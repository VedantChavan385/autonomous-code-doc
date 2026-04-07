import os
import shutil
import tempfile
from git import Repo
import logging
logger = logging.getLogger(__name__)

def clone_repository(repo_url: str, project_id: str) -> str:
    """
    Clones a GitHub repository to a temporary directory.
    Returns the path to the cloned repository.
    """
    try:
        # Create a specific temporary directory for this project
        target_dir = os.path.join(tempfile.gettempdir(), "repos", project_id)
        
        # If the directory already exists, clear it out to avoid conflicts
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir, ignore_errors=True)
            
        os.makedirs(target_dir, exist_ok=True)
        
        logger.info(f"Cloning {repo_url} into {target_dir}...")
        
        # Clone the repo (shallow clone to save time and bandwidth)
        Repo.clone_from(repo_url, target_dir, depth=1)
        
        logger.info(f"Successfully cloned {repo_url}")
        return target_dir
        
    except Exception as e:
        logger.error(f"Failed to clone repository: {str(e)}")
        raise Exception(f"Failed to clone repository: {str(e)}")

def cleanup_repository(target_dir: str):
    """
    Deletes the temporary repository folder to save disk space.
    """
    try:
        if os.path.exists(target_dir):
            # On windows sometimes .git files are read-only, making rmtree fail.
            # We use an error handler to force delete if necessary.
            def handle_remove_readonly(func, path, exc):
                import stat
                os.chmod(path, stat.S_IWRITE)
                func(path)
                
            shutil.rmtree(target_dir, onerror=handle_remove_readonly)
            logger.info(f"Cleaned up repository at {target_dir}")
    except Exception as e:
        logger.warning(f"Failed to cleanup repository at {target_dir}: {str(e)}")
