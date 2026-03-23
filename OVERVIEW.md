# 🚀 Autonomous Codebase Documentor

## 📌 Project Overview

An AI-powered system that:
- Analyzes a GitHub repository
- Generates documentation automatically
- Allows users to chat with the codebase
- Uses RAG (Retrieval Augmented Generation)

---

## 🧠 Core Idea

Instead of sending the entire codebase to an LLM:

1. Break code into chunks
2. Convert chunks into embeddings
3. Store in vector database
4. Retrieve relevant chunks based on query
5. Send only relevant data to LLM

---

## 🏗 System Architecture
Frontend (React)
↓
MERN Server (Node + Express)
↓
AI Server (FastAPI)
↓
Vector DB + LLM APIs


---

## 📦 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind

### Backend (App Layer)
- Node.js
- Express
- MongoDB

### AI Layer
- FastAPI
- LangChain
- LlamaIndex
- OpenAI / Gemini

### Data Layer
- Chroma / FAISS (Vector DB)

---

## 🔁 Core Workflow
User uploads repo
↓
Repo parsed
↓
Code chunked
↓
Embeddings created
↓
Stored in vector DB
↓
User asks question
↓
Relevant code retrieved
↓
LLM generates answer