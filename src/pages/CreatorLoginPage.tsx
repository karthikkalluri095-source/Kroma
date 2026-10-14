import React, { useState } from 'react';
import {
  Film,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Upload,
  Layers,
  Video,
  DollarSign,
  Building2,
  UserCheck,
  Star,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';

interface CreatorLoginPageProps {
  onNavigate: (tab: string) => void;
  onOpenPortfolioUpload?: () => void;
}

export const CreatorLoginPage: React.FC<CreatorLoginPageProps> = ({
  onNavigate,
  onOpenPortfolioUpload,
}) => {
  const { loginAsDemo, loginWithGoogle } = useAuth();
  const [handle, setHandle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [email, setEmail] = useState('');
  const [primaryTools, setPrimaryTools] = useState('Runway Gen-3, Midjourney v6, Kling AI, Flux');
  const [password, setPassword] = useState('');
  const [autoOpenUpload, setAutoOpenUpload] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await loginWithGoogle('creator');
    setIsSubmitting(false);

    if (autoOpenUpload && onOpenPortfolioUpload) {
      onOpenPortfolioUpload();
    }
    onNavigate('dashboard');
  };

  const handleDemoCreatorLogin = (creatorRole: 'creator', creatorId?: string) => {
    loginAsDemo('creator');
    if (autoOpenUpload && onOpenPortfolioUpload) {
      onOpenPortfolioUpload();
    }
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-fuchsia-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-[#0e1017]/95 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl relative z-10">
        {/* Left Column: Creator Opportunities & Manager Observation (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 bg-gradient-to-br from-purple-950/40 via-[#0e1017] to-[#08090d] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold shadow-lg shadow-purple-500/10">
              <Film className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>FOR AI FILMMAKERS, DIRECTORS &amp; PERSONA DESIGNERS</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-display tracking-tight">
                Upload Your AI Highlight Reel &amp; Let Brand Managers{' '}
                <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Observe Your Aesthetic Style
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Marketing leads and brand managers evaluate highlight reels for camera trajectory, character consistency, and commercial clearance. Upload your portfolio projects, verify your tool stacks, and receive direct brief invitations.
              </p>
            </div>

            {/* How Manager Observation & Hiring Works */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#08090d] border border-white/10 space-y-3 shadow-inner">
              <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-400 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                How Brand Managers Evaluate &amp; Hire You
              </span>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-indigo-500/30 shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Upload Your Highlight Reel (.mp4 or URL)</span>
                      <Upload className="w-3 h-3 text-cyan-400" />
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">
                      Include project URLs (Vimeo, Behance, YouTube), AI tool stacks used, and aesthetic prompt direction.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-purple-500/30 shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Managers Observe in the Aesthetic Player</span>
                      <Play className="w-3 h-3 text-fuchsia-400" />
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">
                      Company managers evaluate your style in 0.5x slow-motion, inspect character lock, and audit commercial tool licenses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-emerald-500/30 shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Receive Paid Briefs &amp; Escrow Contracts</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">
                      Get hired directly with milestone protection ($500 - $3,500+ per spot) and zero client ghosting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification & Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] text-neutral-400 font-mono block">Average Rate</span>
                <p className="text-sm font-bold text-white mt-0.5 font-mono">$600 - $2,500</p>
                <span className="text-[10px] text-emerald-400 font-medium">Per commercial spot</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] text-neutral-400 font-mono block">Tool Receipts</span>
                <p className="text-sm font-bold text-white mt-0.5 font-mono">31 AI Tools</p>
                <span className="text-[10px] text-indigo-400 font-medium">Runway, Kling, Flux</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-neutral-400 font-mono block">Protected Payment</span>
                <p className="text-sm font-bold text-white mt-0.5 font-mono">Mock Escrow</p>
                <span className="text-[10px] text-fuchsia-400 font-medium">Milestone releases</span>
              </div>
            </div>
          </div>

          {/* Switch to Brand Login Link */}
          <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400">
            <div>
              <span className="font-semibold text-white">Are you a Brand or Agency Manager?</span>
              <p className="text-[11px] text-neutral-400">
                Looking to search creators for marketing campaigns?
              </p>
            </div>
            <button
              onClick={() => onNavigate('login-brand')}
              className="px-4 py-2 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-500/40 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Brand &amp; Marketing Sign In</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Right Column: Creator Sign In & Demo Access (5 cols) */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-[#0b0c12]">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Creator Studio Sign In</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Sign in to manage your reels, submit new projects, and review brief invitations.
              </p>
            </div>

            {/* 1-Click Demo Creator Logins */}
            <div className="space-y-2.5 mb-6">
              <button
                type="button"
                onClick={() => handleDemoCreatorLogin('creator', 'cr-aanya-frames')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-fuchsia-600/25 flex items-center justify-between transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <div className="text-left">
                    <p className="font-bold">1-Click Demo: Aanya Sharma</p>
                    <p className="text-[10px] text-purple-100 font-normal">Generative Director (Fashion &amp; Film)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoCreatorLogin('creator', 'cr-diego-motorreel')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-200 text-xs flex items-center justify-between transition-colors"
              >
                <div className="text-left">
                  <span className="font-bold text-white">Demo: Diego Fuentes</span>
                  <span className="text-[10px] text-neutral-400 block font-mono">Automotive &amp; Mobility AI Ads</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-[#0b0c12] text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                or sign in / register with creator profile
              </span>
            </div>

            <form onSubmit={handleCustomLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-200 block mb-1">Creator Handle</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-mono">@</span>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={e => setHandle(e.target.value)}
                    placeholder="my.creative.handle"
                    className="w-full bg-[#08090d] border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-fuchsia-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-200 block mb-1">Full Name / Studio Name</label>
                <input
                  type="text"
                  required
                  value={creatorName}
                  onChange={e => setCreatorName(e.target.value)}
                  placeholder="e.g. Kai Jensen Studios"
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-200 block mb-1">Creator Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="creator@generative.studio"
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-200 block mb-1">Primary AI Tool Stack</label>
                <input
                  type="text"
                  value={primaryTools}
                  onChange={e => setPrimaryTools(e.target.value)}
                  placeholder="Runway Gen-3, Flux, Kling, ComfyUI, Sora"
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-fuchsia-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-200 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              {/* Auto open upload option */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={autoOpenUpload}
                  onChange={e => setAutoOpenUpload(e.target.checked)}
                  className="rounded bg-[#08090d] border-white/20 text-fuchsia-600 focus:ring-0"
                />
                <span className="text-[11px] text-neutral-300">
                  Open <strong>Portfolio Submission &amp; Reel Upload</strong> right after sign in
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-fuchsia-600/25 transition-all"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In as Creator & Upload Reel'}
              </button>
            </form>
          </div>

          <p className="text-[10px] text-neutral-500 text-center mt-6">
            100% of escrow payments released directly upon milestone deliverables approval.
          </p>
        </div>
      </div>
    </div>
  );
};
