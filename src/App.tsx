/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/dashboard/HeroSection';
import { AIServiceDiscovery } from './components/dashboard/AIServiceDiscovery';
import { ServiceCard } from './components/dashboard/ServiceCard';
import { ServiceDetailModal } from './components/service/ServiceDetailModal';
import { FindServiceCatalog } from './components/dashboard/FindServiceCatalog';
import { ApplicationTracker } from './components/tracker/ApplicationTracker';
import { DocumentsCenter } from './components/documents/DocumentsCenter';
import { SavedServicesView } from './components/dashboard/SavedServicesView';
import { HelpCenterView } from './components/help/HelpCenterView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LanguageSelectorModal } from './components/common/LanguageSelectorModal';
import { VoiceInputModal } from './components/common/VoiceInputModal';
import { DocumentUploadModal } from './components/common/DocumentUploadModal';
import { PrivacyModal } from './components/common/PrivacyModal';
import { ShieldCheck, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

const MainApplicationContent: React.FC = () => {
  const { isAuthenticated, isCheckingSession } = useAuth();
  const {
    activeTab,
    setActiveTab,
    services,
    activeCategory,
    aiResult,
    toastMessage,
    performAISearch,
    logCitizenQuery,
  } = useApp();
  const { t } = useLanguage();

  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const aiDiscoveryRef = useRef<HTMLDivElement>(null);

  // Automatically scroll view to AIServiceDiscovery component with a smooth animation when aiResult changes
  useEffect(() => {
    if (aiResult) {
      const scrollTimer = setTimeout(() => {
        if (aiDiscoveryRef.current) {
          aiDiscoveryRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else {
          const el = document.getElementById('service-results');
          if (el) {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
      }, 100);

      return () => clearTimeout(scrollTimer);
    }
  }, [aiResult]);

  // Loading state while verifying real Supabase session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-blue-900 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
          Verifying Citizen Session...
        </p>
      </div>
    );
  }

  // Protect private pages with supabase.auth.getSession() — if no session, redirect to /login
  if (!isAuthenticated) {
    return (
      <>
        <AuthScreen
          onOpenPrivacy={() => setPrivacyModalOpen(true)}
          onOpenTerms={() => setTermsModalOpen(true)}
        />
        <PrivacyModal
          isOpen={privacyModalOpen}
          onClose={() => setPrivacyModalOpen(false)}
          isTerms={false}
        />
        <PrivacyModal
          isOpen={termsModalOpen}
          onClose={() => setTermsModalOpen(false)}
          isTerms={true}
        />
      </>
    );
  }

  // Filter services for home view
  const displayServices = services.filter((s) => {
    if (!activeCategory) return true;
    return s.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar onOpenLanguageModal={() => setLanguageModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Router */}
        {activeTab === 'home' && (
          <div>
            <HeroSection
              onOpenVoiceModal={() => setVoiceModalOpen(true)}
              onOpenUploadModal={() => setUploadModalOpen(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              {/* AI Discovery Result Block */}
              {aiResult && (
                <div ref={aiDiscoveryRef} className="scroll-mt-24">
                  <AIServiceDiscovery />
                </div>
              )}

              {/* Browse Catalog Header */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                      <Compass className="w-6 h-6 text-blue-900" />
                      <span>
                        {activeCategory
                          ? `${activeCategory} Services`
                          : 'Key Indian Public Services & Welfare Schemes'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verified government services with statutory rules, document requirements, and direct portal access.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('find_service')}
                    className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1 self-start cursor-pointer hover:underline"
                  >
                    <span>View all {services.length} services</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {displayServices.slice(0, 6).map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'find_service' && <FindServiceCatalog />}
        {activeTab === 'my_applications' && <ApplicationTracker />}
        {activeTab === 'documents' && <DocumentsCenter />}
        {activeTab === 'saved_services' && <SavedServicesView />}
        {activeTab === 'help' && <HelpCenterView />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals */}
      <ServiceDetailModal />

      <LanguageSelectorModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
      />

      <VoiceInputModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onTranscriptReady={(text) => {
          logCitizenQuery(text, 'voice');
          performAISearch(text);
        }}
      />

      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onDocumentAnalyzed={(text) => {
          logCitizenQuery(text, 'document_upload');
          performAISearch(text);
        }}
      />

      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        isTerms={false}
      />

      <PrivacyModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        isTerms={true}
      />

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenTerms={() => setTermsModalOpen(true)}
        onOpenLanguageModal={() => setLanguageModalOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <MainApplicationContent />
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
