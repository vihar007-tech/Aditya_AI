import React from 'react';
import { Menu, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onOpenMobile: () => void;
  onGoToTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onOpenMobile, onGoToTab }) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'chat':
        return 'Aditya Campus AI Assistant';
      case 'programs':
        return 'Academic Programs Directory';
      case 'explorer':
        return 'Aditya Campus Explorer';
      case 'leadership':
        return 'Leadership & Governance Directory';
      case 'analytics':
        return 'Campus Insights & Analytics';
      case 'knowledge':
        return 'Knowledge Centre (RAG Admin)';
      case 'api':
        return 'Developer REST API Specification';
      default:
        return 'Aditya Campus AI';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle-btn"
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-slate-800 text-base md:text-lg leading-tight">
            {getTabTitle()}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-amber-700 font-semibold">Surampalem Campus</span>
            <span>•</span>
            <span className="hidden sm:inline">Kakinada District, AP</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Grounding Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Official RAG Grounded</span>
        </div>

        {/* Gemini Badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Gemini 3.8 Flash</span>
        </div>

        {/* Quick Admissions Link */}
        <a
          href="https://www.adityauniversity.in/admissions"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
        >
          <span>Admissions 2026</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </header>
  );
};
