
---

## 🧩 Features (MVP)

### 1. Repo Upload
- Accept GitHub URL or ZIP

### 2. Code Parsing
- Extract .js, .py, .jsx, .jsx files (and more)

### 3. Documentation Generation
- Summarize modules and functions

### 4. Chat with Codebase
- Ask questions about repository

---

## ⚙️ Step-by-Step Implementation

---

### STEP 1: Setup AI Server

- Install FastAPI
- Create server

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI Server Running"}

STEP 2: Connect LLM
Add endpoint:
POST /explain-code
Input: code
Output: explanation
STEP 3: Repo Parsing
Clone repo
Traverse files
Filter code files
STEP 4: Code Chunking
Split files into smaller chunks

Example:

function loginUser()
function validateToken()
STEP 5: Embeddings
Convert chunks into vectors
Store metadata
STEP 6: Vector Database
Store embeddings in:
Chroma / FAISS
STEP 7: RAG Pipeline
User Query
   ↓
Convert to embedding
   ↓
Vector search
   ↓
Retrieve code chunks
   ↓
Send to LLM
STEP 8: MERN Backend
Auth (JWT)
Project storage
Call AI server
STEP 9: Frontend
Upload repo UI
Documentation viewer
Chat interface

# to start the AI server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000