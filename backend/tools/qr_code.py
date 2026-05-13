"""QR Code Generator — uses the `qrcode` library with Pillow."""

import base64
from io import BytesIO

import qrcode
from pydantic import BaseModel, field_validator


class QRRequest(BaseModel):
    content: str
    size: int = 10          # box_size
    border: int = 4         # quiet zone boxes

    @field_validator('content')
    @classmethod
    def content_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Content cannot be empty')
        return v

class QRResponse(BaseModel):
    image_base64: str       # PNG encoded as base64 data URI

def generate_qr(request: QRRequest) -> QRResponse:
    """Generate a QR code PNG and return it as a base64 data URI."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=request.size,
        border=request.border,
    )
    qr.add_data(request.content)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return QRResponse(image_base64=f"data:image/png;base64,{encoded}")