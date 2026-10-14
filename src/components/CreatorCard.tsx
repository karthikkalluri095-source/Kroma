import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Star, Sparkles, ArrowUpRight, Film, CheckCircle2, Play } from 'lucide-react';
import { Creator, PortfolioItem } from '../types';
import { MediaPreview } from './MediaPreview';
import { TrustBadge, VerificationChips } from './TrustBadge';
import { dataService } from '../services/dataService';

interface CreatorCardProps {
  creator: Creator;
  whyThisMatch?: string[];
  isFallback?: boolean;
  onSelect: (creator: Creator) => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  whyThisMatch,
  isFallback,
  onSelect,
}) => {
  const [heroPortfolio, setHeroPortfolio] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    if (creator.portfolioItemIds?.length) {
      dataService.getPortfolioItem(creator.portfolioItemIds[0]).then(item => {
        if (item) setHeroPortfolio(item);
      });
    }
  }, [creator]);

  const availabilityColors = {
    available: 'bg-emerald-400 shadow-sm shadow-emerald-400/60',
    limited: 'bg-amber-400 shadow-sm shadow-amber-400/60',
    booked: 'bg-rose-400 shadow-sm shadow-rose-400/60',
  };

  const getToolBadgeStyle = (tool: string) => {
    const t = tool.toLowerCase();
    if (t.includes('runway') || t.includes('kling') || t.includes('sora') || t.includes('luma') || t.includes('veo')) {
      return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:border-cyan-400/60';
    }
    if (t.includes('midjourney') || t.includes('flux') || t.includes('firefly') || t.includes('dall')) {
      return 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30 hover:border-fuchsia-400/60';
    }
    if (t.includes('elevenlabs') || t.includes('suno') || t.includes('audio')) {
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:border-amber-400/60';
    }
    if (t.includes('comfy') || t.includes('topaz') || t.includes('after') || t.includes('davinci')) {
      return 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:border-purple-400/60';
    }
    return 'bg-white/[0.05] text-neutral-300 border-white/10';
  };

  return (
    <div
      onClick={() => onSelect(creator)}
      className="group relative rounded-2xl bg-[#0d0f18]/90 border border-white/[0.08] hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col overflow-hidden cursor-pointer backdrop-blur-xl hover:-translate-y-1"
    >
      {/* Top Media Preview with true aspect ratio & hover video */}
      <div className="relative overflow-hidden">
        <MediaPreview
          thumbnail={heroPortfolio?.thumbnail || creator.banner}
          thumbnailFallback={heroPortfolio?.thumbnailFallback || creator.bannerFallback}
          videoUrl={heroPortfolio?.videoUrl}
          title={heroPortfolio?.title || creator.headline}
          aspectRatio={heroPortfolio?.aspectRatio || '16:9'}
          className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Gradient scrim for top controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f18] via-transparent to-black/60 pointer-events-none" />

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white shadow-md">
            <span className={`w-2 h-2 rounded-full ${availabilityColors[creator.availability]}`} />
            <span className="capitalize">{creator.availability}</span>
          </div>

          <div className="pointer-events-auto">
            <TrustBadge
              score={creator.trustScore}
              verification={creator.verification}
              completeness={creator.profileCompleteness}
              size="sm"
            />
          </div>
        </div>

        {/* Video highlight reel indicator on thumbnail */}
        {heroPortfolio?.videoUrl && (
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow-md pointer-events-none group-hover:border-cyan-400 group-hover:bg-cyan-950/80 transition-colors">
            <Play className="w-3 h-3 text-cyan-400 fill-cyan-400/30" />
            <span>Highlight Reel</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Creator Header with Avatar */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-md">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-full h-full rounded-full bg-neutral-900 object-cover"
                  />
                </div>
                {creator.commercialUseReady && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0d0f18] flex items-center justify-center text-[9px] text-white shadow-xs" title="Commercial Cleared">
                    ✓
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-neutral-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1 text-sm tracking-tight">
                  {creator.name}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-cyan-400" />
                </h3>
                <p className="text-xs text-neutral-400 font-mono">@{creator.handle}</p>
              </div>
            </div>

            {creator.stats.rating && (
              <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/25 shadow-xs shrink-0">
                <Star className="w-3 h-3 fill-current text-amber-400" />
                <span>{creator.stats.rating.toFixed(1)}</span>
                <span className="text-[10px] text-neutral-400 font-normal">({creator.stats.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Headline */}
          <p className="text-xs text-neutral-300 line-clamp-2 mb-3 leading-relaxed font-normal">
            {creator.headline}
          </p>

          {/* Verification Chips */}
          <VerificationChips verification={creator.verification} className="mb-3" />

          {/* Tools Stack Chips with Vibrant Coding */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {creator.tools.slice(0, 4).map(t => (
              <span
                key={t}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono border font-medium transition-colors ${getToolBadgeStyle(t)}`}
              >
                {t}
              </span>
            ))}
            {creator.tools.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-neutral-400 border border-white/10">
                +{creator.tools.length - 4}
              </span>
            )}
          </div>
        </div>

        <div>
          {/* Why this matched banner */}
          {whyThisMatch && whyThisMatch.length > 0 && (
            <div className={`p-2 rounded-xl text-[11px] mb-3 flex items-start gap-1.5 ${
              isFallback
                ? 'bg-neutral-800/60 text-neutral-400 border border-neutral-700/40'
                : 'bg-indigo-950/50 text-indigo-200 border border-indigo-500/30'
            }`}>
              <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-cyan-400" />
              <span className="line-clamp-1">
                {isFallback && <strong className="text-amber-400 font-semibold mr-1">[Closest Match]</strong>}
                {whyThisMatch.join(' · ')}
              </span>
            </div>
          )}

          {/* Footer Rate & Turnaround */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>{creator.location.city}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                <Clock className="w-3 h-3 text-neutral-500" />
                <span>{creator.turnaroundDays}d delivery</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white font-mono bg-gradient-to-r from-white to-neutral-200 bg-clip-text">${creator.rateFromUSD}</span>
                <span className="text-[10px] text-neutral-400 ml-1">start</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
