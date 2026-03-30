from typing import Dict, Any

class MonitorService:
    def __init__(self, name: str = "Monitor"):
        self.name = name

    def evaluate_status(self, execution_result: Dict[str, Any]) -> str:
        """
        Check and define the next state for the workflow engine.
        """
        if execution_result.get("status") == "success":
            return "SUCCESS"
        else:
            return "FAILURE"

monitor_service = MonitorService()
