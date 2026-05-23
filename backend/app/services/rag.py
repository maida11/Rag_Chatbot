from app.services.file_extractor import extract_text
from app.services.embeddings import generate_embedding
from app.services.storage import add_documents, search
import uuid

def chunk_text(text, chunk_size=1000, overlap=200):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap

    return chunks
def process_file(file_path, filename):
    text = extract_text(file_path, filename)

    chunks = chunk_text(text)

    embeddings = [generate_embedding(chunk) for chunk in chunks]

    doc_id = str(uuid.uuid4())

    add_documents(doc_id, chunks, embeddings)

    return doc_id


def answer_question(question: str):
    query_embedding = get_embedding(question)

    relevant_chunks = search(query_embedding)

    context = "\n".join(relevant_chunks)

    return context