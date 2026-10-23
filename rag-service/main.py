from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import os
from dotenv import load_dotenv

from chunker import chunk_pdf
from embedder import embed_texts
from vector_store import store_chunks, delete_collection
from retriever import retrieve_top_chunks

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODELS = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.5-flash"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/rag/upload")
async def upload_pdf(file: UploadFile, docId: str = Form(...)):
    file_bytes = await file.read()
    chunks = chunk_pdf(file_bytes)
    if not chunks:
        raise HTTPException(status_code=400, detail="No readable text found in this PDF (it may be scanned/image-based). Try a text-based PDF.")
    texts = [c["text"] for c in chunks]
    embeddings = embed_texts(texts)
    count = store_chunks(docId, chunks, embeddings)
    return {"docId": docId, "chunksStored": count, "status": "success"}

@app.post("/rag/query")
async def query_rag(docId: str = Form(...), question: str = Form(...)):
    try:
        top_chunks = retrieve_top_chunks(docId, question)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Document not indexed in RAG yet: {e}")

    context = "\n".join([c["text"] for c in top_chunks])
    prompt = f"""Answer the question based ONLY on the following context from the uploaded document.
If the answer is not in the context, say 'I could not find this in the document.'
Context: {context}
Question: {question}"""

    last_err = None
    for name in MODELS:
        try:
            result = client.models.generate_content(model=name, contents=prompt)
            sources = [{"text": c["text"][:100], "page": c["page"]} for c in top_chunks]
            return {"answer": result.text, "sources": sources}
        except Exception as e:
            last_err = e
            print(f"[Gemini] {name} failed: {e}")
    raise HTTPException(status_code=503, detail=f"Gemini busy: {last_err}")

@app.delete("/rag/document/{doc_id}")
async def delete_document(doc_id: str):
    delete_collection(doc_id)
    return {"status": "deleted"}

@app.get("/")
async def root():
    return {"message": "RAG service running"}