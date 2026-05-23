from fastapi import APIRouter, UploadFile, File
from app.services.file_extractor import extract_text
from app.services.rag import chunk_text
from app.services.embeddings import generate_embedding
from app.services.storage import add_documents
import uuid

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):

    content = await file.read()
    filename = file.filename
    text = extract_text(content, filename)
    chunks = chunk_text(text)
    embeddings = [generate_embedding(c) for c in chunks]
    doc_id = str(uuid.uuid4())
    add_documents(doc_id, chunks, embeddings)

    return {
        "message": "File uploaded and processed successfully",
        "chunks": len(chunks)
    }