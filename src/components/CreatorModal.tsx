import React, { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  Star,
  Clock,
  Briefcase,
  Share2,
  Mail,
  Film,
  Bot,
  Plus,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Creator, PortfolioItem, AIPersona, Review } from '../types';
import { dataService } from '../services/dataService';
import { TrustBadge, VerificationChips } from './TrustBadge';
import { MediaPreview } from './MediaPreview';
import { PortfolioModal } from './PortfolioModal';
import { HighlightReelPlayer } from './HighlightReelPlayer';

interface CreatorModalProps {
  creatorId: string | null;
  onClose: () => void;
  onInviteToBrief?: (creator: Creator) => void;
}

export const CreatorModal: React.FC<CreatorModalProps> = ({
  creatorId,
  onClose,
  onInviteToBrief,
}) => {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [personas, setPersonas] = useState<AIPersona[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'personas' | 'reviews'>('portfolio');

  useEffect(() => {
    if (!creatorId) return;
    dataService.getCreator(creatorId).then(c => {
      setCreator(c);
      if (c) {
        dataService.getPortfolioByCreator(c.id).then(setPortfolio);
        dataService.getPersonas().then(allP => setPersonas(allP.filter(p => p.creatorId === c.id)));
        dataService.getReviews(c.id).then(setReviews);
      }
    });
  }, [creatorId]);

  if (!creator) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto">
          {/* Header Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Profile link copied to clipboard!');
              }}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Banner & Avatar */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-neutral-950">
            <img
              src={creator.banner}
              alt={creator.name}
              onError={(e) => {
                if (creator.bannerFallback) (e.target as HTMLImageElement).src = creator.bannerFallback;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
          </div>

          {/* Profile Header Info */}
          <div className="px-6 pb-4 relative -mt-16 sm:-mt-20 z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-neutral-900 border-4 border-neutral-900 shadow-2xl object-cover"
                />
                <div className="mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    {creator.name}
                  </h1>
                  <p className="text-xs text-neutral-400 font-mono">@{creator.handle}</p>
                </div>
              </div>

              {/* Actions & Trust Score */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <TrustBadge
                  score={creator.trustScore}
                  verification={creator.verification}
                  completeness={creator.profileCompleteness}
                  size="md"
                />
                <button
                  onClick={() => onInviteToBrief?.(creator)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Invite to Brief</span>
                </button>
              </div>
            </div>

            {/* Headline & Meta Row */}
            <p className="mt-4 text-sm text-neutral-200 font-medium leading-relaxed">
              {creator.headline}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>{creator.location.city}, {creator.location.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>{creator.turnaroundDays} days delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white">${creator.rateFromUSD}</span>
                <span>{creator.rateUnit}</span>
              </div>
              {creator.stats.rating && (
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold">{creator.stats.rating.toFixed(1)}</span>
                  <span className="text-neutral-400">({creator.stats.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            {/* Verification Chips */}
            <div className="mt-3">
              <VerificationChips verification={creator.verification} />
            </div>

            {/* Skills & Tools chips */}
            <div className="mt-3 pt-3 border-t border-neutral-800 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-neutral-500 mr-1">Tools & Stack:</span>
              {creator.tools.map(tool => (
                <span
                  key={tool}
                  className="px-2 py-0.5 rounded bg-neutral-800/80 text-[10px] font-mono text-indigo-300 border border-neutral-700/60"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-neutral-800 px-6 text-xs font-semibold bg-neutral-950/40">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'portfolio'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Highlight Reel & Portfolio ({portfolio.length})</span>
            </button>
            {creator.offersAIPersonas && (
              <button
                onClick={() => setActiveTab('personas')}
                className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'personas'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Personas ({personas.length})</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Reviews ({reviews.length})</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {/* Embedded Aesthetic Highlight Reel Player */}
                {portfolio.length > 0 && (
                  <HighlightReelPlayer
                    creator={creator}
                    portfolio={portfolio}
                    onOpenPortfolioDetail={item => setSelectedItem(item)}
                    onInviteToBrief={() => onInviteToBrief?.(creator)}
                  />
                )}

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                    <Film className="w-3.5 h-3.5 text-indigo-400" />
                    All Portfolio Works & Workflow Receipts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/80 hover:border-indigo-500/40 transition-all cursor-pointer group"
                  >
                    <MediaPreview
                      thumbnail={item.thumbnail}
                      thumbnailFallback={item.thumbnailFallback}
                      videoUrl={item.videoUrl}
                      title={item.title}
                      aspectRatio={item.aspectRatio}
                      className="rounded-lg mb-2.5"
                    />
                    <h4 className="font-semibold text-sm text-neutral-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{item.workflow.length} workflow steps</span>
                      <span className="font-mono text-indigo-400">{item.commercialStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

            {activeTab === 'personas' && (
              <div className="space-y-4">
                {personas.map(persona => (
                  <div
                    key={persona.id}
                    className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 flex items-start gap-4"
                  >
                    <img
                      src={persona.avatar}
                      alt={persona.name}
                      className="w-16 h-16 rounded-xl bg-neutral-800 object-cover border border-purple-500/30"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-base">{persona.name}</h4>
                        <span className="text-xs font-bold text-purple-400">from ${persona.rateFromUSD}</span>
                      </div>
                      <p className="text-xs text-neutral-300 mt-0.5">{persona.tagline}</p>
                      <p className="text-xs text-neutral-400 mt-2">
                        <strong>Visual Style:</strong> {persona.visualStyle}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {persona.contentPillars.map(p => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded text-[10px] bg-purple-950/40 text-purple-300 border border-purple-500/20"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-neutral-500 text-xs">No reviews submitted yet.</p>
                ) : (
                  reviews.map(rev => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/80 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-white">{rev.reviewer}</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-bold">{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-neutral-300 leading-relaxed">{rev.text}</p>
                      <p className="text-[10px] text-neutral-500 mt-2 font-mono">{rev.date}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Portfolio Item Modal */}
      {selectedItem && (
        <PortfolioModal
          item={selectedItem}
          creator={creator}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
};
