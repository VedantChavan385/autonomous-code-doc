import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_answer(question, chunks):
    context = "\n\n".join(chunks)

    prompt = f"""
You are a helpful AI code assistant.

Answer the question using the code below.

Code:
{context}

Question:
{question}

Answer clearly:
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"[LLM Error] {str(e)}"