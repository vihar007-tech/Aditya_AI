/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AssistantView } from './components/AssistantView';
import { AcademicProgramsView } from './components/AcademicProgramsView';
import { CampusExplorerView } from './components/CampusExplorerView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { AttendanceAnalyzerView } from './components/AttendanceAnalyzerView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { InterviewCoachView } from './components/InterviewCoachView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { LeadershipView } from './components/LeadershipView';
import { AnalyticsView } from './components/AnalyticsView';
import { KnowledgeCenterView } from './components/KnowledgeCenterView';
import { DeveloperApiView } from './components/DeveloperApiView';
import { AdminAccessRestricted } from './components/AdminAccessRestricted';
import { FloatingWidget } from './components/FloatingWidget';
import { UserRole } from './types';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [currentTab, setCurrentTab] = useState<string>('chat');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | undefined>(undefined);

  const adminTabs = ['admin-dashboard', 'leadership', 'analytics', 'knowledge', 'api'];

  const handleToggleRole = (newRole: UserRole) => {
    setUserRole(newRole);
    if (newRole === 'admin' && !adminTabs.includes(currentTab)) {
      setCurrentTab('admin-dashboard');
    } else if (newRole === 'user' && adminTabs.includes(currentTab)) {
      setCurrentTab('chat');
    }
  };

  const handleAskInChat = (query: string) => {
    setPendingPrompt(query);
    setCurrentTab('chat');
  };

  const isAdminTab = adminTabs.includes(currentTab);
  const isAccessDenied = isAdminTab && userRole !== 'admin';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userRole={userRole}
          onToggleRole={handleToggleRole}
          showWidget={showWidget}
          onToggleWidget={() => setShowWidget(!showWidget)}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 h-full">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              userRole={userRole}
              onToggleRole={handleToggleRole}
              showWidget={showWidget}
              onToggleWidget={() => setShowWidget(!showWidget)}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          currentTab={currentTab}
          userRole={userRole}
          onToggleRole={handleToggleRole}
          onOpenMobile={() => setMobileMenuOpen(true)}
          onGoToTab={setCurrentTab}
        />

        <main className="flex-1 overflow-hidden relative flex flex-col">
          {/* Permission Guard: Non-admin trying to access Admin console */}
          {isAccessDenied ? (
            <AdminAccessRestricted
              onGrantAdmin={() => {
                setUserRole('admin');
              }}
              onReturnToUser={() => {
                setCurrentTab('chat');
              }}
            />
          ) : (
            <>
              {/* User Experience Views */}
              {currentTab === 'chat' && (
                <AssistantView
                  onNavigateTab={setCurrentTab}
                  initialPrompt={pendingPrompt}
                  onClearInitialPrompt={() => setPendingPrompt(undefined)}
                />
              )}

              {currentTab === 'programs' && (
                <AcademicProgramsView />
              )}

              {currentTab === 'explorer' && (
                <CampusExplorerView onAskAboutFacility={handleAskInChat} />
              )}

              {/* Student Toolkit Views */}
              {currentTab === 'planner' && (
                <StudyPlannerView />
              )}

              {currentTab === 'attendance' && (
                <AttendanceAnalyzerView />
              )}

              {currentTab === 'resume' && (
                <ResumeAnalyzerView />
              )}

              {currentTab === 'interview' && (
                <InterviewCoachView />
              )}

              {/* Admin Console Views */}
              {currentTab === 'admin-dashboard' && (
                <AdminDashboardView onNavigateTab={setCurrentTab} />
              )}

              {currentTab === 'leadership' && (
                <LeadershipView onAskAboutLeader={handleAskInChat} />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsView />
              )}

              {currentTab === 'knowledge' && (
                <KnowledgeCenterView />
              )}

              {currentTab === 'api' && (
                <DeveloperApiView />
              )}
            </>
          )}
        </main>
      </div>

      {/* Live Floating Widget Simulation */}
      <FloatingWidget
        isOpen={showWidget}
        onClose={() => setShowWidget(false)}
      />
    </div>
  );
}
