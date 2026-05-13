from fastapi import APIRouter
from tools.emi_calculator import EMIRequest, EMIResponse, calculate_emi

router = APIRouter()

@router.post("/emi", response_model=EMIResponse)
async def emi(request: EMIRequest):
    """Calculate loan EMI, total interest, and monthly repayment schedule."""
    return calculate_emi(request)
