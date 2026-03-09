import json
import re
from openai import OpenAI
from app.core.config import GROQ_API_KEY, GROQ_BASE_URL, AI_MODEL

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = OpenAI(
            api_key=GROQ_API_KEY,
            base_url=GROQ_BASE_URL,
        )
    return _client


def call_openai(system_prompt: str, user_prompt: str, temperature: float = 0):
    """Groq chat completion wrapper that returns parsed JSON."""
    response = _get_client().chat.completions.create(
        model=AI_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=temperature,
    )

    result = response.choices[0].message.content

    print("LLM RAW OUTPUT:")
    print(result[:500])

    # Extract JSON from the response using regex
    match = re.search(r"\{.*\}", result, re.DOTALL)

    if not match:
        return {"raw_response": result}

    json_string = match.group(0)

    try:
        return json.loads(json_string)
    except json.JSONDecodeError:
        return {"raw_response": result}