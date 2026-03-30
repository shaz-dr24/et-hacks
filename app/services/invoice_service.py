from app.supabase_client import supabase
from typing import Dict, Any, List, Tuple

def store_invoice(data: Dict[str, Any], status: str, validation_status: str, error: str) -> str:
    """
    Persistence Layer: Logs the extracted and validated invoice details in Supabase.
    """
    try:
        response = supabase.table("invoices").insert({
            "vendor": data.get("vendor"),
            "invoice_number": data.get("invoice_number"),
            "amount": data.get("amount"),
            "invoice_date": data.get("invoice_date"),
            "status": status,
            "validation_status": validation_status,
            "error_message": error,
            "extracted_data": data
        }).execute()
        
        return response.data[0]["id"]
    except Exception as e:
        print(f"❌ DB Store Invoice Error: {e}")
        return ""

def get_finance_team() -> List[Dict[str, str]]:
    """
    Identifies active finance team members for automated approval notification.
    """
    try:
        res = supabase.table("employees") \
            .select("name,email") \
            .ilike("role", "%finance%") \
            .execute()
        return res.data
    except Exception as e:
        print(f"❌ DB Get Finance Team Error: {e}")
        return []

def log_task_email(task: str, owner: str, email: str, subject: str, message: str, status: str):
    """
    Audit Trail: Logs automated email notifications to ensure accountability.
    """
    try:
        supabase.table("task_email_logs").insert({
            "task": task,
            "owner": owner,
            "email": email,
            "subject": subject,
            "message": message,
            "status": status
        }).execute()
    except Exception as e:
        print(f"❌ DB Email Log Error: {e}")

def log_agent_activity(agent: str, action: str, reason: str):
    """
    Audit Trail: Logs agent actions and decision-making rationale for transparency.
    """
    try:
        supabase.table("logs").insert({
            "agent": agent,
            "action": action,
            "reason": reason
        }).execute()
    except Exception as e:
        print(f"❌ DB Agent Log Error: {e}")
