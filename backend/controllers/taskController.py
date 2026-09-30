from fastapi import APIRouter, HTTPException, Response, Depends, status
from models.models import TaskDraft as td
from services.taskService import createNewTask
from services.taskService import getAllTasks, getTaskById, updateTask, deleteTaskByID
from models.models import TaskUpdate as T_update
from core.security import get_current_user
from models.userModels import UserResponse
from sqlalchemy.orm import Session
from core.database import get_db
from core.cache import get_cache
from models.models import TaskResponse
from redis import Redis

Taskrouter = APIRouter(
    prefix= "/tasks",
    tags = ["tasks"]
)

spoof_exception = HTTPException(
        status_code = status.HTTP_403_FORBIDDEN,
        detail= "You do not have permission to alter this resource"
)

@Taskrouter.get("/", status_code=200, response_model=list[TaskResponse])
def get_tasks(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
    cache: Redis = Depends(get_cache),
):
    tasks = getAllTasks(current_user, db, cache)
    return tasks

@Taskrouter.get("/{task_id}", status_code=200, response_model=TaskResponse)
def getByID(task_id: str, current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    res = getTaskById(task_id, current_user, db)

    if res == "unauthorized access":
        raise spoof_exception
    if res == "not found":
        raise HTTPException(status_code = 404, detail="Task not found")

    return res 

@Taskrouter.post("/", status_code=201, response_model=TaskResponse)
def createTask(
    task: td,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
    cache: Redis = Depends(get_cache),
):
    res = createNewTask(task, current_user, db, cache)
    return res

@Taskrouter.patch("/{task_id}", status_code=200, response_model=TaskResponse)
def updateByID(
    task_id: str,
    task_update: T_update,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
    cache: Redis = Depends(get_cache),
):
    res = updateTask(task_id, task_update, current_user, db, cache)

    if res == "unauthorized access":
        raise spoof_exception
    if res == "not found":
        raise HTTPException(status_code = 404, detail="Task to update not found")

    return res

@Taskrouter.delete("/{task_id}", status_code=204)
def deleteByID(
    task_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
    cache: Redis = Depends(get_cache),
):
    res = deleteTaskByID(task_id, current_user, db, cache)

    if res == "unauthorized access":
        raise spoof_exception
    if res == "not found":
        raise HTTPException(status_code = 404, detail="Task not found")

    return Response(status_code = 204)