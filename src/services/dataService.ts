import {
  Creator,
  PortfolioItem,
  AIPersona,
  Brief,
  Proposal,
  Engagement,
  VerificationRequest,
  NotificationItem,
  Brand,
  Review,
  Domain,
  Specialization,
  ToolItem,
  BriefTemplate,
  DemoAccount,
} from '../types';
import seedDataRaw from '../data/seed.json';

export interface DataService {
  getActiveAdapterName(): 'firestore' | 'seed';
  isUsingFallback(): boolean;

  // Taxonomies
  getDomains(): Promise<Domain[]>;
  getSpecializations(): Promise<Specialization[]>;
  getTools(): Promise<ToolItem[]>;
  getDemoAccounts(): Promise<DemoAccount[]>;
  getBriefTemplates(): Promise<BriefTemplate[]>;

  // Creators
  getCreators(): Promise<Creator[]>;
  getCreator(id: string): Promise<Creator | null>;
  updateCreator(creator: Creator): Promise<Creator>;

  // Portfolio
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItem(id: string): Promise<PortfolioItem | null>;
  getPortfolioByCreator(creatorId: string): Promise<PortfolioItem[]>;
  addPortfolioItem(item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem>;

  // AI Personas
  getPersonas(): Promise<AIPersona[]>;
  getPersona(id: string): Promise<AIPersona | null>;

  // Briefs
  getBriefs(): Promise<Brief[]>;
  getBrief(id: string): Promise<Brief | null>;
  createBrief(brief: Omit<Brief, 'id' | 'postedAt'>): Promise<Brief>;
  updateBrief(brief: Brief): Promise<Brief>;

  // Proposals
  getProposals(briefId?: string, creatorId?: string): Promise<Proposal[]>;
  createProposal(proposal: Omit<Proposal, 'id' | 'submittedAt'>): Promise<Proposal>;
  updateProposal(proposal: Proposal): Promise<Proposal>;

  // Engagements
  getEngagements(filter?: { brandId?: string; creatorId?: string }): Promise<Engagement[]>;
  getEngagement(id: string): Promise<Engagement | null>;
  updateEngagement(engagement: Engagement): Promise<Engagement>;
  createEngagement(engagement: Omit<Engagement, 'id'>): Promise<Engagement>;

  // Verification
  getVerificationRequests(): Promise<VerificationRequest[]>;
  updateVerificationRequest(id: string, status: 'approved' | 'rejected'): Promise<VerificationRequest>;
  createVerificationRequest(req: Omit<VerificationRequest, 'id' | 'submittedAt'>): Promise<VerificationRequest>;

  // Notifications
  getNotifications(role: string, entityId?: string): Promise<NotificationItem[]>;
  markNotificationRead(id: string): Promise<void>;

  // Brands & Reviews
  getBrands(): Promise<Brand[]>;
  getBrand(id: string): Promise<Brand | null>;
  getReviews(creatorId?: string): Promise<Review[]>;
  addReview(review: Omit<Review, 'id' | 'date'>): Promise<Review>;

  // Administration
  resetDemoData(): Promise<void>;
  getSeedCounts(): { [key: string]: number };
}

// SeedAdapter Implementation with local storage persistence
class SeedAdapter implements DataService {
  private storageKey = 'kroma_seed_store_v1';
  private data: any;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.data = JSON.parse(stored);
      } else {
        this.data = JSON.parse(JSON.stringify(seedDataRaw));
        this.persist();
      }
    } catch {
      this.data = JSON.parse(JSON.stringify(seedDataRaw));
    }
  }

  private persist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch {
      // Memory only if quota exceeded
    }
  }

  getActiveAdapterName(): 'firestore' | 'seed' {
    return 'seed';
  }

  isUsingFallback(): boolean {
    return true; // running in seamless seed/local mode
  }

  getSeedCounts(): { [key: string]: number } {
    return {
      creators: this.data.creators?.length || 0,
      portfolioItems: this.data.portfolioItems?.length || 0,
      aiPersonas: this.data.aiPersonas?.length || 0,
      briefs: this.data.briefs?.length || 0,
      proposals: this.data.proposals?.length || 0,
      engagements: this.data.engagements?.length || 0,
      tools: this.data.tools?.length || 0,
      domains: this.data.domains?.length || 0,
      reviews: this.data.reviews?.length || 0,
      verificationRequests: this.data.verificationRequests?.length || 0,
    };
  }

  async getDomains(): Promise<Domain[]> {
    return this.data.domains || [];
  }

  async getSpecializations(): Promise<Specialization[]> {
    return this.data.specializations || [];
  }

  async getTools(): Promise<ToolItem[]> {
    return this.data.tools || [];
  }

  async getDemoAccounts(): Promise<DemoAccount[]> {
    return this.data.demoAccounts || [];
  }

  async getBriefTemplates(): Promise<BriefTemplate[]> {
    return this.data.briefTemplates || [];
  }

  async getCreators(): Promise<Creator[]> {
    return [...this.data.creators];
  }

  async getCreator(id: string): Promise<Creator | null> {
    const creator = this.data.creators.find((c: Creator) => c.id === id);
    return creator ? { ...creator } : null;
  }

  async updateCreator(creator: Creator): Promise<Creator> {
    const idx = this.data.creators.findIndex((c: Creator) => c.id === creator.id);
    if (idx !== -1) {
      this.data.creators[idx] = { ...creator, isDemo: creator.isDemo ?? false };
    } else {
      this.data.creators.push({ ...creator, isDemo: false });
    }
    this.persist();
    return creator;
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return [...this.data.portfolioItems];
  }

  async getPortfolioItem(id: string): Promise<PortfolioItem | null> {
    const item = this.data.portfolioItems.find((p: PortfolioItem) => p.id === id);
    return item ? { ...item } : null;
  }

  async getPortfolioByCreator(creatorId: string): Promise<PortfolioItem[]> {
    return this.data.portfolioItems.filter((p: PortfolioItem) => p.creatorId === creatorId);
  }

  async addPortfolioItem(item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem> {
    const newItem: PortfolioItem = {
      ...item,
      id: `p-${Date.now()}`,
      isDemo: false,
    };
    this.data.portfolioItems.unshift(newItem);
    // Link to creator
    const creator = this.data.creators.find((c: Creator) => c.id === item.creatorId);
    if (creator) {
      creator.portfolioItemIds = [newItem.id, ...(creator.portfolioItemIds || [])];
    }
    this.persist();
    return newItem;
  }

  async getPersonas(): Promise<AIPersona[]> {
    return [...this.data.aiPersonas];
  }

  async getPersona(id: string): Promise<AIPersona | null> {
    const persona = this.data.aiPersonas.find((p: AIPersona) => p.id === id);
    return persona ? { ...persona } : null;
  }

  async getBriefs(): Promise<Brief[]> {
    return [...this.data.briefs];
  }

  async getBrief(id: string): Promise<Brief | null> {
    const brief = this.data.briefs.find((b: Brief) => b.id === id);
    return brief ? { ...brief } : null;
  }

  async createBrief(brief: Omit<Brief, 'id' | 'postedAt'>): Promise<Brief> {
    const newBrief: Brief = {
      ...brief,
      id: `br-${Date.now()}`,
      postedAt: new Date().toISOString().split('T')[0],
      isDemo: false,
    };
    this.data.briefs.unshift(newBrief);
    this.persist();
    return newBrief;
  }

  async updateBrief(brief: Brief): Promise<Brief> {
    const idx = this.data.briefs.findIndex((b: Brief) => b.id === brief.id);
    if (idx !== -1) {
      this.data.briefs[idx] = { ...brief };
      this.persist();
    }
    return brief;
  }

  async getProposals(briefId?: string, creatorId?: string): Promise<Proposal[]> {
    let list = this.data.proposals as Proposal[];
    if (briefId) list = list.filter(p => p.briefId === briefId);
    if (creatorId) list = list.filter(p => p.creatorId === creatorId);
    return [...list];
  }

  async createProposal(proposal: Omit<Proposal, 'id' | 'submittedAt'>): Promise<Proposal> {
    const newProp: Proposal = {
      ...proposal,
      id: `pr-${Date.now()}`,
      submittedAt: new Date().toISOString().split('T')[0],
      isDemo: false,
    };
    this.data.proposals.unshift(newProp);
    this.persist();
    return newProp;
  }

  async updateProposal(proposal: Proposal): Promise<Proposal> {
    const idx = this.data.proposals.findIndex((p: Proposal) => p.id === proposal.id);
    if (idx !== -1) {
      this.data.proposals[idx] = { ...proposal };
      this.persist();
    }
    return proposal;
  }

  async getEngagements(filter?: { brandId?: string; creatorId?: string }): Promise<Engagement[]> {
    let list = this.data.engagements as Engagement[];
    if (filter?.brandId) list = list.filter(e => e.brandId === filter.brandId);
    if (filter?.creatorId) list = list.filter(e => e.creatorId === filter.creatorId);
    return [...list];
  }

  async getEngagement(id: string): Promise<Engagement | null> {
    const eng = this.data.engagements.find((e: Engagement) => e.id === id);
    return eng ? { ...eng } : null;
  }

  async updateEngagement(engagement: Engagement): Promise<Engagement> {
    const idx = this.data.engagements.findIndex((e: Engagement) => e.id === engagement.id);
    if (idx !== -1) {
      this.data.engagements[idx] = { ...engagement };
      this.persist();
    }
    return engagement;
  }

  async createEngagement(engagement: Omit<Engagement, 'id'>): Promise<Engagement> {
    const newEng: Engagement = {
      ...engagement,
      id: `eg-${Date.now()}`,
      isDemo: false,
    };
    this.data.engagements.unshift(newEng);
    this.persist();
    return newEng;
  }

  async getVerificationRequests(): Promise<VerificationRequest[]> {
    return [...(this.data.verificationRequests || [])];
  }

  async updateVerificationRequest(id: string, status: 'approved' | 'rejected'): Promise<VerificationRequest> {
    const req = this.data.verificationRequests.find((r: VerificationRequest) => r.id === id);
    if (!req) throw new Error('Request not found');
    req.status = status;

    // Update creator badges and recalculate trust score
    const creator = this.data.creators.find((c: Creator) => c.id === req.creatorId);
    if (creator && status === 'approved') {
      if (req.type === 'tools') {
        creator.verification.tools.verified = true;
        creator.verification.tools.evidence = req.evidence;
      } else if (req.type === 'workflow') {
        creator.verification.workflow.verified = true;
        creator.verification.workflow.evidence = req.evidence;
      } else if (req.type === 'pastWork') {
        creator.verification.pastWork.verified = true;
        creator.verification.pastWork.evidence = req.evidence;
      }

      // Trust score breakdown: tools 30, workflow 30, past work 25, profile completeness 15
      let score = 0;
      if (creator.verification.tools.verified) score += 30;
      if (creator.verification.workflow.verified) score += 30;
      if (creator.verification.pastWork.verified) score += 25;
      score += Math.round(((creator.profileCompleteness || 90) / 100) * 15);
      creator.trustScore = Math.min(100, score);
    }

    this.persist();
    return { ...req };
  }

  async createVerificationRequest(req: Omit<VerificationRequest, 'id' | 'submittedAt'>): Promise<VerificationRequest> {
    const newReq: VerificationRequest = {
      ...req,
      id: `vr-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      isDemo: false,
    };
    this.data.verificationRequests = [newReq, ...(this.data.verificationRequests || [])];
    this.persist();
    return newReq;
  }

  async getNotifications(role: string, entityId?: string): Promise<NotificationItem[]> {
    let list = (this.data.notifications || []) as NotificationItem[];
    if (role === 'admin') {
      return list.filter(n => n.forRole === 'admin');
    }
    if (role === 'brand') {
      return list.filter(n => n.forRole === 'brand' && (!entityId || n.brandId === entityId));
    }
    if (role === 'creator') {
      return list.filter(n => n.forRole === 'creator' && (!entityId || n.creatorId === entityId));
    }
    return list;
  }

  async markNotificationRead(id: string): Promise<void> {
    const n = this.data.notifications?.find((item: NotificationItem) => item.id === id);
    if (n) {
      n.read = true;
      this.persist();
    }
  }

  async getBrands(): Promise<Brand[]> {
    return [...(this.data.brands || [])];
  }

  async getBrand(id: string): Promise<Brand | null> {
    const b = this.data.brands?.find((item: Brand) => item.id === id);
    return b ? { ...b } : null;
  }

  async getReviews(creatorId?: string): Promise<Review[]> {
    let list = (this.data.reviews || []) as Review[];
    if (creatorId) list = list.filter(r => r.creatorId === creatorId);
    return [...list];
  }

  async addReview(review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isDemo: false,
    };
    this.data.reviews = [newRev, ...(this.data.reviews || [])];
    this.persist();
    return newRev;
  }

  async resetDemoData(): Promise<void> {
    this.data = JSON.parse(JSON.stringify(seedDataRaw));
    this.persist();
  }
}

// Export singleton instance
export const dataService: DataService = new SeedAdapter();
