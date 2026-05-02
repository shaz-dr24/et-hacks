# Nexus AI - Document Intelligence System

## 📌 Overview

**Nexus AI Document Intelligence System** is an end-to-end, event-driven AI procurement and document management system. It provides a highly scalable pipeline designed to ingest, process, and analyze documents and invoices automatically. Leveraging modern machine learning for OCR, fraud detection, and data extraction, Nexus AI ensures rapid and accurate vendor quote comparisons, requirement extraction, and RFQ generation.

## 🚀 Key Features

*   **Intelligent Document Processing:** Asynchronous document parsing and OCR using Celery, Redis, and Poppler.
*   **LLM-Powered Intelligence:** Dynamic validation of vendor quotes against budgetary constraints, requirement extraction, and intelligent fraud detection engine to flag suspicious submissions.
*   **Real-Time Analytics:** Dynamic dashboards driven by live database queries to provide visibility into procurement performance and system activity.
*   **Robust Backend:** FastAPI-powered high-performance REST APIs.
*   **Secure & Scalable Storage:** Integrated with Supabase for persistent, secure data storage.
*   **Responsive Frontend:** A sleek, single-page interface (`nexus_ai.html`) that seamlessly connects to the backend API for real-time interaction.

## 🛠️ Technology Stack

*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla/React-based logic via CDN).
*   **Backend:** Python 3.x, FastAPI.
*   **Message Broker & Task Queue:** Redis, Celery.
*   **Database:** Supabase (PostgreSQL).
*   **Document Processing:** Poppler (for PDF processing), advanced OCR libraries.
*   **AI/LLM Engine:** Integrated LLM for data extraction and fraud detection.

## 📂 Project Structure

```text
AI-Document-Intelligence-System/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── routes/              # API endpoints (upload, email, documents)
│   ├── services/            # Core business logic and AI integrations
│   └── workers/             # Celery background tasks
├── data/                    # Local storage for temporary/processed files
├── poppler/                 # Poppler binaries for PDF manipulation
├── nexus_ai.html            # Main frontend application interface
├── .env                     # Environment variables configuration (ignored by git)
├── .env.example             # Example environment variables template
├── requirements.txt         # Python dependencies
└── README.md                # Project documentation
```

## ⚙️ Setup and Installation

### Prerequisites

*   **Python 3.9+** installed on your system.
*   **Redis** server running locally or accessible remotely.
*   **Poppler** binaries (included in the `poppler/` directory for Windows environments).

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/AI-Document-Intelligence-System.git
cd AI-Document-Intelligence-System
```

### 2. Set Up Virtual Environment

It is recommended to use a virtual environment to manage dependencies:

```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

Install the required Python packages (ensure `requirements.txt` is updated):

```bash
pip install -r requirements.txt
# Note: If requirements.txt is empty, install core dependencies:
pip install fastapi uvicorn celery redis
```

### 4. Configuration

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Open `.env` and fill in your specific credentials (e.g., Supabase API keys, Redis URL, LLM API keys). Ensure no hardcoded keys are left in the source code.

### 5. Running the Application locally

**Start the Redis Server:**
Make sure your Redis server is running. If you're on Windows, you can use WSL or a Windows port of Redis.

**Start the Celery Worker:**
In a new terminal window (with the virtual environment activated), start the background worker:

```bash
celery -A app.workers worker --loglevel=info --pool=solo
```
*(Note: `--pool=solo` is recommended for Windows environments to avoid process spawning issues).*

**Start the FastAPI Backend Server:**
In another terminal, launch the Uvicorn server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Launch the Frontend:**
Simply open the `nexus_ai.html` file in your preferred web browser. It is configured to communicate with the local FastAPI server.

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE file for details.
