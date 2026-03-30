from typing import Dict, Any, List
from app.core.langgraph_orchestrator import run_langgraph_workflow
from app.agents.transcript_agent import extract_tasks
from app.agents.assignment_agent import assign_task, employee_emails
from app.services.email_service import send_email, generate_ack_link
from app.services.logger import create_workflow
from app.supabase_client import supabase
import uuid

class WorkflowService:
    def start_onboarding_workflow(self) -> Dict[str, Any]:
        """
        Trigger the onboarding workflow using LangGraph orchestration.
        """
        return run_langgraph_workflow()

    def process_meeting_transcript(self, transcript_text: str) -> Dict[str, Any]:
        """
        Analyze transcript, assign tasks, and trigger email notifications with 
        one-click acknowledgment links.
        """
        workflow_id = create_workflow("meeting_analysis")
        
        if not workflow_id:
            workflow_id = str(uuid.uuid4())
            print(f"⚠️ Warning: Created orphaned workflow ID: {workflow_id}")

        tasks_data = extract_tasks(transcript_text)
        assigned_tasks = []
        team_members = list(employee_emails.keys())

        for task_obj in tasks_data:
            task_text = task_obj.get("task") or task_obj.get("description", "No description")
            person = task_obj.get("assigned_to") or task_obj.get("owner", "Unassigned")
            
            if person.lower() in ["unassigned", "i", "none"] or person not in team_members:
                predicted_person = assign_task(task_text, team_members)
                person = predicted_person if person.lower() in ["unassigned", "i", "none"] else person
            
            task_id = None
            try:
                data_to_insert = {
                    "workflow_id": workflow_id,
                    "task": task_text,
                    "assigned_to": person,
                    "status": "pending"
                }
                response = supabase.table("tasks").insert(data_to_insert).execute()
                if response.data:
                    task_id = response.data[0]["id"]
            except Exception as e:
                print(f"❌ SUPABASE INSERT ERROR: {e}")

            # 📧 Automated Email Notification with Acknowledgment Link
            email = employee_emails.get(person)
            if email and task_id:
                ack_link = generate_ack_link(task_id)
                subject = "Action Required: New Task Assigned - AutoPilotX"
                body = f"""Hello {person},

You have been assigned a new task:

👉 {task_text}

Status: Pending
Workflow ID: {workflow_id}

Once you have completed this task, please click the link below to verify:
✅ {ack_link}

- AutoPilotX Workflow Agent
"""
                send_email(email, subject, body)

            assigned_tasks.append({
                "task": task_text,
                "assigned_to": person,
                "task_id": task_id
            })

        return {
            "workflow_id": workflow_id,
            "tasks": assigned_tasks
        }

workflow_service = WorkflowService()
