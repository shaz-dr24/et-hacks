from typing import Dict, Any, Tuple, Optional

def validate_invoice(data: Dict[str, Any]) -> Tuple[str, str, Optional[str]]:
    """
    Business rules for automated invoice approval or rejection.
    Returns: (validation_status, status, error_message)
    """
    amount = data.get("amount")
    invoice_number = data.get("invoice_number")
    
    # 1. Check for realistic amount
    if not amount or not isinstance(amount, (int, float)) or amount <= 0:
        return "invalid", "failed", "Invalid or missing amount"
        
    # 2. Check for realistic invoice number length
    if not invoice_number or len(str(invoice_number)) < 3:
        return "invalid", "failed", "Invalid or missing invoice number"
    
    # 3. Valid: Approved for routing
    return "valid", "approved", None
