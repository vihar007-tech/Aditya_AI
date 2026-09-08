import { CampusFacility, LeaderProfile, AnalyticsMetrics } from '../types';

export const CAMPUS_FACILITIES: CampusFacility[] = [
  {
    id: "fac-academic",
    icon: "GraduationCap",
    title: "Smart Academic Complexes",
    category: "Academics",
    desc: "Sprawling air-conditioned lecture theaters with interactive touch displays, high-definition audio-visual gear, and collaborative project rooms.",
    stats: "250+ Smart Classrooms",
    features: ["Acoustic dampening", "Lecture recording systems", "High-speed Wi-Fi access", "Wheelchair accessible"],
    url: "https://www.adityauniversity.in/facilities"
  },
  {
    id: "fac-library",
    icon: "BookOpen",
    title: "Central Library & Knowledge Centre",
    category: "Learning Resources",
    desc: "Central Knowledge Resource Centre with tens of thousands of volumes, global subscriptions to IEEE, Springer, ACM, and quiet research cubicles.",
    stats: "120,000+ Print & Digital Volumes",
    features: ["Digital Delnet & IEEE e-access", "24/7 exam-time study halls", "Plagiarism check portal", "Discussion chambers"],
    url: "https://www.adityauniversity.in/facilities"
  },
  {
    id: "fac-hostels",
    icon: "Bed",
    title: "Hostels & Dining Halls",
    category: "Residential",
    desc: "Separate high-security residential complexes for boys and girls with AC and non-AC rooms, attached bathrooms, biometric turnstiles, and CCTV surveillance.",
    stats: "8,000+ Resident Capacity",
    features: ["Biometric turnstiles", "Multi-cuisine vegetarian & non-veg messes", "Solar hot water 24/7", "Laundry facilities on-site"],
    url: "https://www.adityauniversity.in/facilities"
  },
  {
    id: "fac-transport",
    icon: "Bus",
    title: "Massive Transportation Fleet",
    category: "Transit",
    desc: "One of the largest dedicated university transport fleets in South India, operating over 400 modern buses covering Kakinada, Rajahmundry, Mandapeta, Samalkot, Tuni, and nearby towns.",
    stats: "400+ GPS-Tracked Buses",
    features: ["Live GPS tracking app", "Speed governors & CCTV", "Dedicated female student transit escorts", "Punctual scheduled stops"],
    url: "https://www.adityauniversity.in/facilities"
  },
  {
    id: "fac-health",
    icon: "HeartPulse",
    title: "24/7 Health Care Centre & Ambulances",
    category: "Health & Safety",
    desc: "Fully equipped on-campus medical clinic staffed with resident doctors, registered nurses, observation beds, and round-the-clock emergency ambulances.",
    stats: "24/7 Medical Care",
    features: ["Free primary healthcare & medication", "2 On-campus ALS Ambulances", "Tie-ups with tertiary hospitals in Kakinada", "Emergency oxygen & trauma triage"],
    url: "https://www.adityauniversity.in/facilities"
  },
  {
    id: "fac-placements",
    icon: "Briefcase",
    title: "Career Development Centre (CDC)",
    category: "Placements",
    desc: "High-octane career acceleration center running competitive coding bootcamps, technical mock interviews, resume reviews, and foreign language certifications (Japanese, German, French).",
    stats: "3,500+ Annual Placement Offers",
    features: ["Amazon, Google Cloud, Microsoft tie-ups", "Highest package 30+ LPA", "Coding sandbox training", "International language labs"],
    url: "https://www.adityauniversity.in/facilities"
  },
  {
    id: "fac-sports",
    icon: "Trophy",
    title: "Sports & Fitness Arenas",
    category: "Recreation",
    desc: "Expansive outdoor athletic grounds featuring turf cricket pitches, floodlit basketball and volleyball courts, 400m running tracks, and air-conditioned gymnasiums.",
    stats: "25+ Acres of Sports Fields",
    features: ["BCCI-standard cricket ground", "Wooden badminton courts", "Certified fitness trainers", "Inter-university sports meets"],
    url: "https://www.adityauniversity.in/facilities"
  },
  {
    id: "fac-innovation",
    icon: "Lightbulb",
    title: "Innovation & Incubation Hub",
    category: "Entrepreneurship",
    desc: "T-Hub affiliated startup launchpad and prototyping center offering seed grants, intellectual property filing aid, maker labs, and mentoring from seasoned founders.",
    stats: "65+ Student Startups Incubated",
    features: ["Fab Lab with 3D printers & laser cutters", "Legal IP & patent filing cell", "Investor pitch days", "Industry mentorship network"],
    url: "https://www.adityauniversity.in/about-us/overview"
  }
];

