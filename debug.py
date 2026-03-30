import urllib.request
import urllib.error

def fetch(url, method="GET"):
    try:
        req = urllib.request.Request(url, method=method)
        print(f"{method} {url}:", urllib.request.urlopen(req).read().decode())
    except urllib.error.HTTPError as e:
        print(f"Error {method} {url}:", e.read().decode())
    except Exception as e:
        print(f"Crashed {method} {url}:", e)

fetch("http://127.0.0.1:8000/health-scan", "POST")
fetch("http://127.0.0.1:8000/analytics", "GET")
