import os

#filter codes by file extensions

SUPPORTED_EXTENSIONS = [".py", ".js", ".ts", ".java", ".cpp"]
IGNORE_DIRS = ["node_modules", ".git", "venv", "__pycache__"]

def is_valid_file(file_name):
    return any(file_name.endswith(ext) for ext in SUPPORTED_EXTENSIONS)

def parse_repo(repo_path):
    #READS ALL FILES
    code_files = []

    for root, dirs, files in os.walk(repo_path):
        # Prune the dirs list so os.walk doesn't visit ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file in files:
            if is_valid_file(file):
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