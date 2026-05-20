"""BMI Calculator — simple Python math."""

from pydantic import BaseModel, field_validator


class BMIRequest(BaseModel):
    weight_kg: float
    height_cm: float

    @field_validator('weight_kg', 'height_cm')
    @classmethod
    def must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Value must be positive')
        return v

class BMIResponse(BaseModel):
    bmi: float
    category: str

def calculate_bmi(request: BMIRequest) -> BMIResponse:
    """Calculate BMI and return the category."""
    height_m = request.height_cm / 100
    bmi = request.weight_kg / (height_m ** 2)
    bmi = round(bmi, 1)

    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal weight"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obesity"

    return BMIResponse(bmi=bmi, category=category)
