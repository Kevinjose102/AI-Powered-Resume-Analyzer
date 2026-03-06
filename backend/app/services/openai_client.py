import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("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")
)


def extract_skills_from_text(prompt: str):

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a system that extracts structured information."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except:
        return {"skills": []}