import React from 'react';
import {
  MessageSquare,
  GraduationCap,
  Compass,
  Users,
  BarChart3,
  Database,
  Code,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ShieldCheck,
  Radio
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  showWidget: boolean;
  onToggleWidget: () => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  showWidget,
  onToggleWidget,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare, badge: 'Grounded' },
    { id: 'programs', label: 'Academic Programs', icon: GraduationCap, badge: '14+ Tracks' },
    { id: 'explorer', label: 'Campus Explorer', icon: Compass },
    { id: 'leadership', label: 'Leadership & Directory', icon: Users },
    { id: 'analytics', label: 'Campus Insights', icon: BarChart3, badge: 'Live' },
    { id: 'knowledge', label: 'Knowledge Centre (RAG)', icon: Database },
    { id: 'api', label: 'Developer REST API', icon: Code },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-100 flex flex-col h-full border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-500/20 border border-amber-400/30">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
              ADITYA UNIVERSITY
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <span>Campus AI</span>
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
              <span className="text-slate-400 font-normal">NAAC A++</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Embed Widget Simulation Toggle */}
        <div className="pt-4 px-1">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Embed Widget</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${showWidget ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            </div>
            <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed">
              Toggle the floating widget to preview how it looks on the official website.
            </p>
            <button
              id="toggle-floating-widget-btn"
              onClick={onToggleWidget}
              className={`w-full py-1.5 px-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                showWidget
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showWidget ? 'Hide Embed Widget' : 'Test Embed Widget'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Campus Helpdesk Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40 space-y-2">
        <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Campus Helpdesk</span>
        </div>
        <div className="flex items-start gap-2 text-[11px] leading-tight text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>Surampalem, Kakinada District, AP – 533437</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <a href="tel:+919989776661" className="text-amber-400 hover:underline">
            +91 9989 776661
          </a>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <a href="mailto:info@adityauniversity.in" className="hover:text-slate-200 truncate">
            info@adityauniversity.in
          </a>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>09:00 AM – 06:00 PM (Mon-Sat)</span>
        </div>
      </div>
    </aside>
  );
};
