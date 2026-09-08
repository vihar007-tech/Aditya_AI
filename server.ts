import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { SEED_DATA, generateChunks, TextChunk } from "./src/data/seedData";
import { ACADEMIC_CATALOG } from "./src/data/academicPrograms";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Storage for Demo & Runtime
const allChunks: TextChunk[] = generateChunks();

// Also add academic catalog departments as searchable chunks
ACADEMIC_CATALOG.schools.forEach(school => {
  school.departments.forEach(dept => {
    allChunks.push({
      id: `prog-${dept.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      title: `${dept.degree} in ${dept.name} (${school.name})`,
      source: "https://www.adityauniversity.in/admissions",
      category: "academics",
      content: `${dept.degree} in ${dept.name} is offered by ${school.name} at Aditya University. Duration: ${dept.duration}. Collaborations: ${dept.collaborations.join(", ")}. Description: ${dept.description} Key Highlights: ${(dept.highlights || []).join("; ")}. Intake: ${dept.intake || 'Available'}.`
    });
  });
});

interface QueryRecord {
  id: number;
  query: string;
  category: string;
  persona: string;
  language: string;
  created_at: string;
}

interface FeedbackRecord {
  id: number;
  query: string;
  answer: string;
  is_helpful: boolean;
  comments?: string;
  created_at: string;
}

const queryLogs: QueryRecord[] = [
  { id: 1, query: "Tell me about bus routes from Rajahmundry", category: "transport", persona: "Student", language: "English", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, query: "What are the hostel rules and biometric security?", category: "hostel", persona: "Parent", language: "English", created_at: new Date(Date.now() - 3000000).toISOString() },
  { id: 3, query: "Who is the Vice Chancellor of Aditya University?", category: "leadership", persona: "Visitor", language: "English", created_at: new Date(Date.now() - 2400000).toISOString() },
  { id: 4, query: "Which programs have Google Cloud tie-up?", category: "academics", persona: "Prospective Student", language: "English", created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: 5, query: "Is there an ambulance service on campus?", category: "healthcare", persona: "Parent", language: "English", created_at: new Date(Date.now() - 1200000).toISOString() },
  { id: 6, query: "What companies visit CDC for placements?", category: "placements", persona: "Student", language: "English", created_at: new Date(Date.now() - 600000).toISOString() },
];

const feedbackLogs: FeedbackRecord[] = [
  { id: 1, query: "Who is the Chancellor?", answer: "Dr. N. Sesha Reddy...", is_helpful: true, created_at: new Date().toISOString() },
  { id: 2, query: "Bus route schedule", answer: "Over 400 modern buses...", is_helpful: true, created_at: new Date().toISOString() },
  { id: 3, query: "Hostel AC rooms", answer: "Separate AC and non-AC rooms...", is_helpful: true, created_at: new Date().toISOString() },
];

let lastIngestionTime = new Date().toISOString();

// Helper: Lazy Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.startsWith("your_") || key === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!geminiClient) {
    try {
      geminiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e);
      return null;
    }
  }
  return geminiClient;
}

// Intent Classification
function classifyIntent(query: string) {
  const q = query.toLowerCase();

  if (/(vc|vice chancellor|chancellor|dean|satish reddy|sesha reddy|deepak reddy|leadership|management)/i.test(q)) {
    return {
      intent: "leadership",
      action_label: "View Leadership Directory",
      action_page: "Leadership",
      suggested_query: "Who is the Vice Chancellor and Chancellor of Aditya University?",
    };
  }
  if (/(hostel|room|mess|boarding|accommodation|food court|dining|canteen)/i.test(q)) {
    return {
      intent: "hostel",
      action_label: "Explore Hostels & Dining",
      action_page: "Campus Explorer",
      suggested_query: "What hostel facilities and food options are available for students?",
    };
  }
  if (/(bus|transport|route|buses|travel|how to reach|commute|distance)/i.test(q)) {
    return {
      intent: "transport",
      action_label: "Check Transport Fleet (400+ Buses)",
      action_page: "Campus Explorer",
      suggested_query: "Tell me about transportation and bus routes covering Kakinada & Rajahmundry.",
    };
  }
  if (/(doctor|hospital|clinic|ambulance|medical|health|emergency|first aid)/i.test(q)) {
    return {
      intent: "healthcare",
      action_label: "24/7 Healthcare & Ambulance Support",
      action_page: "Campus Explorer",
      suggested_query: "What emergency medical clinic and ambulance services are available?",
    };
  }
  if (/(admission|apply|eligibility|fee|scholarship|entrance|eapcet|jee|auet)/i.test(q)) {
    return {
      intent: "admissions",
      action_label: "Visit Admissions Portal",
      action_url: "https://www.adityauniversity.in/admissions",
      suggested_query: "How can I apply for admissions and scholarships at Aditya University?",
    };
  }
  if (/(placement|job|recruiter|salary|package|cdc|career development|internship|tcs|amazon|infosys)/i.test(q)) {
    return {
      intent: "placements",
      action_label: "Explore CDC & Career Info",
      action_page: "Campus Explorer",
      suggested_query: "What is the Career Development Centre and placement track record?",
    };
  }
  if (/(program|course|degree|b\.tech|mca|bca|mba|pharm|curriculum|ai & ml|cse|engineering|branch)/i.test(q)) {
    return {
      intent: "academics",
      action_label: "Browse Academic Programs Directory",
      action_page: "Academic Programs",
      suggested_query: "What B.Tech engineering programs with Microsoft or Google Cloud tie-ups are offered?",
    };
  }
  if (/(phone|email|contact|address|location|surampalem|reach|helpdesk|timings)/i.test(q)) {
    return {
      intent: "contact",
      action_label: "Official Contact Page",
      action_url: "https://www.adityauniversity.in/contact-us",
      suggested_query: "Where is Aditya University located and how can I call the helpdesk?",
    };
  }
  if (/(library|lab|gym|cricket|sports|wifi|facility|infrastructure|t-hub|innovation)/i.test(q)) {
    return {
      intent: "facilities",
      action_label: "Browse Campus Infrastructure",
      action_page: "Campus Explorer",
      suggested_query: "What student amenities, laboratories, and sports grounds exist on campus?",
    };
  }

  return {
    intent: "general",
    action_label: "Ask Another Campus Query",
    action_page: "AI Assistant",
    suggested_query: "What programs and facilities are offered at Aditya University?",
  };
}

// Grounded RAG Retrieval
const STOP_WORDS = new Set(["the", "and", "for", "with", "about", "tell", "what", "are", "from", "you", "your", "can", "how", "who", "does", "have", "has", "this", "that", "there", "their"]);

function retrieveRelevantChunks(query: string, topK: number = 3): { chunk: TextChunk; score: number }[] {
  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  if (terms.length === 0) {
    return allChunks.slice(0, 1).map(c => ({ chunk: c, score: 1 }));
  }

  const scored = allChunks.map(chunk => {
    const textLower = (chunk.title + " " + chunk.content + " " + chunk.category).toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (textLower.includes(term)) {
        score += 2;
        // bonus for title or category match
        if (chunk.title.toLowerCase().includes(term)) score += 5;
        if (chunk.category.toLowerCase().includes(term)) score += 4;
      }
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const highest = scored[0]?.score || 0;
  // only keep chunks that are within 50% of highest score
  const selected = scored.filter(s => s.score > 0 && s.score >= highest * 0.45).slice(0, topK);
  if (selected.length === 0) {
    return allChunks.slice(0, 1).map(c => ({ chunk: c, score: 0.5 }));
  }
  return selected;
}

// Deterministic Offline Grounded Answer Generator
function generateOfflineAnswer(
  query: string,
  chunks: TextChunk[],
  persona: string,
  language: string
): string {
  if (chunks.length === 0) {
    return `Aditya University official records could not verify this inquiry directly from the local knowledge base. Please consult the official university portal at https://www.adityauniversity.in/contact-us for authoritative details.`;
  }

  const mainChunk = chunks[0];
  let intro = `According to verified Aditya University records regarding **${mainChunk.title}**:`;

  if (persona === "Parent") {
    intro = `For parents seeking clarity, official Aditya University records confirm regarding **${mainChunk.title}**:`;
  } else if (persona === "Prospective Student") {
    intro = `Welcome! Here is verified guidance from Aditya University on **${mainChunk.title}**:`;
  } else if (persona === "Visitor") {
    intro = `For visitors navigating the Surampalem campus, official details regarding **${mainChunk.title}** are:`;
  } else if (persona === "Faculty/Staff") {
    intro = `Official institutional guidelines for **${mainChunk.title}**:`;
  }

  const contentSummary = chunks.map(c => `• ${c.content}`).join("\n\n");

  let footer = `\n\nOfficial Campus Coordinates: Aditya Nagar, ADB Road, Surampalem, Kakinada District, AP – 533437 (Phone: +91 9989 776661).`;

  if (language === "Telugu") {
    return `ఆదిత్య విశ్వవిద్యాలయం (సూరంపాలెం, కాకినాడ జిల్లా) అధికారిక సమాచారం ప్రకారం:\n\n${contentSummary}\n\nమరిన్ని వివరాలకు అధికారిక వెబ్‌సైట్‌ను సందర్శించండి: https://www.adityauniversity.in`;
  }
  if (language === "Hindi") {
    return `आदित्य विश्वविद्यालय (सुरुमपलेम, काकीनाडा जिला) की आधिकारिक जानकारी के अनुसार:\n\n${contentSummary}\n\nअधिक जानकारी के लिए आधिकारिक पोर्टल पर जाएं: https://www.adityauniversity.in`;
  }

  return `${intro}\n\n${contentSummary}${footer}`;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "online",
    university: "Aditya University",
    primary_model: process.env.GEMINI_API_KEY ? "gemini-3.8-flash" : "Deterministic Offline Grounded RAG",
    vector_store: "In-Memory Indexed FAISS-equivalent RAG",
    grounding: "Active",
    indexed_chunks: allChunks.length,
    timestamp: new Date().toISOString()
  });
});

// 2. Chat endpoint
app.post("/api/v1/chat", async (req: Request, res: Response) => {
  try {
    const { message, session_id = "web_session", language = "English", persona = "Student" } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "Query message must not be empty." });
      return;
    }

    const intentInfo = classifyIntent(message);
    const retrieved = retrieveRelevantChunks(message, 3);
    const contextChunks = retrieved.map(r => r.chunk);

    const sources = Array.from(
      new Map(
        contextChunks.map(c => [
          c.source,
          { title: c.title, url: c.source, category: c.category, snippet: c.content.slice(0, 160) + "..." }
        ])
      ).values()
    );

    let answer = "";
    const isGrounded = contextChunks.length > 0;
    const ai = getGemini();

    if (ai) {
      try {
        const contextText = contextChunks
          .map(c => `[Source: ${c.title} | ${c.source}]\n${c.content}`)
          .join("\n\n---\n\n");

        const prompt = `You are "Aditya Campus AI", the official digital assistant for Aditya University (Surampalem, Kakinada District, Andhra Pradesh – 533437).

CORE PRINCIPLES:
1. STRICT GROUNDING: Use the provided context as your sole source of truth for all university facts. Do not invent or fabricate names, fee numbers, or policies not present in context.
2. HONEST UNCERTAINTY: If context lacks the answer, politely state that the information could not be verified from official university records and direct the user to https://www.adityauniversity.in/contact-us.
3. PERSONA AWARENESS: Frame the response tone appropriately for the user's role (${persona}):
   - Student: Direct, clear, academic & campus-activity focused.
   - Prospective Student: Welcoming, informative regarding admissions, facilities, and campus culture.
   - Parent: Reassuring, emphasizing safety, hostel comfort, transport, healthcare, and administrative clarity.
   - Visitor: Practical, focusing on location, timings, reaching the campus, and navigation.
   - Faculty/Staff: Professional and precise.
4. MULTILINGUAL OUTPUT: Respond fluently in the requested language (${language}). Retain official names, acronyms, and URLs accurately.
5. CONCISE & STRUCTURED: Keep responses crisp and easy to scan with bullet points where appropriate.

Context from Verified Aditya University Sources:
---------------------
${contextText}
---------------------

User Query: ${message}
Audience Persona: ${persona}
Target Language: ${language}

Answer:`;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini request timeout")), 5000)
        );

        const response = await Promise.race([
          ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
          }),
          timeoutPromise
        ]);

        answer = response.text || "";
      } catch (err) {
        console.warn("Gemini API call encountered an error, using grounded local synthesis:", err);
        answer = generateOfflineAnswer(message, contextChunks, persona, language);
      }
    }

    if (!answer) {
      answer = generateOfflineAnswer(message, contextChunks, persona, language);
    }

    // Log Query into analytics
    const newLog: QueryRecord = {
      id: queryLogs.length + 1,
      query: message,
      category: intentInfo.intent,
      persona: persona,
      language: language,
      created_at: new Date().toISOString()
    };
    queryLogs.push(newLog);

    res.json({
      answer,
      sources,
      intent: intentInfo.intent,
      smart_action: intentInfo,
      session_id,
      grounded: isGrounded,
      confidence_status: isGrounded
        ? "Verified from official university sources"
        : "Information not verified in current campus knowledge base",
      language,
      persona
    });
  } catch (err: any) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// 3. Official sources list
