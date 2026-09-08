import React, { useState } from 'react';
import {
  Users,
  Search,
  ExternalLink,
  MessageSquare,
  Award,
  Sparkles,
  Quote
} from 'lucide-react';
import { LEADERSHIP_PROFILES } from '../data/campusInfo';

interface LeadershipViewProps {
  onAskAboutLeader: (query: string) => void;
}

export const LeadershipView: React.FC<LeadershipViewProps> = ({ onAskAboutLeader }) => {
  const [search, setSearch] = useState('');

  const filtered = LEADERSHIP_PROFILES.filter(l => {
    const q = search.toLowerCase();
    return l.name.toLowerCase().includes(q) || l.role.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q);
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 space-y-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 md:p-8 text-white shadow-md border-l-4 border-amber-500">
          <div className="space-y-2">
            <span className="inline-block bg-amber-500/20 text-amber-300 font-bold text-xs uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-amber-500/30">
              Governance & Visionaries
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Aditya University Leadership Directory
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Meet the founders, chancellors, and chief executive officers steering Aditya University’s academic excellence, NAAC A++ accreditation, and international industrial collaborations.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, role (Chancellor, Pro-Chancellor, Vice Chancellor, Registrar)..."
            className="w-full text-xs text-slate-800 bg-transparent focus:outline-none"
          />
        </div>

        {/* Leaders Grid */}
        <div className="space-y-4">
          {filtered.map(leader => (
            <div
              key={leader.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0 border border-amber-400/40">
                    {leader.name.charAt(0) === 'O' ? 'AU' : leader.name.split(' ').pop()?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {leader.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        <Award className="w-3 h-3 text-amber-700" />
                        {leader.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button
                    onClick={() => onAskAboutLeader(`Tell me about ${leader.name} (${leader.role}) and their contributions to Aditya University.`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask AI</span>
                  </button>

                  <a
                    href={leader.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Biography */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {leader.desc}
              </p>

              {/* Vision quote */}
              <div className="bg-slate-50 border-l-2 border-amber-500 p-3 rounded-r-lg text-xs text-slate-700 italic flex items-start gap-2">
                <Quote className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>"{leader.vision}"</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
