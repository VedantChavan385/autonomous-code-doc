import pytest
from app.services.code_chunker import chunk_code

def test_code_chunker():
    # Dummy python file
    dummy_files = [
        {
            "file_path": "test.py",
            "content": "def hello():\n    print('hello world')\n\n\ndef goodbye():\n    print('goodbye world')"
        }
    ]
    
    # Try chunking it
    chunks = chunk_code(dummy_files, chunk_size=20, overlap=5)
    
    assert len(chunks) > 0
    assert chunks[0]["file_path"] == "test.py"
    assert "def hello()" in chunks[0]["chunk"]

    print(f"Successfully chunked into {len(chunks)} chunks.")
