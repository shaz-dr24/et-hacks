from typing import List, Dict, Any
from app.agents.planner import planner_agent
from app.core.execution_engine import execution_engine
from app.core.monitor import monitor_service
from app.core.recovery_engine import recovery_engine
from app.services.logger import insert_log, create_workflow, update_workflow

class WorkflowEngine:
    def __init__(self, name: str = "WorkflowMaster"):
        self.name = name

    def run_onboarding(self) -> Dict[str, Any]:
        """
        Execute the onboarding workflow end-to-end.
        """
        workflow_id = create_workflow("started")
        if not workflow_id:
            return {"status": "error", "message": "Failed to create workflow"}

        # Get initial plan from Planner Agent
        steps = planner_agent.generate_plan("onboarding")
        insert_log(workflow_id, "planner", "PlannerAgent", "generate_plan", f"Found {len(steps)} steps")

        results = []
        for step in steps:
            # 1. Execution
            execution_res = execution_engine.execute_step(step)
            insert_log(workflow_id, step["step"], "ExecutionEngine", "execute_step", execution_res["status"])

            # 2. Monitoring
            status = monitor_service.evaluate_status(execution_res)
            
            # 3. Recovery if needed
            if status == "FAILURE":
                recovery_res = recovery_engine.attempt_recovery(step)
                insert_log(workflow_id, step["step"], "RecoveryEngine", "attempt_recovery", "recovered")
                results.append(recovery_res)
            else:
                results.append(execution_res)

        update_workflow(workflow_id, "completed")
        return {"workflow_id": workflow_id, "status": "completed", "results": results}

workflow_engine = WorkflowEngine()
