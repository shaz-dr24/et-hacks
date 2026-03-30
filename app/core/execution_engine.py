import random
from typing import Dict, Any

class ExecutionEngine:
    def __init__(self, failure_probability: float = 0.3):
        self.failure_probability = failure_probability
        self.reasons = [
            "Timeout during API call",
            "Authentication failed for remote resource",
            "Inconsistent data format detected",
            "Resource temporarily unavailable",
            "Network latency exceeded threshold"
        ]

    def execute_step(self, step_data: Dict[str, Any], force_failure: bool = False) -> Dict[str, Any]:
        """
        Simulate step execution with a failure probability.
        'force_failure' can be used to guarantee a failure for demo purposes.
        """
        if force_failure or random.random() < self.failure_probability:
            reason = random.choice(self.reasons)
            if force_failure:
                reason = "Forced failure for demo (simulating unstable environment)"
                
            return {
                "status": "failed", 
                "error": "Simulated hardware/network failure", 
                "step": step_data["step"],
                "reason": reason
            }
        else:
            return {
                "status": "success", 
                "step": step_data["step"], 
                "result": f"Executed by {step_data.get('agent', 'Unknown')}",
                "reason": "OK - Ready for next step"
            }

execution_engine = ExecutionEngine()
