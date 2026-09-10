from models.userModels import UserCreate, UserUpdate, SavedUser, UserResponse, UserCreateRes
import uuid
from datetime import datetime,timezone
from pydantic import ValidationError, TypeAdapter, EmailStr
from core.security import hash_password
from db.orm_models import User
from sqlalchemy.orm import Session
from fastapi import HTTPException, status


EMAIL_ADAPTER = TypeAdapter(EmailStr)
def getAllUsers(db:Session):        
    return db.query(User).all()

def createNewUser(newUser:UserCreate, db:Session):
    normalised_email = newUser.email.lower().strip()

    existing_user = db.query(User).filter(User.email == normalised_email).first()
    if existing_user: 
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email address already exists"
        )

    db_user = User(
        username = newUser.username,
        email = normalised_email,
        password_hash = hash_password(newUser.password.get_secret_value())
    )

    retUser = UserCreateRes(
        username = newUser.username,
        email = normalised_email
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return retUser

def getUserBYID(userID:str, db:Session):
    user_id = uuid.UUID(userID)
    user = db.query(User).filter(User.id == user_id).first()
    return user

def patchMe(Curruser: UserResponse, updateDetails : UserUpdate, db:Session):

    update_data = updateDetails.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"]:
        new_email = update_data["email"].lower().strip()
        existing = db.query(User).filter(User.email == new_email, User.id != Curruser.id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email address already exists"
            )
        update_data["email"] = new_email
    for field, value in update_data.items():
        setattr(Curruser, field, value)

    db.add(Curruser)
    db.commit()
    db.refresh(Curruser)
    return Curruser
def deleteSelf(user: UserResponse, db:Session):
    db.delete(user)
    db.commit()

# def deleteUserBYID(user_id:str):
#     user = users.get(user_id)
#     if user is None :
#         return "User not found"
#     else:
#         users.pop(user_id)
#         tasks = [ t for t in tasks if t.userId != user_id]


#     return UserResponse(
#         id = user.id ,
#         username= user.username,
#         email = user.email ,
#         createdAt = user.createdAt
#     )


# async def updateUserbyID(userID: str, updateDetails:UserUpdate ):

#     user = users.get(userID)

#     if user is None:
#         return None 

#     return await UpdateLogic(userID, user, updateDetails)

 

