import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DiscoverPage } from './pages/DiscoverPage';
import { DomainsPage } from './pages/DomainsPage';
import { BriefsPage } from './pages/BriefsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { QAPage } from './pages/QAPage';
import { BrandLoginPage } from './pages/BrandLoginPage';
import { CreatorLoginPage } from './pages/CreatorLoginPage';
import { CreatorModal } from './components/CreatorModal';
import { GuidedDemoModal } from './components/GuidedDemoModal';
import { Creator } from './types';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('discover');
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [selectedDomainForDiscover, setSelectedDomainForDiscover] = useState<string | null>(null);
  const [showGuidedDemo, setShowGuidedDemo] = useState(false);
  const [openPortfolioUploadInDashboard, setOpenPortfolioUploadInDashboard] = useState(false);

  // Sync hash/path for deep linking if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || window.location.pathname.replace('/', '');
      if (['discover', 'domains', 'briefs', 'dashboard', 'admin', 'qa', 'login-brand', 'login-creator'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDomainFromBrowse = (domainId: string) => {
    setSelectedDomainForDiscover(domainId);
    navigateTo('discover');
  };

  const handleOpenCreatorUpload = () => {
    setOpenPortfolioUploadInDashboard(true);
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-neutral-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-black">
      <Navbar
        currentTab={currentTab}
        onNavigate={navigateTo}
        onStartGuidedDemo={() => setShowGuidedDemo(true)}
      />

      <main className="flex-1">
        {currentTab === 'discover' && (
          <DiscoverPage
            onSelectCreator={(c: Creator) => setSelectedCreatorId(c.id)}
            onSelectPersona={() => navigateTo('briefs')}
            onNavigate={navigateTo}
            initialDomain={selectedDomainForDiscover}
          />
        )}

        {currentTab === 'domains' && (
          <DomainsPage onSelectDomain={handleSelectDomainFromBrowse} />
        )}

        {currentTab === 'briefs' && (
          <BriefsPage
            onSelectCreator={(c: Creator) => setSelectedCreatorId(c.id)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onNavigate={navigateTo}
            onOpenCreator={(c: Creator) => setSelectedCreatorId(c.id)}
            openPortfolioSubmission={openPortfolioUploadInDashboard}
          />
        )}

        {currentTab === 'login-brand' && (
          <BrandLoginPage
            onNavigate={navigateTo}
            onSearchMarketingCreators={(_query) => {
              setSelectedDomainForDiscover(null);
            }}
          />
        )}

        {currentTab === 'login-creator' && (
          <CreatorLoginPage
            onNavigate={navigateTo}
            onOpenPortfolioUpload={handleOpenCreatorUpload}
          />
        )}

        {currentTab === 'admin' && <AdminPage />}

        {currentTab === 'qa' && <QAPage />}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Creator Details Modal with Integrated Highlight Reel Video Player */}
      {selectedCreatorId && (
        <CreatorModal
          creatorId={selectedCreatorId}
          onClose={() => setSelectedCreatorId(null)}
          onInviteToBrief={() => {
            setSelectedCreatorId(null);
            navigateTo('briefs');
          }}
        />
      )}

      {/* Guided Demo Walkthrough for Judges */}
      <GuidedDemoModal
        isOpen={showGuidedDemo}
        onClose={() => setShowGuidedDemo(false)}
        onNavigate={navigateTo}
        onSearchDemo={(_query) => {
          setSelectedDomainForDiscover(null);
          navigateTo('discover');
        }}
        onOpenCreatorDemo={(creatorId) => {
          setSelectedCreatorId(creatorId);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
