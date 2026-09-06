from models.loginModels import LoginRequest
from inMemoryUsers import users
from models.userModels import UserResponse
from core.security import hash_password, verify_password
from models.loginModels import Token
import jwt
import os
from core.config import JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import datetime, timedelta, timezone
from db.orm_models import User
from sqlalchemy.orm import Session

def create_access_token(user_id:str)-> str:
     now = datetime.now(timezone.utc)
     expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

     payload ={
          "sub": str(user_id),          #immutable user id
          "iat": int(now.timestamp()),   # issued at timestamp
          "exp": int(expire.timestamp()),
          "type": "access"
     }

     encoded_jwt = jwt.encode(
          payload,
          JWT_SECRET_KEY,
          algorithm = JWT_ALGORITHM
     )
     return encoded_jwt

def loginService(loginReq: LoginRequest, db:Session):
    Submitted_Email = loginReq.email.lower().strip()
    Submitted_Password = loginReq.password.get_secret_value()

    """
    Normalize submitted email
    """
    """
    Find the internal stored user
    """
    stored_user = get_user_by_email(Submitted_Email, db)

    if stored_user is None or not verify_password(Submitted_Password, stored_user.password_hash):
         return None

    access_token = create_access_token(user_id=str(stored_user.id))

    return {
        "message": "login successful",
        "token": Token(access_token=access_token, token_type="bearer"),
        "data": UserResponse.model_validate(stored_user)
    }
     

def get_user_by_email(email:str, db:Session):
    NormalisedEmail = email.lower().strip()
    return db.query(User).filter(User.email == NormalisedEmail).first()
   

