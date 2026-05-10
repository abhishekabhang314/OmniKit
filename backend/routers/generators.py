from fastapi import APIRouter

router = APIRouter()

# Tool endpoints will be added here in Phase 4
# Example structure:
# from tools.qr_code import QRRequest, QRResponse, generate_qr
# @router.post("/qr-code", response_model=QRResponse)
# async def qr_code(request: QRRequest):
#     return generate_qr(request)