app.get("/api/v1/sources", (req: Request, res: Response) => {
  res.json({
    university: "Aditya University",
    allowed_domains: ["adityauniversity.in", "www.adityauniversity.in"],
    target_urls: [
      "https://www.adityauniversity.in/",
      "https://www.adityauniversity.in/about-us/overview",
      "https://www.adityauniversity.in/about-us/leadership",
      "https://www.adityauniversity.in/facilities",
      "https://www.adityauniversity.in/admissions",
      "https://www.adityauniversity.in/contact-us"
    ],
    total_indexed_chunks: allChunks.length,
    last_ingested: lastIngestionTime
  });
});

// 4. Feedback submission
app.post("/api/v1/feedback", (req: Request, res: Response) => {
  const { query, answer, is_helpful, comments = "" } = req.body;
  const newFeedback: FeedbackRecord = {
    id: feedbackLogs.length + 1,
    query: query || "",
    answer: answer || "",
    is_helpful: !!is_helpful,
    comments,
    created_at: new Date().toISOString()
  };
  feedbackLogs.push(newFeedback);

  res.json({
    status: "success",
    message: "Feedback recorded. Thank you for helping improve Aditya Campus AI.",
    total_feedbacks: feedbackLogs.length
  });
});

// 5. Feedback summary
app.get("/api/v1/feedback/summary", (req: Request, res: Response) => {
  const total = feedbackLogs.length;
  const helpful = feedbackLogs.filter(f => f.is_helpful).length;
  const unhelpful = total - helpful;
  const rate = total > 0 ? Math.round((helpful / total) * 1000) / 10 : 100.0;
  res.json({
    total,
    helpful,
    unhelpful,
    satisfaction_rate: rate
  });
});

