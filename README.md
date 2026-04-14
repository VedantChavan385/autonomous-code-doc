# Autonomous Codebase Documentor - Project Report

## 1. INTRODUCTION
We have successfully built and deployed the **Autonomous Codebase Documentor**, an AI-powered system designed to analyze an entire GitHub repository and automatically generate comprehensive documentation while allowing users to chat directly with their codebase. It takes the heavy lifting out of understanding legacy code and drastically reduces the time required to onboard new developers to massive projects.

## 2. OBJECTIVE
The core objective was to create a seamless, full-stack **Retrieval-Augmented Generation (RAG)** system capable of handling complex codebases securely and efficiently. Instead of passing an entire codebase (which is too large and expensive) to a Large Language Model (LLM), we designed a system that breaks the code down, stores it mathematically, and retrieves only the exact, relevant pieces of code needed to answer a user's question or generate a specific module's documentation.

## 3. PROBLEM DEFINITION
Before this project, teams faced several persistent challenges:
*   **Documentation Neglect:** Developers hate writing documentation, leaving most codebases poorly documented or strictly relying on stale, outdated information.
*   **Slow Onboarding:** New engineers spent weeks simply trying to figure out where core logic resided within the file structure.
*   **LLM Limitations:** It was impossible to paste an entire application's source code into a standard AI chat interface due to strict context window limits. Furthermore, bypassing those limits natively resulted in staggering token costs over time.

## 4. HOW WE BUILT IT (The Architecture)
We built a highly decoupled, three-tier architecture utilizing a customized RAG pipeline. The application flow is broken into distinct phases driven by specialized servers:

*   **Phase 1 - The User Interface (Frontend):** We built a React dashboard where users can submit GitHub URLs, visually track the background ingestion process, view generated documentation, and utilize a ChatGPT-style interface to ask complex, codebase-specific questions.
*   **Phase 2 - The Orchestration Server (Backend):** We engineered a secure Node/Express backend that handles user authentication (JWT), maintains user workspaces via MongoDB, and routes traffic back and forth between the client and the AI Engine.
*   **Phase 3 - The AI Engine (Ingestion & Retrieval):** The FastAPI Python server shallow-clones the requested repo, aggressively filters out useless artifacts and binaries, and uses intelligent, language-aware chunking (via `LangChain`) to split the source text. These chunks are converted into math vectors using local embeddings and stored in ChromaDB. Upon a query, the system vector-matches the user's question against the database, extracting the 5 closest code chunks, and sends them to the Groq Cloud LLM for a lightning-fast, highly accurate answer.

## 5. TECH STACK
Our comprehensive stack merges standard MERN paradigms with state-of-the-art Python ML ecosystems:

### Frontend (User Interface)
*   **Core:** React, Vite, TypeScript
*   **Styling:** Tailwind CSS

### MERN Server (App & Data Layer)
*   **Core:** Node.js, Express.js
*   **Database:** MongoDB (using Mongoose for schemas tracking user logs and AI history)
*   **Security:** JSON Web Tokens (JWT) for stateless authentication.

### AI Server (Machine Learning Layer)
*   **Core:** Python, FastAPI (for blazing-fast Python routing), Pydantic (for schema validation)
*   **Orchestration:** LangChain (using `RecursiveCharacterTextSplitter`)
*   **Vector Database:** ChromaDB (for high-speed semantic cosine-similarity searches)
*   **Embeddings:** `SentenceTransformer` (`all-MiniLM-L6-v2`) – A local model utilized to ensure zero API costs during the heavy ingestion of large files.
*   **LLM Generation:** Groq Cloud with Llama-3.3 70B (utilizing LPUs to match streaming speeds of top-tier cloud models).

## 6. SCOPE OF PROJECT
The delivered framework encapsulates a fully production-ready application featuring:
*   **Automated Ingestion:** The ability to download, parse, and clean `.js`, `.py`, and `.ts` files from remote GitHub URLs dynamically.
*   **Documentation Generation:** Automated summarization producing baseline markdown documents highlighting dependencies, modules, and structures within the repo.
*   **Interactive Codebase Chat:** A rich-text integrated chat UI allowing engineers to ask specific logic questions (e.g., "Where is authentication handled?") and receive responses grounded strictly in the parsed source code.
*   **Multi-tenant Security:** Individual workspaces authenticated via JWTs, ensuring user project queries do not bleed contexts.

## 7. CONCLUSION
The completion of the Autonomous Codebase Documentor successfully leverages cutting-edge RAG architectures to bridge the massive gap between raw source code and developer comprehension. By combining the snappy rendering of a React frontend and the durable storage of a Node/MongoDB backend with highly efficient local embedding models and blazing-fast inference APIs (Groq Cloud), we delivered an application that keeps token costs minimal while providing instant, high-fidelity clarity on thousands of lines of code.
