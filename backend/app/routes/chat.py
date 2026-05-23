from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag import answer_question

router = APIRouter()
class Query(BaseModel):
    question: str
@router.post("/")
def chat(query: Query):
    response = answer_question(query.question)
    return {"answer": response}