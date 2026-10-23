import chromadb
import os
from dotenv import load_dotenv

load_dotenv()
client = chromadb.PersistentClient(path=os.getenv("CHROMA_DB_PATH", "./chroma_db"))

def get_collection(doc_id):
    return client.get_or_create_collection(name=doc_id, metadata={"hnsw:space": "cosine"})

def store_chunks(doc_id, chunks, embeddings):
    collection = get_collection(doc_id)
    ids = [f"{doc_id}_{c['chunkIndex']}" for c in chunks]
    documents = [c["text"] for c in chunks]
    metadatas = [{"pageNumber": c["pageNumber"], "chunkIndex": c["chunkIndex"]} for c in chunks]

    collection.add(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)
    return len(ids)

def delete_collection(doc_id):
    client.delete_collection(name=doc_id)