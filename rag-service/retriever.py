from vector_store import get_collection
from embedder import embed_texts

def retrieve_top_chunks(doc_id, question, n_results=5):
    collection = get_collection(doc_id)
    query_embedding = embed_texts([question])[0]

    results = collection.query(query_embeddings=[query_embedding], n_results=n_results)

    chunks = []
    for i in range(len(results["documents"][0])):
        chunks.append({
            "text": results["documents"][0][i],
            "page": results["metadatas"][0][i]["pageNumber"]
        })
    return chunks