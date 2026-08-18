from fastapi import APIRouter
from models.models import TaskDraft as td
from services.taskService import createTask as createNewTask
from services.taskService import getAllTasks, getTaskById

Taskrouter = APIRouter(
    prefix= "/tasks",
    tags = ["tasks"]
)

@Taskrouter.get("/", status_code=200)
async def get_tasks():
    tasks = await getAllTasks()
    return tasks

@Taskrouter.get("/{task_id}")
async def getByID(task_id:str):
    task = await getTaskById(task_id)
    return task 

@Taskrouter.post("/", status_code = 201)
async def createTask(task:td):
    res = await createNewTask(task)
    return res