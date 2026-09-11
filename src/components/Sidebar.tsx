import React from 'react';
import {
  MessageSquare,
  GraduationCap,
  Compass,
  Calendar,
  Calculator,
  FileText,
  UserCheck,
  Shield,
  LayoutDashboard,
  Users,
  BarChart3,
  Database,
  Code,
  Sparkles,
  ArrowRightLeft,
  Radio,
  ExternalLink
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onToggleRole: (newRole: UserRole) => void;
  showWidget: boolean;
  onToggleWidget: () => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onToggleRole,
  showWidget,
  onToggleWidget,
  onCloseMobile
}) => {
  // User Mode Navigation Items (Section 5)
  const userNavItems = [
    { id: 'chat', label: 'AI Campus Assistant', icon: MessageSquare, badge: 'Grounded' },
    { id: 'programs', label: 'Academic Programs', icon: GraduationCap, badge: '14+ Tracks' },
    { id: 'explorer', label: 'Campus Explorer', icon: Compass }
  ];

  const studentToolkitItems = [
    { id: 'planner', label: 'Smart Study Planner', icon: Calendar, badge: 'Dynamic' },
    { id: 'attendance', label: 'Attendance Analyzer', icon: Calculator, badge: 'Safe Absences' },
    { id: 'resume', label: 'AI Resume Analyzer', icon: FileText, badge: 'ATS Match' },
    { id: 'interview', label: 'AI Interview Coach', icon: UserCheck, badge: 'Vocal/STAR' }
  ];

  // Admin Mode Navigation Items (Section 28)
  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard, badge: 'Health' },
    { id: 'leadership', label: 'Leadership & Directory', icon: Users },
    { id: 'analytics', label: 'Campus Insights', icon: BarChart3, badge: 'Telemetry' },
    { id: 'knowledge', label: 'Knowledge Centre (RAG)', icon: Database, badge: '38 Chunks' },
    { id: 'api', label: 'Developer REST API', icon: Code }
  ];

  return (
    <aside className={`w-72 flex flex-col h-full select-none transition-colors border-r ${
      userRole === 'admin'
        ? 'bg-slate-950 text-slate-100 border-slate-800'
        : 'bg-slate-900 text-slate-100 border-slate-800'
    }`}>
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-500/20 border border-amber-400/30">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
              ADITYA UNIVERSITY
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <span>{userRole === 'admin' ? 'Admin Console' : 'Campus AI'}</span>
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
              <span className="text-slate-400 font-normal">NAAC A++</span>
            </div>
          </div>
        </div>

        {/* Current Active Mode Badge */}
        <div className="mt-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${userRole === 'admin' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="font-semibold text-slate-200">
              {userRole === 'admin' ? 'Administrator Role' : 'Student & Visitor Mode'}
            </span>
          </div>

          <button
            onClick={() => onToggleRole(userRole === 'admin' ? 'user' : 'admin')}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
            title="Switch between User Experience and Admin Console"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Switch</span>
          </button>
        </div>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {userRole === 'user' ? (
          <>
            {/* Main Navigation */}
            <div className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Core Campus
              </div>
              {userNavItems.map(item => {
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Student Toolkit Section (Section 5) */}
            <div className="space-y-1 pt-2">
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Student Toolkit</span>
              </div>
              {studentToolkitItems.map(item => {
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* Admin Navigation (Section 28) */
          <div className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Admin Console</span>
            </div>
            {adminNavItems.map(item => {
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Embed Widget Simulation Toggle */}
        <div className="pt-4 px-1">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Floating Web Widget</span>
              </div>
              <button
                id="toggle-widget-sidebar-btn"
                onClick={onToggleWidget}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  showWidget ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    showWidget ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Test the embeddable Campus AI script as it appears on external university portals.
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Switch Role Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/90">
        <button
          onClick={() => onToggleRole(userRole === 'admin' ? 'user' : 'admin')}
          className="w-full py-2 px-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
        >
          {userRole === 'user' ? (
            <>
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Enter Admin Console</span>
            </>
          ) : (
            <>
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Back to Student Mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
