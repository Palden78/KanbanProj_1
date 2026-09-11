from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from controllers.taskController import Taskrouter as task_router
from controllers.userController import Userrouter as user_router
from controllers.authController import LoginRouter as login_router
from core.database import engine 
from db.base import Base
import db.orm_models
# Base.metadata.create_all(bind=engine)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
router = APIRouter()

origins=[
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers=["*"]
)

app.include_router(task_router)
app.include_router(user_router)
app.include_router(login_router)

#public route
@app.get("/")
def read_root():
    return {"Hello":"World",
            "Description":"Backend API of the project"}