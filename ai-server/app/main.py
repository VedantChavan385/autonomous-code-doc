from fastapi import FastAPI, HTTPException
from app.services.repo_cloner import clone_repository, cleanup_repository
from app.services.repo_parser import parse_repo
from app.services.code_chunker import chunk_code
from app.services.embedding import generate_embeddings
from app.services.vector_store import store_embeddings, query_embeddings
from app.services.rag_pipeline import run_rag_pipeline
from app.models.schemas import ProcessRepoRequest, ProcessRepoResponse, QueryRequest, QueryResponse
from app.config import settings
import logging

# Set up simple logging
logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name)

@app.get("/")
def root():
    return {"message": "AI Server Running 🚀"}

@app.post("/process-repo", response_model=ProcessRepoResponse)
def process_repo(request: ProcessRepoRequest):
    """
    Unified endpoint to clone, parse, chunk, embed, and store a repository.
    """
    repo_path = None
    try:
        # Step 1: Clone
        repo_path = clone_repository(request.repo_url, request.project_id)
        
        # Step 2: Parse
        files = parse_repo(repo_path)
        if not files:
            raise HTTPException(status_code=400, detail="No valid code files found in repository.")
            
        # Step 3: Chunk
        chunks = chunk_code(files, chunk_size=settings.max_chunk_size)
        if not chunks:
            raise HTTPException(status_code=400, detail="Failed to chunk code files.")
            
        # Step 4: Embed
        embeddings = generate_embeddings(chunks)
        
        # Step 5: Store
        store_embeddings(embeddings)
        
        return ProcessRepoResponse(
            status="success",
            file_count=len(files),
            chunk_count=len(chunks),
            collection_id="codebase", # Currently using a generic collection in vector store
            message="Repository successfully processed and stored."
        )
        
    except Exception as e:
        logger.error(f"Failed to process repository: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup cloned repo to save disk space
        if repo_path:
            cleanup_repository(repo_path)

@app.post("/query", response_model=QueryResponse)
def query_endpoint(request: QueryRequest):
    """
    Queries the codebase and returns an answer along with sources.
    """
    try:
        # run_rag_pipeline handles embedding query -> retrieving -> answering
        result = run_rag_pipeline(request.question)
        
        # Format the sources list and answer
        sources = []
        for i in range(len(result["sources"])):
            sources.append({"code_snippet": result["sources"][i]})
            
        return QueryResponse(
            answer=result["answer"],
            sources=sources
        )
    except Exception as e:
        logger.error(f"Query failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rag-test")
def rag_test(question: str):
    """
    Legacy testing endpoint without strong typing
    """
    result = run_rag_pipeline(question)
    return result