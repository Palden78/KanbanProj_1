from fastapi import APIRouter, HTTPException
from services.userService import getAllUsers, createNewUser, getUserBYID,updateUserbyID, deleteUserBYID
from models.userModels import UserCreate, UserUpdate

Userrouter = APIRouter(
    prefix = "/users",
    tags= ["users"]
)

@Userrouter.get("/", status_code=200)
async def getUsers():
    res = await getAllUsers()
    return res

@Userrouter.post("/", status_code=201)
async def createNewUserRoute(newUser:UserCreate):
    res = await createNewUser(newUser)

    if res == "Duplicate email":
        raise HTTPException(status_code = 422, detail="Duplicate email")
    if res == "Username cannot be blank":
        raise HTTPException(status_code=422, detail= "Username cannot be blank")
    if res == "Invalid email format":
        raise HTTPException(status_code=409, detail="Invalid email format")

    return res

@Userrouter.get("/{user_id}", status_code=200)
async def getUserByID(user_id:str):
    user = await getUserBYID(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@Userrouter.patch("/{user_id}", status_code=200)
async def updateByID(user_id:str, userUpdateDetails: UserUpdate):
    res = await updateUserbyID(user_id, userUpdateDetails)

    if res is None:
        raise HTTPException(status_code=404, detail="Could not update user, user not found")

    return res

@Userrouter.delete("/{user_id}", status_code=204)
async def deleteByID(user_id:str):
    res = await deleteUserBYID(user_id)

    if res == "User not found":
        raise HTTPException(status_code=404, detail="User not found, could not delete user")


    return res 
