from fastapi import APIRouter, HTTPException, Response, Depends, status
from models.models import TaskDraft as td
from services.taskService import createNewTask
from services.taskService import getAllTasks, getTaskById, updateTask, deleteTaskByID
from models.models import TaskUpdate as T_update
from core.security import get_current_user
from models.userModels import UserResponse
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import TaskResponse

Taskrouter = APIRouter(
    prefix= "/tasks",
    tags = ["tasks"]
)

spoof_exception = HTTPException(
        status_code = status.HTTP_403_FORBIDDEN,
        detail= "You do not have permission to alter this resource"
)

@Taskrouter.get("/", status_code=200, response_model=list[TaskResponse])
def get_tasks(current_user: UserResponse = Depends(get_current_user), db:Session = Depends(get_db)):
    tasks = getAllTasks(current_user, db )
    return tasks

@Taskrouter.get("/{task_id}",status_code=200,response_model=list[TaskResponse])
def getByID(task_id:str, current_user: UserResponse = Depends(get_current_user), db:Session = Depends(get_db)):
    res = getTaskById(task_id, current_user, db)

    if res == "unauthorized access":
        raise spoof_exception
    if res == "not found":
        raise HTTPException(status_code = 404, detail="Task not found")

    return res 

@Taskrouter.post("/", status_code = 201,response_model=list[TaskResponse])
def createTask(task:td, current_user: UserResponse = Depends(get_current_user), db:Session = Depends(get_db)):
    res = createNewTask(task, current_user, db)
    return res

@Taskrouter.patch("/{task_id}", status_code=200,response_model=list[TaskResponse])
def updateByID(task_id:str, task_update:T_update, current_user: UserResponse = Depends(get_current_user), db:Session = Depends(get_db)):
    res = updateTask(task_id, task_update, current_user, db)

    if res == "unauthorized access":
        raise spoof_exception
    if res == "not found":
        raise HTTPException(status_code = 404, detail="Task to update not found")

    return res

@Taskrouter.delete("/{task_id}", status_code=204)
def deleteByID(task_id:str, current_user: UserResponse = Depends(get_current_user), db:Session = Depends(get_db)):
    res = deleteTaskByID(task_id,current_user, db)

    if res == "unauthorized access":
        raise spoof_exception
    if res == "not found":
        raise HTTPException(status_code = 404, detail="Task not found")

    return Response(status_code = 204)