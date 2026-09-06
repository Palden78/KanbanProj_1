from fastapi import APIRouter, HTTPException, Response, Depends
from services.userService import getAllUsers, createNewUser, getUserBYID, patchMe, deleteSelf
from models.userModels import UserCreate, UserUpdate,  UserResponse
from core.security import get_current_user
from core.database import get_db
from db.orm_models import User
from sqlalchemy.orm import Session

Userrouter = APIRouter(
    prefix = "/users",
    tags= ["users"]
)


@Userrouter.get("/", status_code=200)
def getUsers(db:Session = Depends(get_db)):
    res = getAllUsers(db)
    return res

@Userrouter.get("/me", response_model=UserResponse)
def get_me(current_user: UserResponse = Depends(get_current_user), db:Session = Depends(get_db)):
    return current_user

@Userrouter.patch("/me", response_model = UserResponse, status_code=200)
def patch_me(userUpdateDetails: UserUpdate, current_user: UserResponse= Depends(get_current_user), db:Session = Depends(get_db)):
    res = patchMe(current_user, userUpdateDetails, db)
    return res 

#PUBLIC ROUTE
@Userrouter.post("/", status_code=201)
def createNewUserRoute(newUser:UserCreate, db:Session = Depends(get_db)):
    res = createNewUser(newUser, db)
    return res

@Userrouter.get("/{user_id}", status_code=200)
def getUserByID(user_id:str, db:Session = Depends(get_db)):
    user = getUserBYID(user_id, db)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@Userrouter.delete("/me", status_code=204)
def deleteSelfAccount(current_user: UserResponse= Depends(get_current_user), db:Session = Depends(get_db) ):
    res = deleteSelf(current_user, db)
    return Response(status_code=204)

# @Userrouter.patch("/{user_id}", status_code=200)
# async def updateByID(user_id:str, userUpdateDetails: UserUpdate):
#     res = await updateUserbyID(user_id, userUpdateDetails)

#     match res:
#         case None:
#             raise HTTPException(status_code=404, detail="Could not update user, user not found")
#         case "Blank username":
#             raise HTTPException(status_code=422, detail="Username cannot be null or blank")
#         case "Null email":
#             raise HTTPException(status_code=422, detail="Email cannot be null")
#         case "Duplicate email":
#             raise HTTPException(status_code=409, detail="A user with this email address already exists")

#     return res


# @Userrouter.delete("/{user_id}", status_code=204)
# def deleteByID(user_id:str):
#     res = deleteUserBYID(user_id)

#     if res == "User not found":
#         raise HTTPException(status_code=404, detail="User not found, could not delete user")

#     return Response(status_code = 204)
