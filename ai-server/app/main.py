from fastapi import FastAPI
from app.services.repo_parser import parse_repo
from app.services.code_chunker import chunk_code
from app.services.embedding import generate_embeddings

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