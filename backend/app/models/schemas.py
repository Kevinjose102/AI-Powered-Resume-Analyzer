from pydantic import BaseModel
from typing import Optional


class HealthResponse(BaseModel):
    status: str


class UploadResponse(BaseModel):
    filename: str
    extracted_text: str


class SkillItem(BaseModel):
    name: str
    category: str
    proficiency: str
    evidence: str


class EducationItem(BaseModel):
    degree: str
    field: str
    institution: str
    year: Optional[int] = None


class SkillsExtractionResponse(BaseModel):
    candidate_name: Optional[str] = None
    total_experience_years: Optional[float] = None
    skills: list[SkillItem] = []
    certifications: list[str] = []
    education: list[EducationItem] = []


class JobRequirement(BaseModel):
    skill: str
    category: str
    priority: str
    min_years: Optional[int] = None
    details: str = ""


class JobParseResponse(BaseModel):
    job_title: str = ""
    company: Optional[str] = None
    seniority_level: str = ""
    requirements: list[JobRequirement] = []
    min_experience_years: Optional[int] = None
    education_requirements: list[str] = []
    salary_range: Optional[str] = None


class MatchedSkill(BaseModel):
    skill: str
    candidate_level: str
    required_level: str
    match_quality: str


class RecommendedResource(BaseModel):
    title: str
    platform: str
    url: Optional[str] = None
    estimated_hours: Optional[int] = None


class SkillGap(BaseModel):
    skill: str
    category: str
    priority: str
    required_level: str
    current_level: str
    gap_severity: int = 5
    why_important: str = ""
    recommended_resource: Optional[RecommendedResource] = None


class BonusSkill(BaseModel):
    skill: str
    value_add: str


class LearningStep(BaseModel):
    week_range: str
    focus: str
    resource: str
    goal: str


class CategoryScores(BaseModel):
    technical_skills: float = 0
    experience: float = 0
    education: float = 0
    certifications: float = 0


class AnalysisResponse(BaseModel):
    overall_match_score: float = 0
    category_scores: CategoryScores = CategoryScores()
    matched_skills: list[MatchedSkill] = []
    skill_gaps: list[SkillGap] = []
    bonus_skills: list[BonusSkill] = []
    learning_path: list[LearningStep] = []
    executive_summary: str = ""
    strengths_narrative: str = ""
    gaps_narrative: str = ""
    market_positioning: str = ""
    action_plan: str = ""


class PresetItem(BaseModel):
    id: str
    title: str
    description: str


class PresetsResponse(BaseModel):
    presets: list[PresetItem]
