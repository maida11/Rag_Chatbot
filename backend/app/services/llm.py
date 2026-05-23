import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv(override=True)

api_key = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    api_key=api_key,
    model="llama-3.3-70b-versatile"
)

def _message_fields(msg):
    if isinstance(msg, dict):
        return msg.get("role", "user"), msg.get("text", "")
    return getattr(msg, "role", "user"), getattr(msg, "text", "")


def format_history(history):
    if not history:
        return ""

    formatted = ""
    for msg in history[-6:]:
        role, text = _message_fields(msg)
        label = "Assistant" if role in ("bot", "assistant") else "User"
        formatted += f"{label}: {text}\n"

    return formatted


def generate_answer(question, context, chat_history=None):
    formatted_history = format_history(chat_history or [])
    prompt = f"""
You are a helpful AI assistant.
Use the conversation history and retrieved context
to answer follow-up questions naturally.
Conversation History:
{formatted_history}
Retrieved Context:
{context}
Current Question:
{question}
Instructions:
- Answer using the retrieved context
- Use conversation history for follow-ups
- If answer not found, say it is outside the document scope

Answer:
"""

    response = llm.invoke(prompt)
    return response.content