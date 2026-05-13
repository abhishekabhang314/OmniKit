"""UUID Generator — uses `uuid` to generate random UUID v4 strings."""

import uuid
from pydantic import BaseModel
from typing import List

class UUIDRequest(BaseModel):
    count: int = 1
    uppercase: bool = False
    remove_hyphens: bool = False

class UUIDResponse(BaseModel):
    uuids: List[str]

def generate_uuid(request: UUIDRequest) -> UUIDResponse:
    """Generate the requested number of UUID v4 strings."""
    # Cap count to prevent abuse
    count = min(request.count, 100)
    
    results = []
    for _ in range(count):
        val = str(uuid.uuid4())
        if request.remove_hyphens:
            val = val.replace("-", "")
        if request.uppercase:
            val = val.upper()
        results.append(val)
        
    return UUIDResponse(uuids=results)
