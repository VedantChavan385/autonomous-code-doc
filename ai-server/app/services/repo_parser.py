import os

#filter codes by file extensions

SUPPORTED_EXTENSIONS = [".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".cpp", ".ipynb", ".html", ".css", ".php", ".rb", ".go"]
IGNORE_DIRS = ["node_modules", ".git", "venv", "myenv", "env", ".venv", "__pycache__", "dist", "build", "coverage"]

def is_valid_file(file_name, supported_extensions):
    return any(file_name.endswith(ext) for ext in supported_extensions)

def parse_repo(repo_path, file_extensions=None):
    if file_extensions is None:
        file_extensions = SUPPORTED_EXTENSIONS
        
    #READS ALL FILES
    code_files = []

    for root, dirs, files in os.walk(repo_path):
        # Prune the dirs list so os.walk doesn't visit ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file in files:
            if is_valid_file(file, file_extensions):
                file_path = os.path.join(root, file)

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()

                    code_files.append({
                        "file_path": file_path,
                        "content": content
                    })

                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

    #input for chunking and embeddings
    return code_files

def detect_language(code_files):
    if not code_files:
        return "Unknown"
        
    counts = {}
    ext_map = {
        ".py": "Python",
        ".js": "JavaScript",
        ".ts": "TypeScript",
        ".jsx": "React (JS)",
        ".tsx": "React (TS)",
        ".java": "Java",
        ".cpp": "C++",
        ".c": "C",
        ".h": "C/C++",
        ".cs": "C#",
        ".go": "Go"
    }
    
    for f in code_files:
        ext = os.path.splitext(f["file_path"])[1]
        lang = ext_map.get(ext, "Other")
        counts[lang] = counts.get(lang, 0) + 1
        
    # Return the language with the highest count
    return max(counts, key=counts.get)