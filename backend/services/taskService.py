from models.models import TaskDraft as td
import uuid 
from datetime import datetime, timezone 
from inMemoryTasks import tasks

async def createTask(task:td):
    taskID = str(uuid.uuid4())
    status = "To Do"
    timestamp = (datetime.now(timezone.utc)).isoformat()

    newTask = {
        "taskName": task.taskName,
        "description": task.description,
        "id":taskID,
        "status": status,
        "createdAt": timestamp
    }
    tasks[taskID] = newTask
    return newTask 

async def getAllTasks():
    return list(tasks.values())

async def getTaskById(id):
    return tasks.get(id)