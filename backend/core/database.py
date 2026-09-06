import psycopg
import alembic
from sqlalchemy import create_engine, text
from core.config import DB_URL
from sqlalchemy.orm import sessionmaker


engine = create_engine(DB_URL , echo=True)

Session = sessionmaker(autocommit=False, autoflush=False, bind= engine)

def get_db():
    db = Session()
    try:
        yield db 
        db.commit()
    except Exception:
        db.rollback()
        raise 
    finally:
        db.close()
