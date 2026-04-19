from pydantic import BaseModel, Field
from typing import List, Optional

class ProcessRepoRequest(BaseModel):
    repo_url: str = Field(..., description="The GitHub repository URL to process")
    project_id: str = Field(..., description="The unique ID of the project from the backend")
    file_extensions: Optional[List[str]] = Field(
        default=[".js", ".ts", ".py", ".jsx", ".tsx", ".java", ".cpp", ".c", ".h", ".cs", ".go"],
        description="File extensions to parse"
    )

class ProcessRepoResponse(BaseModel):
    status: str
    file_count: int
    chunk_count: int
    collection_id: str
    message: str

class QueryRequest(BaseModel):
    question: str = Field(..., description="The question asked by the user")
    project_id: str = Field(..., description="The ID of the project to search against")
    top_k: int = Field(default=5, description="Number of context chunks to retrieve")

class QueryResponse(BaseModel):
    answer: str
    sources: List[dict]

class GenerateDocsRequest(BaseModel):
    repo_url: str = Field(..., description="The GitHub repository URL to process")
    project_id: str = Field(..., description="The unique ID of the project from the backend")
    file_extensions: Optional[List[str]] = Field(
        default=[".js", ".ts", ".py", ".jsx", ".tsx", ".java", ".cpp", ".c", ".h", ".cs", ".go"],
        description="File extensions to parse"
    )

class GenerateDocsResponse(BaseModel):
    status: str
    tree: List[dict]
    docs: dict
