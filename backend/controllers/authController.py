from fastapi import APIRouter, HTTPException, Response
from services.authService import loginService
from models.loginModels import LoginRequest


LoginRouter = APIRouter(
    prefix = "/auth",
    tags = ["auth"]
)

@LoginRouter.post("/login",status_code=200)
async def loginUser(loginDetails:LoginRequest):
    res = await loginService(loginDetails)

    match res:
        case "Stored user not found":
            raise HTTPException(status_code = 401, detail="Invalid email or password")
        case "Invalid email or password":
            raise HTTPException(status_code = 401, detail="Incorrect password")

    return res 