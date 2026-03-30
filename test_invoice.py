"""Quick test: Upload a sample invoice to trigger the full pipeline + health monitor."""
import requests

# Create a simple text-based invoice for testing
invoice_text = """
INVOICE

Vendor: TechPro Solutions Pvt. Ltd.
Invoice Number: INV-2026-0042
Date: 2026-03-28
Amount: 45000

Description: Annual cloud hosting and DevOps management services.

Payment Terms: Net 30
"""

# Save as a temp file and upload
with open("test_invoice.txt", "w") as f:
    f.write(invoice_text)

with open("test_invoice.txt", "rb") as f:
    response = requests.post(
        "http://localhost:8000/upload-invoice",
        files={"file": ("invoice.pdf", f, "application/pdf")}
    )

print("STATUS:", response.status_code)
print("RESPONSE:", response.json())
