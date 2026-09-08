# 🎓 Aditya Campus AI

### Your Intelligent Guide to Aditya University

**🚀 Live Demo:**
https://aditya-ai-theta.vercel.app/

Aditya Campus AI is an AI-powered campus assistant designed to help students, parents, faculty, and visitors quickly find information about **Aditya University**.

Instead of searching through multiple university webpages, users can simply ask questions in natural language and receive **context-aware, source-grounded answers**.

---

## ✨ Features

* 🤖 **AI Campus Assistant** — Ask questions naturally.
* 🔎 **RAG-powered answers** — Uses official university information.
* 🔗 **Source Citations** — Shows information sources.
* 🧠 **Conversation Memory** — Understands follow-up questions.
* 🌐 **Multilingual Support** — English, Telugu & Hindi.
* 🏫 **Campus Explorer** — Explore facilities and services.
* 👥 **Leadership Directory** — Access university leadership information.
* 📊 **Campus Insights** — Analyze common question categories.
* 🔌 **Developer API** — Integrate the assistant into websites and applications.
* 🛡️ **Anti-Hallucination Design** — Avoids inventing unverifiable university information.

---

## 🧠 How It Works

```text
Official University Website
          ↓
    Data Ingestion
          ↓
   Cleaning + Chunking
          ↓
 Vector Knowledge Base
          ↓
      LangChain RAG
          ↓
       Gemini AI
          ↓
 Grounded Answer + Sources
```

The Streamlit/web interface and API use the same AI service, allowing Campus AI to be integrated into different platforms.

---

## 🛠️ Tech Stack

* **Python**
* **Google Gemini**
* **LangChain**
* **RAG**
* **FAISS / Chroma**
* **Streamlit**
* **FastAPI**
* **BeautifulSoup**
* **Pydantic**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/aditya-campus-ai.git
cd aditya-campus-ai
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure API Key

Create a `.env` file:

```env
GOOGLE_API_KEY=your_google_ai_studio_api_key
```

**Never commit your API key to GitHub.**

### 4. Build the knowledge base

```bash
python -m rag.ingest
```

### 5. Run the application

```bash
streamlit run app.py
```

### 6. Run the API

```bash
uvicorn api:app --reload
```

---

## 🔌 API

### Endpoint

```http
POST /api/v1/chat
```

### Request

```json
{
  "message": "What facilities are available on campus?",
  "session_id": "demo-123",
  "language": "en"
}
```

### Response

```json
{
  "answer": "Aditya University provides...",
  "sources": [
    {
      "title": "Campus Facilities",
      "url": "https://www.adityauniversity.in/facilities"
    }
  ],
  "session_id": "demo-123"
}
```

The API makes it possible to integrate Campus AI into the **official university website, student portal, mobile application, or other platforms**.

---

## 🌐 Knowledge Sources

The knowledge base uses publicly available information from official Aditya University sources, including:

* University Overview
* Leadership
* Campus Facilities
* Contact Information
* FAQs
* Other approved university pages

Official website:

https://www.adityauniversity.in/

---

## 🔐 Security

* API keys are stored using environment variables/secrets.
* No credentials are hard-coded.
* Only approved public university sources are ingested.
* The AI is instructed not to fabricate information when reliable sources are unavailable.

---

## 🚀 Future Scope

* Student-specific authenticated services
* Timetable & attendance integration
* Examination notifications
* Campus navigation
* Voice assistant
* Mobile application
* ERP/LMS integration

---

## 🏆 Hackathon Vision

> **“From searching for campus information to simply asking for it.”**

Aditya Campus AI aims to become an intelligent digital layer connecting students, parents, faculty, visitors, and university services through one conversational interface.

### 🔗 Project Links

**Live Deployment:**
https://aditya-ai-theta.vercel.app/

**Official University:**
https://www.adityauniversity.in/

### Built with ❤️ using Gemini + LangChain
