import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  BookOpen,
  Building2,
  Clock,
  Users
} from 'lucide-react';
import { ACADEMIC_CATALOG } from '../data/academicPrograms';

export const AcademicProgramsView: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<string>('All');
  const [selectedPartner, setSelectedPartner] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const schools = ['All', ...ACADEMIC_CATALOG.schools.map(s => s.name)];
  const partners = ['All', 'Google Cloud', 'Microsoft', 'SAP'];

  const filteredPrograms = useMemo(() => {
    let list: { schoolName: string; dept: typeof ACADEMIC_CATALOG.schools[0]['departments'][0] }[] = [];

    ACADEMIC_CATALOG.schools.forEach(school => {
      if (selectedSchool === 'All' || selectedSchool === school.name) {
        school.departments.forEach(dept => {
          // Check partner filter
          let matchesPartner = true;
          if (selectedPartner !== 'All') {
            matchesPartner = dept.collaborations.some(c =>
              c.toLowerCase().includes(selectedPartner.toLowerCase())
            );
          }

          // Check search query
          let matchesSearch = true;
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const fullText = (dept.name + ' ' + dept.degree + ' ' + dept.description + ' ' + (dept.highlights || []).join(' ')).toLowerCase();
            matchesSearch = fullText.includes(q);
          }

          if (matchesPartner && matchesSearch) {
            list.push({ schoolName: school.name, dept });
          }
        });
      }
    });

    return list;
  }, [selectedSchool, selectedPartner, searchQuery]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-block bg-white/20 text-white font-bold text-xs uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              Academic Catalog & Degrees
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Academic Programs & Industry Specializations
            </h1>
            <p className="text-amber-100 text-sm max-w-3xl leading-relaxed">
              Explore undergraduate and postgraduate degrees across Engineering, Computing, Management, and Pharmaceutical Sciences, featuring co-branded curricula with Google Cloud, Microsoft, and SAP.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-white/90">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>NAAC A++ Accredited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>PCI & AICTE Recognized</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Merit Scholarships Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="program-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search branches (e.g. AI, Petroleum, MCA)..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* School Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">School:</span>
              <select
                id="school-filter-select"
                value={selectedSchool}
                onChange={e => setSelectedSchool(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {schools.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Partner Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Industry Partner:</span>
              <select
                id="partner-filter-select"
                value={selectedPartner}
                onChange={e => setSelectedPartner(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {partners.map(p => (
                  <option key={p} value={p}>{p === 'All' ? 'All Partners' : p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Showing <strong>{filteredPrograms.length}</strong> academic programs</span>
            {(searchQuery || selectedSchool !== 'All' || selectedPartner !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSchool('All');
                  setSelectedPartner('All');
                }}
                className="text-amber-600 hover:text-amber-800 font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPrograms.map(({ schoolName, dept }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* School tag & degree badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    {schoolName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded">
                      {dept.degree}
                    </span>
                    <span className="text-slate-600 text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {dept.duration}
                    </span>
                  </div>
                </div>

                {/* Program Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {dept.name}
                </h3>

                {/* Industry Collaborations */}
                <div className="flex flex-wrap gap-1.5">
                  {dept.collaborations.map((collab, cIdx) => {
                    const isGoogle = collab.includes('Google');
                    const isMS = collab.includes('Microsoft');
                    const isSAP = collab.includes('SAP');
                    return (
                      <span
                        key={cIdx}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isGoogle
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : isMS
                            ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                            : isSAP
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {(isGoogle || isMS || isSAP) && <Sparkles className="w-2.5 h-2.5" />}
                        {collab}
                      </span>
                    );
                  })}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {dept.description}
                </p>

                {/* Highlights */}
                {dept.highlights && dept.highlights.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Key Program Features:
                    </div>
                    <ul className="space-y-1">
                      {dept.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer with Intake & Apply button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Intake: <strong>{dept.intake || 'Available'}</strong>
                </span>

                <a
                  href="https://www.adityauniversity.in/admissions"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Admissions CTA footer */}
        <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-amber-400">
              Need assistance with Admissions & Eligibility?
            </h3>
            <p className="text-xs text-slate-300">
              Speak with the Aditya University Admissions Cell or call the Surampalem Campus Helpdesk directly.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+919989776661"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              📞 +91 9989 776661
            </a>
            <a
              href="https://www.adityauniversity.in/admissions"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>AUET Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
