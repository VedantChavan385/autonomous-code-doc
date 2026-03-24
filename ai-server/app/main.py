from fastapi import FastAPI
from app.services.repo_parser import parse_repo

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

