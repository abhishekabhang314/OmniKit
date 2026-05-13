from fastapi import APIRouter

from tools.qr_code import QRRequest, QRResponse, generate_qr
from tools.password_generator import PasswordRequest, PasswordResponse, generate_password
from tools.uuid_generator import UUIDRequest, UUIDResponse, generate_uuid

router = APIRouter()

@router.post("/qr-code", response_model=QRResponse)
async def qr_code(request: QRRequest):
    """Generate a QR code from any text or URL."""
    return generate_qr(request)

@router.post("/password", response_model=PasswordResponse)
async def password(request: PasswordRequest):
    """Generate a random secure password."""
    return generate_password(request)

@router.post("/uuid", response_model=UUIDResponse)
async def get_uuid(request: UUIDRequest):
    """Generate random UUIDs."""
    return generate_uuid(request)
