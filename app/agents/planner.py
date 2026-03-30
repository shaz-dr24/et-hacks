from typing import List, Dict

class PlannerAgent:
    def __init__(self, name: str = "Planner"):
        self.name = name

    def generate_plan(self, workflow_type: str = "onboarding") -> List[Dict]:
        """
        Returns a list of onboarding workflow steps.
        """
        if workflow_type == "onboarding":
            return [
                {"step": "document_review", "agent": "HR"},
                {"step": "equipment_provisioning", "agent": "IT"},
                {"step": "security_briefing", "agent": "Security"},
                {"step": "internal_account_creation", "agent": "Ops"},
                {"step": "first_day_meeting", "agent": "Manager"}
            ]
        return [{"step": "initial_assessment", "agent": "General"}]

planner_agent = PlannerAgent()
