import uuid

from models.models import TaskDraft as td, TaskUpdate as T_update, TaskResponse
from models.userModels import UserResponse
from sqlalchemy.orm import Session
from db.orm_models import Task
from pydantic import TypeAdapter
from redis import Redis
from core.config import CACHE_KEY_PREFIX, CACHE_TASK_LIST_TTL_SECONDS
from services.cacheService import (
    delete_cached_values,
    get_cached_value,
    get_or_create_task_list_generation,
    rotate_task_list_generation,
    set_cached_value,
    task_list_key,
)

task_list_adapter = TypeAdapter(list[TaskResponse])

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


def createNewTask(task: td, current_user: UserResponse, db:Session, cache:Redis):
    db_task = Task(
        task_name =task.taskName,            # match your ORM model's column name
        description=task.description,
        status="To Do",                 # or task.status if passed
        user_id=current_user.id         # foreign key association
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    rotate_task_list_generation(
        cache,
        CACHE_KEY_PREFIX,
        current_user.id,
    )

    return TaskResponse.model_validate(db_task)


def getAllTasks(current_user: UserResponse, db: Session, cache: Redis) -> list[TaskResponse]:
    generation = get_or_create_task_list_generation(
        cache,
        CACHE_KEY_PREFIX,
        current_user.id,
    )
    key = None

    if generation is not None:
        key = task_list_key(CACHE_KEY_PREFIX, current_user.id, generation)
        cached = get_cached_value(cache, key)

        if cached is not None:
            try:
                tasks = task_list_adapter.validate_json(cached)

                if all(task.user_id == current_user.id for task in tasks):
                    return tasks
            except ValueError:
                delete_cached_values(cache, key)

    records = (
        db.query(Task)
        .filter(Task.user_id == current_user.id)
        .order_by(Task.created_at, Task.id)
        .all()
    )

    tasks = [TaskResponse.model_validate(record) for record in records]

    if key is not None:
        set_cached_value(
            cache,
            key,
            task_list_adapter.dump_json(tasks).decode(),
            CACHE_TASK_LIST_TTL_SECONDS,
        )

    return tasks

    


def getTaskById(id: str, current_user: UserResponse, db:Session):
    verdict, task = checkAuthorisedUse(id, str(current_user.id), db)
    if verdict in ("unauthorized access", "not found"):
        return verdict
    return task 


def updateTask(id: str, task_update: T_update, current_user: UserResponse, db:Session, cache:Redis ):
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

    rotate_task_list_generation(
        cache,
        CACHE_KEY_PREFIX,
        current_user.id,
    )
    return TaskResponse.model_validate(taskToupdate)



def deleteTaskByID(id: str, current_user: UserResponse, db:Session, cache:Redis):
    verdict, taskToDel = checkAuthorisedUse(id, current_user.id, db)
    if verdict in ("unauthorized access", "not found"):
        return verdict

    db.delete(taskToDel)
    db.commit()
    rotate_task_list_generation(
        cache,
        CACHE_KEY_PREFIX,
        current_user.id,
    )
    return taskToDel