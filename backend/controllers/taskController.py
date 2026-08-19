from fastapi import APIRouter, HTTPException, Response
from models.models import TaskDraft as td
from services.taskService import createTask as createNewTask
from services.taskService import getAllTasks, getTaskById, updateTask, deleteTaskByID
from models.models import TaskUpdate as T_update

Taskrouter = APIRouter(
    prefix= "/tasks",
    tags = ["tasks"]
)

@Taskrouter.get("/", status_code=200)
async def get_tasks():
    tasks = await getAllTasks()
    return tasks

@Taskrouter.get("/{task_id}",status_code=200)
async def getByID(task_id:str):
    task = await getTaskById(task_id)
    if task is None:
        raise HTTPException(status_code = 404, detail="Task not found")
    return task 

@Taskrouter.post("/", status_code = 201)
async def createTask(task:td):
    res = await createNewTask(task)
    return res

@Taskrouter.patch("/{task_id}", status_code=200)
async def updateByID(task_id:str, task_update:T_update):
    res = await updateTask(task_id, task_update)

    if res is None:
        raise HTTPException(status_code = 404, detail="Task to update not found")

    return res

@Taskrouter.delete("/{task_id}", status_code=202)
async def deleteByID(task_id:str):
    res = await deleteTaskByID(task_id)

    if res == "Not found":
        raise HTTPException(status_code = 404, detail="Task not found")

    return Response(status_code = 204)