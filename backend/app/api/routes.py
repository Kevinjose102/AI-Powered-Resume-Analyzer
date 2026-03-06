from fastapi import APIRouter, UploadFile, File
from app.services.resume_parser import extract_text_from_pdf

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