import pymupdf as fitz

def chunk_pdf(file_bytes, chunk_size=500, overlap=50):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    chunks = []
    chunk_index = 0

    for page_num, page in enumerate(doc):
        text = page.get_text()
        start = 0
        while start < len(text):
            chunk_text = text[start:start + chunk_size]
            if chunk_text.strip():
                chunks.append({
                    "text": chunk_text,
                    "pageNumber": page_num + 1,
                    "chunkIndex": chunk_index
                })
                chunk_index += 1
            start += chunk_size - overlap

    return chunks