# 🎓 Aditya Campus AI

### AI for Campus Life — Official Intelligent Campus Platform for Aditya University

**🚀 Live Demo:**  
[https://aditya-ai-theta.vercel.app/](https://aditya-ai-theta.vercel.app/)

Aditya Campus AI is a unified intelligent digital layer designed for students, parents, faculty, and administrators of **Aditya University**. Instead of navigating across fragmented portals and static webpages, users receive **context-aware, source-grounded answers**, academic toolkits, and campus navigation through one seamless platform.

---

## 🚀 Live Demo

* **Production URL:** [https://aditya-ai-theta.vercel.app/](https://aditya-ai-theta.vercel.app/)
* **Official University Portal:** [https://www.adityauniversity.in/](https://www.adityauniversity.in/)

---

## ✨ Features

### 👤 User Experience
* **AI Campus Assistant** — Natural conversational assistant with voice input, speech output, follow-up memory, and verified source citations. Answers directly first, provides sources second, and avoids unsolicited redirects.
* **Academic Programs** — Comprehensive directory of Undergraduate, Postgraduate, Doctoral, and Diploma programs with search, eligibility criteria, curriculum details, and direct AI inquiry.
* **Campus Explorer** — Interactive exploration of campus facilities (Libraries, Hostels, Laboratories, Sports Complex, Food Courts, Healthcare, Innovation Centres) with verified coordinates and map navigation.
* **Smart Study Planner** — Deterministic adaptive study scheduler that prioritizes subjects, detects schedule conflicts, and rebalances study plans when sessions are marked as missed. Supports optional Google Calendar synchronization.
* **Smart Attendance Analyzer** — Mathematical attendance calculator determining safe absences before falling below configured mandatory thresholds (75%), providing automated warning triggers.
* **AI Resume Analyzer** — Evaluates resume quality scores, estimates ATS compatibility against target job descriptions, identifies skill gaps, and suggests contextual bullet improvements without fabricating metrics.
* **AI Interview Coach** — Interactive mock interview simulator across Technical, HR, Behavioral, and Case roles, offering structured constructive feedback on relevance, pace, and clarity, with optional presentation framing analysis.
* **Campus Notifications** — Centralized in-app notifications system alerting students to academic deadlines, examination schedules, attendance thresholds, and campus events.

### 🛡️ Admin Experience
* **Leadership & Directory** — Verified administrative directory covering the Chancellor, Vice Chancellor, Pro Vice Chancellors, Deans, and Heads of Departments.
* **Campus Insights** — Aggregated analytics dashboard illustrating query trends, popular facility inquiries, multilingual distribution, and unanswered information gaps.
* **Knowledge Centre** — Administrative crawler status console, document chunk tracker, incremental knowledge refresh controls, failed page logs, and granular Source Explorer.
* **Developer REST API** — Interactive documentation and test harness enabling external integration into student portals, digital kiosks, and mobile applications.

---

## 🧠 AI Architecture

Campus AI adheres to a strict **Ask → Understand → Retrieve → Verify → Answer → Act** pipeline:

```text
User Question / Voice Input
          ↓
  Query & Intent Router
          ↓
  Hybrid RAG Retrieval (Semantic + Keyword + Metadata)
          ↓
  Evidence Evaluation (Strong / Moderate / Weak / None)
          ↓
  Gemini 2.5 Flash Grounding
          ↓
  Grounded Answer + Official Citations + Smart Actions
```

* **Answer-First Policy**: Direct factual answers are generated first. Official university links serve as verifiable citations.
* **Anti-Hallucination**: When evidence is insufficient, the system explicitly states what could not be verified rather than fabricating details.

---

## 🛠️ Technology

* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Web Speech API
* **Backend & API**: Express.js / Node.js, Python / FastAPI, LangChain, @google/genai (Gemini 2.5 Flash)
* **Knowledge & Retrieval**: Vector search, BM25 keyword matching, structured document metadata store
* **Deployment**: Cloud Run / Vercel with zero-configuration fallbacks

---

## 🌐 Knowledge Sources

All institutional data is ingested from official public Aditya University resources:
* Overview, Governance & Leadership: `https://www.adityauniversity.in/about-us/`
* Academic Regulations & Faculties: `https://www.adityauniversity.in/`
* Campus Facilities: `https://www.adityauniversity.in/facilities`
* Official Contact: `https://www.adityauniversity.in/contact-us`
* Admissions & FAQs: `https://www.adityauniversity.in/faqs`

---

## 💻 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/aditya-campus-ai.git
cd aditya-campus-ai

# Install frontend and server dependencies
npm install

# (Optional) Python environment for custom crawlers
pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Configure your `.env` file based on `.env.example`:

```env
# Required for Gemini AI Studio operations
GEMINI_API_KEY="your-google-ai-studio-api-key"
GEMINI_MODEL="gemini-2.5-flash"

# Optional external integrations (gracefully degraded if omitted)
GOOGLE_MAPS_API_KEY=""
GOOGLE_CLIENT_ID=""
```

---

## 🔌 API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health and operational status |
| `POST` | `/api/v1/chat` | Main Campus AI chatbot endpoint with RAG |
| `POST` | `/api/v1/chat/stream` | Streamed response generation |
| `GET` | `/api/v1/sources` | Verified university knowledge sources |
| `GET` | `/api/v1/programs` | Academic programs catalog |
| `GET` | `/api/v1/locations` | Verified campus locations and map queries |
| `POST` | `/api/v1/planner` | Study schedule generator and rebalancer |
| `POST` | `/api/v1/attendance/analyze` | Attendance and safe absence calculator |
| `POST` | `/api/v1/resume/analyze` | Resume scorer and ATS compatibility analyzer |
| `POST` | `/api/v1/interview/start` | Interview session generator |
| `POST` | `/api/v1/interview/feedback` | Interview answer evaluator |
| `GET` | `/api/v1/admin/insights` | Campus query analytics (Admin protected) |
| `GET` | `/api/v1/admin/crawl-status` | Crawler metrics and source index (Admin protected) |

---

## 🔐 Security

* Admin routes enforce server-side token authorization (`AdminToken`).
* All API keys are isolated on the server-side; client never exposes Gemini secrets.
* Crawling is strictly restricted to `adityauniversity.in` and `www.adityauniversity.in`.
* Private user documents (resumes, interview answers) are processed in-memory and never permanently exposed.

---

## 🧪 Demo Mode

* Student tools (Attendance, Planner, Benchmarks) include clearly labeled **"Demo Dataset"** options for instant demonstration without manual typing.
* Missing external credentials (Google Maps, Google Calendar) automatically degrade to verified external URLs and local offline state without erroring.

---

## 🔮 Future Scope

* Direct single-sign-on integration with University ERP/Student Information System
* Physical digital kiosk hardware deployment across campus libraries and entrances
* WhatsApp and Telegram campus notification gateways
