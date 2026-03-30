import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    SMTP_EMAIL: str = os.getenv("SMTP_EMAIL", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")

    class Config:
        env_file = ".env"

settings = Settings()
