/**
 * Grounded Knowledge Base for Aditya University.
 * Pre-indexed official documents, chunks, metadata, and ingestion functions.
 */

import { KnowledgeChunk } from '../core/types';

export interface SeedDocument {
  id: string;
  title: string;
  url: string;
  category: string;
  source_type: 'official';
  paragraphs: string[];
  keywords: string[];
}

export const SEED_DOCUMENTS: SeedDocument[] = [
  {
    id: "doc-overview",
    title: "Aditya University Overview & Heritage",
    url: "https://www.adityauniversity.in/about-us/overview",
    category: "overview",
    source_type: "official",
    keywords: ["aditya university", "surampalem", "kakinada", "naac a++", "180 acres", "heritage", "google cloud", "microsoft", "sap"],
    paragraphs: [
      "Aditya University is situated in Aditya Nagar, ADB Road, Surampalem, Kakinada District, Andhra Pradesh, India – 533437. Renowned for its NAAC A++ accreditation, the university provides multidisciplinary higher education across engineering, computing, management, science, and pharmacy programs.",
      "The university campus spans over 180 lush green acres in coastal Andhra Pradesh, serving as a regional educational hub with state-of-the-art facilities, cutting-edge laboratories, and deep technology alliances with industry pioneers including Google Cloud, Microsoft, and SAP.",
      "Aditya University has four decades of institutional excellence, pioneering experiential education, technical hackathons, entrepreneurship incubation, and community outreach programs."
    ]
  },
  {
    id: "doc-leadership",
    title: "Aditya University Leadership & Governance",
    url: "https://www.adityauniversity.in/about-us/leadership",
    category: "leadership",
    source_type: "official",
    keywords: ["leadership", "chancellor", "vice chancellor", "vc", "dr. m.b. srinivas", "dr. n. sesha reddy", "satish reddy", "deepak reddy", "registrar", "governance"],
    paragraphs: [
      "Aditya University leadership is spearheaded by Dr. N. Sesha Reddy as Chancellor, Sri N. Satish Reddy as Vice-Chairman and Pro-Chancellor, and Sri N. Deepak Reddy as Secretary and Pro-Chancellor.",
      "The Vice Chancellor of Aditya University is Dr. M.B. Srinivas, an eminent academician and researcher who oversees university governance, academic curriculum standards, research initiatives, faculty development, and global industry partnerships.",
      "The executive administration includes the Registrar, Academic Deans, and Heads of Departments across all academic schools who maintain strict compliance with university statutory bodies and national regulatory guidelines."
    ]
  },
  {
    id: "doc-facilities",
    title: "Campus Facilities & Smart Infrastructure",
    url: "https://www.adityauniversity.in/facilities",
    category: "facilities",
    source_type: "official",
    keywords: ["facilities", "infrastructure", "smart classrooms", "wi-fi", "library", "central library", "food courts", "atms", "auditorium"],
    paragraphs: [
      "Aditya University features smart air-conditioned digital classrooms equipped with multimedia audio-visual projectors, interactive podiums, and campus-wide high-speed 24/7 Wi-Fi connectivity.",
      "The Central Knowledge Resource Centre (Central Library) maintains thousands of physical books, print journals, and digital subscriptions to global databases including IEEE Xplore, Springer, ScienceDirect, and DELNET.",
      "Campus amenities include multi-cuisine hygienic food courts and cafeterias, on-campus bank branch and 24/7 ATM kiosks, air-conditioned convention centers, open-air amphitheatres, and round-the-clock power backup."
    ]
  },
  {
    id: "doc-hostels",
    title: "Hostels & Student Residential Living",
    url: "https://www.adityauniversity.in/facilities",
    category: "hostel",
    source_type: "official",
    keywords: ["hostel", "hostels", "accommodation", "boys hostel", "girls hostel", "ac rooms", "non-ac", "food", "mess", "security", "biometric"],
    paragraphs: [
      "Aditya University provides comprehensive on-campus residential hostels for boys and girls with modern living facilities. Room configurations include both Air-Conditioned (AC) and Non-AC options across 2-sharing, 3-sharing, and 4-sharing layouts with attached washrooms.",
      "Hostel security is maintained 24/7 through biometric entry and exit access points, round-the-clock CCTV surveillance, dedicated security personnel, and resident wardens residing in every hostel block.",
      "Hostel amenities include multi-cuisine hygienic dining halls serving balanced vegetarian and non-vegetarian meals, mineral RO water plants on all floors, daily housekeeping, solar water heaters, study lounges, laundry facilities, and parent guest rooms."
    ]
  },
  {
    id: "doc-transport",
    title: "Transportation Services & Bus Fleet",
    url: "https://www.adityauniversity.in/facilities",
    category: "transport",
    source_type: "official",
    keywords: ["transport", "transportation", "bus", "buses", "fleet", "400 buses", "routes", "kakinada", "rajahmundry", "mandapeta", "samalkot", "peddapuram", "tuni"],
    paragraphs: [
      "Aditya University operates a massive fleet of over 400 modern buses connecting the Surampalem campus to major nearby cities and towns across coastal Andhra Pradesh.",
      "Primary transport routes cover Kakinada, Rajahmundry, Mandapeta, Samalkot, Peddapuram, Tuni, Ramachandrapuram, Pithapuram, Amalapuram, and surrounding rural communities.",
      "Every bus in the fleet is equipped with real-time GPS tracking, speed governors, and trained transport personnel ensuring strict punctuality, safety compliance, and disciplined boarding bays on campus."
    ]
  },
  {
    id: "doc-healthcare",
    title: "Healthcare Centre & Emergency Medical Support",
    url: "https://www.adityauniversity.in/facilities",
    category: "healthcare",
    source_type: "official",
    keywords: ["healthcare", "medical", "hospital", "clinic", "doctor", "nursing", "ambulance", "emergency", "free medicine"],
    paragraphs: [
      "Aditya University maintains a dedicated on-campus Health Care Centre staffed 24/7 with qualified medical officers and nursing professionals providing routine health consultations and emergency care.",
      "Essential first-aid, primary care medicines, routine health monitoring, and paramedic triage are provided free of cost to resident students, day scholars, faculty, and campus staff.",
      "The university operates dedicated 24/7 emergency ambulance vehicles on campus with direct emergency tie-ups with leading multi-speciality tertiary partner hospitals in Kakinada and Rajahmundry for rapid evacuation."
    ]
  },
  {
    id: "doc-sports",
    title: "Sports Complexes & Athletic Amenities",
    url: "https://www.adityauniversity.in/facilities",
    category: "sports",
    source_type: "official",
    keywords: ["sports", "cricket", "basketball", "football", "gym", "gymnasium", "badminton", "athletics", "track", "fitness"],
    paragraphs: [
      "Aditya University offers extensive sports facilities including a full-sized cricket ground with turf pitch and pavilion, football pitch, international-standard floodlit basketball courts, volleyball, and kabaddi courts.",
      "Indoor sports amenities feature wooden badminton courts, table tennis arenas, chess rooms, and modern air-conditioned gymnasiums equipped with cardiovascular and resistance weight-training equipment.",
      "The university regularly hosts inter-university sports tournaments, annual athletic meets on its 400m running track, and provides dedicated physical education directors and sports scholarships."
    ]
  },
  {
    id: "doc-placements",
    title: "Career Development Centre (CDC) & Placements",
    url: "https://www.adityauniversity.in/facilities",
    category: "career",
    source_type: "official",
    keywords: ["placements", "career", "cdc", "career development centre", "jobs", "recruiters", "salary", "lpa", "amazon", "microsoft", "tcs", "infosys"],
    paragraphs: [
      "The Career Development Centre (CDC) at Aditya University is the dedicated institutional wing driving campus placements, technical training, coding bootcamps, and holistic professional grooming.",
      "Training includes full-stack software development, competitive programming in Python, TypeScript, Go, and Rust, cloud computing certifications, mock HR interviews, and foreign language programs in Japanese, German, and French.",
      "Premier recruiters hiring from Aditya include Amazon, Microsoft, Google Cloud ecosystem partners, TCS, Infosys, Wipro, Capgemini, Tech Mahindra, and DXC Technologies, with the highest placement packages reaching 30+ LPA."
    ]
  },
  {
    id: "doc-admissions",
    title: "Admissions Process, AUET & Scholarships",
    url: "https://www.adityauniversity.in/admissions",
    category: "admissions",
    source_type: "official",
    keywords: ["admissions", "apply", "auet", "ap eapcet", "jee main", "scholarships", "b.tech", "mca", "bca", "mba", "b.pharm", "pharm.d"],
    paragraphs: [
      "Admissions to B.Tech, BCA, MCA, MBA, B.Pharm, and Pharm.D at Aditya University are conducted through national and state entrance examinations including AP EAPCET, JEE Main, AUET (Aditya University Entrance Test), and Intermediate (10+2) academic merit.",
      "Aditya University provides comprehensive merit scholarships offering up to 100% tuition fee waivers for top entrance exam rankers, national sports medalists, and economically deserving students.",
      "Prospective students can submit applications, book campus tours, check eligibility criteria, and verify scholarship brackets directly via the official admissions portal at https://www.adityauniversity.in/admissions."
    ]
  },
  {
    id: "doc-contact",
    title: "Official Contact Information & Campus Coordinates",
    url: "https://www.adityauniversity.in/contact-us",
    category: "contact",
    source_type: "official",
    keywords: ["contact", "phone", "email", "address", "timings", "office hours", "surampalem", "kakinada", "coordinates", "helpdesk"],
    paragraphs: [
      "Aditya University Official Address: Aditya Nagar, ADB Road, Surampalem, Kakinada District, Andhra Pradesh, India – 533437.",
      "Official Contact Numbers & Email: Primary University Helpdesk Phone: +91 9989 776661. Official Email: info@adityauniversity.in.",
      "University Administrative Office Working Hours: 09:00 AM to 06:00 PM, Monday through Saturday (excluding declared university public holidays). Official contact and inquiry portal: https://www.adityauniversity.in/contact-us."
    ]
  },
  {
    id: "doc-collaborations",
    title: "Academic Industry Collaborations: Google Cloud, Microsoft, SAP",
    url: "https://www.adityauniversity.in/about-us/overview",
    category: "academics",
    source_type: "official",
    keywords: ["collaborations", "industry", "google cloud", "microsoft", "sap", "ai & ml", "cse", "data science"],
    paragraphs: [
      "Aditya University has established formal industry collaborations with Google Cloud, Microsoft, and SAP to embed enterprise curriculum and cloud certifications directly into degree programs.",
      "B.Tech in Artificial Intelligence & Machine Learning (AI & ML) features specialized certified tracks in association with Microsoft Azure and Google Cloud Professional Machine Learning Engineer curricula.",
      "B.Tech Computer Science & Engineering (CSE) integrates an on-campus Google Cloud Center of Excellence and SAP Next-Gen Lab training for enterprise ERP software engineering."
    ]
  }
];

