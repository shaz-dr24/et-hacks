from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class TranscriptRequest(BaseModel):
    text: str

class TranscriptResponse(BaseModel):
    tasks: List[Dict[str, Any]]

class OnboardingResponse(BaseModel):
    workflow_id: str
    status: str
    metrics: Optional[Dict[str, Any]] = None
    final_state: Optional[Dict[str, Any]] = None

class WorkflowLog(BaseModel):
    id: str
    workflow_id: str
    step: str
    agent: str
    action: str
    result: str
    reason: str
    created_at: str
