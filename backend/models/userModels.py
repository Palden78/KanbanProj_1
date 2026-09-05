from pydantic import BaseModel, EmailStr, Field, SecretStr, ConfigDict
from typing import Optional, Literal
from datetime import datetime
import uuid

"""
For account creation User -> Backend
"""
class UserCreate(BaseModel):
    username : str = Field(min_length=1)
    email: EmailStr 
    password: SecretStr = Field(min_length=8)

"""
For public user response Backend -> User/ Frontend DTO
"""
class UserResponse(BaseModel):
    id: uuid.UUID
    username: str 
    email: EmailStr
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)

"""
For profile update (User -> Backend)
"""
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None


"""
For Internal backend use
"""
class SavedUser(BaseModel):
    id: uuid.UUID
    username: str 
    email: EmailStr
    createdAt: str
    password_hash: str 