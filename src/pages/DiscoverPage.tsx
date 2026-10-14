import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Bot,
  Users,
  Sparkles,
  X,
  ArrowRight,
  TrendingUp,
  Check,
  RotateCcw,
  Film,
  ShieldCheck,
  Zap,
  Layers,
  Award
} from 'lucide-react';
import { Creator, AIPersona, Domain, Specialization, ToolItem } from '../types';
import { dataService } from '../services/dataService';
import { searchCreators, searchPersonas, isAiInfluencerQuery, SearchResult } from '../utils/search';
import { CreatorCard } from '../components/CreatorCard';
import { PersonaCard } from '../components/PersonaCard';
import { useAuth } from '../context/AuthContext';
import seedData from '../data/seed.json';

interface DiscoverPageProps {
  onSelectCreator: (creator: Creator) => void;
  onSelectPersona?: (persona: AIPersona) => void;
  onNavigate: (tab: string) => void;
  initialDomain?: string | null;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  onSelectCreator,
  onSelectPersona,
  onNavigate,
  initialDomain,
}) => {
  const { loginAsDemo, role } = useAuth();

  const [query, setQuery] = useState('');
  const [activeMode, setActiveMode] = useState<'creators' | 'personas'>('creators');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [personas, setPersonas] = useState<AIPersona[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedDomain, setSelectedDomain] = useState<string>(initialDomain || '');
  const [selectedSpec, setSelectedSpec] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedPriceBand, setSelectedPriceBand] = useState<string>('');
  const [selectedTurnaround, setSelectedTurnaround] = useState<number | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [commercialOnly, setCommercialOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState<boolean>(false);

  useEffect(() => {
    if (initialDomain) {
      setSelectedDomain(initialDomain);
    }
  }, [initialDomain]);

  useEffect(() => {
    Promise.all([
      dataService.getCreators(),
      dataService.getPersonas(),
      dataService.getDomains(),
      dataService.getSpecializations(),
      dataService.getTools(),
    ]).then(([crs, ps, dms, sps, tls]) => {
      setCreators(crs);
      setPersonas(ps);
      setDomains(dms);
      setSpecializations(sps);
      setTools(tls);
      setLoading(false);
    });
  }, []);

  // Handle Query Changes & Auto-toggle mode on AI Influencer triggers
  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (isAiInfluencerQuery(val)) {
      setActiveMode('personas');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedDomain('');
    setSelectedSpec('');
    setSelectedTool('');
    setSelectedFormat('');
    setSelectedPriceBand('');
    setSelectedTurnaround(undefined);
    setSelectedLanguage('');
    setSelectedLevel('');
    setCommercialOnly(false);
    setVerifiedOnly(false);
    setSortBy('relevance');
    setQuery('');
  };

  const hasActiveFilters = Boolean(
    selectedDomain ||
    selectedSpec ||
    selectedTool ||
    selectedFormat ||
    selectedPriceBand ||
    selectedTurnaround ||
    selectedLanguage ||
    selectedLevel ||
    commercialOnly ||
    verifiedOnly ||
    query
  );

  // Filtered & Scored Creators
  const creatorResults: SearchResult<Creator>[] = useMemo(() => {
    return searchCreators(query, creators, {
      domain: selectedDomain || undefined,
      specialization: selectedSpec || undefined,
      tool: selectedTool || undefined,
      contentType: selectedFormat || undefined,
      priceBand: selectedPriceBand || undefined,
      turnaroundDays: selectedTurnaround,
      language: selectedLanguage || undefined,
      experienceLevel: selectedLevel || undefined,
      commercialUseReady: commercialOnly || undefined,
      verifiedOnly: verifiedOnly || undefined,
      sort: sortBy,
    });
  }, [
    query,
    creators,
    selectedDomain,
    selectedSpec,
    selectedTool,
    selectedFormat,
    selectedPriceBand,
    selectedTurnaround,
    selectedLanguage,
    selectedLevel,
    commercialOnly,
    verifiedOnly,
    sortBy,
  ]);

  // Filtered & Scored Personas
  const personaResults: SearchResult<AIPersona>[] = useMemo(() => {
    return searchPersonas(query, personas, {
      domain: selectedDomain || undefined,
      language: selectedLanguage || undefined,
      sort: sortBy,
    });
  }, [query, personas, selectedDomain, selectedLanguage, sortBy]);

  const roughIdeas = [
    'Cyberpunk Saree Runway Kling 1.5',
    'Automotive Drone Commercial 4K',
    'Fintech SaaS 3D Motion Graphics',
    'Telugu Regional Skincare Explainer',
    'Virtual Fashion Influencer Lookbook'
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Search Section with Multi-Orb Ambient Lighting */}
      <div className="relative border-b border-white/[0.08] bg-[#08090d] overflow-hidden pt-14 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-indigo-600/20 to-fuchsia-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[400px] h-[300px] bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Quick Demo Switcher Strip */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-lg shadow-black/40">
            <span className="text-[11px] font-bold text-neutral-400 px-2.5 font-mono">EXPLORE:</span>
            <button
              onClick={() => loginAsDemo('brand')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'brand'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              Demo Brand (Marketing)
            </button>
            <button
              onClick={() => loginAsDemo('creator')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'creator'
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              Demo Creator (Studio)
            </button>
            <button
              onClick={() => loginAsDemo('admin')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              Demo Admin
            </button>
          </div>

          {/* Hero Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.12] font-display">
              The Premier Marketplace for{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Generative Directors
              </span>{' '}
              &amp;{' '}
              <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Virtual Personas
              </span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Connect with top-tier AI filmmakers who preserve character and product consistency across 20+ cuts, audit tool stacks, and clear commercial indemnity.
            </p>
          </div>

          {/* Glowing Search Box */}
          <div className="max-w-3xl mx-auto relative group pt-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-3xl blur-md opacity-40 group-hover:opacity-85 transition-opacity duration-500" />
            <div className="relative flex items-center bg-[#0d0e15] border border-white/15 rounded-2xl p-2 shadow-2xl">
              <Search className="w-5 h-5 text-cyan-400 ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => handleQueryChange(e.target.value)}
                placeholder="Search any domain, tool stack (Runway, Kling, Flux), dialect, or try 'AI influencer'..."
                className="w-full bg-transparent border-0 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-neutral-400 hover:text-white mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowFiltersDrawer(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-xs font-bold text-neutral-200 transition-colors shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
              </button>
            </div>
          </div>

          {/* Quick Query Ideas */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-400 pt-1">
            <span className="flex items-center gap-1 text-cyan-400 font-semibold font-mono text-[11px]">
              <TrendingUp className="w-3.5 h-3.5" /> Popular:
            </span>
            {roughIdeas.map((idea, idx) => (
              <button
                key={idx}
                onClick={() => handleQueryChange(idea)}
                className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-neutral-300 hover:text-cyan-200 transition-colors text-[11px]"
              >
                {idea}
              </button>
            ))}
          </div>

          {/* Trust KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
              <span className="font-bold text-white">35</span>
              <span className="text-neutral-400 text-[11px]">Verified Directors</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-sm shadow-fuchsia-400/50" />
              <span className="font-bold text-white">31</span>
              <span className="text-neutral-400 text-[11px]">Tool Stacks</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              <span className="font-bold text-white">100%</span>
              <span className="text-neutral-400 text-[11px]">Escrow Protected</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
              <span className="font-bold text-white">26</span>
              <span className="text-neutral-400 text-[11px]">Industry Domains</span>
            </div>
          </div>

          {/* Mode Switcher: Creators vs AI Influencers */}
          <div className="inline-flex rounded-2xl p-1 bg-white/[0.04] border border-white/10 mt-3 shadow-lg">
            <button
              onClick={() => setActiveMode('creators')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'creators'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-4 h-4 text-cyan-300" />
              <span>AI Content Creators ({creatorResults.length})</span>
            </button>
            <button
              onClick={() => setActiveMode('personas')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'personas'
                  ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-600/30'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.04]'
              }`}
            >
              <Bot className="w-4 h-4 text-fuchsia-200" />
              <span>AI Influencers &amp; Virtual Personas ({personaResults.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Browse Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Active Filter Chips & Results Count Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white">
              {activeMode === 'creators' ? `${creatorResults.length} Generative Creators` : `${personaResults.length} Virtual Personas`}
            </span>
            {query && (
              <span className="text-xs text-cyan-300 bg-cyan-950/50 px-2.5 py-0.5 rounded-lg border border-cyan-500/30 font-medium">
                Matching "{query}"
              </span>
            )}
            {selectedDomain && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-indigo-950/60 text-indigo-300 px-3 py-1 rounded-xl border border-indigo-500/30 font-medium">
                Domain: {domains.find(d => d.id === selectedDomain)?.label}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => setSelectedDomain('')} />
              </span>
            )}
            {selectedSpec && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-purple-950/60 text-purple-300 px-3 py-1 rounded-xl border border-purple-500/30 font-medium">
                {specializations.find(s => s.id === selectedSpec)?.label}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => setSelectedSpec('')} />
              </span>
            )}
            {selectedTool && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-fuchsia-950/60 text-fuchsia-300 px-3 py-1 rounded-xl border border-fuchsia-500/30 font-medium font-mono">
                Tool: {selectedTool}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => setSelectedTool('')} />
              </span>
            )}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline ml-2"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto text-xs">
            <span className="text-neutral-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-[#0e1017] border border-white/10 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="relevance">Relevance Score</option>
              <option value="most-verified">Trust Score &amp; Verified</option>
              <option value="price-low">Starting Rate: Low to High</option>
              <option value="price-high">Starting Rate: High to Low</option>
              <option value="fastest">Fastest Turnaround</option>
              <option value="newest">Experience Level</option>
            </select>
          </div>
        </div>

        {/* Content Grids */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-white/[0.03] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : activeMode === 'creators' ? (
          <div className="pt-8">
            {creatorResults.length === 0 ? (
              <div className="text-center py-20 p-8 rounded-2xl bg-white/[0.02] border border-white/10 max-w-lg mx-auto">
                <Sparkles className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No exact creator matches found</h3>
                <p className="text-xs text-neutral-400 mt-1 mb-5 leading-relaxed">
                  Try broadening your search query or reset active filters to explore all 35 verified AI filmmakers.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creatorResults.map(({ item, whyThisMatch, isFallback }) => (
                  <CreatorCard
                    key={item.id}
                    creator={item}
                    whyThisMatch={whyThisMatch}
                    isFallback={isFallback}
                    onSelect={onSelectCreator}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="pt-8">
            {personaResults.length === 0 ? (
              <div className="text-center py-20 p-8 rounded-2xl bg-white/[0.02] border border-white/10 max-w-lg mx-auto">
                <Bot className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No virtual personas found</h3>
                <p className="text-xs text-neutral-400 mt-1 mb-5">
                  Try clearing domain filters to see synthetic personas across fashion, music, and fintech.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20"
                >
                  Reset Persona Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {personaResults.map(({ item, whyThisMatch, isFallback }) => (
                  <PersonaCard
                    key={item.id}
                    persona={item}
                    whyThisMatch={whyThisMatch}
                    isFallback={isFallback}
                    onSelectPersona={onSelectPersona}
                    onSelectCreator={id => {
                      const c = creators.find(cr => cr.id === id);
                      if (c) onSelectCreator(c);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters Drawer Modal */}
      {showFiltersDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0e1017] border-l border-white/10 h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                Filter Marketplace
              </h3>
              <button
                onClick={() => setShowFiltersDrawer(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Domains Filter */}
            <div>
              <label className="text-xs font-bold text-neutral-200 block mb-2">Industry Domain</label>
              <select
                value={selectedDomain}
                onChange={e => setSelectedDomain(e.target.value)}
                className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">All 26 Domains</option>
                {domains.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Specializations Filter */}
            <div>
              <label className="text-xs font-bold text-neutral-200 block mb-2">Specialization</label>
              <select
                value={selectedSpec}
                onChange={e => setSelectedSpec(e.target.value)}
                className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">All Specializations</option>
                {specializations.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tools / Models */}
            <div>
              <label className="text-xs font-bold text-neutral-200 block mb-2">AI Tool &amp; Pipeline</label>
              <select
                value={selectedTool}
                onChange={e => setSelectedTool(e.target.value)}
                className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">Any AI Tool</option>
                {tools.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Aspect Ratios */}
            <div>
              <label className="text-xs font-bold text-neutral-200 block mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {['16:9', '9:16', '1:1', '4:5', '2.39:1'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(selectedFormat === fmt ? '' : fmt)}
                    className={`py-2 text-xs font-mono rounded-xl border text-center transition-all ${
                      selectedFormat === fmt
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-cyan-400/50 shadow-md shadow-indigo-600/30'
                        : 'bg-[#08090d] text-neutral-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Band */}
            <div>
              <label className="text-xs font-bold text-neutral-200 block mb-2">Budget Tier</label>
              <div className="grid grid-cols-2 gap-2">
                {(seedData.filters.priceBands as any[]).map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedPriceBand(selectedPriceBand === b.id ? '' : b.id)}
                    className={`py-2 px-3 text-xs rounded-xl border text-left transition-all ${
                      selectedPriceBand === b.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-purple-400/50 shadow-md shadow-purple-600/30'
                        : 'bg-[#08090d] text-neutral-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-200 font-medium">
                <input
                  type="checkbox"
                  checked={commercialOnly}
                  onChange={e => setCommercialOnly(e.target.checked)}
                  className="rounded border-white/20 bg-neutral-900 text-indigo-500 focus:ring-0"
                />
                <span>Commercial-Use Ready Only</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-200 font-medium">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={e => setVerifiedOnly(e.target.checked)}
                  className="rounded border-white/20 bg-neutral-900 text-cyan-500 focus:ring-0"
                />
                <span>Verified Badges Only (Trust Score 70+)</span>
              </label>
            </div>

            <div className="pt-6 flex gap-3 border-t border-white/10">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 text-xs font-bold transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFiltersDrawer(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
