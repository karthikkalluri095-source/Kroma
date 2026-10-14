import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Search,
  Film,
  ShieldCheck,
  FileText,
  Lock,
  Play
} from 'lucide-react';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onSearchDemo: (query: string) => void;
  onOpenCreatorDemo: (creatorId: string) => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSearchDemo,
  onOpenCreatorDemo,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. AI-Native Discovery & Persona Matching',
      icon: Search,
      badge: 'Discovery Engine',
      description:
        'Try searching "AI influencer for skincare". Watch how the engine instantly detects the synthetic persona intent, switches to the AI Influencers view, and scores Hana Seol and Jin-woo Park with exact domain, language, and tool weights.',
      actionLabel: 'Execute Skincare Search',
      action: () => {
        onNavigate('discover');
        onSearchDemo('AI influencer for skincare');
        onClose();
      },
    },
    {
      title: '2. Verifiable Portfolio & Workflow Pipeline',
      icon: Film,
      badge: 'Provenance',
      description:
        'Traditional marketplaces only show a final video. Kroma creators submit verifiable workflow pipelines: step-by-step tools (Midjourney → Veo → ElevenLabs → DaVinci), iterations, hours, and self-declared commercial rights clearing.',
      actionLabel: 'Inspect Aanya Reddy Profile',
      action: () => {
        onOpenCreatorDemo('cr-aanya-frames');
        onClose();
      },
    },
    {
      title: '3. Trust Score & Verification Signals',
      icon: ShieldCheck,
      badge: 'Trust Score 100',
      description:
        'Every creator carries a 100-point Trust Score: Verified Tools (30 pts, plan receipts), Verified Workflow (30 pts, screen recording), Verified Past Work (25 pts, live campaign link), and Profile Completeness (15 pts). Admins audit and approve requests in real time.',
      actionLabel: 'Open Verification Admin',
      action: () => {
        onNavigate('admin');
        onClose();
      },
    },
    {
      title: '4. AI-Assisted Brief Builder & Recommended Creators',
      icon: FileText,
      badge: 'Gemini Briefs',
      description:
        'Brands can turn messy ideas (e.g. "small chai brand Instagram video before Diwali") into structured creative briefs with duration, aspect ratios, revision rounds, and commercial use specs. Each brief scores recommended creators live.',
      actionLabel: 'Explore Creative Briefs',
      action: () => {
        onNavigate('briefs');
        onClose();
      },
    },
    {
      title: '5. Engagements, Iterations & Mock Escrow',
      icon: Lock,
      badge: 'Delivery Room',
      description:
        'Engagements enforce a strict state machine: Kickoff → In Production → Review → Revisions → Approved → Delivered. Features versioned cuts (v1, v2 with change summaries), revision counters, mock escrow milestone tracking, and a final licence receipt summary.',
      actionLabel: 'Open Dashboard Workspace',
      action: () => {
        onNavigate('dashboard');
        onClose();
      },
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-indigo-500/30 rounded-2xl shadow-2xl p-6 text-neutral-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {currentStep + 1}
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              Judge & Reviewer Guided Tour
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-base">
              <StepIcon className="w-5 h-5" />
              <span>{step.title}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-500/30">
              {step.badge}
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            {step.description}
          </p>

          <button
            onClick={step.action}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{step.actionLabel}</span>
          </button>
        </div>

        {/* Step Indicator and Controls */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                  i === currentStep ? 'bg-indigo-500 w-5' : 'bg-neutral-700 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStep === steps.length - 1}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
