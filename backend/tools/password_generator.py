"""Password Generator — uses `secrets` and `string` for secure random passwords."""

import secrets
import string

from pydantic import BaseModel, field_validator


class PasswordRequest(BaseModel):
    length: int = 16
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_numbers: bool = True
    include_symbols: bool = True

    @field_validator('length')
    @classmethod
    def validate_length(cls, v):
        if v < 4 or v > 128:
            raise ValueError('Length must be between 4 and 128')
        return v

class PasswordResponse(BaseModel):
    password: str

def generate_password(request: PasswordRequest) -> PasswordResponse:
    """Generate a secure random password based on the provided criteria."""
    if not (request.include_uppercase or request.include_lowercase or request.include_numbers or request.include_symbols):
        # Default to lowercase if nothing is selected
        request.include_lowercase = True

    alphabet = ""
    if request.include_lowercase:
        alphabet += string.ascii_lowercase
    if request.include_uppercase:
        alphabet += string.ascii_uppercase
    if request.include_numbers:
        alphabet += string.digits
    if request.include_symbols:
        alphabet += string.punctuation

    # Ensure at least one character of each selected type is included
    password = []
    if request.include_lowercase:
        password.append(secrets.choice(string.ascii_lowercase))
    if request.include_uppercase:
        password.append(secrets.choice(string.ascii_uppercase))
    if request.include_numbers:
        password.append(secrets.choice(string.digits))
    if request.include_symbols:
        password.append(secrets.choice(string.punctuation))

    # Fill the rest
    while len(password) < request.length:
        password.append(secrets.choice(alphabet))

    # Shuffle the result
    secrets.SystemRandom().shuffle(password)
    
    return PasswordResponse(password="".join(password[:request.length]))
