from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from controllers.taskController import Taskrouter as task_router
from controllers.userController import Userrouter as user_router
from controllers.authController import LoginRouter as login_router

app = FastAPI()
router = APIRouter()

app.include_router(task_router)
app.include_router(user_router)
app.include_router(login_router)

#public route
@app.get("/")
def read_root():
    return {"Hello":"World",
            "Description":"Backend API of the project"}