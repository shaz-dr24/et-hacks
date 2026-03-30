from app.supabase_client import supabase
import datetime

def insert_log(workflow_id: str, step: str, agent: str, action: str, result: str, reason: str = ""):
    try:
        data = {
            "workflow_id": workflow_id,
            "step": str(step),
            "agent": str(agent),
            "action": str(action),
            "result": str(result),
            "reason": str(reason)
        }
        res = supabase.table("logs").insert(data).execute()
        print(f"🚀 [AUDIT] {agent} | Action: {action} | Result: {result} | Reason: {reason}")
        return res
    except Exception as e:
        print(f"❌ [AUDIT ERROR] Failed to insert log: {e}")
        return None

def create_workflow(status: str = "started"):
    try:
        data = {"status": status}
        res = supabase.table("workflows").insert(data).execute()
        if res.data:
            return res.data[0]["id"]
        return None
    except Exception as e:
        print(f"Error creating workflow: {e}")
        return None

def update_workflow(workflow_id: str, status: str):
    try:
        res = supabase.table("workflows").update({"status": status}).eq("id", workflow_id).execute()
        return res
    except Exception as e:
        print(f"Error updating workflow: {e}")
        return None
