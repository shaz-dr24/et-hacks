from typing import List, Dict, Optional

class AssignmentAgent:
    def __init__(self, name: str = "Assignment"):
        self.name = name
        self.team = [
            {"id": "E001", "name": "Alice Developer", "role": "IT", "capacity": 0.8},
            {"id": "E002", "name": "Bob HR", "role": "HR", "capacity": 1.0},
            {"id": "E003", "name": "Charlie Manager", "role": "Manager", "capacity": 0.5},
            {"id": "E004", "name": "Dana Security", "role": "Security", "capacity": 0.9}
        ]

    def assign_tasks(self, tasks: List[Dict]) -> List[Dict]:
        """
        Assign tasks to employees based on mock dataset and simple rules.
        """
        assigned_tasks = []
        for index, task in enumerate(tasks):
            # For this simple rule: just alternate between employees.
            # In a real-case, we would use roles or capacity.
            employee = self.team[index % len(self.team)]
            assigned_tasks.append({
                "description": task["task"],
                "assigned_to": employee["name"],
                "employee_id": employee["id"],
                "role": employee["role"]
            })
        return assigned_tasks

employee_emails = {
    "Rahul": "smuthu2005.business@gmail.com",
    "Priya": "srinithimcse@gmail.com",
    "Sneha": "naguik1984@gmail.com",
    "Vikram": "shachindranrao@gmail.com",
    "Arjun": "solutionseekers402@gmail.com"
}

def assign_task(task: str, employees: Optional[List[str]] = None, mention: Optional[str] = None) -> str:
    """
    Smarter assignment logic: 
    1. Check for explicit mention from speaker (e.g., "Arjun, you do X")
    2. Check if a name is contained in the task text
    3. Fallback to random choice from the worker pool
    """
    import random
    if not employees:
        employees = ["Arjun", "Priya", "Rahul"]
    
    # Check mentions first
    if mention and mention in employees:
        return mention

    # Check if any employee name is specifically in the task string
    for emp in employees:
        if emp.lower() in task.lower():
            return emp
            
    return random.choice(employees)

assignment_agent = AssignmentAgent()
