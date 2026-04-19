import os
import sys
import json

# Append application root to python paths
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.repo_parser import parse_repo
from app.services.doc_generator import generate_project_docs

def main():
    print("===========================================")
    print("Initiating Self-Scan: Architectural Mapping")
    print("===========================================")
    
    # Target our own project! 
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    
    # We will specifically target the AI-Server's backend logic to prove it works
    target_path = os.path.join(project_root, 'ai-server')
    
    print(f"Targeting logic inside: {target_path}")
    
    # Extract Python files
    files = parse_repo(target_path, file_extensions=[".py"])
    print(f"\nDiscovered {len(files)} Python files in internal systems.")
    
    if not files:
        print("No files found!")
        return

    print("\nInstructing LLM to document core system files... (Fast Testing Mode: limited to 2 files)")
    
    # For testing speed, grab two specific core files instead of random ones
    core_files = []
    for f in files:
        if "rag_pipeline.py" in f["file_path"] or "doc_generator.py" in f["file_path"]:
            core_files.append(f)
            
    if not core_files:
        core_files = files[:2] # Fallback
        
    result = generate_project_docs(core_files, target_path)
    
    print("\n-----------------------------------------------------")
    print("DOCUMENTATION PAYLOAD EXTRACTED:")
    print("-----------------------------------------------------")
    print(json.dumps(result, indent=2))
    print("-----------------------------------------------------")

if __name__ == "__main__":
    main()
