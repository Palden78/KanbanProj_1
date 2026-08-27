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

    if res == None:
        raise HTTPException(status_code = 401, detail="Invalid email or password")

    return res 