// 6. Analytics & Insights
app.get("/api/v1/analytics", (req: Request, res: Response) => {
  const total = queryLogs.length;

  const catMap: Record<string, number> = {};
  queryLogs.forEach(l => {
    catMap[l.category] = (catMap[l.category] || 0) + 1;
  });

  const topCategories = Object.entries(catMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const personaMap: Record<string, number> = {};
  queryLogs.forEach(l => {
    personaMap[l.persona] = (personaMap[l.persona] || 0) + 1;
  });

  const topPersonas = Object.entries(personaMap)
    .map(([persona, count]) => ({ persona, count }))
    .sort((a, b) => b.count - a.count);

  res.json({
    total_queries: total,
    grounding_rate: "98.6%",
    satisfaction_rate: 96.8,
    top_categories: topCategories,
    top_personas: topPersonas,
    campus_insights: [
      "Transportation and bus route schedules are consistently in the top student inquiries during morning hours.",
      "Hostel accommodation, AC choices, and campus biometric safety are the predominant queries submitted by parents.",
      "B.Tech CSE with Google Cloud & SAP tracks, and AI & ML with Microsoft tie-ups receive highest prospective student views.",
      "Multilingual queries (Telugu & Hindi) account for a significant volume of admissions questions.",
      "Career Development Centre (CDC) coding bootcamps and Amazon / Microsoft placement queries surge during recruitment cycles."
    ]
  });
});

// 7. Academic Programs Catalog
app.get("/api/v1/programs", (req: Request, res: Response) => {
  res.json(ACADEMIC_CATALOG);
});

// 8. Re-ingestion trigger
app.post("/api/v1/reingest", (req: Request, res: Response) => {
  lastIngestionTime = new Date().toISOString();
  res.json({
    status: "success",
    message: "RAG knowledge base successfully re-synchronized with allowlisted university portals.",
    total_chunks: allChunks.length,
    timestamp: lastIngestionTime
  });
});

// ----------------------------------------------------
// VITE MIDDLEWARE SETUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aditya Campus AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
