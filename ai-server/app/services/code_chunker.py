from langchain_text_splitters import Language, RecursiveCharacterTextSplitter
import os

def chunk_code(file_data, chunk_size=400, overlap=100):
    """
    Intelligently chunks code files based on their programming language
    to avoid splitting functions/classes in half when possible.
    """
    all_chunks = []

    # Map file extensions to Langchain Language enums
    language_map = {
        ".py": Language.PYTHON,
        ".js": Language.JS,
        ".ts": Language.TS,
        ".java": Language.JAVA,
        ".cpp": Language.CPP,
        ".c": Language.C,
        ".cs": Language.CSHARP,
        ".go": Language.GO,
        ".rs": Language.RUST,
        ".rb": Language.RUBY,
        ".php": Language.PHP,
        ".html": Language.HTML
    }

    # Fallback generic splitter 
    generic_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap
    )

    for file in file_data:
        content = file["content"]
        file_path = file["file_path"]
        
        # Determine language from extension
        _, ext = os.path.splitext(file_path)
        lang = language_map.get(ext.lower())

        if lang:
            try:
                splitter = RecursiveCharacterTextSplitter.from_language(
                    language=lang,
                    chunk_size=chunk_size,
                    chunk_overlap=overlap
                )
                texts = splitter.split_text(content)
            except Exception:
                # If tree-sitter or langchain fails for a specific language, fallback
                texts = generic_splitter.split_text(content)
        else:
            texts = generic_splitter.split_text(content)

        for text in texts:
            all_chunks.append({
                "file_path": file_path,
                "chunk": text
            })

    return all_chunks