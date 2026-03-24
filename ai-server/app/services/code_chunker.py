def chunk_code(file_data, chunk_size=500, overlap=50):
    # Breaking into 500 characters with 50 characters overlap
    chunks = []

    for file in file_data:
        content = file["content"]
        file_path = file["file_path"]

        start = 0
        while start < len(content):
            end = start + chunk_size

            chunk_text = content[start:end]

            chunks.append({
                "file_path": file_path,
                "chunk": chunk_text
            })

            start += chunk_size - overlap

    return chunks