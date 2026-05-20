"""EMI Calculator — pure Python math, no external library needed."""

from typing import List

from pydantic import BaseModel, field_validator


class EMIRequest(BaseModel):
    principal: float        # Loan amount
    annual_rate: float      # Annual interest rate (%)
    tenure_months: int      # Loan tenure in months

    @field_validator('principal', 'annual_rate', 'tenure_months')
    @classmethod
    def must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Value must be positive')
        return v

class MonthlyBreakdown(BaseModel):
    month: int
    emi: float
    principal_paid: float
    interest_paid: float
    balance: float

class EMIResponse(BaseModel):
    emi: float
    total_payment: float
    total_interest: float
    principal: float
    schedule: List[MonthlyBreakdown]

def calculate_emi(request: EMIRequest) -> EMIResponse:
    """Calculate EMI and full repayment schedule."""
    P = request.principal
    r = request.annual_rate / 12 / 100   # Monthly rate
    n = request.tenure_months

    # EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    emi = P * r * (1 + r) ** n / ((1 + r) ** n - 1)
    emi = round(emi, 2)

    schedule = []
    balance = P

    for month in range(1, n + 1):
        interest_paid = round(balance * r, 2)
        principal_paid = round(emi - interest_paid, 2)
        balance = round(balance - principal_paid, 2)

        schedule.append(MonthlyBreakdown(
            month=month,
            emi=emi,
            principal_paid=principal_paid,
            interest_paid=interest_paid,
            balance=max(balance, 0),
        ))

    total_payment = round(emi * n, 2)
    total_interest = round(total_payment - P, 2)

    return EMIResponse(
        emi=emi,
        total_payment=total_payment,
        total_interest=total_interest,
        principal=P,
        schedule=schedule,
    )