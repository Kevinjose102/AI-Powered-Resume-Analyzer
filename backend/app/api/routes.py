from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.services.resume_parser import extract_text_from_pdf
from app.services.skill_extractor import extract_skills
from app.services.analysis_engine import parse_job_description, perform_gap_analysis, JOB_PRESETS

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "API working"}


@router.post("/upload-resume")
async def upload_resume(resume: UploadFile = File(...)):
    if not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    try:
        extracted_text = extract_text_from_pdf(resume)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")

    return {
        "filename": resume.filename,
        "extracted_text": extracted_text[:2000],
    }


@router.post("/extract-skills")
async def extract_resume_skills(resume: UploadFile = File(...)):
    if not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    text = extract_text_from_pdf(resume)
    skills = extract_skills(text)
    return skills


@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    job_preset: Optional[str] = Form(None),
):
    """Full analysis pipeline: parse resume → extract skills → parse job → gap analysis."""

    if not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    # 1. Parse resume
    try:
        resume_text = extract_text_from_pdf(resume)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    # 2. Resolve job description
    jd_text = job_description
    if not jd_text and job_preset:
        preset = next((p for p in JOB_PRESETS if p["id"] == job_preset), None)
        if preset:
            jd_text = preset["description"]

    if not jd_text:
        raise HTTPException(
            status_code=400,
            detail="Please provide a job description or select a preset",
        )

    try:
        # 3. Extract skills from resume
        candidate_skills = extract_skills(resume_text)

        # 4. Parse job description
        job_requirements = parse_job_description(jd_text)

        # 5. Perform gap analysis
        analysis = perform_gap_analysis(candidate_skills, job_requirements)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"OpenRouter Error: {str(e)}\n\nPlease check your OpenRouter privacy settings: https://openrouter.ai/settings/privacy"
        )

    return {
        "candidate_skills": candidate_skills,
        "job_requirements": job_requirements,
        "analysis": analysis,
    }


@router.get("/presets")
def get_presets():
    """Return available job description presets."""
    return {
        "presets": [
            {"id": p["id"], "title": p["title"], "description": p["description"]}
            for p in JOB_PRESETS
        ]
    }