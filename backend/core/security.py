from pwdlib import PasswordHash
from pwdlib.hashers.bcrypt import BcryptHasher

import jwt 
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from inMemoryUsers import users
from models.userModels import UserResponse
from core.config import JWT_SECRET_KEY, JWT_ALGORITHM

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

async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security_scheme)
) -> UserResponse:
    token = credentials.credentials

    payload = decode_access_token(token)
    user_id = payload.get("sub")

    stored_user = users.get(user_id)
    if stored_user is None:
        raise cred_exception

    return UserResponse(
        id=stored_user.id if hasattr(stored_user, "id") else stored_user["id"],
        username=stored_user.username if hasattr(stored_user, "username") else stored_user["username"],
        email=stored_user.email if hasattr(stored_user, "email") else stored_user["email"],
        createdAt=stored_user.createdAt if hasattr(stored_user, "createdAt") else stored_user["createdAt"]
    )
    
