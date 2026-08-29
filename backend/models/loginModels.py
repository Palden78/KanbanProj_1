from pydantic import BaseModel, EmailStr, Field, SecretStr
from typing import Optional
from models.userModels import UserResponse

class LoginRequest(BaseModel):
    email:EmailStr
    password: SecretStr

class Token(BaseModel):
    access_token:str 
    token_type:str = "bearer"

class LoginResponse(BaseModel):
    message: str 
    token: Token
    user: UserResponse