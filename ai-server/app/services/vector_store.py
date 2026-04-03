import chromadb
import uuid

# Create persistent client (data survives restarts)
client = chromadb.PersistentClient(path="./chroma_db")

# Create / get collection
collection = client.get_or_create_collection(name="codebase")

def store_embeddings(embedded_data):
    #STORES EMBEDDINGS IN CHROMA DB
    for data in embedded_data:
        collection.add(
            ids=[str(uuid.uuid4())],   # unique ID per chunk to avoid overwrites
            embeddings=[data["embedding"]],
            documents=[data["chunk"]],
            metadatas=[{"file_path": data["file_path"]}]
        )

def query_embeddings(query_embedding, n_results=3):
    #SEARCHES IN CHROMA DB
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
        #most similar chunk will be found
    )

    return results