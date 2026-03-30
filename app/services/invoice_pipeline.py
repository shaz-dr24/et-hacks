from app.services.invoice_parser import extract_invoice_text
from app.services.invoice_ai import extract_invoice_json_llm
from app.services.invoice_validator import validate_invoice
from app.services.invoice_service import store_invoice, get_finance_team, log_task_email, log_agent_activity
from app.services.email_service import send_email
from app.services.logger import create_workflow
from app.services.health_monitor import trigger_monitor_for_workflow
from app.supabase_client import supabase
from typing import Dict, Any

def process_invoice(file_bytes: bytes) -> Dict[str, Any]:
    """
    Orchestrates the Enterprise Invoice Automation Pipeline:
    Extract -> JSON -> Validate -> Store -> Notify -> Log -> Monitor.
    """
    workflow_id = None
    try:
        # STEP 0: Create workflow for tracking
        workflow_id = create_workflow("invoice_processing")
        print(f"📌 Invoice workflow created: {workflow_id}")

        # STEP 1: OCR Extraction
        text = extract_invoice_text(file_bytes)
        
        # STEP 2: AI Decoding
        data = extract_invoice_json_llm(text)
        log_agent_activity("Invoice AI", "Extracted JSON data", "Groq-Llama 3.3 Semantic Parsing")

        # STEP 3: Business Validation
        validation_status, status, error = validate_invoice(data)
        log_agent_activity("Invoice Validator", f"Validation status: {validation_status}", "Business rules validation")

        # STEP 4: DB Storage (invoices table)
        invoice_id = store_invoice(data, status, validation_status, error)
        log_agent_activity("Invoice Storage", "Persisted invoice meta-data", f"Supabase Invoice ID: {invoice_id}")

        # STEP 4b: Insert into tasks table (for Health Monitor)
        try:
            supabase.table("tasks").insert({
                "workflow_id": workflow_id,
                "task": f"Process invoice {data.get('invoice_number', 'N/A')} from {data.get('vendor', 'Unknown')}",
                "assigned_to": "Finance Team",
                "status": "pending",
                "is_escalated": False
            }).execute()
            print(f"✅ Invoice task linked to workflow {str(workflow_id)[:8]}")
        except Exception as e:
            print(f"❌ Failed to insert invoice task: {e}")

        # STEP 5: Notification Routing (only if valid)
        if validation_status == "valid":
            finance_team = get_finance_team()
            
            subject = "💰 AutoPilotX: Invoice Approval Required"
            message_body = f"""
New Invoice for Approval:

- Vendor: {data.get('vendor')}
- Amount: ₹{data.get('amount')}
- Invoice No: {data.get('invoice_number')}
- Date: {data.get('invoice_date')}

Status: Approved / Pending Finance Check.
Please login to the finance portal to release payment.

- AutoPilotX Enterprise Admin
"""
            for member in finance_team:
                send_email(member["email"], subject, message_body)
                log_task_email("Invoice Approval", member["name"], member["email"], subject, message_body, "sent")
            
            log_agent_activity("Invoice Notification", "Routed to finance team", f"Sent to {len(finance_team)} members")

        # STEP 6: Trigger scoped health monitor
        if workflow_id:
            print(f"🔥 Triggering monitor for invoice workflow: {workflow_id}")
            trigger_monitor_for_workflow(str(workflow_id))

        return {
            "status": "success",
            "workflow_id": str(workflow_id) if workflow_id else None,
            "invoice_id": invoice_id,
            "data": data,
            "validation": {
                "status": validation_status,
                "workflow_state": status,
                "error": error
            }
        }

    except Exception as e:
        log_agent_activity("Invoice Pipeline", "Processing failed", str(e))
        return {"status": "failed", "error": str(e)}