function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

class KnowledgeBaseManager {
  private chunks: KnowledgeChunk[] = [];
  private lastIndexed: string = new Date().toISOString();

  constructor() {
    this.rebuildIndex();
  }

  public rebuildIndex(): number {
    const newChunks: KnowledgeChunk[] = [];

    SEED_DOCUMENTS.forEach(doc => {
      doc.paragraphs.forEach((p, idx) => {
        const chunkContent = p.trim();
        const hash = generateHash(chunkContent);
        newChunks.push({
          id: `${doc.id}-p${idx + 1}`,
          title: doc.title,
          url: doc.url,
          category: doc.category,
          source_type: doc.source_type,
          content: chunkContent,
          content_hash: hash,
          last_updated: this.lastIndexed,
          keywords: doc.keywords
        });
      });
    });

    this.chunks = newChunks;
    this.lastIndexed = new Date().toISOString();
    return this.chunks.length;
  }

  public getAllChunks(): KnowledgeChunk[] {
    return this.chunks;
  }

  public getLastIndexedTime(): string {
    return this.lastIndexed;
  }

  public getOfficialSources(): Array<{ title: string; url: string; category: string; chunk_count: number }> {
    const map = new Map<string, { title: string; url: string; category: string; chunk_count: number }>();
    this.chunks.forEach(c => {
      const existing = map.get(c.url);
      if (existing) {
        existing.chunk_count++;
      } else {
        map.set(c.url, {
          title: c.title,
          url: c.url,
          category: c.category,
          chunk_count: 1
        });
      }
    });
    return Array.from(map.values());
  }
}

export const knowledgeBase = new KnowledgeBaseManager();
