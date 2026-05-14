from fastapi import APIRouter

from tools.color_converter import ColorRequest, ColorResponse, convert_color
from tools.unit_converter import (
    UnitConvertRequest,
    UnitConvertResponse,
    convert_unit,
    get_supported_units,
)

router = APIRouter()

@router.post("/unit", response_model=UnitConvertResponse)
async def unit_convert(request: UnitConvertRequest):
    """Convert between units of length, weight, temperature, speed, and area."""
    return convert_unit(request)

@router.get("/unit/supported")
async def supported_units():
    """Return all supported unit categories and units."""
    return get_supported_units()

@router.post("/color", response_model=ColorResponse)
async def color_convert(request: ColorRequest):
    """Convert colors between HEX, RGB, and HSL."""
    return convert_color(request)