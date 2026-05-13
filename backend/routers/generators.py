from fastapi import APIRouter
from tools.qr_code import QRRequest, QRResponse, generate_qr

router = APIRouter()

@router.post("/qr-code", response_model=QRResponse)
async def qr_code(request: QRRequest):
    """Generate a QR code from any text or URL."""
    return generate_qr(request)
