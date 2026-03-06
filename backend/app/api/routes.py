from fastapi import APIRouter, UploadFile, File
from app.services.resume_parser import extract_text_from_pdf
from app.services.skill_extractor import extract_skills

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "API working"}


@router.post("/upload-resume")
async def upload_resume(resume: UploadFile = File(...)):

    extracted_text = extract_text_from_pdf(resume)

    return {
        "filename": resume.filename,
        "extracted_text": extracted_text[:1000]  # limit output for now
    }

@router.post("/extract-skills")
async def extract_resume_skills(resume: UploadFile = File(...)):

    text = extract_text_from_pdf(resume)

    skills = extract_skills(text)

    return {
        "skills": skills
    }