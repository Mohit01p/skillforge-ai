# ⚡ SkillForge AI

An AI-powered placement prep platform for developer students. Roadmaps, AI tools, interview practice, resume tools and document Q&A in one app, personalised to each user's career goal.

**Live demo:** https://skillforge-ai-zeta.vercel.app

## Features

- **Auth and onboarding:** JWT login, a 3-step wizard for career goal and current skills
- **5 career roadmaps:** MERN, Java Backend, Python, DevOps, DSA, with topic resources and MongoDB-synced progress
- **Progress dashboard:** Chart.js donut charts and stats across all roadmaps
- **10 Gemini-powered AI features:**
  - Topic explainer
  - Roadmap generator
  - Skill gap analyzer
  - Daily planner
  - Project ideas
  - AI mentor chat (knows your goal and skills)
  - AI quiz generator
  - Resume builder
  - ATS resume scorer
  - AI interview coach (scores answers and gives feedback)
- **Interview prep:** question bank by topic and difficulty, with AI answer evaluation
- **PDF Document Chat:** ask questions about an uploaded PDF using the Gemini File API
- **RAG pipeline:** a Python FastAPI service with PyMuPDF chunking, sentence-transformers embeddings and ChromaDB vector search
- **Light and dark themes**, with Gemini model fallback and retry on API overload

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, Chart.js, Lucide |
| Backend | Node.js, Express, Mongoose, JWT, bcrypt, multer |
| Database | MongoDB Atlas, ChromaDB (vector store) |
| AI | Google Gemini API |
| RAG service | FastAPI, sentence-transformers (all-MiniLM-L6-v2), PyMuPDF |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

```
React (Vercel) ──► Express API (Render) ──► MongoDB Atlas
                         │
                         ├──► Gemini API
                         └──► FastAPI RAG service ──► ChromaDB ──► Gemini
```

## Project Structure

```
skillforge-ai/
├── client/        React frontend
├── server/        Node.js + Express API
└── rag-service/   Python FastAPI RAG microservice
```

## Run Locally

**Prerequisites:** Node.js 20+, Python 3.11+, a MongoDB Atlas cluster, a Gemini API key.

**1. Clone**
```bash
git clone https://github.com/Mohit01p/skillforge-ai.git
cd skillforge-ai
```

**2. Backend**
```bash
cd server
npm install
```
Create `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_key
RAG_SERVICE_URL=http://localhost:8000
```
```bash
npm run dev
```

**3. Frontend**
```bash
cd client
npm install
```
Create `client/.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```
```bash
npm run dev
```

**4. RAG service (optional, needed only for RAG mode)**
```bash
cd rag-service
python -m venv venv
.\venv\Scripts\activate      # Windows (Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
```
Create `rag-service/.env`:
```
GEMINI_API_KEY=your_gemini_key
CHROMA_DB_PATH=./chroma_db
```
```bash
uvicorn main:app --reload --port 8000
```

Open http://localhost:5173

## Notes

- RAG mode currently runs locally only. The Gemini PDF chat mode works in the live demo.
- Files uploaded to the Gemini File API expire after 48 hours.

## Author

**Mohit** · [GitHub](https://github.com/Mohit01p)