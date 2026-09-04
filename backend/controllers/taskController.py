from fastapi import APIRouter, HTTPException, Response, Depends, status
from models.models import TaskDraft as td
from services.taskService import createTask as createNewTask
from services.taskService import getAllTasks, getTaskById, updateTask, deleteTaskByID
from models.models import TaskUpdate as T_update
from core.security import get_current_user
from models.userModels import UserResponse

Taskrouter = APIRouter(
    prefix= "/tasks",
    tags = ["tasks"]
)

spoof_exception = HTTPException(
        status_code = status.HTTP_403_FORBIDDEN,
        detail= "You do not have permission to alter this resource"
)

@Taskrouter.get("/", status_code=200)
async def get_tasks(current_user: UserResponse = Depends(get_current_user)):
    tasks = await getAllTasks(current_user)
    return tasks

@Taskrouter.get("/{task_id}",status_code=200)
async def getByID(task_id:str, current_user: UserResponse = Depends(get_current_user)):
    res = await getTaskById(task_id, current_user)

    if res == "unauthorized access":
        raise spoof_exception
    if res == "not found":
        raise HTTPException(status_code = 404, detail="Task not found")

    return res 

@Taskrouter.post("/", status_code = 201)
async def createTask(task:td, current_user: UserResponse = Depends(get_current_user)):
    res = await createNewTask(task, current_user)
    return res

@Taskrouter.patch("/{task_id}", status_code=200)
async def updateByID(task_id:str, task_update:T_update, current_user: UserResponse = Depends(get_current_user)):
    res = await updateTask(task_id, task_update, current_user)

    if res == "unauthorized access":
        raise spoof_exception
    if res == "not found":
        raise HTTPException(status_code = 404, detail="Task to update not found")

    return res

@Taskrouter.delete("/{task_id}", status_code=204)
async def deleteByID(task_id:str, current_user: UserResponse = Depends(get_current_user)):
    res = await deleteTaskByID(task_id,current_user)

    if res == "unauthorized access":
        raise spoof_exception
    if res == "not found":
        raise HTTPException(status_code = 404, detail="Task not found")

    return Response(status_code = 204)