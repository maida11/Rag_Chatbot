import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv(override=True)

api_key = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    api_key=api_key,
    model="llama-3.3-70b-versatile"
)


def generate_answer(question, context, chat_history=None):

    prompt = f"""
You are a precise AI assistant working on a RAG system.

RULES:
1. Answer ONLY using the provided context.
2. If the answer is not in the context, say: The information is not available in the provided document.
3. Do NOT use outside knowledge.
4. Be concise and professional.
CONTEXT:
{context}
CHAT HISTORY:
{chat_history}
QUESTION:
{question}
FINAL ANSWER:
"""

    response = llm.invoke(prompt)
    return response.content