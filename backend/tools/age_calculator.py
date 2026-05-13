"""Age Calculator — pure Python datetime math."""

from datetime import date
from pydantic import BaseModel, field_validator

class AgeRequest(BaseModel):
    birth_date: str  # YYYY-MM-DD format expected

    @field_validator('birth_date')
    @classmethod
    def validate_date(cls, v):
        try:
            d = date.fromisoformat(v)
            if d > date.today():
                raise ValueError('Birth date cannot be in the future')
            return v
        except ValueError as e:
            if "future" in str(e):
                raise e
            raise ValueError('Invalid date format. Expected YYYY-MM-DD')

class AgeResponse(BaseModel):
    years: int
    months: int
    days: int
    total_days: int

def calculate_age(request: AgeRequest) -> AgeResponse:
    """Calculate exact age in years, months, and days."""
    birth_date = date.fromisoformat(request.birth_date)
    today = date.today()
    
    total_days = (today - birth_date).days
    
    years = today.year - birth_date.year
    months = today.month - birth_date.month
    days = today.day - birth_date.day

    if days < 0:
        months -= 1
        # Get days in previous month
        if today.month == 1:
            prev_month = 12
            prev_month_year = today.year - 1
        else:
            prev_month = today.month - 1
            prev_month_year = today.year
            
        # Approximation or exact
        try:
            days_in_prev_month = (date(today.year, today.month, 1) - date(prev_month_year, prev_month, 1)).days
        except ValueError:
            days_in_prev_month = 31 # fallback
        days += days_in_prev_month

    if months < 0:
        years -= 1
        months += 12
    
    return AgeResponse(
        years=years,
        months=months,
        days=days,
        total_days=total_days
    )

