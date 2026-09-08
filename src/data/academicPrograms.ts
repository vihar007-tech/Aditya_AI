import { AcademicSchool } from '../types';

export const ACADEMIC_CATALOG: { schools: AcademicSchool[] } = {
  schools: [
    {
      name: "School of Engineering",
      description: "Cutting-edge B.Tech specializations featuring industry-aligned curricula, cloud computing labs, and international certifications.",
      departments: [
        {
          degree: "B.Tech",
          name: "Artificial Intelligence & Machine Learning (AI & ML)",
          collaborations: ["Standard Track", "In association with Microsoft", "In association with Google Cloud"],
          duration: "4 Years",
          description: "Specialized curriculum focusing on deep learning, neural networks, natural language processing, computer vision, and cloud-native AI deployments with certified Google Cloud and Microsoft tracks.",
          highlights: [
            "Dedicated AI & Deep Learning Hardware Labs with GPU clusters",
            "Google Cloud Professional Machine Learning Engineer track",
            "Microsoft Certified: Azure AI Fundamentals integration",
            "Industry capstone projects with healthcare and fintech data"
          ],
          intake: "180 Seats"
        },
        {
          degree: "B.Tech",
          name: "Computer Science and Engineering (CSE)",
          collaborations: ["Standard Track", "In association with Google Cloud", "In association with SAP"],
          duration: "4 Years",
          description: "Core computer science principles, enterprise computing, distributed systems, algorithms, and full-stack software architecture with enterprise SAP integration.",
          highlights: [
            "Co-branded Google Cloud Center of Excellence on campus",
            "Official SAP Next-Gen Lab training for enterprise ERP",
            "Coding bootcamps in Go, Rust, Python, and TypeScript",
            "Global hackathons and competitive programming mentorship"
          ],
          intake: "360 Seats"
        },
        {
          degree: "B.Tech",
          name: "Computer Science and Engineering (Data Science)",
          collaborations: ["Standard Track", "In association with Google Cloud"],
          duration: "4 Years",
          description: "Big data analytics, data engineering pipelines, statistical modeling, data visualization, and predictive machine learning infrastructure.",
          highlights: [
            "Google BigQuery and Vertex AI hands-on labs",
            "End-to-end data pipeline construction on Apache Spark & Hadoop",
            "Quantitative modeling for finance, logistics, and retail",
            "Internship pipelines with top data analytics consulting firms"
          ],
          intake: "120 Seats"
        },
        {
          degree: "B.Tech",
          name: "Agricultural Engineering",
          collaborations: ["Standard Track"],
          duration: "4 Years",
          description: "Smart precision farming, farm machinery automation, drone surveillance for crops, soil and water conservation engineering, and post-harvest technology.",
          highlights: [
            "10-acre experimental farm station in Surampalem",
            "Agricultural drone piloting and multispectral imagery",
            "Micro-irrigation and sensor-driven fertigation systems",
            "Agri-tech entrepreneurship incubator with T-Hub support"
          ],
          intake: "60 Seats"
        },
        {
          degree: "B.Tech",
          name: "Civil Engineering",
          collaborations: ["Standard Track"],
          duration: "4 Years",
          description: "Structural engineering, BIM (Building Information Modeling), GIS/remote sensing, environmental design, earthquake-resistant design, and smart city infrastructure.",
          highlights: [
            "Advanced NDT (Non-Destructive Testing) concrete laboratory",
            "AutoCAD, Revit, STAAD.Pro, and GIS software suites",
            "Green building design and sustainability certifications",
            "Field survey training using Total Stations and GPS"
          ],
          intake: "90 Seats"
        },
        {
          degree: "B.Tech",
          name: "Electrical and Electronics Engineering (EEE)",
          collaborations: ["Standard Track"],
          duration: "4 Years",
          description: "Renewable energy microgrids, electric vehicle (EV) powertrain technology, power electronics, industrial automation, and smart grid embedded control systems.",
          highlights: [
            "Electric Vehicle Prototyping & Battery Testing Center",
            "Solar microgrid installations powering campus buildings",
            "PLC, SCADA, and IoT industrial automation workbench",
            "Collaborations with state power corporations & EV manufacturers"
          ],
          intake: "90 Seats"
        },
        {
          degree: "B.Tech",
          name: "Electronics and Communication Engineering (ECE)",
          collaborations: ["Standard Track"],
          duration: "4 Years",
          description: "VLSI chip design, embedded systems, 5G wireless communications, RF systems, robotics, and IoT hardware prototyping.",
          highlights: [
            "Cadence and Synopsys EDA tools for silicon chip design",
            "5G antenna and microwave test benches",
            "Embedded ARM and RISC-V development boards",
            "Robotics fabrication center with 3D printing and PCB milling"
          ],
          intake: "240 Seats"
        },
        {
          degree: "B.Tech",
          name: "Mechanical Engineering",
          collaborations: ["Standard Track"],
          duration: "4 Years",
          description: "Robotics automation, additive manufacturing (3D printing), thermal power systems, automotive engineering, and modern CAD/CAM/CAE design.",
          highlights: [
            "Industrial 6-axis robotic arms and automated CNC milling",
            "CATIA, SolidWorks, and ANSYS simulation suites",
            "SAE BAJA and Formula Student racing car workshop",
            "Advanced Materials testing and metallurgy laboratory"
          ],
          intake: "120 Seats"
        },
        {
          degree: "B.Tech",
          name: "Mining Engineering",
          collaborations: ["Standard Track"],
          duration: "4 Years",
          description: "Surface and subsurface mineral extraction, geo-mechanics, mine ventilation, safety technology, mineral processing, and environmental reclamation.",
          highlights: [
            "Virtual Reality (VR) underground mine simulation simulator",
            "Rock mechanics and core sampling analytical facility",
            "MoUs with Singareni Collieries and NMDC for on-site training",
            "Mine safety and explosive engineering certified courses"
          ],
          intake: "30 Seats"
        },
        {
          degree: "B.Tech",
          name: "Petroleum Technology",
          collaborations: ["Standard Track"],
          duration: "4 Years",
          description: "Drilling technology, reservoir modeling, refinery operations, natural gas processing, and offshore engineering strategically aligned with the KG-Basin industry corridor.",
          highlights: [
            "Direct proximity to ONGC and Reliance KG-D6 Eastern Offshore basin",
            "Drilling fluid and reservoir mud analysis testing laboratory",
            "Petrel and Eclipse reservoir simulation software",
            "Guest masterclasses by active ONGC and GAIL petroleum engineers"
          ],
          intake: "60 Seats"
        }
      ]
    },
    {
      name: "School of Computing",
      description: "Professional degree programs preparing software engineers, full-stack application architects, and IT consultants.",
      departments: [
        {
          degree: "BCA",
          name: "Bachelor of Computer Applications",
          collaborations: ["Standard Track", "Cloud & Web Tech Track"],
          duration: "3 Years",
          description: "Undergraduate curriculum covering modern software development, web engineering, cloud applications, mobile app development, and database administration.",
          highlights: [
            "Full-stack web development with React, Node.js, and Cloud Databases",
            "Mobile app design in Flutter & Kotlin",
            "Direct placement assistance with tech service giants"
          ],
          intake: "120 Seats"
        },
        {
          degree: "MCA",
          name: "Master of Computer Applications",
          collaborations: ["Standard Track", "AI & Cloud Architecture Track"],
          duration: "2 Years",
          description: "Advanced computing degree covering enterprise systems, cloud architecture, cybersecurity, machine learning, and devops methodologies.",
          highlights: [
            "Enterprise system design and microservices",
            "Cybersecurity testing and ethical hacking",
            "Industry internship semester with placement guarantee"
          ],
          intake: "120 Seats"
        }
      ]
    },
    {
      name: "School of Business",
      description: "Leadership, managerial, and entrepreneurial education fostering forward-thinking business executives.",
      departments: [
        {
          degree: "BBA",
          name: "Bachelor of Business Administration",
          collaborations: ["Digital Marketing", "Financial Technology (FinTech)", "Business Analytics"],
          duration: "3 Years",
          description: "Foundational business administration with specializations in digital marketing, corporate finance, logistics, and human resource management.",
          highlights: [
            "Live stock trading simulation terminal",
            "Corporate mentoring sessions and CEO talk series",
            "Case study pedagogy modeled after top global business schools"
          ],
          intake: "120 Seats"
        },
        {
          degree: "MBA",
          name: "Master of Business Administration",
          collaborations: ["Dual Specialization: Finance, Marketing, HR, Business Analytics"],
          duration: "2 Years",
          description: "Flagship postgraduate management program emphasizing strategic leadership, executive decision-making, global supply chains, and quantitative analytics.",
          highlights: [
            "Dual specializations tailored for corporate leadership",
            "Summer internship with multinational corporations",
            "Incubation grants for student startup ventures"
          ],
          intake: "180 Seats"
        }
      ]
    },
    {
      name: "School of Pharmacy",
      description: "PCI (Pharmacy Council of India) approved pharmaceutical sciences and clinical pharmacy education.",
      departments: [
        {
          degree: "B.Pharm",
          name: "Bachelor of Pharmacy",
          collaborations: ["Standard Track"],
          duration: "4 Years",
          description: "Comprehensive pharmaceutical chemistry, pharmacology, pharmaceutics, drug formulation, regulatory affairs, and clinical trial methodologies.",
          highlights: [
            "Pilot drug manufacturing and tableting formulation lab",
            "Animal house certified for pharmacological screening",
            "Tie-ups with leading pharma manufacturers in Visakhapatnam & Hyderabad"
          ],
          intake: "100 Seats"
        },
        {
          degree: "Pharm.D",
          name: "Doctor of Pharmacy",
          collaborations: ["Clinical Hospital Residency Track"],
          duration: "6 Years",
          description: "Post-graduate professional doctorate in clinical pharmacy, pharmacotherapy, hospital patient rounds, therapeutic drug monitoring, and adverse reaction surveillance.",
          highlights: [
            "Clinical rotations at tertiary multispeciality partner hospitals",
            "Direct patient interaction alongside attending physicians",
            "Eligibility for clinical pharmacist roles globally"
          ],
          intake: "30 Seats"
        }
      ]
    }
  ]
};
