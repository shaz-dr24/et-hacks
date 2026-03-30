from pypdf import PdfReader
import pytesseract
from pdf2image import convert_from_bytes
import io

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Hybrid PDF extraction: 
    1. Try PyPDF for digital text extraction (fastest/most accurate).
    2. Fallback to Tesseract OCR if text extraction returns nothing (scanned/image).
    """
    text = ""
    
    # --- 1. Attempt Direct Text Extraction (PyPDF) ---
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            text += page.extract_text() or ""
        
        if text.strip():
            print("🚀 [PARSER] Digital Text Extraction Successful (PyPDF)")
            return text
    except Exception as e:
        print(f"⚠️ [PARSER] Digital Extraction Failed: {e}")

    # --- 2. Fallback to OCR (Tesseract) ---
    print("📸 [PARSER] Attempting OCR Fallback (Tesseract)...")
    try:
        images = convert_from_bytes(file_bytes)
        ocr_text = ""
        for img in images:
            ocr_text += pytesseract.image_to_string(img) + "\n"
        
        if ocr_text.strip():
            print("✅ [PARSER] OCR Extraction Successful")
            return ocr_text
    except Exception as e:
        print(f"❌ [PARSER] OCR Extraction Error: {e}")
        
    return ""
