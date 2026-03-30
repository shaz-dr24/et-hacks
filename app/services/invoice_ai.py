import json
from groq import Groq
from app.config import settings
from typing import Dict, Any

def extract_invoice_json_llm(text: str) -> Dict[str, Any]:
    """
    Leverages Groq/Llama 3.3 for high-precision extraction of structured 
    invoice fields (vendor, number, amount, date) from unstructured text.
    """
    if not settings.GROQ_API_KEY:
        print("❌ Groq key missing for Invoice AI.")
        return {}

    client = Groq(api_key=settings.GROQ_API_KEY)
    
    prompt = f"""
    You are an expert Finance Auditor. Extract the following details from the invoice text:
    - Vendor Name
    - Invoice Number
    - Total Amount (as a number, ignore currency)
    - Invoice Date (Format: YYYY-MM-DD)

    Return ONLY a JSON object:
    {{
      "vendor": "...",
      "invoice_number": "...",
      "amount": number,
      "invoice_date": "YYYY-MM-DD"
    }}

    Rules: 
    - Accuracy is critical. 
    - If unknown, return null.
    - No placeholders.

    Invoice Text:
    {text}
    """

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "system", "content": "You are a financial AI extracting structured invoice data."},{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        data = json.loads(chat_completion.choices[0].message.content)
        return data
    except Exception as e:
        print(f"❌ Invoice AI Extraction Error: {e}")
        return {}
