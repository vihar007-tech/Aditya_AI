export interface SeedDocument {
  id: string;
  title: string;
  url: string;
  category: string;
  content: string;
}

export const SEED_DATA: SeedDocument[] = [
  {
    id: "doc-overview",
    title: "Aditya University Overview",
    url: "https://www.adityauniversity.in/about-us/overview",
    category: "overview",
    content: `Aditya University is situated in Aditya Nagar, ADB Road, Surampalem, Kakinada District, Andhra Pradesh, India – 533437. Renowned for its NAAC A++ accreditation, the university provides engineering, computing, management, science, and pharmacy programs. Aditya has transformed coastal Andhra Pradesh into an educational hub with state-of-the-art facilities, lush green campus grounds spanning over 180 acres, and deep ties with industry leaders like Google Cloud, Microsoft, and SAP. Aditya University is recognized for pioneering experiential education, technical excellence, and entrepreneurial incubation.`
  },
  {
    id: "doc-leadership",
    title: "University Leadership & Administration",
    url: "https://www.adityauniversity.in/about-us/leadership",
    category: "leadership",
    content: `Aditya University's leadership includes Dr. N. Sesha Reddy as Chancellor, Sri N. Satish Reddy as Vice-Chairman and Pro-Chancellor, and Sri N. Deepak Reddy as Secretary and Pro-Chancellor. The Vice Chancellor oversees academic standards, university governance, research excellence, and industry partnerships alongside the Registrar, Deans, and Heads of Departments across all academic schools. The leadership has guided Aditya through four decades of academic distinction, fostering high-tech laboratories and global institutional alliances.`
  },
  {
    id: "doc-facilities",
    title: "Campus Facilities & Student Services",
    url: "https://www.adityauniversity.in/facilities",
    category: "facilities",
    content: `Aditya University campus features smart air-conditioned classrooms with audio-visual equipment, advanced computing laboratories, a centralized Knowledge Resource Centre/Central Library with access to IEEE, Springer, and digital journals, high-speed 24/7 campus Wi-Fi, fully air-conditioned and non-AC residential hostels for boys and girls with biometric security, modern multi-cuisine food courts, banking facilities with ATMs, extensive sports complexes including cricket grounds, basketball courts, and indoor gymnasiums.`
  },
  {
    id: "doc-healthcare",
    title: "Healthcare and Emergency Support",
    url: "https://www.adityauniversity.in/facilities",
    category: "healthcare",
    content: `Aditya University operates a dedicated on-campus Health Care Centre staffed with qualified medical officers and nursing professionals. Round-the-clock 24/7 emergency medical assistance and dedicated on-campus ambulance services are maintained for emergency evacuations to multi-speciality tertiary partner hospitals in Kakinada and Rajahmundry. Routine health checkups, primary care medicines, and immediate paramedic triage are available free to resident students and faculty.`
  },
  {
    id: "doc-transport",
    title: "Transportation Services Fleet",
    url: "https://www.adityauniversity.in/facilities",
    category: "transport",
    content: `Aditya University operates a massive fleet of over 400 modern buses connecting the Surampalem campus to major nearby cities and towns including Kakinada, Rajahmundry, Mandapeta, Samalkot, Peddapuram, Tuni, and Ramachandrapuram. Every bus is equipped with GPS tracking, speed governors, and trained transport personnel ensuring strict punctuality and student safety. Dedicated bus passes, scheduled transit apps, and organized boarding bays are provided.`
  },
  {
    id: "doc-placements",
    title: "Career Development Centre (CDC) & Placements",
    url: "https://www.adityauniversity.in/facilities",
    category: "placements",
    content: `The Career Development Centre (CDC) drives comprehensive campus placements, personality development, coding bootcamps, mock technical interviews, and international language certifications (including Japanese, German, and French). Top recruiters include Amazon, Microsoft, TCS, Infosys, Wipro, DXC Technologies, Tech Mahindra, and Capgemini with thousands of placement offers annually and highest compensation packages reaching 30+ LPA.`
  },
  {
    id: "doc-sports",
    title: "Sports & Athletics Facilities",
    url: "https://www.adityauniversity.in/facilities",
    category: "sports",
    content: `Aditya University campus features extensive sports complexes including full-size cricket grounds, football turf, basketball courts, badminton courts, volleyball courts, and modern indoor gymnasiums with strength and cardio fitness training equipment. Students actively participate in university tournaments, South Zone inter-university competitions, and athletic meets with dedicated coaching and sports scholarship programs.`
  },
  {
    id: "doc-contact",
    title: "Official Contact Information & Campus Coordinates",
    url: "https://www.adityauniversity.in/contact-us",
    category: "contact",
    content: `Aditya University contact coordinates: Address: Aditya Nagar, ADB Road, Surampalem, Kakinada District, Andhra Pradesh, India – 533437. Phone: +91 9989 776661. Email: info@adityauniversity.in. General office working hours: 09:00 AM to 06:00 PM, Monday through Saturday. Official web portal for inquiries and admissions: https://www.adityauniversity.in/contact-us.`
  },
  {
    id: "doc-admissions",
    title: "Admissions Eligibility & Scholarships",
    url: "https://www.adityauniversity.in/admissions",
    category: "admissions",
    content: `Admissions to B.Tech, BCA, MCA, MBA, B.Pharm, and Pharm.D are open based on national and state entrance tests including AP EAPCET, JEE Main, AUET (Aditya University Entrance Test), and merit in 10+2 / Intermediate exams. Merit scholarships up to 100% tuition fee waiver are awarded to top rankers, sports achievers, and economically deserving students. Online application portal: https://www.adityauniversity.in/admissions.`
  }
];

export interface TextChunk {
  id: string;
  title: string;
  source: string;
  category: string;
  content: string;
}

export function generateChunks(): TextChunk[] {
  const chunks: TextChunk[] = [];
  SEED_DATA.forEach((doc, docIdx) => {
    // split into clean paragraphs
    const paragraphs = doc.content.split("\n\n").map(p => p.trim()).filter(Boolean);
    paragraphs.forEach((p, pIdx) => {
      chunks.push({
        id: `${doc.id}-chunk-${pIdx + 1}`,
        title: doc.title,
        source: doc.url,
        category: doc.category,
        content: p
      });
    });
  });
  return chunks;
}
