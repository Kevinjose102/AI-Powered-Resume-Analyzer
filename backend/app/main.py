from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import ALLOWED_ORIGINS

app = FastAPI(
    title="AI Resume Analyzer",
    description="AI-powered resume skill gap analysis system using OpenAI",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {"message": "Resume Analyzer API running"}