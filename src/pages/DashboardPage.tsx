import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
  Plus,
  Film,
  Link as LinkIcon,
  Upload,
  Video,
  Play,
  Zap,
  TrendingUp,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Brief, Engagement, Proposal, NotificationItem, Creator, PortfolioItem } from '../types';
import { dataService } from '../services/dataService';
import { EngagementModal } from '../components/EngagementModal';
import { PortfolioSubmissionModal } from '../components/PortfolioSubmissionModal';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onOpenCreator: (creator: Creator) => void;
  openPortfolioSubmission?: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenCreator,
  openPortfolioSubmission,
}) => {
  const { user, role, refreshUnreadCount } = useAuth();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [activeEngagement, setActiveEngagement] = useState<Engagement | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [creatorPortfolio, setCreatorPortfolio] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    if (openPortfolioSubmission) {
      setIsSubmissionModalOpen(true);
    }
  }, [openPortfolioSubmission]);

  useEffect(() => {
    loadDashboard();
  }, [user, role]);

  const loadDashboard = async () => {
    const [brfs, props, engs, notifs, crs] = await Promise.all([
      dataService.getBriefs(),
      dataService.getProposals(),
      dataService.getEngagements(),
      dataService.getNotifications(role, role === 'brand' ? user?.brandId : user?.creatorId),
      dataService.getCreators(),
    ]);

    setBriefs(brfs);
    setProposals(props);
    setEngagements(engs);
    setNotifications(notifs);
    setCreators(crs);

    const activeCreatorId = user?.creatorId || (crs.length > 0 ? crs[0].id : 'cr-aanya-frames');
    const portItems = await dataService.getPortfolioByCreator(activeCreatorId);
    setCreatorPortfolio(portItems);
  };

  const handleMarkNotification = async (id: string) => {
    await dataService.markNotificationRead(id);
    await loadDashboard();
    await refreshUnreadCount();
  };

  const handleAcceptProposal = async (prop: Proposal) => {
    const brief = briefs.find(b => b.id === prop.briefId);
    if (!brief) return;

    // Update proposal status
    prop.status = 'accepted';
    await dataService.updateProposal(prop);

    // Update brief status
    brief.status = 'hired';
    await dataService.updateBrief(brief);

    // Create an active engagement
    const newEng = await dataService.createEngagement({
      briefId: brief.id,
      creatorId: prop.creatorId,
      brandId: brief.brandId,
      stage: 'kickoff',
      stages: ['kickoff', 'in_production', 'review', 'revisions', 'approved', 'delivered', 'completed'],
      agreedPriceUSD: prop.priceUSD,
      revisionsIncluded: brief.revisionRounds,
      revisionsUsed: 0,
      startedAt: new Date().toISOString().split('T')[0],
      dueDate: brief.deadline,
      milestones: [
        { id: 'm1', title: 'Kickoff and prompt boards approved', amountUSD: Math.round(prop.priceUSD * 0.3), status: 'held-in-escrow', dueDate: brief.deadline },
        { id: 'm2', title: 'First cuts delivered for review', amountUSD: Math.round(prop.priceUSD * 0.4), status: 'pending', dueDate: brief.deadline },
        { id: 'm3', title: 'Final delivery & tool licence receipts', amountUSD: Math.round(prop.priceUSD * 0.3), status: 'pending', dueDate: brief.deadline },
      ],
      escrowNote: 'Mock escrow for demonstration only. No real payments are processed.',
      messages: [
        { from: 'brand', text: `Welcome! Proposal accepted for "${brief.title}". Let's kick off production.`, at: new Date().toISOString() },
      ],
      versions: [],
      licenseSummary: {
        status: 'draft',
        usageTypes: brief.commercialUse.usageTypes,
        territory: brief.commercialUse.territory,
        durationMonths: brief.commercialUse.durationMonths,
        exclusivity: brief.commercialUse.exclusivity,
        toolsDisclosed: [],
        voiceConsentOnFile: true,
        disclaimer: 'Self-declared by creator. Not legal advice.',
      },
    });

    await loadDashboard();
    setActiveEngagement(newEng);
  };

  const currentCreator = creators.find(c => c.id === user?.creatorId) || creators[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Greeting with Radiant Glass Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0e1017] via-[#121422] to-[#0e1017] border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                role === 'brand'
                  ? 'bg-blue-500/15 text-cyan-300 border-cyan-500/30'
                  : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
              }`}>
                {role.toUpperCase()} PORTAL
              </span>
              <span className="text-xs text-neutral-400 font-mono">Authenticated Demo Session</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">{user?.displayName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              {role === 'brand'
                ? 'Manage active campaign briefs, evaluate creator aesthetic style reels, and sign off on escrow iterations.'
                : 'Upload highlight reels, manage client commissions, and observe your verified trust score.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {role === 'creator' && (
              <button
                onClick={() => setIsSubmissionModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
              >
                <Upload className="w-4 h-4" />
                <span>Submit Portfolio Reel</span>
              </button>
            )}

            {role === 'brand' ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsSubmissionModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-cyan-300 font-semibold text-xs flex items-center gap-1.5 border border-cyan-500/30 transition-colors"
                  title="Open creator portfolio submission component"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload Reel as Creator</span>
                </button>
                <button
                  onClick={() => onNavigate('briefs')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Brief</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => currentCreator && onOpenCreator(currentCreator)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>View Public Reel Player</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Creator Checklist & Stats (if creator role) */}
      {role === 'creator' && currentCreator && (
        <div className="p-6 rounded-3xl bg-[#0e1017]/90 border border-white/10 space-y-4 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Director Profile Completeness &amp; Trust Index
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                High scores increase recommendation priority in marketing director search results.
              </p>
            </div>
            <span className="text-sm font-mono font-bold text-emerald-400">
              {currentCreator.profileCompleteness}% Complete
            </span>
          </div>

          <div className="w-full bg-white/[0.05] rounded-full h-2.5 overflow-hidden p-0.5 border border-white/[0.06]">
            <div
              className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm shadow-emerald-400/50"
              style={{ width: `${currentCreator.profileCompleteness}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div className="p-3.5 rounded-2xl bg-[#08090d] border border-white/[0.06] hover:border-cyan-500/30 transition-colors">
              <p className="text-neutral-400 text-[10px] font-mono uppercase">Trust Score</p>
              <p className="text-xl font-bold text-cyan-300 mt-0.5 font-mono">{currentCreator.trustScore}<span className="text-xs text-neutral-500">/100</span></p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#08090d] border border-white/[0.06] hover:border-purple-500/30 transition-colors">
              <p className="text-neutral-400 text-[10px] font-mono uppercase">Verified AI Tools</p>
              <p className="text-xl font-bold text-purple-300 mt-0.5 font-mono">{currentCreator.tools.length} <span className="text-xs text-neutral-500">Tools</span></p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#08090d] border border-white/[0.06] hover:border-emerald-500/30 transition-colors">
              <p className="text-neutral-400 text-[10px] font-mono uppercase">Repeat Client Rate</p>
              <p className="text-xl font-bold text-emerald-300 mt-0.5 font-mono">{currentCreator.stats.repeatClientRate}%</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#08090d] border border-white/[0.06] hover:border-amber-500/30 transition-colors">
              <p className="text-neutral-400 text-[10px] font-mono uppercase">Avg Turnaround Time</p>
              <p className="text-xl font-bold text-amber-300 mt-0.5 font-mono">{currentCreator.stats.avgResponseHours}h <span className="text-xs text-neutral-500">Response</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Creator Highlight Reels & Portfolio Projects Section */}
      <div className="space-y-4 p-6 sm:p-7 rounded-3xl bg-[#0e1017]/90 border border-white/10 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-400" />
                Highlight Reels &amp; Master Works ({creatorPortfolio.length})
              </h2>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
                Aesthetic Showcase
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">
              Project URLs, AI tool stacks, and video highlight reels observed by company managers evaluating your aesthetic style for hire.
            </p>
          </div>

          <button
            onClick={() => setIsSubmissionModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5 self-start sm:self-auto transition-all hover:scale-105"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Submit New Reel</span>
          </button>
        </div>

        {creatorPortfolio.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl space-y-3 bg-[#08090d]/50">
            <Film className="w-12 h-12 text-neutral-600 mx-auto" />
            <div>
              <p className="text-sm font-bold text-white">No highlight reels uploaded yet</p>
              <p className="text-xs text-neutral-400 mt-0.5 max-w-sm mx-auto">
                Upload your AI highlight reel with project URLs and tool stacks so company managers can observe and hire you.
              </p>
            </div>
            <button
              onClick={() => setIsSubmissionModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20"
            >
              Upload Highlight Reel Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {creatorPortfolio.map(item => {
              const itemUrls = (item.projectUrls && item.projectUrls.length > 0)
                ? item.projectUrls
                : item.projectUrl
                ? [item.projectUrl]
                : [];

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#08090d] border border-white/[0.08] flex flex-col justify-between group hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 space-y-3"
                >
                  <div className="space-y-3">
                    {/* Thumbnail / Video */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.videoUrl && (
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/40 flex items-center gap-1 shadow-md">
                          <Video className="w-3 h-3 text-cyan-400" />
                          <span>Reel Video Ready</span>
                        </div>
                      )}
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono text-white border border-white/15">
                        {item.aspectRatio} · {item.durationSec ? `${item.durationSec}s` : 'Master'}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">{item.title}</h4>
                      <p className="text-xs text-neutral-300 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* AI Tool Stacks Used */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">AI Tool Stacks:</span>
                      <div className="flex flex-wrap gap-1">
                        {item.tools.slice(0, 4).map(tool => (
                          <span
                            key={tool}
                            className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-cyan-300 font-medium"
                          >
                            {tool}
                          </span>
                        ))}
                        {item.tools.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-neutral-400">
                            +{item.tools.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Project URLs */}
                    {itemUrls.length > 0 && (
                      <div className="pt-2 border-t border-white/[0.06] space-y-1">
                        <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">Project URLs:</span>
                        <div className="flex flex-wrap gap-2">
                          {itemUrls.map((url, uIdx) => (
                            <a
                              key={uIdx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono underline"
                            >
                              <LinkIcon className="w-3 h-3" />
                              <span className="truncate max-w-[130px]">{url.replace('https://', '').replace('http://', '')}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono">
                      {item.commercialStatus}
                    </span>

                    <button
                      onClick={() => currentCreator && onOpenCreator(currentCreator)}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 text-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Inspect in Reel Player</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Engagements Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            Active Client Engagements ({engagements.length})
          </h2>
          <span className="text-xs text-neutral-400">Click any engagement to open production room</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {engagements.map(eng => {
            const brief = briefs.find(b => b.id === eng.briefId);
            const creator = creators.find(c => c.id === eng.creatorId);

            return (
              <div
                key={eng.id}
                onClick={() => setActiveEngagement(eng)}
                className="p-5 rounded-2xl bg-[#0e1017]/90 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-lg shadow-black/20 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-neutral-300 border border-white/5">
                      #{eng.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {eng.stage.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {brief?.title || `Engagement for ${creator?.name}`}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1">
                    With {creator?.name} · {eng.revisionsUsed}/{eng.revisionsIncluded} revisions
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-mono text-sm text-gradient-amber">${eng.agreedPriceUSD}</span>
                  <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-semibold">
                    Enter Workspace <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proposals Received & Status */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          Proposals Pipeline ({proposals.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proposals.map(prop => {
            const brief = briefs.find(b => b.id === prop.briefId);
            const creator = creators.find(c => c.id === prop.creatorId);

            return (
              <div
                key={prop.id}
                className="p-5 rounded-2xl bg-[#0e1017]/90 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">
                      {creator?.name || prop.creatorId}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        prop.status === 'accepted'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : prop.status === 'declined'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </div>

                  <p className="text-xs text-cyan-300 font-medium mb-1">
                    For: {brief?.title || prop.briefId}
                  </p>
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {prop.coverMessage}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-white">
                    ${prop.priceUSD} · {prop.timelineDays} days
                  </span>

                  {role === 'brand' && prop.status === 'submitted' && (
                    <button
                      onClick={() => handleAcceptProposal(prop)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
                    >
                      Accept &amp; Commission
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* In-App Notifications Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          Recent Activity &amp; Notifications
        </h2>

        <div className="space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleMarkNotification(notif.id)}
              className={`p-4 rounded-2xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                notif.read
                  ? 'bg-white/[0.02] border-white/5 text-neutral-400'
                  : 'bg-[#0e1017] border-cyan-500/40 text-neutral-100 font-medium shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${notif.read ? 'bg-neutral-600' : 'bg-cyan-400 shadow-sm shadow-cyan-400/50'}`} />
                <span>{notif.text}</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {new Date(notif.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Modal */}
      {activeEngagement && (
        <EngagementModal
          engagement={activeEngagement}
          onClose={() => setActiveEngagement(null)}
          onRefresh={loadDashboard}
        />
      )}

      {/* Portfolio Submission Modal for Creators */}
      {isSubmissionModalOpen && currentCreator && (
        <PortfolioSubmissionModal
          creator={currentCreator}
          isOpen={isSubmissionModalOpen}
          onClose={() => setIsSubmissionModalOpen(false)}
          onSuccess={async () => {
            await loadDashboard();
          }}
        />
      )}
    </div>
  );
};
