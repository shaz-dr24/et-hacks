from pypdf import PdfReader
from pdf2image import convert_from_bytes
import pytesseract
import io

def extract_invoice_text(file_bytes: bytes) -> str:
    """
    Hybrid Invoice extraction:
    First attempts direct PDF text parsing (ideal for generated invoices), 
    then falls back to OCR if the file is an image/scanned PDF.
    """
    text = ""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            text += page.extract_text() or ""
        
        if text.strip():
            print("🚀 [INVOICE PARSER] Direct PDF parsing successful.")
            return text
    except Exception as e:
        print(f"⚠️ Direct parsing failed: {e}")

    print("📸 [INVOICE PARSER] Falling back to OCR...")
    try:
        images = convert_from_bytes(file_bytes)
        for img in images:
            text += pytesseract.image_to_string(img) + "\n"
        return text
    except Exception as e:
        print(f"❌ OCR extraction failed: {e}")
        return ""
