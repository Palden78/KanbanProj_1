from pydantic import BaseModel, EmailStr, Field, SecretStr, ConfigDict
from typing import Optional, Literal
from datetime import datetime
import uuid

TaskStatus = Literal["To Do", "In Progress", "Done"]


class TaskDraft(BaseModel):
    taskName: str = Field(..., min_length=1, strip_whitespace= True)
    description: str 

class SavedTask(TaskDraft):
    id: uuid.UUID
    status : TaskStatus
    createdAt: datetime 
    userId: uuid.UUID

    model_config = ConfigDict(from_attributes=True)

class TaskUpdate(BaseModel):
    taskName: Optional[str] = None 
    description: Optional[str] = None 
    status: Optional[TaskStatus] = None





