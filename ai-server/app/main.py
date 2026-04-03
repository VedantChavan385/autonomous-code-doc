from fastapi import FastAPI
from app.services.repo_parser import parse_repo
from app.services.code_chunker import chunk_code
from app.services.embedding import generate_embeddings
from app.services.vector_store import store_embeddings, query_embeddings
from app.services.rag_pipeline import run_rag_pipeline

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI Server Running 🚀"}

@app.post("/parse-repo")
def parse(repo_path: str):
    files = parse_repo(repo_path)
    return {
        "total_files": len(files),
        "files": files[:3]  
    }

@app.post("/chunk-repo")
def chunk(repo_path: str):
    files = parse_repo(repo_path)
    chunks = chunk_code(files)

    return {
        "total_chunks": len(chunks),
        "sample": chunks[:5]
    }

@app.post("/embed-repo")
def embed(repo_path: str):
    files = parse_repo(repo_path)
    chunks = chunk_code(files)

    # limit for testing
    embeddings = generate_embeddings(chunks[:10])

    return {
        "total_embeddings": len(embeddings),
        "sample": [
            {
                "file_path": e["file_path"],
                "embedding_preview": e["embedding"][:5]  # show only first 5 numbers
            }
            for e in embeddings[:2]
        ]
    }    

@app.post("/store-repo")
def store(repo_path: str):
    files = parse_repo(repo_path)
    chunks = chunk_code(files)
    embeddings = generate_embeddings(chunks[:20])  # limit

    store_embeddings(embeddings)

    return {
        "message": "Embeddings stored successfully",
        "count": len(embeddings)
    }

@app.post("/query")
def query_codebase(question: str):
    from app.services.embedding import model

    # Convert question → embedding
    query_embedding = model.encode([question])[0].tolist()

    # Search DB
    results = query_embeddings(query_embedding)

    return {
        "results": results
    }

@app.post("/rag-test")
def rag_test(question: str):
    result = run_rag_pipeline(question)
    return result