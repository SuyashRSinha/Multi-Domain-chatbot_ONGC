# Multi-Domain Enterprise Chatbot (RAG)

A state-of-the-art **Retrieval-Augmented Generation (RAG)** chatbot application designed for enterprise document search and question answering across multiple isolated organizational domains (e.g., ONGC Guidelines, HR & Onboarding, Technical Docs, and Training Manuals). 

Featuring a sleek **glassmorphic Dark Mode UI**, real-time **streaming responses**, an **analytical admin dashboard**, and support for **scanned document OCR ingestion**.

---

## Key Features

* **Multi-Domain Isolation**: Seamlessly switch between workspaces (HR, ONGC Guidelines, Technical, Finance, etc.) to get context-specific answers.
* **Intelligent RAG Pipeline**: Combines semantic retrieval using ChromaDB and query rewriting via Llama 3 to convert follow-up chat messages into standalone queries.
* **Hybrid Text Ingestion (with OCR)**: Supports both digital PDFs/DOCX text extraction and scanned PDF OCR processing using pytesseract.
* **Analytical Admin Dashboard**: Real-time charts showing document distribution across domains, total messages, conversations, and queries.
* **User Authentication**: Secure signup/login powered by Firebase Auth.
* **Real-time Streaming**: Fluid response streaming using SSE (Server-Sent Events).
* **Database Persisted History**: All chats, messages, and uploaded document histories are saved to a MySQL database.

---

## Technology Stack

### Backend
* **Core Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.14+)
* **Vector Store**: [ChromaDB](https://www.trychromadb.com/) (Persistent database)
* **Embeddings**: [SentenceTransformers](https://www.sbert.net/) (`all-MiniLM-L6-v2`)
* **LLM Engine**: [Ollama](https://ollama.com/) (running `llama3`)
* **Database**: MySQL (for users, conversations, documents meta, and history logs)
* **OCR & Parsing**: Tesseract-OCR, Poppler, `pypdf`, and `python-docx`

### Frontend
* **Core Framework**: React 19 + Vite (built using ES modules)
* **Styling**: TailwindCSS (Modern glassmorphic aesthetic)
* **Data Visualization**: Recharts (interactive dashboards)
* **Authentication**: Firebase Authentication (Client-side integration)
* **HTTP Client**: Axios

---

## Project Structure

```
multi-domain-chatbot/
├── backend/
│   ├── app/
│   │   ├── api/             # API routes (upload, chat, analytics, conversations)
│   │   ├── config/          # Environment & settings configurations
│   │   ├── database/        # Database setup and connection
│   │   ├── models/          # Pydantic schemas and models
│   │   ├── repositories/    # MySQL query handlers (admin, analytics, conversations)
│   │   ├── services/        # RAG, LLM, OCR, and Document services
│   │   ├── utils/           # Chunking, metadata, and PDF/DOCX loaders
│   │   ├── ingest.py        # Ingestion script to parse & index knowledge_base docs
│   │   └── main.py          # FastAPI application entrypoint
│   └── requirements.txt     # Python pinned dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Chat area, sidebar, selector, upload, admin charts
│   │   ├── contexts/        # Auth context (Firebase Auth provider)
│   │   ├── hooks/           # Custom React hooks (useChat, useDocuments, etc.)
│   │   ├── pages/           # Chatbot, Dashboard, Login, Register views
│   │   └── services/        # API request wrapper services
│   └── package.json         # Node.js build configurations
├── mysql/
│   └── schema.sql           # MySQL database schema setup script
└── knowledge_base/          # Preloaded enterprise document directories
```

---

## Setup and Installation

You can run the application either using **Docker & Docker Compose** (quickest method) or via **Manual Installation**.

---

### Option 1: Running with Docker (Recommended)

You can run the entire Multi-Domain Chatbot stack (Frontend, Backend FastAPI, and MySQL Database) seamlessly using Docker.

#### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
* [Ollama](https://ollama.com/) running on your host machine with the `llama3` model downloaded:
  ```bash
  ollama pull llama3
  ```

#### Steps

1. **Environment Setup**:
   Copy the example environment file to create `.env` in the root directory:
   ```bash
   # Linux / macOS / Git Bash
   cp .env.example .env

   # Windows PowerShell
   copy .env.example .env
   ```
   *Edit `.env` to update MySQL passwords, Firebase auth keys, or custom configuration if needed.*

2. **Build and Launch Containers**:
   ```bash
   docker compose up -d --build
   ```
   This will build and start 3 services:
   * **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   * **Backend API**: [http://localhost:8000](http://localhost:8000) (Swagger Docs at [http://localhost:8000/docs](http://localhost:8000/docs))
   * **MySQL Database**: `localhost:3306`

3. **Ingest Documents into Vector Store**:
   To index the documents located in `knowledge_base/` into ChromaDB inside the Docker backend container, run:
   ```bash
   docker exec -it chatbot-backend python app/ingest.py
   ```

4. **Stopping Containers**:
   ```bash
   docker compose down
   ```
   *(To stop and clear data volumes, use `docker compose down -v`)*

---

### Option 2: Manual Local Installation

#### Prerequisites
* Python 3.11+ (Python 3.14 supported)
* Node.js (v18+) & npm
* MySQL Server
* [Ollama](https://ollama.com/) (installed locally with the `llama3` model downloaded)

---

### 1. Database Configuration
1. Open your MySQL client and run the SQL instructions inside [mysql/schema.sql](file:///d:/multi-domain-chatbot/mysql/schema.sql) to initialize the database and tables:
   ```sql
   source mysql/schema.sql;
   ```
2. Update the credentials inside [backend/app/config/settings.py](file:///d:/multi-domain-chatbot/backend/app/config/settings.py) to match your local MySQL configuration:
   ```python
   MYSQL_HOST = "localhost"
   MYSQL_USER = "root"
   MYSQL_PASSWORD = "your_password"
   MYSQL_DATABASE = "chatbot_db"
   ```

---

### 2. Backend Installation & Run
1. Navigate to the `backend` directory and activate your virtual environment:
   ```bash
   cd backend
   ..\.venv\Scripts\Activate.ps1   # PowerShell
   # OR
   ..\.venv\Scripts\activate.bat   # CMD
   ```
2. Install the python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the ingestion script to parse and index documents in your `knowledge_base` directory:
   ```bash
   $env:PYTHONPATH="."  # PowerShell
   python app/ingest.py
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend API will run on `http://127.0.0.1:8000`.*

---

### 3. Frontend Installation & Run
1. Open a new terminal window, navigate to the `frontend` directory, and install the modules:
   ```bash
   cd frontend
   npm install
   ```
2. Make sure your Firebase configuration variables inside [frontend/src/firebase.js](file:///d:/multi-domain-chatbot/frontend/src/firebase.js) match your Firebase web application setup.
3. Launch the Vite dev server:
   ```bash
   npm run dev
   ```
   *The application UI will run on `http://localhost:5173`.*

---

## Git & Deployment Ignored Paths
All caches, database connection configurations, local sqlite stores, virtual environments, and log files are correctly set up and ignored in the root [`.gitignore`](file:///d:/multi-domain-chatbot/.gitignore) file to prevent committing environment variables and credentials to GitHub.
