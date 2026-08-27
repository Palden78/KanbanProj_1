from models.loginModels import LoginRequest
from inMemoryUsers import users
from models.userModels import UserResponse
from core.security import hash_password, verify_password

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
    
    """
    Call the helper function to verify
    submitted plaintext password
    stored password hash
    """
    if not pwdHash or not verify_password(Submitted_Password,pwdHash):
         return None
    else:
         retUser = UserResponse(
              id = stored_user.id ,
              username = stored_user.username,
              email= stored_user.email ,
              createdAt = stored_user.createdAt 
         )
         return {"message": "login successful", "data":retUser}



def get_user_by_email(email:str):
    NormalisedEmail = email.lower().strip()
    for user in users.values():
            user_email = user.get("email") if isinstance(user, dict) else getattr(user, "email", "")
    
            if user_email.lower() == NormalisedEmail:
                return user 

    return None 

