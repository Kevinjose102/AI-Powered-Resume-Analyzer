from app.services.openai_client import call_openai


def extract_skills(text: str) -> dict:
    """Extract skills from resume text using OpenAI."""

    system_prompt = (
        "You are an expert HR technology system specializing in resume analysis "
        "and skill extraction. You have deep knowledge of technical skills, tools, "
        "frameworks, programming languages, certifications, and industry-standard "
        "competencies across all domains."
    )

    user_prompt = f"""Analyze the following resume text and extract ALL professional skills mentioned or strongly implied. Categorize each skill and assess the proficiency level based on context clues (years of experience, project complexity, certifications held).

Rules:
1. Extract both technical skills AND soft skills
2. Categorize skills into: Programming Languages, Frameworks & Libraries, Databases, Cloud & DevOps, Tools & Platforms, Soft Skills, Domain Knowledge
3. Assess proficiency as: Beginner, Intermediate, Advanced, Expert
4. Base proficiency on: years mentioned, project complexity described, certifications listed, and role seniority
5. Do NOT hallucinate skills — only extract what is explicitly stated or strongly implied
6. Include version numbers if mentioned (e.g., "Python 3.x", "React 18")

Return STRICTLY valid JSON in this exact format:
{{
  "candidate_name": "string",
  "total_experience_years": 0,
  "skills": [
    {{
      "name": "string",
      "category": "string",
      "proficiency": "Beginner|Intermediate|Advanced|Expert",
      "evidence": "string (brief quote or reason from resume)"
    }}
  ],
  "certifications": ["string"],
  "education": [
    {{
      "degree": "string",
      "field": "string",
      "institution": "string",
      "year": 0
    }}
  ]
}}

Resume Text:
\"\"\"
{text}
\"\"\""""

    return call_openai(system_prompt, user_prompt)