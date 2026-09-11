import { CampusLocation } from '../types';

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: "loc-library",
    name: "Knowledge Resource Centre (Central Library)",
    category: "Academic Infrastructure",
    landmark: "Academic Block A, Ground & First Floors",
    coordinates: { lat: 17.0898, lng: 82.0674 },
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=17.0898,82.0674",
    hours: "08:00 AM – 10:00 PM (Monday – Saturday)",
    description: "Multi-storey digital library housing 100,000+ volumes, IEEE/Springer digital terminals, quiet study carrels, and discussion pods."
  },
  {
    id: "loc-healthcare",
    name: "24/7 University Health Care Centre",
    category: "Healthcare & Emergency",
    landmark: "Adjacent to Student Amenity Block & Ambulance Bay",
    coordinates: { lat: 17.0905, lng: 82.0669 },
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=17.0905,82.0669",
    hours: "24 Hours / 7 Days a Week (Emergency Phone: +91 9989 776661)",
    description: "On-campus health center staffed with medical officers, nursing staff, emergency observation beds, and two on-site ambulances."
  },
  {
    id: "loc-cdc",
    name: "Career Development Centre (CDC)",
    category: "Career & Placements",
    landmark: "Ramanujan Innovation Block, 2nd Floor",
    coordinates: { lat: 17.0912, lng: 82.0681 },
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=17.0912,82.0681",
    hours: "09:00 AM – 06:00 PM",
    description: "Hub for corporate campus interviews, coding bootcamps, resume review clinics, and international language training (Japanese, German, French)."
  },
  {
    id: "loc-hostels",
    name: "Residential Hostels (Boys & Girls Blocks)",
    category: "Accommodation",
    landmark: "North-East Residential Campus Zone",
    coordinates: { lat: 17.0885, lng: 82.0660 },
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=17.0885,82.0660",
    hours: "Resident Access 24/7 (Biometric Curfew: 09:00 PM)",
    description: "Air-conditioned and non-AC student rooms with biometric security, dedicated wardens, RO water plants, and multi-cuisine dining halls."
  },
  {
    id: "loc-sports",
    name: "Aditya Sports Complex & Athletic Grounds",
    category: "Sports & Fitness",
    landmark: "South Campus Sports Arena",
    coordinates: { lat: 17.0920, lng: 82.0690 },
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=17.0920,82.0690",
    hours: "05:30 AM – 08:30 AM & 04:30 PM – 08:00 PM",
    description: "Full-size cricket turf ground, floodlit basketball and volleyball courts, 400m athletic track, and air-conditioned gymnasiums."
  },
  {
    id: "loc-foodcourt",
    name: "Central Multi-Cuisine Food Court",
    category: "Dining & Amenities",
    landmark: "Central Campus Square, Opposite Knowledge Centre",
    coordinates: { lat: 17.0895, lng: 82.0678 },
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=17.0895,82.0678",
    hours: "07:30 AM – 09:30 PM Daily",
    description: "Hygienic vegetarian and non-vegetarian food courts, quick service cafes, fresh juice bars, and national banking ATMs."
  },
  {
    id: "loc-transport",
    name: "Central Transportation Fleet & Boarding Bays",
    category: "Transportation",
    landmark: "Main Campus Entrance, Transport Gate 2",
    coordinates: { lat: 17.0880, lng: 82.0655 },
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=17.0880,82.0655",
    hours: "06:30 AM – 07:30 PM",
    description: "Starting terminal for 400+ modern GPS-tracked buses connecting Kakinada, Rajahmundry, Mandapeta, Samalkot, and Tuni."
  },
  {
    id: "loc-admin",
    name: "Administrative Building & Admissions Office",
    category: "Administration & Admissions",
    landmark: "Main University Gate, Surampalem",
    coordinates: { lat: 17.0875, lng: 82.0650 },
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=17.0875,82.0650",
    hours: "09:00 AM – 05:30 PM (Mon – Sat)",
    description: "Offices of the Chancellor, Vice Chancellor, Registrar, Dean of Admissions, and Student Verification Helpdesk."
  }
];
