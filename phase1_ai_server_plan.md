# Phase 1: AI Server Implementation Plan

We are fulfilling the remaining Phase 1 tasks for the AI Server. This involves creating a seamless pipeline so a user can provide a GitHub URL, and the server will grab the code, process it smartly, and ready it for chat!

## Pipeline Flow

1. **User asks to process a repo** → We hit the new `POST /process-repo` endpoint with a GitHub URL.
2. `repo_cloner.py` takes that URL and downloads the code locally into a temporary folder using `GitPython`.
3. `repo_parser.py` scans that downloaded folder and grabs only code files (no images or binaries).
4. `code_chunker.py` looks at those files and divides them logically. It avoids chopping a function in half.
5. `embedding.py` contacts the **Gemini Embedding API** (instead of the local model) and turns those code pieces into vectors (numbers).
6. `vector_store.py` takes those numbers and saves them into the local ChromaDB database.
7. Finally, `/process-repo` sends a JSON response back to the user saying "Success! Processed X files into Y chunks."

---

## Action Items

### 1. Setup Configuration and Schemas
#### [NEW] `app/models/schemas.py`
We will use Pydantic to define what the API accepts and returns. For example, `ProcessRepoRequest` will expect `repo_url` and `project_id`.

#### [NEW] `app/config.py`
We'll create a centralized settings manager using `pydantic-settings` to manage environment variables like your Gemini key and DB paths.

---

### 2. Core Services

#### [NEW] `app/services/repo_cloner.py`
**How it works:** When we receive a GitHub URL, we download it. This script will use `GitPython` to clone the repo into a temporary folder (e.g., `/tmp/repos/xyz`), let the parser do its job, and optionally clean up the files to save disk space.

#### [MODIFY] `app/services/code_chunker.py`
**How it works:** The current version splits code brutally by 300 characters. We will improve this by introducing a "smarter" chunker. Using `LangChain`'s language-aware splitters (`RecursiveCharacterTextSplitter.from_language`), we will split the code at natural boundaries keeping related code together.

#### [MODIFY] `app/services/embedding.py`
**How it works:** We will update this file to use the `google.genai` SDK to fetch embeddings from Google's high-quality cloud models (`text-embedding-004`), saving local memory.

---

### 3. The Main API Endpoint

#### [MODIFY] `app/main.py`
Create the unified endpoint: `POST /process-repo`.
When called, it will:
1. Call `repo_cloner` 
2. Call `repo_parser` 
3. Call `code_chunker` 
4. Call `embedding` 
5. Call `vector_store`
It will return a success summary (file count, chunk count, collection ID).

---

### 4. Tests

#### [NEW] `tests/test_flow.py`
Create small scripts to verify each of these new components works in isolation.
