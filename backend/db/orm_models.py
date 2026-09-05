from sqlalchemy import Integer,String, ForeignKey, types, text, Uuid, CheckConstraint, func
import uuid
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from datetime import datetime

from db.base import Base 

class User(Base):
    __tablename__ = "user"

    id : Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key = True,
        default = uuid.uuid4
    )
    username: Mapped[str]
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password_hash: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

class Task(Base):
    __tablename__ = "task"

    # Add table-level check constraint for valid status values
    __table_args__ = (
        CheckConstraint("status IN ('To Do', 'In Progress', 'Done')", name="check_valid_status"),
    )

    id:Mapped[uuid.UUID] =  mapped_column(
        Uuid,
        primary_key = True,
        default = uuid.uuid4
    )
    task_name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="To Do", nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("user.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )



