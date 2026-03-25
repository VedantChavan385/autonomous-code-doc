from sentence_transformers import SentenceTransformer

# Load model once (IMPORTANT)
model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embeddings(chunks):
    embedded_data = []

    # Extract all chunk text
    texts = [chunk["chunk"] for chunk in chunks]

    # Generate embeddings in one go (FAST ⚡)
    embeddings = model.encode(texts)

    # Combine with metadata
    for i, chunk in enumerate(chunks):
        embedded_data.append({
            "file_path": chunk["file_path"],
            "chunk": chunk["chunk"],
            "embedding": embeddings[i].tolist()
        })

    return embedded_data