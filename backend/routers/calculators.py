from fastapi import APIRouter

from tools.emi_calculator import EMIRequest, EMIResponse, calculate_emi
from tools.bmi_calculator import BMIRequest, BMIResponse, calculate_bmi
from tools.age_calculator import AgeRequest, AgeResponse, calculate_age

router = APIRouter()

@router.post("/emi", response_model=EMIResponse)
async def emi(request: EMIRequest):
    """Calculate loan EMI, total interest, and monthly repayment schedule."""
    return calculate_emi(request)

@router.post("/bmi", response_model=BMIResponse)
async def bmi(request: BMIRequest):
    """Calculate Body Mass Index and category."""
    return calculate_bmi(request)

@router.post("/age", response_model=AgeResponse)
async def age(request: AgeRequest):
    """Calculate age in years, months, and days."""
    return calculate_age(request)
