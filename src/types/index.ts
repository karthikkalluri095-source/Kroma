export type UserRole = 'brand' | 'creator' | 'admin';

export interface Location {
  city: string;
  country: string;
}

export interface VerificationBadge {
  verified: boolean;
  evidence: string | null;
}

export interface VerificationInfo {
  tools: VerificationBadge;
  workflow: VerificationBadge;
  pastWork: VerificationBadge;
}

export interface CreatorStats {
  projectsCompleted: number;
  rating: number | null;
  reviewCount: number;
  repeatClientRate: number;
  avgResponseHours: number;
}

export interface WorkflowStep {
  tool: string;
  step: string;
  note: string;
}

export interface Creator {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  banner: string;
  bannerFallback?: string;
  headline: string;
  bio: string;
  location: Location;
  languages: string[];
  availability: 'available' | 'limited' | 'booked';
  rateFromUSD: number;
  rateUnit: string;
  turnaroundDays: number;
  experienceYears: number;
  experienceLevel: 'emerging' | 'established' | 'expert';
  specializations: string[];
  domains: string[];
  skills: string[];
  tools: string[];
  preferredFormats: string[];
  contentTypes: string[];
  commercialUseReady: boolean;
  verification: VerificationInfo;
  trustScore: number;
  profileCompleteness: number;
  stats: CreatorStats;
  portfolioItemIds: string[];
  offersAIPersonas: boolean;
  isDemo?: boolean;
}

export interface PortfolioItem {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  mediaType: 'video' | 'image';
  contentType: string;
  aspectRatio: string;
  durationSec: number | null;
  year: number;
  clientContext: string;
  thumbnail: string;
  thumbnailFallback?: string;
  videoUrl?: string | null;
  projectUrl?: string | null;
  projectUrls?: string[];
  aestheticTags?: string[];
  tools: string[];
  workflow: WorkflowStep[];
  iterations: number;
  hoursSpent: number;
  commercialStatus: 'cleared' | 'showcase' | 'needs-review';
  licenseNote: string;
  verified: boolean;
  isDemo?: boolean;
}

export interface AIPersona {
  id: string;
  name: string;
  creatorId: string;
  domains: string[];
  tagline: string;
  personality: string;
  visualStyle: string;
  languages: string[];
  platforms: string[];
  contentPillars: string[];
  licensingModels: string[];
  rateFromUSD: number;
  avatar: string;
  isAIGenerated: boolean;
  disclosure: string;
  isDemo?: boolean;
}

export interface Domain {
  id: string;
  label: string;
  icon: string;
  description: string;
  keywords: string[];
}

export interface Specialization {
  id: string;
  label: string;
  icon: string;
  keywords: string[];
}

export interface ToolItem {
  id: string;
  name: string;
  category: string;
  creatorCount: number;
}

export interface CommercialUseRequirement {
  usageTypes: string[];
  territory: string;
  durationMonths: number;
  exclusivity: string;
  toolLicenseProofRequired: boolean;
}

export interface RecommendedCreatorMatch {
  creatorId: string;
  score: number;
  whyThisMatch: string[];
}

export interface Brief {
  id: string;
  title: string;
  brandId: string;
  brandName: string;
  domains: string[];
  summary: string;
  campaignGoal: string;
  requirements: string[];
  targetAudience: string;
  contentType: string;
  styleTags: string[];
  aspectRatios: string[];
  durationSec: number;
  deliverables: number;
  platforms: string[];
  preferredTools: string[];
  languages: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
  revisionRounds: number;
  commercialUse: CommercialUseRequirement;
  status: 'draft' | 'published' | 'in_review' | 'hired' | 'closed';
  postedAt: string;
  recommendedCreators?: RecommendedCreatorMatch[];
  isDemo?: boolean;
}

export interface Proposal {
  id: string;
  briefId: string;
  creatorId: string;
  coverMessage: string;
  priceUSD: number;
  timelineDays: number;
  relatedPortfolioItemIds: string[];
  status: 'submitted' | 'shortlisted' | 'accepted' | 'declined';
  submittedAt: string;
  isDemo?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  amountUSD: number;
  status: 'released' | 'held-in-escrow' | 'pending';
  dueDate: string;
}

export interface EngagementMessage {
  from: 'brand' | 'creator' | 'system';
  text: string;
  at: string;
}

export interface DeliverableVersion {
  version: string;
  label: string;
  videoUrl?: string | null;
  submittedAt: string;
  status: 'in_review' | 'changes_requested' | 'approved';
  toolsUsed: string[];
  changeSummary: string;
  feedback?: string | null;
}

export interface LicenseSummary {
  status: 'draft' | 'pending' | 'final';
  usageTypes: string[];
  territory: string;
  durationMonths: number;
  exclusivity: string;
  toolsDisclosed: string[];
  voiceConsentOnFile: boolean;
  disclaimer: string;
}

export interface Engagement {
  id: string;
  briefId: string;
  creatorId: string;
  brandId: string;
  stage: 'kickoff' | 'in_production' | 'review' | 'revisions' | 'approved' | 'delivered' | 'completed';
  stages: string[];
  agreedPriceUSD: number;
  revisionsIncluded: number;
  revisionsUsed: number;
  startedAt: string;
  dueDate: string;
  milestones: Milestone[];
  escrowNote: string;
  messages: EngagementMessage[];
  versions: DeliverableVersion[];
  licenseSummary: LicenseSummary;
  review?: {
    rating: number;
    text: string;
    date: string;
  };
  isDemo?: boolean;
}

export interface VerificationRequest {
  id: string;
  creatorId: string;
  type: 'tools' | 'workflow' | 'pastWork';
  evidence: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  isDemo?: boolean;
}

export interface NotificationItem {
  id: string;
  forRole: 'brand' | 'creator' | 'admin';
  brandId?: string;
  creatorId?: string;
  text: string;
  createdAt: string;
  read: boolean;
  isDemo?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  industryDomain: string;
  city: string;
  about: string;
  verified: boolean;
  isDemo?: boolean;
}

export interface Review {
  id: string;
  creatorId: string;
  reviewer: string;
  rating: number;
  text: string;
  date: string;
  isDemo?: boolean;
}

export interface DemoAccount {
  role: UserRole;
  label: string;
  displayName: string;
  brandId?: string;
  creatorId?: string;
  email: string;
}

export interface BriefTemplate {
  id: string;
  name: string;
  prefill: Partial<Brief>;
}

export interface QAQuery {
  query: string;
  mode: 'creators' | 'personas';
  expectOneOf: string[];
}
