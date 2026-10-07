import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PublicService,
  ApplicationJourney,
  JourneyReminder,
  DocumentReadinessState,
  AIDiscoveryResult,
  ApplicationStage,
  ServiceCategory,
} from '../types';
import { PUBLIC_SERVICES_CATALOG } from '../data/servicesData';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import {
  loadUserJourneys,
  createUserJourney,
  updateJourneyStageInDb,
  updateJourneyReminderInDb,
  deleteUserJourney,
  loadSavedServices,
  addSavedService,
  removeSavedService,
  loadUserDocuments,
  saveUserDocumentStatus,
  recordCitizenQuery,
} from '../services/supabaseService';

interface AppContextType {
  services: PublicService[];
  activeCategory: ServiceCategory | null;
  setActiveCategory: (cat: ServiceCategory | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  aiResult: AIDiscoveryResult | null;
  isSearching: boolean;
  searchError: string | null;
  performAISearch: (queryText: string) => Promise<void>;
  resetSearch: () => void;
  selectedService: PublicService | null;
  setSelectedService: (svc: PublicService | null) => void;
  savedServiceIds: string[];
  toggleSaveService: (serviceId: string) => void;
  isServiceSaved: (serviceId: string) => boolean;
  applicationJourneys: ApplicationJourney[];
  startApplicationJourney: (service: PublicService) => ApplicationJourney;
  updateJourneyStage: (
    journeyId: string,
    newStage: ApplicationStage,
    referenceNumber?: string
  ) => void;
  saveJourneyReminder: (journeyId: string, reminder: JourneyReminder) => void;
  removeJourneyReminder: (journeyId: string) => void;
  deleteApplicationJourney: (journeyId: string) => void;
  logCitizenQuery: (queryText: string, inputType?: 'text' | 'voice' | 'document_upload', docName?: string) => void;
  documentReadiness: Record<string, DocumentReadinessState>;
  setDocumentReadinessState: (docId: string, state: DocumentReadinessState) => void;
  activeTab: 'home' | 'find_service' | 'my_applications' | 'documents' | 'saved_services' | 'help' | 'admin';
  setActiveTab: (tab: 'home' | 'find_service' | 'my_applications' | 'documents' | 'saved_services' | 'help' | 'admin') => void;
  showPrivacyModal: boolean;
  setShowPrivacyModal: (show: boolean) => void;
  showTermsModal: boolean;
  setShowTermsModal: (show: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const JOURNEYS_STORAGE_KEY = 'civicassist_journeys';
const SAVED_STORAGE_KEY = 'civicassist_saved_services';
const DOCS_STORAGE_KEY = 'civicassist_docs_status';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { languageCode } = useLanguage();
  const { currentUser } = useAuth();

  const [services] = useState<PublicService[]>(PUBLIC_SERVICES_CATALOG);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResult, setAiResult] = useState<AIDiscoveryResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<PublicService | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'find_service' | 'my_applications' | 'documents' | 'saved_services' | 'help' | 'admin'>('home');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Saved service IDs
  const [savedServiceIds, setSavedServiceIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['income-cert', 'post-matric-scholarship'];
    } catch {
      return ['income-cert', 'post-matric-scholarship'];
    }
  });

  // Application Journeys
  const [applicationJourneys, setApplicationJourneys] = useState<ApplicationJourney[]>(() => {
    try {
      const stored = localStorage.getItem(JOURNEYS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Pre-populate realistic demo application journeys
    return [
      {
        id: 'journey-inc-1',
        serviceId: 'income-cert',
        serviceName: 'Income Certificate (आय प्रमाण पत्र)',
        category: 'Certificates',
        state: 'Uttar Pradesh (e-District)',
        referenceNumber: 'UP/2026/EDIST/88921',
        currentStage: 'application_pending',
        stageDate: new Date(Date.now() - 3 * 86400000).toISOString(),
        notes: 'Submitted online. Lekhpal field verification scheduled.',
        documentsStatus: {
          doc_id: 'ready',
          doc_address: 'ready',
          doc_income_proof: 'missing',
          doc_photo: 'ready',
        },
        createdDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        lastUpdatedDate: new Date().toISOString(),
      },
      {
        id: 'journey-sch-2',
        serviceId: 'post-matric-scholarship',
        serviceName: 'Post-Matric Scholarship for Higher Education',
        category: 'Scholarships',
        state: 'National Scholarship Portal',
        referenceNumber: 'NSP/2026/UG/44019',
        currentStage: 'documents_prepared',
        stageDate: new Date(Date.now() - 1 * 86400000).toISOString(),
        notes: 'Awaiting college bonafide certificate signature.',
        documentsStatus: {
          doc_student_id: 'ready',
          doc_income_cert: 'ready',
          doc_caste_cert: 'ready',
          doc_marksheet: 'ready',
          doc_bonafide: 'missing',
        },
        createdDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        lastUpdatedDate: new Date().toISOString(),
        reminderDeadline: {
          title: 'Submit Bonafide Certificate to Institute Nodal Officer',
          date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          time: '11:00',
          type: 'document_submission',
          notes: 'Signed bonafide letter from college dean needed to unlock NSP biometric verification.',
          portalUrl: 'https://scholarships.gov.in',
        },
      },
    ];
  });

  // Global document readiness state
  const [documentReadiness, setDocumentReadiness] = useState<Record<string, DocumentReadinessState>>(() => {
    try {
      const stored = localStorage.getItem(DOCS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {
      doc_id: 'ready',
      doc_address: 'ready',
      doc_income_proof: 'missing',
      doc_photo: 'ready',
      doc_student_id: 'ready',
      doc_income_cert: 'missing',
      doc_caste_cert: 'ready',
      doc_marksheet: 'ready',
      doc_bonafide: 'unsure',
      doc_aadhaar: 'ready',
      doc_age_proof: 'ready',
    };
  });

  // Sync to storage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedServiceIds));
    } catch {}
  }, [savedServiceIds]);

  useEffect(() => {
    try {
      localStorage.setItem(JOURNEYS_STORAGE_KEY, JSON.stringify(applicationJourneys));
    } catch {}
  }, [applicationJourneys]);

  useEffect(() => {
    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(documentReadiness));
    } catch {}
  }, [documentReadiness]);

  // Load real Supabase user data upon authentication
  useEffect(() => {
    let isCancelled = false;

    const fetchSupabaseData = async () => {
      if (!currentUser?.id) return;
      try {
        const [dbJourneys, dbSaved, dbDocs] = await Promise.all([
          loadUserJourneys(currentUser.id),
          loadSavedServices(currentUser.id),
          loadUserDocuments(currentUser.id),
        ]);

        if (isCancelled) return;

        if (dbJourneys !== null && dbJourneys.length > 0) {
          setApplicationJourneys(dbJourneys);
        }
        if (dbSaved !== null) {
          setSavedServiceIds(dbSaved);
        }
        if (dbDocs !== null && Object.keys(dbDocs).length > 0) {
          setDocumentReadiness((prev) => ({ ...prev, ...dbDocs }));
        }
      } catch (err) {
        console.warn('Initial Supabase data sync notice:', err);
      }
    };

    fetchSupabaseData();
    return () => {
      isCancelled = true;
    };
  }, [currentUser?.id]);

  const toggleSaveService = (serviceId: string) => {
    setSavedServiceIds((prev) => {
      const exists = prev.includes(serviceId);
      const next = exists ? prev.filter((id) => id !== serviceId) : [...prev, serviceId];
      showToast(exists ? 'Service removed from saved list.' : 'Service saved to your profile.');

      // Sync to Supabase
      if (currentUser?.id) {
        if (exists) {
          removeSavedService(currentUser.id, serviceId);
        } else {
          addSavedService(currentUser.id, serviceId);
        }
      }

      return next;
    });
  };

  const isServiceSaved = (serviceId: string) => savedServiceIds.includes(serviceId);

  const setDocumentReadinessState = (docId: string, state: DocumentReadinessState) => {
    setDocumentReadiness((prev) => ({
      ...prev,
      [docId]: state,
    }));

    // Sync to Supabase
    if (currentUser?.id) {
      saveUserDocumentStatus(currentUser.id, docId, state);
    }
  };

  const startApplicationJourney = (service: PublicService): ApplicationJourney => {
    const existing = applicationJourneys.find((j) => j.serviceId === service.id);
    if (existing) {
      showToast('You already have an active application journey for this service.');
      return existing;
    }

    const docStatuses: Record<string, DocumentReadinessState> = {};
    service.requiredDocuments.forEach((doc) => {
      docStatuses[doc.id] = documentReadiness[doc.id] || 'unsure';
    });

    const newJourney: ApplicationJourney = {
      id: `journey-${Date.now()}`,
      serviceId: service.id,
      serviceName: service.serviceName,
      category: service.category,
      state: service.state,
      currentStage: 'service_identified',
      stageDate: new Date().toISOString(),
      documentsStatus: docStatuses,
      createdDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
    };

    setApplicationJourneys((prev) => [newJourney, ...prev]);
    showToast(`Added "${service.serviceName}" to My Applications.`);

    // Sync to Supabase
    if (currentUser?.id) {
      createUserJourney(currentUser.id, newJourney);
    }

    return newJourney;
  };

  const updateJourneyStage = (
    journeyId: string,
    newStage: ApplicationStage,
    referenceNumber?: string
  ) => {
    setApplicationJourneys((prev) =>
      prev.map((j) => {
        if (j.id === journeyId) {
          return {
            ...j,
            currentStage: newStage,
            stageDate: new Date().toISOString(),
            lastUpdatedDate: new Date().toISOString(),
            ...(referenceNumber ? { referenceNumber } : {}),
          };
        }
        return j;
      })
    );
    showToast('Application stage updated successfully.');

    // Sync to Supabase
    if (currentUser?.id) {
      updateJourneyStageInDb(currentUser.id, journeyId, newStage, referenceNumber);
    }
  };

  const saveJourneyReminder = (journeyId: string, reminder: JourneyReminder) => {
    setApplicationJourneys((prev) =>
      prev.map((j) => {
        if (j.id === journeyId) {
          return {
            ...j,
            reminderDeadline: reminder,
            lastUpdatedDate: new Date().toISOString(),
          };
        }
        return j;
      })
    );
    showToast(`Reminder set for "${reminder.title}"`);

    // Sync to Supabase
    if (currentUser?.id) {
      updateJourneyReminderInDb(currentUser.id, journeyId, reminder);
    }
  };

  const removeJourneyReminder = (journeyId: string) => {
    setApplicationJourneys((prev) =>
      prev.map((j) => {
        if (j.id === journeyId) {
          const { reminderDeadline, ...rest } = j;
          return {
            ...rest,
            lastUpdatedDate: new Date().toISOString(),
          };
        }
        return j;
      })
    );
    showToast('Reminder removed from tracker.');

    // Sync to Supabase
    if (currentUser?.id) {
      updateJourneyReminderInDb(currentUser.id, journeyId, null);
    }
  };

  const deleteApplicationJourney = (journeyId: string) => {
    setApplicationJourneys((prev) => prev.filter((j) => j.id !== journeyId));
    showToast('Application removed from tracker.');

    // Sync to Supabase
    if (currentUser?.id) {
      deleteUserJourney(currentUser.id, journeyId);
    }
  };

  const logCitizenQuery = (
    queryText: string,
    inputType: 'text' | 'voice' | 'document_upload' = 'text',
    docName?: string
  ) => {
    if (currentUser?.id && queryText.trim()) {
      recordCitizenQuery(currentUser.id, queryText.trim(), inputType, docName);
    }
  };

  const performAISearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setActiveTab('home');
    setIsSearching(true);
    setSearchError(null);
    setSearchQuery(queryText);

    // Record citizen query in Supabase
    logCitizenQuery(queryText, 'text');

    try {
      const res = await fetch('/api/analyze-need', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          language: languageCode,
          userProfile: currentUser,
        }),
      });

      if (!res.ok) {
        throw new Error('Service analysis request failed');
      }

      const data = await res.json();
      setAiResult(data);
    } catch (err: any) {
      console.error('AI search failed, running client fallback:', err);
      // Client-side fallback if server fails
      const fallbackQuery = queryText.toLowerCase();
      const matched = services.filter((s) =>
        s.whyRelevantRules.some((r) => fallbackQuery.includes(r.toLowerCase())) ||
        s.serviceName.toLowerCase().includes(fallbackQuery) ||
        s.category.toLowerCase().includes(fallbackQuery)
      );
      const chosen = matched.length > 0 ? matched[0] : services[0];
      setAiResult({
        intentSummary: `Identified public service matching citizen query: "${queryText}"`,
        matchedServices: [
          {
            service: chosen,
            relevanceScore: 92,
            whyRelevant: `Matches citizen requirement for ${chosen.category} services.`,
          },
        ],
        suggestedQuestions: [
          'What is your resident state for application processing?',
          'Do you have your active Aadhaar card ready?',
        ],
        actionPlan: [
          {
            id: 1,
            title: 'Verify eligibility conditions',
            description: 'Check resident state criteria and income slabs.',
            actionType: 'check_eligibility',
            isComplete: false,
          },
          {
            id: 2,
            title: 'Prepare required documents',
            description: 'Collect identity and income proofs.',
            actionType: 'prepare_document',
            isComplete: false,
          },
          {
            id: 3,
            title: 'Open verified official government portal',
            description: `Visit ${chosen.officialPortalUrl}`,
            actionType: 'visit_portal',
            isComplete: false,
          },
        ],
        detectedCategory: chosen.category,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setAiResult(null);
    setSearchError(null);
  };

  return (
    <AppContext.Provider
      value={{
        services,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        aiResult,
        isSearching,
        searchError,
        performAISearch,
        resetSearch,
        selectedService,
        setSelectedService,
        savedServiceIds,
        toggleSaveService,
        isServiceSaved,
        applicationJourneys,
        startApplicationJourney,
        updateJourneyStage,
        saveJourneyReminder,
        removeJourneyReminder,
        deleteApplicationJourney,
        logCitizenQuery,
        documentReadiness,
        setDocumentReadinessState,
        activeTab,
        setActiveTab,
        showPrivacyModal,
        setShowPrivacyModal,
        showTermsModal,
        setShowTermsModal,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
