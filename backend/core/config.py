import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET")
if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET is not set in environment variables or .env file.")

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

DB_URL = os.getenv("DATABASE_URL")
