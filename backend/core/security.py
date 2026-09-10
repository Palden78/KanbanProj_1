from pwdlib import PasswordHash
from pwdlib.hashers.bcrypt import BcryptHasher
from uuid import UUID
import jwt 
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.userModels import UserResponse
from core.config import JWT_SECRET_KEY, JWT_ALGORITHM
from sqlalchemy.orm import Session
from core.database import get_db
from db.orm_models import User

password_hash_contet = PasswordHash((BcryptHasher(),))

cred_exception = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail= "Could not validate credentials",
        headers={"WWW-Authenticate":"Bearer"}
)

def hash_password(password:str)-> str :
    return password_hash_contet.hash(password)

def verify_password(plain_password:str, hashed_password:str)-> bool:
    return password_hash_contet.verify(plain_password, hashed_password)

def decode_access_token(token:str) -> dict:

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])

        user_id: str | None = payload.get("sub")
        token_type: str | None = payload.get("type")

        if user_id is None or token_type != "access":
            raise cred_exception

        return payload
    except jwt.PyJWTError:
        raise cred_exception

security_scheme = HTTPBearer()

def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
        db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials

    payload = decode_access_token(token)
    user_id_str = payload.get("sub")

    try:
        user_uuid = UUID(user_id_str)
    except(ValueError, TypeError):
        raise cred_exception

    user = db.query(User).filter(User.id == user_uuid).first()

    if user is None:
        raise cred_exception
    return user 

   
    
