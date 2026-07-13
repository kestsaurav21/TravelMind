import os
from pathlib import Path
from dotenv import load_dotenv

# Load environmental variables from .env file
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "AI Travel Planner"
    API_V1_STR: str = "/api/v1"
    
    # JWT Security settings
    # In production, this MUST be set via environment variable
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretjwtkeyforlocaldevelopmentonlychangeinprod")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "11520"))  # Default: 8 days
    
    # Database URL configuration
    # Default to a local SQLite database for ease of local development
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./travelmind.db")

settings = Settings()
