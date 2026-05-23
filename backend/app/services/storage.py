import chromadb

client = chromadb.PersistentClient(path="chroma_db")
collection = client.get_or_create_collection(name="rag_docs")


def add_documents(doc_id: str, chunks: list, embeddings: list):
    for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
        collection.add(
            ids=[f"{doc_id}_{i}"],
            documents=[chunk],
            embeddings=[emb]
        )


def search(query_embedding, k=5):
    results = collection.query(
            query_embeddings=[query_embedding],
            n_results=k
        )

    docs = results["documents"][0]
    unique_docs = list(dict.fromkeys(docs))
    return unique_docs