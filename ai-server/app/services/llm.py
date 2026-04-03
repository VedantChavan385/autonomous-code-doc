import ollama

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

    response = ollama.chat(
        model='llama3',
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response['message']['content']