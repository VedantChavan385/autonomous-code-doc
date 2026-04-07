from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)

# Load model once
model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embeddings(chunks):
    """
    CONVERTS CHUNKS INTO VECTORS using local Sentence Transformers
    (Bypassing Gemini API to avoid free-tier quota/access errors)
    """
    embedded_data = []
    texts = [chunk["chunk"] for chunk in chunks]

    if not texts:
        return []

    try:
        logger.info(f"Generating embeddings for {len(texts)} chunks via local model...")
        
        # Generate embeddings in one go locally
        embeddings = model.encode(texts)
        
        for i, chunk in enumerate(chunks):
            embedded_data.append({
                "file_path": chunk["file_path"],
                "chunk": chunk["chunk"],
                "embedding": embeddings[i].tolist()
            })

        logger.info("Embeddings successfully generated.")
        return embedded_data
        
    except Exception as e:
        logger.error(f"Error generating embeddings: {str(e)}")
        raise e