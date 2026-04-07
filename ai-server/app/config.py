import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App Settings
    app_name: str = "Autonomous Codebase Documentor - AI Server"
    log_level: str = "INFO"

    # Gemini Settings
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    # LLM Settings (Groq)
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    llm_model: str = "llama-3.3-70b-versatile"

    # Chroma DB
    chroma_db_dir: str = "./chroma_db"

    # Repo cloning
    clone_dir: str = "/tmp/repos"
    max_chunk_size: int = 400

    class Config:
        env_file = ".env"

settings = Settings()
