import sys
import os

try:
    import requests
except ImportError:
    os.system(sys.executable + " -m pip install requests")
    import requests

try:
    r = requests.post("http://127.0.0.1:8000/health-scan", timeout=5)
    print("health:", r.status_code, r.text)
except Exception as e:
    print("health err:", e)

try:
    r = requests.get("http://127.0.0.1:8000/analytics", timeout=5)
    print("analytics:", r.status_code, r.text)
except Exception as e:
    print("analytics err:", e)
