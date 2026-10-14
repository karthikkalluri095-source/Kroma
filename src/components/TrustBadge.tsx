import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Wrench, Film, History, Info } from 'lucide-react';
import { VerificationInfo } from '../types';

interface TrustScoreProps {
  score: number;
  verification: VerificationInfo;
  completeness: number;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustBadge: React.FC<TrustScoreProps> = ({
  score,
  verification,
  completeness,
  size = 'md',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (s >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const ringColor = score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="relative inline-block">
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border cursor-pointer select-none transition-all hover:scale-105 ${getScoreColor(
          score
        )}`}
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span className="font-bold text-xs">Trust {score}</span>
        <Info className="w-3 h-3 opacity-60 ml-0.5" />
      </div>

      {/* Breakdown Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-xl bg-neutral-900/95 dark:bg-neutral-950/95 backdrop-blur-md border border-neutral-700/60 shadow-2xl z-50 text-xs text-neutral-200">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-2.5">
            <span className="font-semibold text-neutral-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Trust Score Breakdown
            </span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{score}/100</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-blue-400" />
                <div>
                  <p className="font-medium text-neutral-200">Verified Tools</p>
                  <p className="text-[10px] text-neutral-400">Plan proof & export receipts</p>
                </div>
              </div>
              <span className={`font-semibold ${verification.tools.verified ? 'text-emerald-400' : 'text-neutral-500'}`}>
                {verification.tools.verified ? '30 pts' : '0 pts'}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-purple-400" />
                <div>
                  <p className="font-medium text-neutral-200">Verified Workflow</p>
                  <p className="text-[10px] text-neutral-400">Screen recording prompt to export</p>
                </div>
              </div>
              <span className={`font-semibold ${verification.workflow.verified ? 'text-emerald-400' : 'text-neutral-500'}`}>
                {verification.workflow.verified ? '30 pts' : '0 pts'}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <p className="font-medium text-neutral-200">Verified Past Work</p>
                  <p className="text-[10px] text-neutral-400">Published URL & client citation</p>
                </div>
              </div>
              <span className={`font-semibold ${verification.pastWork.verified ? 'text-emerald-400' : 'text-neutral-500'}`}>
                {verification.pastWork.verified ? '25 pts' : '0 pts'}
              </span>
            </div>

            <div className="flex items-start justify-between pt-1 border-t border-neutral-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <div>
                  <p className="font-medium text-neutral-200">Profile Completeness</p>
                  <p className="text-[10px] text-neutral-400">{completeness}% filled</p>
                </div>
              </div>
              <span className="font-semibold text-emerald-400">
                {Math.round((completeness / 100) * 15)}/15 pts
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const VerificationChips: React.FC<{ verification: VerificationInfo; className?: string }> = ({
  verification,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {verification.tools.verified && (
        <span
          title={verification.tools.evidence || 'Verified tools plan licenses'}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
        >
          <Wrench className="w-2.5 h-2.5" />
          Tools Verified
        </span>
      )}
      {verification.workflow.verified && (
        <span
          title={verification.workflow.evidence || 'Verified prompt-to-export workflow'}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
        >
          <Film className="w-2.5 h-2.5" />
          Workflow Verified
        </span>
      )}
      {verification.pastWork.verified && (
        <span
          title={verification.pastWork.evidence || 'Verified client work with live campaign reference'}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        >
          <CheckCircle2 className="w-2.5 h-2.5" />
          Work Verified
        </span>
      )}
    </div>
  );
};
