from models.loginModels import LoginRequest
from inMemoryUsers import users
from models.userModels import UserResponse
from core.security import hash_password, verify_password
from models.loginModels import Token
import jwt
import os
from core.config import JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import datetime, timedelta, timezone

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

async def loginService(loginReq: LoginRequest):
    Submitted_Email = loginReq.email.lower().strip()
    Submitted_Password = loginReq.password.get_secret_value()

    """
    Normalize submitted email
    """
    """
    Find the internal stored user
    """
    stored_user = get_user_by_email(Submitted_Email)

    if stored_user is None:
         return None

    """
    Retrieve the stored user's password hash
    """
    pwdHash = stored_user.password_hash
    user_id = stored_user.id if hasattr(stored_user, "id") else stored_user["id"]
    
    """
    Call the helper function to verify
    submitted plaintext password
    stored password hash
    """
    if not pwdHash or not verify_password(Submitted_Password,pwdHash):
         return None
    else:
        access_token = create_access_token(user_id=user_id)
        #DTO Response
        retUser = UserResponse(
            id = stored_user.id ,
            username = stored_user.username,
            email= stored_user.email ,
            createdAt = stored_user.createdAt 
        )
        return {
             "message": "login successful", 
             "token": Token(access_token= access_token, token_type ="bearer"),
             "data":retUser
            }
     

def get_user_by_email(email:str):
    NormalisedEmail = email.lower().strip()
    for user in users.values():
            user_email = user.get("email") if isinstance(user, dict) else getattr(user, "email", "")
    
            if user_email.lower() == NormalisedEmail:
                return user 

    return None 

