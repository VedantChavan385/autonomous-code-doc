import chromadb

# Create client (local DB)
client = chromadb.Client()

# Create / get collection
collection = client.get_or_create_collection(name="codebase")

def store_embeddings(embedded_data):
    for i, data in enumerate(embedded_data):
        collection.add(
            ids=[str(i)],
            embeddings=[data["embedding"]],
            documents=[data["chunk"]],
            metadatas=[{"file_path": data["file_path"]}]
        )

def query_embeddings(query_embedding, n_results=3):
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
        #most similar chunk will be find out
    )

    return results