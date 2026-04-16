import chromadb
import uuid
import logging

logger = logging.getLogger(__name__)

# Create a single persistent ChromaDB client.
# Think of this as the "database connection" — one connection, many folders (collections).
client = chromadb.PersistentClient(path="./chroma_db")


def _get_collection(project_id: str):
    """
    Helper: Gets (or creates) a ChromaDB collection for a specific project.

    Why? Each project needs its own isolated 'folder' in ChromaDB so that
    chunks from different repos never get mixed together during a search.

    Example:
        project_id = "proj_abc123"
        → ChromaDB collection name = "proj_abc123"
    """
    # ChromaDB collection names must only contain letters, numbers, underscores, hyphens.
    # We sanitize the project_id just in case it has dots or special chars.
    safe_name = f"proj_{project_id}".replace(".", "_").replace("/", "_")
    return client.get_or_create_collection(name=safe_name)


def store_embeddings(embedded_data: list, project_id: str):
    """
    Stores all chunk embeddings into the project's dedicated ChromaDB collection.

    Each item in embedded_data looks like:
        { "file_path": "...", "chunk": "...", "embedding": [...floats...] }
    """
    collection = _get_collection(project_id)
    logger.info(f"Storing {len(embedded_data)} chunks into collection for project '{project_id}'")

    for data in embedded_data:
        collection.add(
            ids=[str(uuid.uuid4())],          # Unique ID so chunks don't overwrite each other
            embeddings=[data["embedding"]],    # The math vector
            documents=[data["chunk"]],         # The original text chunk
            metadatas=[{"file_path": data["file_path"]}]  # Where it came from
        )

    logger.info(f"Successfully stored {len(embedded_data)} chunks for project '{project_id}'")


def query_embeddings(query_embedding: list, project_id: str, n_results: int = 5):
    """
    Performs a similarity search in the project's ChromaDB collection.

    ChromaDB finds the 'n_results' chunks whose embeddings are mathematically
    closest to the query_embedding — these are the most relevant code snippets.
    """
    collection = _get_collection(project_id)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )

    return results


def delete_collection(project_id: str):
    """
    Deletes all stored embeddings for a project.
    Called when a user deletes a project — cleans up ChromaDB storage.
    """
    safe_name = f"proj_{project_id}".replace(".", "_").replace("/", "_")
    try:
        client.delete_collection(name=safe_name)
        logger.info(f"Deleted ChromaDB collection for project '{project_id}'")
    except Exception as e:
        logger.warning(f"Could not delete collection for '{project_id}': {e}")