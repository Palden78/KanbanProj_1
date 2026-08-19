from models.models import TaskDraft as td
import uuid 
from datetime import datetime, timezone 
from inMemoryTasks import tasks
from models.models import TaskUpdate as T_update

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

async def updateTask(id, task_update:T_update):
    #Get task from db
    taskToUpdate = tasks.get(id)

    if taskToUpdate is None:
        return taskToUpdate

    # Extract fields sent by the client only
    update_data = task_update.model_dump(exclude_unset=True)

    for k,v in update_data.items():
        taskToUpdate[k] = v 

    tasks[id] = taskToUpdate

    return {"message": "Item updated successfully", "data":taskToUpdate}

async def deleteTaskByID(id):
    output = tasks.pop(id, "Not found")
    return output
    