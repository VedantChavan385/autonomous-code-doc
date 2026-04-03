from app.services.embedding import model
from app.services.vector_store import query_embeddings
from app.services.llm import generate_answer

def run_rag_pipeline(question: str):
    # 1. Convert question → embedding
    query_embedding = model.encode([question])[0].tolist()

    # 2. Search in vector DB
    results = query_embeddings(query_embedding)

    # 3. Extract relevant chunks
    documents = results["documents"][0]

    return {
        "question": question,
        "retrieved_chunks": documents
    }

def run_rag_pipeline(question: str):
    query_embedding = model.encode([question])[0].tolist()
    results = query_embeddings(query_embedding)

    documents = results["documents"][0]

    answer = generate_answer(question, documents)

    return {
        "question": question,
        "answer": answer,
        "sources": documents
    }