"""Color Converter — uses `colorsys` and simple math to convert HEX, RGB, and HSL."""

import colorsys
import re

from pydantic import BaseModel


class ColorRequest(BaseModel):
    color: str

class ColorResponse(BaseModel):
    hex: str
    rgb: str
    hsl: str

def hex_to_rgb(hex_code: str):
    hex_code = hex_code.lstrip('#')
    if len(hex_code) == 3:
        hex_code = ''.join([c*2 for c in hex_code])
    return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))

def parse_rgb(rgb_str: str):
    matches = re.findall(r'\d+', rgb_str)
    if len(matches) >= 3:
        return tuple(min(255, max(0, int(m))) for m in matches[:3])
    raise ValueError("Invalid RGB")

def parse_hsl(hsl_str: str):
    matches = re.findall(r'\d+', hsl_str)
    if len(matches) >= 3:
        h = int(matches[0]) % 360
        s = min(100, max(0, int(matches[1])))
        lightness = min(100, max(0, int(matches[2])))
        return h, s, lightness
    raise ValueError("Invalid HSL")

def convert_color(request: ColorRequest) -> ColorResponse:
    """Parse color string and return all formats."""
    color_input = request.color.strip().lower()
    
    r, g, b = 0, 0, 0
    
    try:
        if color_input.startswith('#') or re.match(r'^[0-9a-fA-F]{3,6}$', color_input):
            r, g, b = hex_to_rgb(color_input if color_input.startswith('#') else f"#{color_input}")
        elif color_input.startswith('rgb'):
            r, g, b = parse_rgb(color_input)
        elif color_input.startswith('hsl'):
            h, s, lightness = parse_hsl(color_input)
            r_float, g_float, b_float = colorsys.hls_to_rgb(h / 360.0, lightness / 100.0, s / 100.0)
            r, g, b = round(r_float * 255), round(g_float * 255), round(b_float * 255)
        else:
            raise ValueError("Unsupported color format. Use HEX, RGB, or HSL.")
    except Exception as e:
        raise ValueError(f"Could not parse color: {e}")

    # Generate Hex
    hex_code = f"#{r:02x}{g:02x}{b:02x}".upper()
    
    # Generate RGB
    rgb_str = f"rgb({r}, {g}, {b})"
    
    # Generate HSL
    h_float, l_float, s_float = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
    h = round(h_float * 360)
    s = round(s_float * 100)
    lightness = round(l_float * 100)
    hsl_str = f"hsl({h}, {s}%, {lightness}%)"
    
    return ColorResponse(hex=hex_code, rgb=rgb_str, hsl=hsl_str)
