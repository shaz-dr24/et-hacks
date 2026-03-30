import smtplib
from email.mime.text import MIMEText
from app.config import settings

BASE_URL = "http://localhost:8000"

def generate_ack_link(task_id: str) -> str:
    """
    Generate a unique URL for acknowledging task completion.
    """
    return f"{BASE_URL}/acknowledge-task/{task_id}"

def send_email(to_email: str, subject: str, body: str):
    """
    SMTP-based email service to notify team members about new assignments.
    """
    if not settings.SMTP_EMAIL or not settings.SMTP_PASSWORD:
        print("❌ SMTP settings missing. Skipping email notification.")
        return

    try:
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_EMAIL
        msg["To"] = to_email

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_EMAIL, to_email, msg.as_string())
        server.quit()

        print(f"✅ Email notification sent to {to_email}")

    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")

# Note: For Gmail, an App Password is required if 2FA is enabled.
