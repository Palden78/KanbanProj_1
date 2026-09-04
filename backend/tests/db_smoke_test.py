import psycopg
import alembic
from sqlalchemy import create_engine, text
from core.config import DB_URL


engine = create_engine(DB_URL , echo=True)

with engine.connect() as conn:
    result = conn.execute(text("SELECT current_database(), current_user;"))
    print(result.all())
