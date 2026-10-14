import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Sparkles,
  Search,
  DollarSign,
  Calendar,
  Layers,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  ArrowRight,
  ShieldAlert,
  Clock,
  Briefcase,
  Award
} from 'lucide-react';
import { Brief, Creator, Proposal } from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import seedData from '../data/seed.json';

interface BriefsPageProps {
  onSelectCreator: (creator: Creator) => void;
  onSelectBrief?: (brief: Brief) => void;
}

export const BriefsPage: React.FC<BriefsPageProps> = ({ onSelectCreator }) => {
  const { user, role } = useAuth();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalBrief, setProposalBrief] = useState<Brief | null>(null);

  // Proposal form state
  const [coverMessage, setCoverMessage] = useState('');
  const [priceUSD, setPriceUSD] = useState<number>(500);
  const [timelineDays, setTimelineDays] = useState<number>(7);
  const [submittingProposal, setSubmittingProposal] = useState(false);

  // AI Brief Builder state
  const [roughIdea, setRoughIdea] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    suggestedQuestions?: string[];
    commercialFlags?: string[];
  } | null>(null);

  // New Brief Form state
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newCampaignGoal, setNewCampaignGoal] = useState('');
  const [newContentType, setNewContentType] = useState('ai-film');
  const [newRequirements, setNewRequirements] = useState<string[]>(['Character consistency', 'High resolution 4K']);
  const [newAspectRatios, setNewAspectRatios] = useState<string[]>(['16:9']);
  const [newDurationSec, setNewDurationSec] = useState<number>(45);
  const [newDeliverables, setNewDeliverables] = useState<number>(1);
  const [newMinBudget, setNewMinBudget] = useState<number>(500);
  const [newMaxBudget, setNewMaxBudget] = useState<number>(1500);
  const [newRevisionRounds, setNewRevisionRounds] = useState<number>(2);
  const [newLicenseProof, setNewLicenseProof] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [brfs, crs] = await Promise.all([
      dataService.getBriefs(),
      dataService.getCreators(),
    ]);
    setBriefs(brfs);
    setCreators(crs);
    if (brfs.length > 0 && !selectedBrief) {
      setSelectedBrief(brfs[0]);
    }
  };

  // AI Brief Builder Trigger
  const handleGenerateAiBrief = async (ideaText?: string) => {
    const textToUse = ideaText || roughIdea;
    if (!textToUse && !selectedTemplateId) return;

    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/briefs/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: textToUse,
          templateId: selectedTemplateId || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.brief) {
        const b = data.brief;
        setNewTitle(b.title || '');
        setNewSummary(b.summary || '');
        setNewCampaignGoal(b.campaignGoal || '');
        setNewContentType(b.contentType || 'ai-film');
        if (b.requirements) setNewRequirements(b.requirements);
        if (b.aspectRatios) setNewAspectRatios(b.aspectRatios);
        if (b.durationSec) setNewDurationSec(b.durationSec);
        if (b.budget) {
          setNewMinBudget(b.budget.min || 500);
          setNewMaxBudget(b.budget.max || 1500);
        }
        setAiSuggestions({
          suggestedQuestions: data.suggestedQuestions,
          commercialFlags: data.commercialFlags,
        });
      }
    } catch (e) {
      // Fallback local prompt generation
      setNewTitle(`Commercial Campaign: ${textToUse.slice(0, 36)}`);
      setNewSummary(textToUse);
      setNewCampaignGoal('Generate a high-converting aesthetic spot with verified character consistency and audio receipts.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCreateBriefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const brandId = user?.brandId || 'brand-nakshatra-weaves';
    const brandName = user?.displayName || 'Nakshatra Weaves';

    const created = await dataService.createBrief({
      title: newTitle,
      brandId,
      brandName,
      domains: ['fashion-apparel'],
      summary: newSummary,
      campaignGoal: newCampaignGoal,
      requirements: newRequirements,
      targetAudience: 'Global commercial audience',
      contentType: newContentType,
      styleTags: ['Cinematic', 'Consistent Character', 'Volumetric Lighting'],
      aspectRatios: newAspectRatios,
      durationSec: newDurationSec,
      deliverables: newDeliverables,
      platforms: ['Instagram Reels', 'YouTube 4K'],
      preferredTools: ['Runway Gen-3', 'Midjourney v6.1', 'Kling AI'],
      languages: ['English'],
      budget: { min: newMinBudget, max: newMaxBudget, currency: 'USD' },
      deadline: '2026-11-15',
      revisionRounds: newRevisionRounds,
      commercialUse: {
        usageTypes: ['organic-social', 'paid-ads'],
        territory: 'Global',
        durationMonths: 12,
        exclusivity: 'none',
        toolLicenseProofRequired: newLicenseProof,
      },
      status: 'published',
    });

    setShowCreateModal(false);
    await loadData();
    setSelectedBrief(created);
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalBrief) return;

    setSubmittingProposal(true);
    const creatorId = user?.creatorId || 'cr-aanya-frames';

    await dataService.createProposal({
      briefId: proposalBrief.id,
      creatorId,
      coverMessage,
      priceUSD,
      timelineDays,
      relatedPortfolioItemIds: [],
      status: 'submitted',
    });

    setSubmittingProposal(false);
    setShowProposalModal(false);
    alert('Proposal submitted successfully! Check your Dashboard to track status.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span>COMMERCIAL COMMISSION WORKSPACE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Creative Briefs &amp; Commission Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1">
            Browse verified production briefs with explicit licensing requirements, milestone escrow budgets, and AI-match scoring.
          </p>
        </div>

        <button
          onClick={() => {
            setRoughIdea('');
            setAiSuggestions(null);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Post Brief with AI Builder</span>
        </button>
      </div>

      {/* Briefs List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Brief Cards */}
        <div className="lg:col-span-2 space-y-4">
          {briefs.map(brief => {
            const isSelected = selectedBrief?.id === brief.id;
            return (
              <div
                key={brief.id}
                onClick={() => setSelectedBrief(brief)}
                className={`p-5 rounded-2xl bg-[#0e1017]/90 border transition-all duration-300 cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? 'border-indigo-500/80 bg-[#121420] shadow-xl shadow-indigo-500/15 ring-1 ring-indigo-500/40'
                    : 'border-white/[0.08] hover:border-white/20 hover:bg-[#10121c]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/[0.05] text-cyan-300 border border-cyan-500/30 font-bold">
                        {brief.contentType}
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">by <span className="text-neutral-200 font-semibold">{brief.brandName}</span></span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {brief.title}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      brief.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : brief.status === 'hired'
                        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {brief.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-4">
                  {brief.summary}
                </p>

                {/* Footer Metrics */}
                <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-3 text-neutral-400">
                    <span className="font-bold text-white font-mono text-sm text-gradient-amber">
                      ${brief.budget.min} - ${brief.budget.max}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      {brief.durationSec}s · {brief.deliverables} deliverable
                    </span>
                  </div>

                  <span className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center gap-1">
                    Inspect Requirements <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Selected Brief Inspector & Recommended Creators */}
        <div>
          {selectedBrief ? (
            <div className="p-6 rounded-2xl bg-[#0e1017]/95 border border-white/10 sticky top-24 space-y-6 backdrop-blur-xl shadow-2xl">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold">
                    Brief Inspector
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">Posted {selectedBrief.postedAt}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1.5">{selectedBrief.title}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Client: <span className="text-neutral-200 font-semibold">{selectedBrief.brandName}</span></p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1 font-mono">Campaign Goal</h4>
                <p className="text-xs text-neutral-200 leading-relaxed">{selectedBrief.campaignGoal}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1 font-mono">Requirements</h4>
                <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1">
                  {selectedBrief.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Commercial Rights */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1.5">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Commercial Requirements
                </p>
                <p className="text-neutral-300 text-[11px]">
                  <strong>Territory:</strong> {selectedBrief.commercialUse.territory} ·{' '}
                  <strong>Duration:</strong> {selectedBrief.commercialUse.durationMonths} months
                </p>
                <p className="text-neutral-300 text-[11px]">
                  <strong>Licence Proof Required:</strong>{' '}
                  <span className={selectedBrief.commercialUse.toolLicenseProofRequired ? 'text-emerald-400 font-semibold' : 'text-neutral-400'}>
                    {selectedBrief.commercialUse.toolLicenseProofRequired ? 'Mandatory (Receipts Required)' : 'Standard'}
                  </span>
                </p>
              </div>

              {/* Recommended Creators Match Score */}
              {selectedBrief.recommendedCreators && selectedBrief.recommendedCreators.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Recommended Creators (AI Scored)
                  </h4>
                  <div className="space-y-2">
                    {selectedBrief.recommendedCreators.slice(0, 3).map(rec => {
                      const cr = creators.find(c => c.id === rec.creatorId);
                      if (!cr) return null;
                      return (
                        <div
                          key={rec.creatorId}
                          onClick={() => onSelectCreator(cr)}
                          className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={cr.avatar} alt={cr.name} className="w-8 h-8 rounded-lg bg-neutral-800 object-cover" />
                            <div>
                              <p className="font-bold text-xs text-white">{cr.name}</p>
                              <p className="text-[10px] text-neutral-400 line-clamp-1">{rec.whyThisMatch[0]}</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                            {rec.score} pts
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setProposalBrief(selectedBrief);
                    setCoverMessage(`Hi ${selectedBrief.brandName} team, I would love to direct this ${selectedBrief.contentType} campaign with full tool receipts.`);
                    setShowProposalModal(true);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/25 hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Pitch &amp; Proposal</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center text-neutral-400 text-xs">
              Select a brief from the list to inspect requirements and recommended creator matches.
            </div>
          )}
        </div>
      </div>

      {/* AI Brief Builder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0e1017] border border-white/15 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] text-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                AI-Assisted Brief Builder
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Generator Strip */}
            <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-[#0e1017] border border-indigo-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Turn my rough vision into a production brief
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">Gemini Studio Engine</span>
              </div>

              <textarea
                value={roughIdea}
                onChange={e => setRoughIdea(e.target.value)}
                placeholder="Describe your rough vision: e.g. Need a high-energy EV scooter teaser for Instagram, night city neon look, show battery range, budget $1500..."
                rows={3}
                className="w-full bg-[#08090d] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />

              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400">
                <span className="text-neutral-500">Try sample:</span>
                {seedData.sampleRoughIdeas.slice(0, 3).map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRoughIdea(idea);
                      handleGenerateAiBrief(idea);
                    }}
                    className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 truncate max-w-[200px]"
                  >
                    {idea.slice(0, 24)}...
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleGenerateAiBrief()}
                disabled={isAiGenerating || (!roughIdea && !selectedTemplateId)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
              >
                {isAiGenerating ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Structuring Brief with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Structured Brief</span>
                  </>
                )}
              </button>
            </div>

            {/* Brief Edit Form */}
            <form onSubmit={handleCreateBriefSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-200 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Diwalifestive Handloom 45s Film"
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-200 block mb-1">Campaign Goal &amp; Summary</label>
                <textarea
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  rows={2}
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-200 block mb-1">Content Type</label>
                  <select
                    value={newContentType}
                    onChange={e => setNewContentType(e.target.value)}
                    className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ai-film">AI Film</option>
                    <option value="ai-animation">AI Animation</option>
                    <option value="product-ads">Product Ads</option>
                    <option value="virtual-influencers">Virtual Influencers</option>
                    <option value="explainers">Explainers</option>
                    <option value="music-videos">Music Videos</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-200 block mb-1">Duration &amp; Takes</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newDurationSec}
                      onChange={e => setNewDurationSec(Number(e.target.value))}
                      placeholder="Seconds"
                      className="w-1/2 bg-[#08090d] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                    <input
                      type="number"
                      value={newDeliverables}
                      onChange={e => setNewDeliverables(Number(e.target.value))}
                      placeholder="Deliverables"
                      className="w-1/2 bg-[#08090d] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-200 block mb-1">Budget Range (USD)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={newMinBudget}
                      onChange={e => setNewMinBudget(Number(e.target.value))}
                      className="w-1/2 bg-[#08090d] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={newMaxBudget}
                      onChange={e => setNewMaxBudget(Number(e.target.value))}
                      className="w-1/2 bg-[#08090d] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-neutral-200 block mb-1">Revisions Included</label>
                  <input
                    type="number"
                    value={newRevisionRounds}
                    onChange={e => setNewRevisionRounds(Number(e.target.value))}
                    className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={newLicenseProof}
                    onChange={e => setNewLicenseProof(e.target.checked)}
                    className="rounded border-white/20 bg-neutral-900 text-indigo-500 focus:ring-0"
                  />
                  <span>Require verified tool-licence proof from creator before milestone release</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Publish Brief
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Proposal Modal */}
      {showProposalModal && proposalBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0e1017] border border-white/15 rounded-2xl shadow-2xl p-6 text-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                Submit Creative Proposal
              </h3>
              <button
                onClick={() => setShowProposalModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 mb-4">
              Responding to: <strong className="text-white">{proposalBrief.title}</strong> by <span className="text-cyan-300">{proposalBrief.brandName}</span>
            </p>

            <form onSubmit={handleSendProposal} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-200 block mb-1">Cover Message &amp; Creative Approach</label>
                <textarea
                  required
                  rows={4}
                  value={coverMessage}
                  onChange={e => setCoverMessage(e.target.value)}
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-200 block mb-1">Your Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={priceUSD}
                    onChange={e => setPriceUSD(Number(e.target.value))}
                    className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-200 block mb-1">Turnaround Days</label>
                  <input
                    type="number"
                    required
                    value={timelineDays}
                    onChange={e => setTimelineDays(Number(e.target.value))}
                    className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-neutral-300 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Commercial Disclosure Commitment
                </p>
                <p>
                  By submitting, you agree to disclose all generative AI models, versioned prompt checkpoints, and confirm your subscription plan covers commercial client outputs.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProposal}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white font-bold shadow-lg shadow-indigo-600/20"
                >
                  {submittingProposal ? 'Submitting...' : 'Send Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
