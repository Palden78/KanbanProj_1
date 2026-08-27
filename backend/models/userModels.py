from pydantic import BaseModel, EmailStr, Field, SecretStr
from typing import Optional

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
    id: str 
    username: str 
    email: EmailStr
    createdAt: str 

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
    id: str 
    username: str 
    email: EmailStr
    createdAt: str
    password_hash: str 