import os
from pathlib import Path
from dotenv import load_dotenv

# Explicitly load .env from the backend/ directory
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY not found in .env file at:", env_path)

# Groq settings (OpenAI-compatible API)
GROQ_BASE_URL = "https://api.groq.com/openai/v1"
AI_MODEL = "llama-3.3-70b-versatile"

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
