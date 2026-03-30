import re
import json
from typing import List, Dict
from groq import Groq
from app.config import settings

class TranscriptAgent:
    def __init__(self):
        self.client = None
        if settings.GROQ_API_KEY:
            self.client = Groq(api_key=settings.GROQ_API_KEY)

    def analyze_transcript(self, transcript: str) -> List[Dict]:
        """
        Extract tasks using Groq LLM for high accuracy and clean output.
        Falls back to regex if API key is missing.
        """
        if not self.client:
            return self._regex_fallback(transcript)

        prompt = f"""
        You are an expert project manager. Extract all actionable tasks from the following meeting transcript.
        
        For each task:
        1. Clean and summarize the task (make it action-oriented).
        2. Identify the person assigned to it.
        3. If no person is clearly assigned, use "Unassigned".
        
        Return ONLY a JSON list of objects with "task" and "assigned_to" keys.
        
        Transcript:
        {transcript}
        """

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"}
            )
            
            content = chat_completion.choices[0].message.content
            data = json.loads(content)
            
            # Groq response_format json_object might return a dict like {"tasks": [...]}
            if isinstance(data, dict):
                if "tasks" in data:
                    return data["tasks"]
                # If it's a list directly in string but wrapped in dict
                for key in data:
                    if isinstance(data[key], list):
                        return data[key]
            
            return data if isinstance(data, list) else []
            
        except Exception as e:
            print(f"LLM Extraction Error: {e}")
            return self._regex_fallback(transcript)

    def _regex_fallback(self, transcript: str) -> List[Dict]:
        tasks = []
        sentences = re.split(r'[.!?]', transcript)
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence: continue
            match = re.match(r"(?P<person>\w+)\s+(?P<verb>will|should|must)\s+(?P<action>.*)", sentence, re.IGNORECASE)
            if match:
                tasks.append({
                    "task": match.group("action"),
                    "assigned_to": match.group("person")
                })
        return tasks

def extract_tasks(text: str) -> List[Dict]:
    return transcript_agent.analyze_transcript(text)

transcript_agent = TranscriptAgent()
