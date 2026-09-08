import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Bed,
  Bus,
  HeartPulse,
  Briefcase,
  Trophy,
  Lightbulb,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  MapPin,
  Sparkles
} from 'lucide-react';
import { CAMPUS_FACILITIES } from '../data/campusInfo';

interface CampusExplorerViewProps {
  onAskAboutFacility: (query: string) => void;
}

export const CampusExplorerView: React.FC<CampusExplorerViewProps> = ({ onAskAboutFacility }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Academics',
    'Learning Resources',
    'Residential',
    'Transit',
    'Health & Safety',
    'Placements',
    'Recreation',
    'Entrepreneurship'
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-amber-600" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'Bed': return <Bed className="w-5 h-5 text-indigo-600" />;
      case 'Bus': return <Bus className="w-5 h-5 text-amber-600" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-emerald-600" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-amber-600" />;
      case 'Lightbulb': return <Lightbulb className="w-5 h-5 text-violet-600" />;
      default: return <Sparkles className="w-5 h-5 text-amber-600" />;
    }
  };

  const filteredFacilities = selectedCategory === 'All'
    ? CAMPUS_FACILITIES
    : CAMPUS_FACILITIES.filter(f => f.category === selectedCategory);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden border-l-4 border-amber-500">
          <div className="relative z-10 space-y-2">
            <span className="inline-block bg-amber-500/20 text-amber-300 font-bold text-xs uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-amber-500/30">
              Campus Infrastructure & Life
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Aditya Campus Explorer
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Explore the 180-acre smart campus in Surampalem (Kakinada District, AP). From high-tech computing laboratories and residential suites to our 400+ bus transportation fleet and round-the-clock emergency medical clinics.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Aditya Nagar, ADB Road, Surampalem</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>180+ Acres Lush Green Grounds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>24/7 Security & CCTV Shield</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto pb-3 md:pb-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredFacilities.map(fac => (
            <div
              key={fac.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      {getIcon(fac.icon)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {fac.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                        {fac.category}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                    {fac.stats}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {fac.desc}
                </p>

                {/* Feature Pills */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Amenities & Specifications:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {fac.features.map((feat, fIdx) => (
                      <div key={fIdx} className="text-[11px] text-slate-600 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onAskAboutFacility(`Tell me details about ${fac.title} and student guidelines at Aditya University.`)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant</span>
                </button>

                <a
                  href={fac.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span>Official Details</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
