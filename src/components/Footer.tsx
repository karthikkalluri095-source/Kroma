import React from 'react';
import { ShieldAlert, RotateCcw, CheckCircle, Database, Sparkles, BookOpen, Film, Building2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { role } = useAuth();

  const handleResetData = async () => {
    if (confirm('Reset all demo data back to seed defaults? Any local edits will be refreshed.')) {
      await dataService.resetDemoData();
      window.location.reload();
    }
  };

  return (
    <footer className="mt-20 border-t border-white/[0.08] bg-[#07080d] text-neutral-400 text-xs relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-t from-indigo-900/10 via-purple-900/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Honest Demo Data Banner */}
      <div className="bg-[#0b0c14]/90 border-b border-white/[0.06] py-2.5 px-4 text-center">
        <p className="flex items-center justify-center gap-1.5 text-neutral-400 font-medium text-[11px]">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            Demo environment: all creators, virtual personas, and brands are illustrative demo fixtures. AI tool names are cited for workflow transparency.
          </span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand Wordmark & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 p-[1.5px] shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-[#0a0a10] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-base text-white tracking-tight font-display">
                Kroma Creative
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              The premier AI-native marketplace connecting generative filmmakers, animators, prompt directors, and virtual influencers with forward-thinking marketing brands.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
              <span>35 Verified Directors · 26 Domains</span>
            </div>
          </div>

          {/* Col 2: Marketplace Navigation */}
          <div>
            <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3.5 font-mono">
              Marketplace
            </p>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('discover')} className="hover:text-cyan-300 transition-colors">
                  Discover AI Filmmakers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('domains')} className="hover:text-cyan-300 transition-colors">
                  Browse 26 Industry Domains
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('briefs')} className="hover:text-cyan-300 transition-colors">
                  Creative Briefs &amp; Commissions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-300 transition-colors">
                  Studio Dashboard &amp; Escrow
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login-brand')} className="hover:text-indigo-300 transition-colors flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-cyan-400" />
                  <span>Brand &amp; Marketing Portal</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login-creator')} className="hover:text-fuchsia-300 transition-colors flex items-center gap-1">
                  <Film className="w-3 h-3 text-fuchsia-400" />
                  <span>Creator Studio &amp; Reel Upload</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Commercial Safety */}
          <div>
            <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3.5 font-mono">
              Trust &amp; Standards
            </p>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors">
                  Trust Score Index &amp; Badges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('qa')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>QA Evaluation Test Suite</span>
                </button>
              </li>
              <li>
                <span className="text-neutral-400">Commercial License Receipts</span>
              </li>
              <li>
                <span className="text-neutral-400">0.5x Slow-Motion Reel Review</span>
              </li>
              <li>
                <span className="text-neutral-400">Milestone Escrow Protection</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Engine & Admin */}
          <div>
            <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3.5 font-mono">
              Platform Engine
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px]">
                <div className="flex items-center gap-1.5 text-neutral-200 font-semibold mb-1">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Adapter: {dataService.getActiveAdapterName().toUpperCase()}</span>
                </div>
                <p className="text-neutral-400 text-[10px] leading-relaxed">
                  Dual-adapter architecture with automatic in-memory seed fallback for zero-downtime evaluation.
                </p>
              </div>

              {role === 'admin' && (
                <button
                  onClick={handleResetData}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
          <p>© 2026 Kroma Creative Marketplace. Designed for Google AI Studio.</p>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('qa')} className="hover:text-white transition-colors font-mono">
              /qa Evaluation
            </button>
            <span>·</span>
            <span>Self-declared AI stacks; not legal counsel</span>
            <span>·</span>
            <span>Mock escrow verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
