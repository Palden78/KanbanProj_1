from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from controllers.taskController import Taskrouter as task_router

app = FastAPI()
router = APIRouter()

app.include_router(task_router)
@app.get("/")
def read_root():
    return {"Hello":"World"}