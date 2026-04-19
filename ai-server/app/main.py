from fastapi import FastAPI, HTTPException
from app.services.repo_cloner import clone_repository, cleanup_repository
from app.services.repo_parser import parse_repo, detect_language
from app.services.code_chunker import chunk_code
from app.services.embedding import generate_embeddings
from app.services.vector_store import store_embeddings, delete_collection
from app.services.rag_pipeline import run_rag_pipeline
from app.services.doc_generator import generate_project_docs
from app.models.schemas import ProcessRepoRequest, ProcessRepoResponse, QueryRequest, QueryResponse, GenerateDocsRequest, GenerateDocsResponse
from app.config import settings
import logging

# Set up simple logging
logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name)

@app.get("/")
def root():
    return {"message": "AI Server Running 🚀"}


@app.get("/status")
def get_service_status():
    """
    Returns the status of the AI server and its connection to Groq.
    """
    try:
        # Try a tiny completion to verify the key
        client.chat.completions.create(
            model=settings.llm_model,
            messages=[{"role": "user", "content": "ping"}],
            max_tokens=1
        )
        return {
            "status": "online",
            "groq_connection": "active",
            "credits_type": "Beta / Unlimited (Rate Limited)",
            "model": settings.llm_model
        }
    except Exception as e:
        return {
            "status": "online",
            "groq_connection": "error",
            "error_detail": str(e)
        }

@app.get("/health")
def health_check():
    """
    Simple health check endpoint.
    The backend will ping this before sending any work to confirm the AI server is alive.
    """
    return {"status": "ok", "service": settings.app_name}

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
        files = parse_repo(repo_path, file_extensions=request.file_extensions)
        if not files:
            raise HTTPException(status_code=400, detail="No valid code files found in repository.")
            
        # Step 3: Chunk
        chunks = chunk_code(files, chunk_size=settings.max_chunk_size)
        if not chunks:
            raise HTTPException(status_code=400, detail="Failed to chunk code files.")
            
        # Step 4: Embed
        embeddings = generate_embeddings(chunks)
        
        # Step 5: Store — pass project_id so chunks go into the right collection
        store_embeddings(embeddings, project_id=request.project_id)
        
        # Step 6: Detect Primary Language
        primary_lang = detect_language(files)
        
        return ProcessRepoResponse(
            status="success",
            file_count=len(files),
            chunk_count=len(chunks),
            collection_id=request.project_id,
            language=primary_lang,
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
        # Pass project_id so we search the right collection
        # Pass top_k so the user can control how many code chunks the LLM sees
        result = run_rag_pipeline(
            question=request.question,
            project_id=request.project_id,
            top_k=request.top_k
        )
        
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

@app.delete("/collections/{project_id}")
def delete_project_collection(project_id: str):
    """
    Deletes the vector embeddings for a given project from ChromaDB.
    Called when a user deletes their project from the backend.
    """
    try:
        delete_collection(project_id)
        return {"status": "success", "message": f"Collection for project '{project_id}' deleted."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-docs", response_model=GenerateDocsResponse)
def generate_docs(request: GenerateDocsRequest):
    """
    Generates documentation schema (JSON tree and markdown) for a repository.
    """
    repo_path = None
    try:
        repo_path = clone_repository(request.repo_url, request.project_id)
        files = parse_repo(repo_path, file_extensions=request.file_extensions)
        
        if not files:
            raise HTTPException(status_code=400, detail="No valid code files found.")
            
        result = generate_project_docs(files, repo_path)
        
        return GenerateDocsResponse(
            status="success",
            tree=result["tree"],
            docs=result["docs"]
        )
    except Exception as e:
        logger.error(f"Failed to generate docs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if repo_path:
            cleanup_repository(repo_path)