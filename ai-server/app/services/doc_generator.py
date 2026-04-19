import os
import json
from app.services.llm import client
from app.config import settings

def build_tree(code_files, repo_path):
    """
    Groups file paths into a hierarchical tree format.
    """
    root_node = {"name": "root", "type": "folder", "children": []}
    
    for f in code_files:
        rel_path = os.path.relpath(f["file_path"], repo_path).replace("\\", "/")
        parts = rel_path.split("/")
        
        current = root_node
        for i, part in enumerate(parts):
            if i == len(parts) - 1:
                # it's a file
                current["children"].append({"name": part, "type": "file", "path": rel_path})
            else:
                # it's a folder
                found = next((child for child in current["children"] if child.get("name") == part and child.get("type") == "folder"), None)
                if not found:
                    found = {"name": part, "type": "folder", "children": []}
                    current["children"].append(found)
                current = found
                
    return root_node["children"]

def generate_file_doc(file_content, filename):
    prompt = f"""
You are an expert code documenter.
Analyze the following code file ({filename}) and generate documentation in this exact JSON structure:
{{
  "summary": "High-level summary of what this file does in 2-3 sentences.",
  "dependencies": ["dependency1", "dependency2"],
  "functions": [
    {{
      "name": "function_name",
      "params": "param1, param2",
      "description": "What this function does.",
      "code": "The raw code string of just this function. Optional if no functions"
    }}
  ]
}}

Code:
```
{file_content}
```
"""
    try:
        response = client.chat.completions.create(
            model=settings.llm_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"Error generating doc for {filename}: {e}")
        return {
            "summary": f"Documentation could not be generated: {str(e)}",
            "dependencies": [],
            "functions": []
        }

def generate_project_docs(code_files, repo_path):
    docs = {}
    
    tree = build_tree(code_files, repo_path)
    
    # Sort files by size or just take first 15 to prevent long timeouts
    files_to_process = code_files[:15]
    
    for f in files_to_process:
        rel_path = os.path.relpath(f["file_path"], repo_path).replace("\\", "/")
        print(f"Generating docs for {rel_path}...")
        doc_json = generate_file_doc(f["content"][:8000], rel_path) # slice content to avoid context limits
        docs[rel_path] = doc_json
        
    return {
        "tree": tree,
        "docs": docs
    }
