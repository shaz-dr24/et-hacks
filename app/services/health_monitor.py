from datetime import datetime, timedelta, timezone
from app.supabase_client import supabase
from app.services.email_service import send_email
from app.services.invoice_service import log_agent_activity
from typing import List, Dict, Any
import threading
import time

SLA_SECONDS = 30  # 30 seconds for demo/testing (change to 120 for production)

def monitor_workflow(workflow_id: str):
    """
    Event-driven, per-workflow health monitor.
    Runs in a background thread scoped to one workflow.
    Stops automatically when all tasks are completed.
    """
    print(f"🚦 [HEALTH MONITOR] Started watching workflow: {workflow_id}")

    retry_count = 0
    max_retries = 5

    while True:
        try:
            # Fetch only pending tasks for THIS workflow
            res = supabase.table("tasks").select("*") \
                .eq("workflow_id", workflow_id) \
                .eq("status", "pending") \
                .execute()
            tasks = res.data

            print(f"🧠 [MONITOR] Tasks found for {workflow_id[:8]}: {len(tasks)}")

            # If no tasks yet, retry a few times before giving up
            if not tasks:
                retry_count += 1
                if retry_count > max_retries:
                    print(f"✅ [HEALTH MONITOR] Workflow {workflow_id[:8]} — all tasks done or none found. Stopping.")
                    log_agent_activity("Health Agent", "Monitor stopped", f"Workflow {workflow_id[:8]} complete.")
                    break
                print(f"⏳ [MONITOR] No pending tasks yet, retry {retry_count}/{max_retries}...")
                time.sleep(10)
                continue

            # Reset retry counter once tasks are found
            retry_count = 0
            now = datetime.now(timezone.utc)

            for task in tasks:
                # Skip already-escalated tasks
                if task.get("is_escalated"):
                    continue

                # Parse and normalize timestamp
                created_at_str = task.get("created_at", "")
                try:
                    created_at = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
                except Exception:
                    print(f"⚠️ Could not parse timestamp: {created_at_str}")
                    continue

                if created_at.tzinfo is None:
                    created_at = created_at.replace(tzinfo=timezone.utc)

                delay_seconds = (now - created_at).total_seconds()
                print(f"⏱ [MONITOR] Task '{task['task'][:30]}...' delay: {delay_seconds:.0f}s (SLA: {SLA_SECONDS}s)")

                # SLA Breach Check
                if delay_seconds > SLA_SECONDS:
                    print(f"⚠️ [SLA BREACH] Task '{task['task'][:40]}' exceeded SLA!")

                    # Log to workflow_health table
                    try:
                        supabase.table("workflow_health").insert({
                            "workflow_id": workflow_id,
                            "issue_type": "SLA Breach",
                            "severity": "high",
                            "message": f"Task '{task['task']}' (owner: {task.get('assigned_to')}) delayed by {delay_seconds:.0f}s"
                        }).execute()
                    except Exception as e:
                        print(f"❌ Error logging health incident: {e}")

                    # Send escalation email
                    try:
                        admin_email = "solutionseekers402@gmail.com"
                        send_email(
                            admin_email,
                            f"⚠️ URGENT: SLA Breach — Task {task['id'][:8]}",
                            f"Task: '{task['task']}'\nOwner: {task.get('assigned_to')}\nDelay: {delay_seconds:.0f}s\n\n— AutoPilotX Health Agent"
                        )
                        print(f"📧 [ESCALATION SENT] Alert dispatched for task {task['id'][:8]}")
                    except Exception as e:
                        print(f"❌ Escalation email error: {e}")

                    # Mark as escalated to prevent duplicate alerts
                    try:
                        supabase.table("tasks").update({"is_escalated": True}).eq("id", task["id"]).execute()
                        print(f"✅ [MARKED ESCALATED] Task {task['id'][:8]}")
                    except Exception as e:
                        print(f"⚠️ Could not mark task as escalated: {e}")

                    log_agent_activity("Health Agent", "SLA Breach detected", f"Task {task['id'][:8]} escalated")

        except Exception as e:
            print(f"❌ [HEALTH MONITOR] Error: {e}")

        time.sleep(20)  # Check every 20 seconds for demo

def trigger_monitor_for_workflow(workflow_id: str):
    """
    Launches a background monitoring thread scoped to a specific workflow.
    """
    print(f"🚀 [TRIGGER] Starting monitor thread for workflow: {workflow_id}")
    t = threading.Thread(target=monitor_workflow, args=(workflow_id,), daemon=True)
    t.start()

def check_workflow_health():
    """
    Global scan — used for the /health-scan manual endpoint only.
    """
    print("🚦 [HEALTH SCAN] Running global health scan...")
    try:
        res = supabase.table("tasks").select("*").eq("status", "pending").execute()
        tasks = res.data
    except Exception as e:
        print(f"❌ Health scan fetch error: {e}")
        return []

    now = datetime.now(timezone.utc)
    issues = []

    for task in tasks:
        try:
            created_at = datetime.fromisoformat(task["created_at"].replace('Z', '+00:00'))
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)
        except Exception:
            continue

        delay = (now - created_at).total_seconds()
        if delay > SLA_SECONDS and not task.get("is_escalated"):
            issues.append({
                "workflow_id": task.get("workflow_id"),
                "issue_type": "SLA Breach",
                "severity": "high",
                "message": f"Task '{task['task']}' delayed by {delay:.0f}s",
                "assigned_to": task.get("assigned_to")
            })

    log_agent_activity("Health Agent", "Global scan", f"{len(issues)} issue(s)")
    return issues
