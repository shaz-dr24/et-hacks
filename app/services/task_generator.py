import json
from typing import List, Dict, Any
from groq import Groq
from app.config import settings

def generate_onboarding_tasks_llm(details: Dict[str, Any]) -> List[str]:
    """
    LLM DYNAMIC TASK GENERATION: Pulls candidate skills and generates custom 
    onboarding roadmap.
    """
    if not settings.GROQ_API_KEY:
        return ["Complete general onboarding training"]

    client = Groq(api_key=settings.GROQ_API_KEY)
    
    prompt = f"""
    ROLE: You are an expert HR Onboarding Specialist.
    TASK: Generate a dynamic onboarding roadmap for a new hire.
    
    CANDIDATE: {details.get("name")}
    SKILLS: {", ".join(details.get("skills", []))}
    
    REQUIREMENTS:
    1. Generate exactly 5 personalized technical tasks.
    2. Focus on their skills (e.g., if they know Python, assign backend setup).
    3. Make tasks professional and company-ready.

    Return ONLY a JSON list of strings (tasks).
    Example: ["Set up Python backend project", "Configure AWS security credentials"]
    """

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        data = json.loads(chat_completion.choices[0].message.content)
        
        # Handle dict or list returned by Groq
        if isinstance(data, dict):
            for key in data:
                if isinstance(data[key], list):
                    return data[key]
        return data if isinstance(data, list) else ["Complete general onboarding training"]
    except Exception as e:
        print(f"❌ LLM TASK GENERATION ERROR: {e}")
        return ["Complete general onboarding training"]
