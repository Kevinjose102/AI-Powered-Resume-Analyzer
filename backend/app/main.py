from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(
    title="AI Resume Analyzer",
    description="Resume skill gap analysis system",
    version="1.0"
)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Resume Analyzer API running"}