import uuid 
from datetime import datetime, timezone 
from inMemoryTasks import tasks
from models.models import TaskDraft as td, TaskUpdate as T_update
from models.userModels import UserResponse
from sqlalchemy.orm import Session
from db.orm_models import Task


def checkAuthorisedUse(task_id: str, curr_user_id: str, db) -> str:
    """FETCHES A TASK AND VERIFIES EXISTENCE AND OWNERSHIP"""
    try:
        #parse uuid
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        return "not found", None

    #ORM OPERATION TO GET MATCHING TASK
    task = db.query(Task).filter(Task.id == task_uuid).first()

    if task is None:
        return "not found", None 

    if str(task.user_id) != str(curr_user_id):
        return "unauthorized access", None 

    return "authorised access", task 


def createNewTask(task: td, current_user: UserResponse, db:Session):
    db_task = Task(
        task_name =task.taskName,            # match your ORM model's column name
        description=task.description,
        status="To Do",                 # or task.status if passed
        user_id=current_user.id         # foreign key association
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def getAllTasks(current_user: UserResponse, db: Session):
    user_uuid = uuid.UUID(str(current_user.id)) if isinstance(current_user.id, str) else current_user.id

    return db.query(Task).filter(Task.user_id == user_uuid).all()


def getTaskById(id: str, current_user: UserResponse, db:Session):
    verdict, task = checkAuthorisedUse(id, str(current_user.id), db)
    if verdict in ("unauthorized access", "not found"):
        return verdict
    return task 


def updateTask(id: str, task_update: T_update, current_user: UserResponse, db:Session ):
    verdict, taskToupdate = checkAuthorisedUse(id, current_user.id, db)
    if verdict in ("unauthorized access", "not found"):
        return verdict
    
    update_data = task_update.model_dump(exclude_unset=True)

    if "taskName" in update_data:
        taskToupdate.task_name = update_data.pop("taskName")

    for k, v in update_data.items():
        setattr(taskToupdate, k, v)

    db.commit()
    db.refresh(taskToupdate)
    return taskToupdate



def deleteTaskByID(id: str, current_user: UserResponse, db:Session):
    verdict, taskToDel = checkAuthorisedUse(id, current_user.id, db)
    if verdict in ("unauthorized access", "not found"):
        return verdict
    
    db.delete(taskToDel)
    db.commit()
    return taskToDel