from fastapi import APIRouter, HTTPException, Response, Depends, status
from services.authService import loginService
from models.loginModels import LoginRequest
from core.database import get_db
from sqlalchemy.orm import Session


LoginRouter = APIRouter(
    prefix = "/auth",
    tags = ["auth"]
)

#PUBLIC ROUTE
@LoginRouter.post("/login",status_code=200)
def loginUser(loginDetails:LoginRequest, db:Session=Depends(get_db)):
    res = loginService(loginDetails, db)

    if res == None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return res 