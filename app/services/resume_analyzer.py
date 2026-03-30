import json
from typing import Dict, Any, List
from groq import Groq
from app.config import settings

def extract_resume_details_llm(resume_text: str) -> Dict[str, Any]:
    """
    STRICT EXTRACTOR: Use Groq LLM to pull candidate data from the resume.
    GROUNDING: Commands to strictly avoid hallucination or default values.
    """
    if not settings.GROQ_API_KEY:
        return {"name": "Unknown", "email": "Unknown", "skills": []}

    client = Groq(api_key=settings.GROQ_API_KEY)
    
    prompt = f"""
    ROLE: You are an expert Recruiter Assistant extracting structured data.
    
    TASK: Pull the Candidate Name, Email, and Technical Skills from the text.
    
    STRICT RULES:
    1. Extract ONLY from the resume text provided.
    2. DO NOT use generic names like "John Doe" or placeholder emails.
    3. If the name is not in the text, return "Candidate-Unknown".
    4. If no email is found, return null.
    5. Summarize skills as single-word technical tags.

    Return ONLY a JSON object:
    {{
      "name": "The Real Name from text",
      "email": "The Real Email from text",
      "skills": ["Skill1", "Skill2", ...]
    }}

    RESUME TEXT:
    {resume_text}
    """

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        data = json.loads(chat_completion.choices[0].message.content)
        return data
    except Exception as e:
        print(f"❌ LLM EXTRACTION ERROR: {e}")
        return {"name": "Error-Extraction", "email": "null", "skills": []}
