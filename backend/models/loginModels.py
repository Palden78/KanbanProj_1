from pydantic import BaseModel, EmailStr, Field, SecretStr
from typing import Optional

class LoginRequest(BaseModel):
    email:EmailStr
    password: SecretStr