export const LEADERSHIP_PROFILES: LeaderProfile[] = [
  {
    id: "chancellor",
    name: "Dr. N. Sesha Reddy",
    role: "Chancellor",
    desc: "Visionary educationist, philanthropist, and founder who established Aditya Educational Institutions in coastal Andhra Pradesh, expanding it from a modest beginning to a world-class academic hub educating over 60,000 students.",
    vision: "To democratize world-standard technical and professional education, empowering rural and urban youth with industry-ready capabilities and ethical values.",
    url: "https://www.adityauniversity.in/about-us/leadership"
  },
  {
    id: "vice-chairman",
    name: "Sri N. Satish Reddy",
    role: "Vice-Chairman & Pro-Chancellor",
    desc: "Dynamic leader driving technological modernization, strategic partnerships with global tech giants like Microsoft, Google Cloud, and SAP, state-of-the-art campus infrastructure, and global academic MoUs.",
    vision: "Transforming Aditya University into a benchmark center for artificial intelligence, cloud computing, advanced materials, and experiential engineering learning.",
    url: "https://www.adityauniversity.in/about-us/leadership"
  },
  {
    id: "secretary",
    name: "Sri N. Deepak Reddy",
    role: "Secretary & Pro-Chancellor",
    desc: "Passionate champion of student innovation, competitive sports, international student exchange programs, and holistic operational excellence across Aditya's campuses.",
    vision: "Fostering vibrant student life where technical competence harmoniously blends with sportsmanship, artistic expression, and global cultural awareness.",
    url: "https://www.adityauniversity.in/about-us/leadership"
  },
  {
    id: "vice-chancellor",
    name: "Office of the Vice Chancellor",
    role: "Vice Chancellor",
    desc: "Chief Executive and Academic Officer steering curriculum revision, research excellence, NAAC A++ accreditation sustainment, NBA compliance, and doctoral studies.",
    vision: "Propelling research productivity, interdisciplinary academic degrees, and outcome-based engineering education to global ranking standards.",
    url: "https://www.adityauniversity.in/about-us/leadership"
  },
  {
    id: "registrar",
    name: "Office of the Registrar",
    role: "Registrar",
    desc: "Administrative custodian of statutory compliance, university records, student admissions governance, degree examinations, and academic councils.",
    vision: "Ensuring transparent, student-friendly digital governance and rapid institutional administrative services.",
    url: "https://www.adityauniversity.in/about-us/leadership"
  }
];

export const INITIAL_ANALYTICS: AnalyticsMetrics = {
  total_queries: 148,
  grounding_rate: "98.8%",
  satisfaction_rate: 96.5,
  top_categories: [
    { category: "Transport & Buses", count: 42 },
    { category: "Hostels & Food", count: 35 },
    { category: "Engineering Programs", count: 28 },
    { category: "CDC & Placements", count: 22 },
    { category: "Leadership & Admin", count: 14 },
    { category: "Healthcare & Clinic", count: 7 }
  ],
  top_personas: [
    { persona: "Student", count: 74 },
    { persona: "Parent", count: 41 },
    { persona: "Prospective Student", count: 22 },
    { persona: "Visitor", count: 8 },
    { persona: "Faculty/Staff", count: 3 }
  ],
  campus_insights: [
    "Transport and bus route inquiries peak between 7:30 AM – 9:00 AM, with maximum lookups for Rajahmundry and Kakinada routes.",
    "Parents most frequently inquire about hostel biometric security, food court hygiene, and round-the-clock ambulance accessibility.",
    "Academic program inquiries surged for B.Tech CSE (Google Cloud & SAP tracks) and AI & ML with Microsoft collaboration.",
    "Telugu and Hindi queries account for over 38% of prospective student inquiries, validating multilingual accessibility.",
    "Career Development Centre (CDC) queries focus strongly on Amazon, TCS, Infosys, and foreign language certification offerings."
  ]
};

export const QUICK_QUERIES = [
  {
    label: "🏛️ Leadership",
    query: "Who is the Chancellor and Vice Chancellor of Aditya University?",
    category: "leadership"
  },
  {
    label: "🛏️ Hostels & Food",
    query: "What hostel amenities, AC options, and dining facilities exist on campus?",
    category: "hostel"
  },
  {
    label: "🚌 Transport Fleet",
    query: "Tell me about the 400+ bus transportation fleet and routes covering Kakinada and Rajahmundry.",
    category: "transport"
  },
  {
    label: "🏥 24/7 Healthcare",
    query: "What emergency medical clinic and ambulance services are available on campus?",
    category: "healthcare"
  },
  {
    label: "💼 CDC Placements",
    query: "What is the Career Development Centre (CDC) and which top recruiters visit Aditya?",
    category: "placements"
  },
  {
    label: "🎓 Industry B.Tech",
    query: "Which B.Tech programs have direct tie-ups with Microsoft, Google Cloud, and SAP?",
    category: "academics"
  }
];
