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
import { LeadershipView } from './components/LeadershipView';
import { AnalyticsView } from './components/AnalyticsView';
import { KnowledgeCenterView } from './components/KnowledgeCenterView';
import { DeveloperApiView } from './components/DeveloperApiView';
import { FloatingWidget } from './components/FloatingWidget';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('chat');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | undefined>(undefined);

  const handleAskInChat = (query: string) => {
    setPendingPrompt(query);
    setCurrentTab('chat');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
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
          onOpenMobile={() => setMobileMenuOpen(true)}
          onGoToTab={setCurrentTab}
        />

        <main className="flex-1 overflow-hidden relative flex flex-col">
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
