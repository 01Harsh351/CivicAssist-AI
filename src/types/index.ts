export interface PublicService {
  id: string;
  serviceName: string;
  serviceNameEn: string;
  category: ServiceCategory;
  state: string;
  department: string;
  description: string;
  whyRelevantRules: string[];
  eligibilityConditions: {
    id: string;
    label: string;
    criteriaText: string;
    required: boolean;
    type: 'boolean' | 'income' | 'age' | 'residence' | 'student';
  }[];
  incomeLimitINR?: number;
  minAge?: number;
  maxAge?: number;
  requiredDocuments: {
    id: string;
    name: string;
    category: 'Identity' | 'Address' | 'Income' | 'Academic' | 'Category' | 'Other';
    description: string;
    howToObtain: string;
    isMandatory: boolean;
  }[];
  applicationSteps: {
    stepNumber: number;
    title: string;
    detail: string;
    estimatedTime: string;
  }[];
  officialPortalUrl: string;
  source: string;
  lastVerified: string;
  isVerified: boolean;
  statutoryFeeText: string;
  processingTimeDays: number;
}

export type ServiceCategory =
  | 'Certificates'
  | 'Education'
  | 'Scholarships'
  | 'Healthcare'
  | 'Identity'
  | 'Employment'
  | 'Business'
  | 'Pension'
  | 'Transport'
  | 'Housing'
  | 'Utility Services'
  | 'Other';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  language: string;
  state?: string;
  occupation?: string;
  isStudent?: boolean;
  createdDate: string;
}

export interface JourneyReminder {
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  type: 'document_submission' | 'portal_verification' | 'field_inquiry' | 'resolution_sla' | 'custom';
  notes?: string;
  portalUrl?: string;
}

export interface ApplicationJourney {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  state: string;
  referenceNumber?: string;
  currentStage: ApplicationStage;
  stageDate: string;
  notes?: string;
  documentsStatus: Record<string, DocumentReadinessState>;
  createdDate: string;
  lastUpdatedDate: string;
  reminderDeadline?: JourneyReminder;
}

export type ApplicationStage =
  | 'service_identified'
  | 'eligibility_checked'
  | 'documents_prepared'
  | 'application_pending'
  | 'verification'
  | 'completed';

export type DocumentReadinessState = 'ready' | 'missing' | 'unsure';

export interface EligibilityAssessment {
  status: 'likely_eligible' | 'more_info_needed' | 'not_eligible';
  scorePercent: number;
  reasons: string[];
  missingAnswers: string[];
  disclaimer: string;
}

export interface ActionPlanItem {
  id: number;
  title: string;
  description: string;
  actionType: 'check_eligibility' | 'prepare_document' | 'visit_portal' | 'track';
  isComplete: boolean;
}

export interface AIDiscoveryResult {
  intentSummary: string;
  matchedServices: {
    service: PublicService;
    relevanceScore: number;
    whyRelevant: string;
  }[];
  suggestedQuestions: string[];
  actionPlan: ActionPlanItem[];
  detectedCategory: ServiceCategory;
}

export interface AdminAnalyticsData {
  totalQueries: number;
  servicesDiscovered: number;
  applicationsStarted: number;
  mostRequestedService: string;
  mostCommonMissingDocument: string;
  languageDistribution: { language: string; count: number; percentage: number }[];
  categoryDemand: { category: string; count: number }[];
  funnelStages: { stage: string; count: number; percentage: number }[];
}
