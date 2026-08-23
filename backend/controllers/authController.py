from fastapi import APIRouter


LoginRouter = APIRouter(
    prefix = "/auth",
    tags = ["auth"]
)

@LoginRouter.post("/login",status_code=201)
async def loginUser():
    pass