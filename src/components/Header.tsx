import React, { useState } from 'react';
import {
  Menu,
  ShieldCheck,
  Bell,
  FileDown,
  ExternalLink,
  Shield,
  GraduationCap,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { UserRole } from '../types';
import { NotificationCenter } from './NotificationCenter';

interface HeaderProps {
  currentTab: string;
  userRole: UserRole;
  onToggleRole: (role: UserRole) => void;
  onOpenMobile: () => void;
  onGoToTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  userRole,
  onToggleRole,
  onOpenMobile,
  onGoToTab
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const getTabTitle = () => {
    switch (currentTab) {
      case 'chat':
        return 'Aditya Campus AI Assistant';
      case 'programs':
        return 'Academic Programs Directory';
      case 'explorer':
        return 'Aditya Campus Explorer';
      case 'planner':
        return 'Smart Study Planner';
      case 'attendance':
        return 'Attendance Analyzer';
      case 'resume':
        return 'AI Resume Analyzer';
      case 'interview':
        return 'AI Interview Coach';
      case 'admin-dashboard':
        return 'Admin System Overview';
      case 'leadership':
        return 'Leadership & Governance Directory';
      case 'analytics':
        return 'Campus Insights & Telemetry';
      case 'knowledge':
        return 'Knowledge Centre (RAG Admin)';
      case 'api':
        return 'Developer REST API Console';
      default:
        return 'Aditya Campus AI';
    }
  };

  return (
    <>
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
            <h2 className="font-bold text-slate-800 text-base md:text-lg leading-tight flex items-center gap-2">
              <span>{getTabTitle()}</span>
              {userRole === 'admin' && (
                <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950">
                  Admin
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-amber-700 font-semibold">Surampalem Campus</span>
              <span>•</span>
              <span className="hidden sm:inline">Kakinada District, AP</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Indicator & Quick Switcher */}
          <button
            onClick={() => onToggleRole(userRole === 'admin' ? 'user' : 'admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              userRole === 'admin'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title="Toggle between Student Experience and Admin Console"
          >
            {userRole === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Admin Mode</span>
                <ArrowRightLeft className="w-3 h-3 opacity-80" />
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">Student View</span>
                <ArrowRightLeft className="w-3 h-3 opacity-60" />
              </>
            )}
          </button>

          {/* In-App Notifications Bell */}
          <button
            id="notification-bell-btn"
            onClick={() => setNotificationsOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            title="Campus & Academic Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Download Technical Documentation (.docx) */}
          <a
            id="download-technical-doc-btn"
            href="/Aditya_Campus_AI_Technical_Documentation.docx"
            download="Aditya_Campus_AI_Technical_Documentation.docx"
            title="Download complete technical documentation Word document (.docx)"
            className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-600" />
            <span>Technical Docs (.docx)</span>
          </a>

          {/* Quick Admissions Link */}
          <a
            href="https://www.adityauniversity.in/admissions"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <span>Admissions 2026</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* In-App Notification Center Modal */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNavigateTab={onGoToTab}
      />
    </>
  );
};
