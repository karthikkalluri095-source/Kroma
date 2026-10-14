import React, { useEffect, useState } from 'react';
import { Bot, Sparkles, User, ExternalLink, Globe, Sparkle } from 'lucide-react';
import { AIPersona, Creator } from '../types';
import { dataService } from '../services/dataService';

interface PersonaCardProps {
  persona: AIPersona;
  whyThisMatch?: string[];
  isFallback?: boolean;
  onSelectPersona?: (persona: AIPersona) => void;
  onSelectCreator?: (creatorId: string) => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  persona,
  whyThisMatch,
  isFallback,
  onSelectPersona,
  onSelectCreator,
}) => {
  const [operator, setOperator] = useState<Creator | null>(null);

  useEffect(() => {
    dataService.getCreator(persona.creatorId).then(c => {
      if (c) setOperator(c);
    });
  }, [persona.creatorId]);

  return (
    <div className="group relative rounded-2xl bg-[#0d0f18]/90 border border-white/[0.08] hover:border-fuchsia-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-500/20 flex flex-col overflow-hidden backdrop-blur-xl hover:-translate-y-1">
      {/* Top Banner & Avatar Header */}
      <div className="relative h-32 bg-gradient-to-r from-purple-950/70 via-fuchsia-950/40 to-[#0d0f18] p-4 flex items-end">
        {/* Synthetic AI Disclosure Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-fuchsia-500/35 text-[10px] font-bold text-fuchsia-300 flex items-center gap-1.5 shadow-md">
          <Bot className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Virtual Influencer</span>
        </div>

        {/* Pricing badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-fuchsia-500/15 backdrop-blur-md border border-fuchsia-500/40 text-xs font-bold text-fuchsia-200 font-mono shadow-sm">
          from ${persona.rateFromUSD}
        </div>

        {/* Avatar with holographic glow */}
        <div className="relative -mb-10 w-20 h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-purple-600 shadow-xl shadow-fuchsia-500/30 overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <img
            src={persona.avatar}
            alt={persona.name}
            className="w-full h-full object-cover rounded-[14px] bg-neutral-900"
          />
        </div>
      </div>

      {/* Persona Details */}
      <div className="pt-12 p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-fuchsia-300 transition-colors flex items-center gap-1.5 font-display">
                {persona.name}
                <Sparkle className="w-3.5 h-3.5 text-fuchsia-400 fill-fuchsia-400/40" />
              </h3>
              <p className="text-xs text-neutral-300 font-medium line-clamp-1 mt-0.5">
                {persona.tagline}
              </p>
            </div>
          </div>

          {/* Personality & Visual Style */}
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-start gap-1.5 text-neutral-300">
              <span className="text-neutral-500 font-semibold shrink-0">Persona:</span>
              <span className="line-clamp-1 text-neutral-200">{persona.personality}</span>
            </div>
            <div className="flex items-start gap-1.5 text-neutral-300">
              <span className="text-neutral-500 font-semibold shrink-0">Aesthetic:</span>
              <span className="line-clamp-1 text-cyan-300 font-mono text-[11px]">{persona.visualStyle}</span>
            </div>
          </div>

          {/* Content Pillars */}
          <div className="mt-3">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 font-mono">
              Campaign Pillars
            </p>
            <div className="flex flex-wrap gap-1">
              {persona.contentPillars.map(p => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] font-medium text-purple-300 border border-purple-500/30"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Languages & Platforms */}
          <div className="mt-3.5 flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px]">{persona.languages.join(', ')}</span>
            </div>
            <div className="text-[11px] font-mono text-fuchsia-300 font-medium">
              {persona.platforms.join(' · ')}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-white/[0.08]">
          {/* Why this matched line */}
          {whyThisMatch && whyThisMatch.length > 0 && (
            <div className={`p-2 rounded-xl text-[11px] mb-3 flex items-start gap-1.5 ${
              isFallback ? 'bg-neutral-800/60 text-neutral-400' : 'bg-fuchsia-950/40 text-fuchsia-200 border border-fuchsia-500/30'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{whyThisMatch.join(' · ')}</span>
            </div>
          )}

          {/* Operator attribution (The human behind the persona) */}
          <div className="flex items-center justify-between text-xs">
            {operator ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCreator?.(operator.id);
                }}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-cyan-300 transition-colors group/op text-left"
              >
                <img
                  src={operator.avatar}
                  alt={operator.name}
                  className="w-5 h-5 rounded-full bg-neutral-800 border border-white/20"
                />
                <span className="line-clamp-1 text-[11px]">Operated by {operator.name}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover/op:opacity-100 transition-opacity text-cyan-400" />
              </button>
            ) : (
              <span className="text-neutral-500 text-[11px]">Creator Operator</span>
            )}

            <button
              type="button"
              onClick={() => onSelectPersona?.(persona)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs shadow-md shadow-fuchsia-600/25 transition-all hover:scale-105"
            >
              Inquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
