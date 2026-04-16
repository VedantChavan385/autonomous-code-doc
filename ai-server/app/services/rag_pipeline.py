from app.services.embedding import model
from app.services.vector_store import query_embeddings
from app.services.llm import generate_answer
import logging

logger = logging.getLogger(__name__)

def run_rag_pipeline(question: str, project_id: str, top_k: int = 5):
    """
    The full RAG (Retrieval-Augmented Generation) pipeline:
    
    Step 1: Convert the user's question into a vector (embedding)
    Step 2: Search ChromaDB for the 'top_k' most similar code chunks (for THIS project)
    Step 3: Send the question + those chunks to the LLM to get a grounded answer

    Why project_id? So we ONLY search this user's project, not everyone else's.
    Why top_k? More chunks = more context for the LLM, but also more cost/latency.
    """
    logger.info(f"Running RAG pipeline for project='{project_id}', question='{question[:50]}...'")

    # Step 1: Embed the question using the same local model used during ingestion
    # (CRITICAL: must use the same model, otherwise the vectors won't be comparable)
    query_embedding = model.encode([question])[0].tolist()

    # Step 2: Find the top_k most relevant code chunks for THIS project
    results = query_embeddings(query_embedding, project_id=project_id, n_results=top_k)

    # results["documents"][0] is a list of the actual text chunks retrieved
    documents = results["documents"][0]

    # Step 3: Send question + retrieved code context to the LLM
    answer = generate_answer(question, documents)

    return {
        "question": question,
        "answer": answer,
        "sources": documents  # Return the raw chunks so the frontend can show "source: file.py"
    }