import uuid 
from datetime import datetime, timezone 
from inMemoryTasks import tasks
from models.models import TaskDraft as td, TaskUpdate as T_update
from models.userModels import UserResponse


def checkAuthorisedUse(task_id: str, curr_user_id: str) -> str:
    """Checks if a task exists and whether the current user owns it."""
    task = tasks.get(task_id)
    if task is None:
        return "not found"

    if task.get("userId") != curr_user_id:
        return "unauthorized access"

    return "authorised access"


async def createTask(task: td, current_user: UserResponse):
    taskID = str(uuid.uuid4())
    status = "To Do"
    timestamp = (datetime.now(timezone.utc)).isoformat()

    newTask = {
        "taskName": task.taskName,
        "description": task.description,
        "id": taskID,
        "status": status,
        "createdAt": timestamp,
        "userId": current_user.id
    }
    tasks[taskID] = newTask
    return newTask 


async def getAllTasks(current_user: UserResponse):
    currId = current_user.id
    return [t for t in tasks.values() if t.get('userId') == currId]


async def getTaskById(id: str, current_user: UserResponse):
    verdict = checkAuthorisedUse(id, current_user.id)
    if verdict in ("unauthorized access", "not found"):
        return verdict

    return tasks.get(id)


async def updateTask(id: str, task_update: T_update, current_user: UserResponse):
    verdict = checkAuthorisedUse(id, current_user.id)
    if verdict in ("unauthorized access", "not found"):
        return verdict

    taskToUpdate = tasks.get(id)
    update_data = task_update.model_dump(exclude_unset=True)

    for k, v in update_data.items():
        taskToUpdate[k] = v 

    tasks[id] = taskToUpdate
    return {"message": "Item updated successfully", "data": taskToUpdate}


async def deleteTaskByID(id: str, current_user: UserResponse):
    verdict = checkAuthorisedUse(id, current_user.id)
    if verdict in ("unauthorized access", "not found"):
        return verdict

    return tasks.pop(id, None)