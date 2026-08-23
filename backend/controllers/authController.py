from fastapi import APIRouter
from services.authService import loginService


LoginRouter = APIRouter(
    prefix = "/auth",
    tags = ["auth"]
)

@LoginRouter.post("/login",status_code=201)
async def loginUser():
    res = await loginService()
    pass