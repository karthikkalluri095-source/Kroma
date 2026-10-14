import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building2,
  Layers,
  Users,
  Compass,
  Film,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BrandLoginPageProps {
  onNavigate: (tab: string) => void;
  onSearchMarketingCreators?: (query: string) => void;
}

export const BrandLoginPage: React.FC<BrandLoginPageProps> = ({
  onNavigate,
  onSearchMarketingCreators,
}) => {
  const { loginAsDemo, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [campaignDomain, setCampaignDomain] = useState('fashion-apparel');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await loginWithGoogle('brand');
    setIsSubmitting(false);
    onNavigate('discover');
  };

  const handleDemoBrandLogin = (brandName: string = 'Nakshatra Weaves') => {
    loginAsDemo('brand');
    onNavigate('discover');
  };

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchQuery.trim()) {
      loginAsDemo('brand');
      if (onSearchMarketingCreators) {
        onSearchMarketingCreators(quickSearchQuery.trim());
      }
      onNavigate('discover');
    }
  };

  const handleDomainChipClick = (domainQuery: string) => {
    loginAsDemo('brand');
    if (onSearchMarketingCreators) {
      onSearchMarketingCreators(domainQuery);
    }
    onNavigate('discover');
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-[#0e1017]/95 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl relative z-10">
        {/* Left Col: Marketing Discovery & Hiring Focus (7 cols on lg) */}
        <div className="lg:col-span-7 p-8 sm:p-10 bg-gradient-to-br from-blue-950/40 via-[#0e1017] to-[#08090d] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>FOR MARKETING TEAMS &amp; CREATIVE AGENCIES</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
                Search &amp; Hire Top Generative Directors for High-Impact Marketing
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Find verified creators who know how to keep characters and products consistent across 20+ cuts, with full tool provenance and licensing clearance.
              </p>
            </div>

            {/* Interactive Marketing Search Teaser */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#08090d] border border-white/10 space-y-3 shadow-inner">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
                <Search className="w-3.5 h-3.5" />
                Live Marketing Creator Search
              </span>

              <form onSubmit={handleQuickSearchSubmit} className="relative">
                <input
                  type="text"
                  value={quickSearchQuery}
                  onChange={e => setQuickSearchQuery(e.target.value)}
                  placeholder="e.g. Saree commercial Runway Gen-3, 3D SaaS motion, Telugu ads..."
                  className="w-full bg-[#121422] border border-white/10 rounded-xl pl-9 pr-28 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
                <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-bold text-[11px] transition-all shadow-sm"
                >
                  Search &amp; Enter
                </button>
              </form>

              {/* Sample campaign search tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-neutral-400 font-mono">Quick filters:</span>
                {[
                  'Fashion Lookbook',
                  'Automotive EV',
                  'Fintech 3D',
                  'Virtual Influencer',
                  'Regional Indian Ads',
                ].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleDomainChipClick(tag)}
                    className="px-2.5 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[10px] text-cyan-300 font-medium transition-colors"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Three key pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 shadow-sm">
                  <Film className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Aesthetic Video Reels</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                  Inspect temporal stability and camera choreography.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Commercial Clearance</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                  Tool license verification and indemnified rights.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 shadow-sm">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">26 Industry Domains</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                  Fashion, automotive, SaaS, fintech &amp; F&amp;B specialists.
                </p>
              </div>
            </div>
          </div>

          {/* Switch to Creator Login Prompt */}
          <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400">
            <div>
              <span className="font-semibold text-white">Are you an AI Content Creator?</span>
              <p className="text-[11px] text-neutral-400">
                Upload your highlight reels and let marketing managers hire you.
              </p>
            </div>
            <button
              onClick={() => onNavigate('login-creator')}
              className="px-4 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-sm"
            >
              <span>Creator Studio Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-300" />
            </button>
          </div>
        </div>

        {/* Right Col: Sign In Form (5 cols on lg) */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-[#0b0c12]">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Brand Manager Sign In</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Access creator search, campaign briefs, and proposal evaluations.
              </p>
            </div>

            {/* Instant Demo Button */}
            <div className="space-y-2 mb-6">
              <button
                type="button"
                onClick={() => handleDemoBrandLogin('Nakshatra Weaves')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>1-Click Brand Demo (Nakshatra Weaves)</span>
              </button>
              <p className="text-[10px] text-neutral-400 text-center font-mono">
                Pre-loaded with 15 briefs, received proposals &amp; creator matches
              </p>
            </div>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-[#0b0c12] text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                or sign in with company credentials
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-200 block mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Marketing Labs"
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-200 block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="marketing.director@company.com"
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-200 block mb-1">Primary Campaign Domain</label>
                <select
                  value={campaignDomain}
                  onChange={e => setCampaignDomain(e.target.value)}
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="fashion-apparel">Fashion &amp; Apparel</option>
                  <option value="beauty-skincare">Beauty &amp; Skincare</option>
                  <option value="automotive-mobility">Automotive &amp; Mobility</option>
                  <option value="tech-saas">Tech &amp; SaaS</option>
                  <option value="food-beverage">Food &amp; Beverage</option>
                  <option value="fintech-finance">Fintech &amp; Finance</option>
                  <option value="travel-hospitality">Travel &amp; Hospitality</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-200 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-xs border border-white/15 transition-colors shadow-sm"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In as Marketing Brand'}
              </button>
            </form>
          </div>

          <p className="text-[10px] text-neutral-500 text-center mt-6">
            Protected by Kroma's Generative Media Commercial Indemnity Terms.
          </p>
        </div>
      </div>
    </div>
  );
};
