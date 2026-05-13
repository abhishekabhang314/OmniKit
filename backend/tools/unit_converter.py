"""Unit Converter — uses the `pint` library for unit conversions."""

from pint import UnitRegistry
from pydantic import BaseModel

ureg = UnitRegistry()

SUPPORTED_CATEGORIES = {
    "length": ["meter", "kilometer", "mile", "yard", "foot", "inch", "centimeter", "millimeter"],
    "weight": ["kilogram", "gram", "pound", "ounce", "ton"],
    "temperature": ["celsius", "fahrenheit", "kelvin"],
    "speed": ["meter_per_second", "kilometer_per_hour", "mile_per_hour", "knot"],
    "area": ["square_meter", "square_kilometer", "square_mile", "acre", "hectare"],
}

class UnitConvertRequest(BaseModel):
    value: float
    from_unit: str
    to_unit: str

class UnitConvertResponse(BaseModel):
    result: float
    from_unit: str
    to_unit: str
    formula: str

def convert_unit(request: UnitConvertRequest) -> UnitConvertResponse:
    """Convert a value from one unit to another using pint."""
    quantity = request.value * ureg(request.from_unit)
    converted = quantity.to(request.to_unit)
    result = round(converted.magnitude, 6)

    return UnitConvertResponse(
        result=result,
        from_unit=request.from_unit,
        to_unit=request.to_unit,
        formula=f"{request.value} {request.from_unit} = {result} {request.to_unit}",
    )

def get_supported_units() -> dict:
    return SUPPORTED_CATEGORIES