from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag import answer_question
from typing import List
router = APIRouter()
class Message(BaseModel):
    role: str
    text: str

class Query(BaseModel):
    question: str
    history: List[Message] = []
@router.post("/")
def chat(query: Query):
    response = answer_question(query.question, query.history)
    return {"answer": response}