from app.services.openai_client import extract_skills_from_text


def extract_skills(text: str):

    prompt = f"""
You are an information extraction system designed to identify professional and technical skills from text.

Rules:
1. Extract only technical skills.
2. Do NOT include soft skills.
3. Do NOT infer skills that are not explicitly mentioned.
4. Remove duplicates.

Return strictly valid JSON:

{{
  "skills": ["skill1", "skill2"]
}}

Text to analyze:
{text}
"""

    response = extract_skills_from_text(prompt)

    return response.get("skills", [])