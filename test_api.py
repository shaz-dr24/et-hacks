import requests
import time

BASE_URL = "http://localhost:8000"

def test_health():
    print("Testing Health Check...")
    res = requests.get(f"{BASE_URL}/")
    print(res.json())

def test_onboarding():
    print("\nStarting Onboarding Workflow...")
    res = requests.post(f"{BASE_URL}/start-onboarding")
    data = res.json()
    print(f"Workflow ID: {data['workflow_id']}")
    print(f"Status: {data['status']}")
    return data['workflow_id']

def test_analyze_meeting():
    print("\nAnalyzing Meeting Transcript...")
    transcript = (
        "We need to document the new API. "
        "Alice will handle the infrastructure setup. "
        "Bob should review the security protocols by Friday. "
        "Charlie must prepare the onboarding slides."
    )
    res = requests.post(
        f"{BASE_URL}/analyze-meeting",
        json={"text": transcript}
    )
    print("Tasks Extracted & Assigned:")
    for task in res.json().get("tasks", []):
        print(f"- {task['task']} (Assigned to: {task['assigned_to']})")

def test_get_logs(workflow_id):
    print(f"\nFetching Logs for Workflow: {workflow_id}...")
    res = requests.get(f"{BASE_URL}/logs", params={"workflow_id": workflow_id})
    logs = res.json()
    for log in logs:
        print(f"[{log['created_at']}] {log['agent']} - {log['step']}: {log['result']}")

if __name__ == "__main__":
    # Note: Ensure the server is running before executing this
    try:
        test_health()
        wf_id = test_onboarding()
        test_analyze_meeting()
        test_get_logs(wf_id)
    except Exception as e:
        print(f"Error: {e}. Is the server running?")
