# Comprehensive RAG Pipeline Guide (Interview Prep)

If an interviewer asks you, *"Walk me through the AI codebase documentation architecture you built,"* this is the exact flow and technical terminology you should use.

## The Core Concept
We built a **Retrieval-Augmented Generation (RAG)** pipeline. Large Language Models (LLMs) like Llama 3 or Gemini don't inherently know your specific codebase because it was written *after* they were trained. RAG solves this by explicitly feeding your codebase to the LLM as contextual memory right before it answers a question.

Our pipeline is broken into two distinct phases: **Ingestion** and **Retrieval**.

---

## Phase 1: The Ingestion Pipeline (Data Prep)
*How we get the code into the database.*

### 1. Cloning & Parsing (`repo_cloner.py` & `repo_parser.py`)
- **What it does:** We use `GitPython` to shallow-clone a target GitHub repository to a temporary directory. Then, we recursively walk the file tree.
- **Key Interview Point:** We implemented robust filtering. We automatically ignore binary files, images, `.git` folders, and build directories (`node_modules`, `venv`). We strictly capture text-based source code files based on their extensions.

### 2. Intelligent Chunking (`code_chunker.py`)
- **What it does:** We cannot feed entire codebases to an LLM at once due to "context window" limits and high costs. We have to split the code into small pieces (chunks).
- **Key Interview Point:** Instead of blindly chopping the text every 400 characters (which might cut a function exactly in half, destroying its meaning), we used **LangChain's `RecursiveCharacterTextSplitter`**. By making it "language-aware," the splitter dynamically looks for structural syntax markers (like `def` in Python or `function()` in JS) to ensure functions and classes stay together in the same chunk.

### 3. Vector Embeddings (`embedding.py`)
- **What it does:** Computers don't understand text; they understand numbers. We pass our text chunks into an Embedding Model which translates the human text into a dense array of floating-point numbers (a vector). 
- **Key Interview Point:** We used `SentenceTransformer('all-MiniLM-L6-v2')`. This is an open-source, local embedding model. We specifically chose a local model over a cloud API (like OpenAI or Gemini embeddings) to ensure zero API costs and avoid strict free-tier rate limits when processing massive repositories containing thousands of chunks.

### 4. Vector Database (`vector_store.py`)
- **What it does:** We store the generated vectors in a database so we can search them later.
- **Key Interview Point:** We used **ChromaDB**. Unlike standard SQL databases, Vector Databases are specifically designed to perform cosine-similarity mathematical searches incredibly fast. We assign UUIDs to every chunk and store them alongside their original metadata (like `file_path`) so we know exactly where a chunk came from.

---

## Phase 2: The Retrieval Pipeline (Answering Questions)
*How we answer user queries (`rag_pipeline.py` & `llm.py`).*

### 1. Vectorizing the Query
When a user asks: *"Where is the database connection handled?"*, we pass that exact question through the **same** local `SentenceTransformer` model to turn the question into a vector.

### 2. Semantic Search (K-Nearest Neighbors)
We query ChromaDB, asking it to find the *Top K* (e.g., top 5) code vectors that mathematically point in the closest direction to our question vector. 
- **Key Interview Point:** Because it's a semantic search instead of a keyword search, it will find connection logic even if the variable isn't explicitly named "database".

### 3. LLM Generation (Groq / Llama 3)
We take the original text from those top 5 closest chunks and slam them into a constructed prompt:
> *"You are an AI assistant. Answer the user's question using the following Code Context: [Insert 5 Chunks Here]. Question: [User Question]"*

- **Key Interview Point:** We send this prompt to **Groq using the Llama-3.3 70B model**. We chose Groq because its LPU (Language Processing Unit) hardware provides industry-leading generation speeds, resulting in lightning-fast, real-time responses for the end user without sacrificing accuracy.

---

## Summary Validations for Further Development (Phase 2 Readiness)

The AI Server is currently **100% production-ready** to connect to an Express/Node backend because:
1. **Strong Typing:** `Pydantic` schemas guarantee the API endpoints will neatly parse JSON requests and reject invalid types. 
2. **Stateless API:** It serves an entirely unified `POST /process-repo` endpoint, abstracting complex ML mechanics behind a simple REST call.
3. **Environment Security:** `Pydantic Settings` gracefully manages `.env` variables (like Database Paths and API keys), ensuring safe deployments.
