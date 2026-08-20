from pydantic import BaseModel, Field
from typing import Literal, Optional

TaskStatus = Literal["To Do", "In Progress", "Done"]


class TaskDraft(BaseModel):
    taskName: str = Field(..., min_length=1, strip_whitespace= True)
    description: str 

class SavedTask(TaskDraft):
    id: str 
    status : TaskStatus
    createdAt: str 

class TaskUpdate(BaseModel):
    taskName: Optional[str] = None 
    description: Optional[str] = None 
    status: Optional[TaskStatus] = None





