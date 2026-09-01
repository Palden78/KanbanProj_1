from fastapi import APIRouter, HTTPException, Response, Depends
from services.userService import getAllUsers, createNewUser, getUserBYID,updateUserbyID, deleteUserBYID, patchMe, deleteSelf
from models.userModels import UserCreate, UserUpdate,  UserResponse
from core.security import get_current_user

Userrouter = APIRouter(
    prefix = "/users",
    tags= ["users"]
)


@Userrouter.get("/", status_code=200)
async def getUsers():
    res = await getAllUsers()
    return res

@Userrouter.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@Userrouter.patch("/me", response_model = UserResponse, status_code=200)
async def patch_me(userUpdateDetails: UserUpdate, current_user: UserResponse= Depends(get_current_user)):
    res = await patchMe(current_user, userUpdateDetails)
    match res:
        case None:
            raise HTTPException(status_code=404, detail="Could not update user, user not found")
        case "Blank username":
            raise HTTPException(status_code=422, detail="Username cannot be null or blank")
        case "Null email":
            raise HTTPException(status_code=422, detail="Email cannot be null")
        case "Duplicate email":
            raise HTTPException(status_code=409, detail="A user with this email address already exists")
    return res 

#PUBLIC ROUTE
@Userrouter.post("/", status_code=201)
async def createNewUserRoute(newUser:UserCreate):
    res = await createNewUser(newUser)

    if res == "Duplicate email":
        raise HTTPException(status_code = 409, detail="Duplicate email")
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

    match res:
        case None:
            raise HTTPException(status_code=404, detail="Could not update user, user not found")
        case "Blank username":
            raise HTTPException(status_code=422, detail="Username cannot be null or blank")
        case "Null email":
            raise HTTPException(status_code=422, detail="Email cannot be null")
        case "Duplicate email":
            raise HTTPException(status_code=409, detail="A user with this email address already exists")

    return res

@Userrouter.delete("/me", status_code=204)
async def deleteSelfAccount(current_user: UserResponse= Depends(get_current_user)):
    res = await deleteSelf(current_user)
    return Response(status_code=204)


@Userrouter.delete("/{user_id}", status_code=204)
async def deleteByID(user_id:str):
    res = await deleteUserBYID(user_id)

    if res == "User not found":
        raise HTTPException(status_code=404, detail="User not found, could not delete user")

    return Response(status_code = 204)
