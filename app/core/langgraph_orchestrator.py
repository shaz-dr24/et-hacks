import operator
import time
from typing import List, Dict, Any, TypedDict, Annotated, Union
from langgraph.graph import StateGraph, START, END
from app.agents.planner import planner_agent
from app.core.execution_engine import execution_engine
from app.core.monitor import monitor_service
from app.core.recovery_engine import recovery_engine
from app.services.logger import insert_log, create_workflow, update_workflow

class WorkflowState(TypedDict):
    workflow_id: str
    steps: List[Dict[str, Any]]
    current_step_index: int
    status: str
    logs: Annotated[List[Dict[str, Any]], operator.add]
    last_action_result: Dict[str, Any]
    start_time: float
    recovery_count: int

# 1. Planner Node
def planner_node(state: WorkflowState) -> Dict[str, Any]:
    steps = planner_agent.generate_plan("onboarding")
    insert_log(state["workflow_id"], "planner", "PlannerAgent", "generate_plan", f"Found {len(steps)} steps")
    return {
        "steps": steps,
        "current_step_index": 0,
        "status": "planned",
        "logs": [{"node": "planner", "result": "planned"}],
        "start_time": time.time(),
        "recovery_count": 0
    }

# 2. Execution Node
def execution_node(state: WorkflowState) -> Dict[str, Any]:
    idx = state["current_step_index"]
    current_step = state["steps"][idx]
    
    # 💥 DEMO: Force failure on the second step (index 1) to show recovery
    should_force = (idx == 1 and state["recovery_count"] == 0)
    
    res = execution_engine.execute_step(current_step, force_failure=should_force)
    
    insert_log(
        state["workflow_id"], 
        current_step["step"], 
        "ExecutionEngine", 
        "execute_step", 
        res["status"],
        reason=res.get("reason", "")
    )
    
    return {
        "last_action_result": res,
        "status": "executing",
        "logs": [{"node": "execution", "result": res["status"]}]
    }

# 3. Monitor Node (Routing)
def monitor_node(state: WorkflowState) -> str:
    res = state["last_action_result"]
    if res["status"] == "success":
        return "next_step"
    else:
        return "failure"

# 4. Recovery Node
def recovery_node(state: WorkflowState) -> Dict[str, Any]:
    current_step = state["steps"][state["current_step_index"]]
    res = recovery_engine.attempt_recovery(current_step)
    
    insert_log(
        state["workflow_id"], 
        current_step["step"], 
        "RecoveryEngine", 
        "attempt_recovery", 
        "recovered",
        reason="Triggered due to simulated failure"
    )
    
    return {
        "last_action_result": res,
        "status": "recovered",
        "recovery_count": state["recovery_count"] + 1,
        "logs": [{"node": "recovery", "result": "recovered"}]
    }

# 5. Result/Audit Node
def audit_node(state: WorkflowState) -> Dict[str, Any]:
    if state["current_step_index"] < len(state["steps"]) - 1:
        return {
            "current_step_index": state["current_step_index"] + 1,
            "status": "in_progress"
        }
    else:
        duration = round(time.time() - state["start_time"], 2)
        summary = f"Workflow finished in {duration}s with {state['recovery_count']} recoveries"
        update_workflow(state["workflow_id"], "completed")
        
        insert_log(
            state["workflow_id"], 
            "audit", 
            "AuditNode", 
            "finalize", 
            "completed",
            reason=summary
        )
        
        return {
            "status": "completed",
            "logs": [{"node": "audit", "result": summary}]
        }

def should_continue(state: WorkflowState) -> str:
    if state["status"] == "completed":
        return END
    return "execution"

# Build Graph
workflow_builder = StateGraph(WorkflowState)

workflow_builder.add_node("planner", planner_node)
workflow_builder.add_node("execution", execution_node)
workflow_builder.add_node("recovery", recovery_node)
workflow_builder.add_node("audit", audit_node)

workflow_builder.add_edge(START, "planner")
workflow_builder.add_edge("planner", "execution")

# Conditional edges for monitoring
workflow_builder.add_conditional_edges(
    "execution",
    monitor_node,
    {
        "next_step": "audit",
        "failure": "recovery"
    }
)

workflow_builder.add_edge("recovery", "audit")

workflow_builder.add_conditional_edges(
    "audit",
    should_continue,
    {
        "execution": "execution",
        END: END
    }
)

workflow_app = workflow_builder.compile()

def run_langgraph_workflow() -> Dict[str, Any]:
    workflow_id = create_workflow("started")
    initial_state = {
        "workflow_id": workflow_id,
        "steps": [],
        "current_step_index": 0,
        "status": "initializing",
        "logs": [],
        "last_action_result": {},
        "start_time": 0.0,
        "recovery_count": 0
    }
    
    final_state = workflow_app.invoke(initial_state)
    return {"workflow_id": workflow_id, "final_state": final_state}
