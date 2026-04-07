from groq import Groq
from app.config import settings

# Initialize Groq client
client = Groq(api_key=settings.groq_api_key)

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
        response = client.chat.completions.create(
            model=settings.llm_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"[LLM Error] {str(e)}"