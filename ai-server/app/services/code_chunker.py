import os

# Simple character-based chunker — no external dependencies needed.
# Works perfectly for embedding purposes.

def chunk_code(file_data, chunk_size=400, overlap=80):
    """
    Splits code files into overlapping text chunks for embedding.
    Uses a simple sliding window approach keyed to newlines so we
    don't break in the middle of a line.
    """
    all_chunks = []

    for file in file_data:
        content = file["content"]
        file_path = file["file_path"]
        
        lines = content.splitlines(keepends=True)
        
        current_chunk_lines = []
        current_len = 0

        for line in lines:
            current_chunk_lines.append(line)
            current_len += len(line)

            if current_len >= chunk_size:
                chunk_text = "".join(current_chunk_lines).strip()
                if chunk_text:
                    all_chunks.append({
                        "file_path": file_path,
                        "chunk": chunk_text
                    })
                # Keep last `overlap` characters worth of lines for context
                overlap_text = chunk_text[-overlap:] if len(chunk_text) > overlap else chunk_text
                current_chunk_lines = [overlap_text]
                current_len = len(overlap_text)

        # Flush remaining lines
        if current_chunk_lines:
            chunk_text = "".join(current_chunk_lines).strip()
            if chunk_text:
                all_chunks.append({
                    "file_path": file_path,
                    "chunk": chunk_text
                })

    return all_chunks