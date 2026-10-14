import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Layers,
  Film,
  RotateCw,
  Sliders,
  CheckCircle,
  Eye,
  ExternalLink,
  ShieldCheck,
  Zap,
  Crop,
  Flame,
  Award
} from 'lucide-react';
import { PortfolioItem, Creator } from '../types';

interface HighlightReelPlayerProps {
  creator: Creator;
  portfolio: PortfolioItem[];
  onOpenPortfolioDetail: (item: PortfolioItem) => void;
  onInviteToBrief?: () => void;
}

export const HighlightReelPlayer: React.FC<HighlightReelPlayerProps> = ({
  creator,
  portfolio,
  onOpenPortfolioDetail,
  onInviteToBrief,
}) => {
  // Filter video items or fallback to all items
  const videoItems = portfolio.filter(p => p.videoUrl) || [];
  const displayItems = videoItems.length > 0 ? videoItems : portfolio;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = displayItems[activeIndex] || portfolio[0];

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [framingGuide, setFramingGuide] = useState<'fit' | 'fill' | 'cinemascope'>('fit');
  const [showAestheticAnalysis, setShowAestheticAnalysis] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [activeIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(curr);
    setProgress((curr / dur) * 100);
    setDuration(dur);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * (videoRef.current.duration || 1);
  };

  const cycleSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!activeItem) return null;

  // Extract external project URLs
  const projectUrls = activeItem.projectUrls && activeItem.projectUrls.length > 0
    ? activeItem.projectUrls
    : activeItem.projectUrl
    ? [activeItem.projectUrl]
    : [];

  return (
    <div className="rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top Banner: Aesthetic Style Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">
                Aesthetic Showcase Reel
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Style Evaluation Mode
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Examining director motion stability, character consistency, and prompt fidelity
            </p>
          </div>
        </div>

        {/* Selected Reel Meta & Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowAestheticAnalysis(!showAestheticAnalysis)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5 border ${
              showAestheticAnalysis
                ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                : 'bg-neutral-800/60 text-neutral-400 border-neutral-700/60'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>{showAestheticAnalysis ? 'Hide Metrics' : 'Aesthetic Metrics'}</span>
          </button>

          {onInviteToBrief && (
            <button
              onClick={onInviteToBrief}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors shadow-md shadow-indigo-600/20"
            >
              Hire on Brief
            </button>
          )}
        </div>
      </div>

      {/* Main Video Frame with Custom Overlay Controls */}
      <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-[380px] w-full flex items-center justify-center border border-neutral-800 group shadow-inner">
        {activeItem.videoUrl ? (
          <video
            ref={videoRef}
            src={activeItem.videoUrl}
            poster={activeItem.thumbnail}
            playsInline
            loop
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            className={`w-full h-full cursor-pointer transition-all ${
              framingGuide === 'fill'
                ? 'object-cover'
                : framingGuide === 'cinemascope'
                ? 'object-cover scale-y-90'
                : 'object-contain'
            }`}
          />
        ) : (
          <img
            src={activeItem.thumbnail}
            alt={activeItem.title}
            className="w-full h-full object-contain"
          />
        )}

        {/* Live Overlay Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10 flex items-center gap-1.5 shadow-md">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
            {activeItem.aspectRatio} · {activeItem.contentType}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 backdrop-blur-md text-[10px] font-mono text-indigo-300 border border-indigo-500/40">
            {activeItem.iterations || 48} prompt takes
          </span>
        </div>

        {/* CinemaScope Guide Overlay */}
        {framingGuide === 'cinemascope' && (
          <div className="absolute inset-0 pointer-events-none border-y-[28px] border-black/90 flex items-center justify-center">
            <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
              2.39:1 CinemaScope Aesthetic Mask
            </span>
          </div>
        )}

        {/* Center Play Button on Pause */}
        {!isPlaying && activeItem.videoUrl && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          >
            <Play className="w-6 h-6 ml-1 fill-current" />
          </button>
        )}

        {/* Bottom Control Bar */}
        {activeItem.videoUrl && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
            {/* Scrubber Bar */}
            <div
              onClick={handleSeek}
              className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full cursor-pointer relative transition-all"
            >
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md scale-0 group-hover:scale-100 transition-transform" />
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1 rounded-md hover:bg-white/20 transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-1 rounded-md hover:bg-white/20 transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-[11px] font-mono text-neutral-300">
                  {formatTime(currentTime)} / {formatTime(duration || activeItem.durationSec || 30)}
                </span>
              </div>

              {/* Center / Right controls */}
              <div className="flex items-center gap-2">
                {/* Slow-mo aesthetic evaluation button */}
                <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10">
                  {[0.5, 1, 1.5].map(speed => (
                    <button
                      key={speed}
                      onClick={() => cycleSpeed(speed)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        playbackSpeed === speed
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title={`${speed}x speed ${speed === 0.5 ? '(Aesthetic Glitch Inspection)' : ''}`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                {/* Framing Guide Toggle */}
                <button
                  onClick={() => {
                    const next = framingGuide === 'fit' ? 'fill' : framingGuide === 'fill' ? 'cinemascope' : 'fit';
                    setFramingGuide(next);
                  }}
                  className="p-1 rounded-md hover:bg-white/20 text-neutral-300 transition-colors"
                  title="Toggle Framing (Fit / Fill / CinemaScope)"
                >
                  <Crop className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleFullscreen}
                  className="p-1 rounded-md hover:bg-white/20 transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Aesthetic Style Evaluation Radar / Metrics Breakdown */}
      {showAestheticAnalysis && (
        <div className="p-4 rounded-xl bg-neutral-950/80 border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Aesthetic Style & Generative Fidelity Evaluation
            </h5>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Commercial Grade Score: 96/100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-mono">Character Consistency</span>
              <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1">
                98% <span className="text-[9px] text-emerald-400 font-normal">No morphing</span>
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-mono">Camera Trajectory</span>
              <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1">
                Fluid <span className="text-[9px] text-indigo-400 font-normal">Dolly / Crane</span>
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-mono">Lighting Coherence</span>
              <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1">
                Volumetric <span className="text-[9px] text-amber-400 font-normal">Subsurface</span>
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-mono">Render Fidelity</span>
              <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1">
                4K Upscaled <span className="text-[9px] text-purple-400 font-normal">24 FPS</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reel Switcher Thumbnail Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Select Aesthetic Cut to Preview ({displayItems.length} Available)
          </span>
          <button
            onClick={() => onOpenPortfolioDetail(activeItem)}
            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 text-[11px]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Provenance & Timeline</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {displayItems.map((item, idx) => {
            const isSel = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative rounded-xl overflow-hidden p-1.5 text-left border transition-all flex items-center gap-2 ${
                  isSel
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-md ring-1 ring-indigo-500/50'
                    : 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/80'
                }`}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-12 h-10 rounded-lg object-cover shrink-0 bg-neutral-800"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                  <p className="text-[10px] text-neutral-400 font-mono truncate">
                    {item.aspectRatio} · {item.tools.slice(0, 2).join(', ')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Cut Aesthetic & Tool Pipeline Tags */}
      <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono text-neutral-400 block">
            Aesthetic Narrative & Direction:
          </span>
          <p className="text-neutral-200 font-medium text-xs line-clamp-2">
            {activeItem.description}
          </p>

          {/* Project URLs link if available */}
          {projectUrls.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-neutral-500 font-mono">External Master:</span>
              {projectUrls.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-mono underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Link {i + 1}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {activeItem.tools.map(tool => (
            <span
              key={tool}
              className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-700/80 font-mono text-[10px] text-indigo-300"
            >
              {tool}
            </span>
          ))}
          <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 font-medium text-[10px] text-emerald-400">
            {activeItem.commercialStatus}
          </span>
        </div>
      </div>
    </div>
  );
};
