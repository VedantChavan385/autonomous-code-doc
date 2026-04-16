# Autonomous Codebase Documentor — Project Report

## 1. INTRODUCTION
We have successfully built the **Autonomous Codebase Documentor**, an AI-powered system designed to analyze an entire GitHub repository and automatically generate comprehensive documentation while allowing users to chat directly with their codebase. It takes the heavy lifting out of understanding complex code and reduces onboarding time.

## 2. OBJECTIVE
The core objective was to create a full-stack **Retrieval-Augmented Generation (RAG)** system. Instead of passing an entire codebase to an LLM, we designed a system that chunks the code, stores it as vectors, and retrieves only relevant pieces to answer questions or generate documentation.

## 3. HOW WE BUILT IT (The Architecture)
We built a three-tier architecture:

*   **Phase 1 - The User Interface (Frontend):** A React dashboard (using **JavaScript** and Vite) where users submit GitHub URLs, track ingestion, and chat with the codebase.
*   **Phase 2 - The Orchestration Server (Backend):** A secure **Node.js/Express (JavaScript)** backend that handles user authentication, data storage (MongoDB), and routes traffic between the client and the AI Engine.
*   **Phase 3 - The AI Engine (Ingestion & Retrieval):** A FastAPI Python server that clones repos, chunks code, and manages the RAG cycle using ChromaDB and local embeddings.

## 4. TECH STACK
Our comprehensive stack merges modern MERN paradigms with Python ML ecosystems:

### Frontend (User Interface)
*   **Core:** React, Vite, **JavaScript**
*   **Styling:** Tailwind CSS

### MERN Server (App & Data Layer)
*   **Core:** Node.js, Express.js (**JavaScript**)
*   **Database:** MongoDB
*   **Security:** JSON Web Tokens (JWT)

### AI Server (Machine Learning Layer)
*   **Core:** Python, FastAPI
*   **Vector Database:** ChromaDB
*   **Embeddings:** `SentenceTransformer` (Local)
*   **LLM Generation:** Groq Cloud with Llama-3.3

## 5. SCOPE OF PROJECT
*   **Automated Ingestion:** Download and parse `.js`, `.py`, `.jsx`, `.jsx` (and more) from GitHub.
*   **Documentation Generation:** Automated summarization of repo structures.
*   **Interactive Codebase Chat:** Chat UI for logic questions grounded in the actual source code.

## 6. CONCLUSION
The Autonomous Codebase Documentor leverages RAG architectures to bridge the gap between raw source code and developer comprehension. By combining the snappy rendering of a React frontend and the durable storage of a Node/MongoDB backend with efficient local embedding models, we delivered an application that provides instant clarity on thousands of lines of code.
