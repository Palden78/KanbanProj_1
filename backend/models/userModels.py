from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    username : str = Field(min_length=1)
    email: EmailStr 

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

class SavedUser(UserCreate):
    id: str 
    createdAt: str