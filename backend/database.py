from sqlmodel import SQLModel, create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./ai_receptionist.db")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    jwt_secret: str = os.getenv("JWT_SECRET", "changeme")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    smtp_host: str = os.getenv("SMTP_HOST", "")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_pass: str = os.getenv("SMTP_PASS", "")
    dealership_name: str = os.getenv("DEALERSHIP_NAME", "Your Dealership Name")


settings = Settings()

# Create async engine
engine = create_async_engine(settings.database_url, echo=True)

# Create session factory
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session


def create_tables():
    """Create all tables. Used for testing."""
    sync_engine = create_engine(settings.database_url.replace("+aiosqlite", ""))
    SQLModel.metadata.create_all(sync_engine)
