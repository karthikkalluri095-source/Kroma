import React, { useState, useRef } from 'react';

interface MediaPreviewProps {
  mediaType?: 'video' | 'image';
  videoUrl?: string | null;
  thumbnail: string;
  thumbnailFallback?: string;
  title: string;
  aspectRatio?: string;
  className?: string;
  hoverPlay?: boolean;
  controls?: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaType = 'image',
  videoUrl,
  thumbnail,
  thumbnailFallback,
  title,
  aspectRatio = '16:9',
  className = '',
  hoverPlay = true,
  controls = false,
}) => {
  const [imgSrc, setImgSrc] = useState(thumbnail);
  const [isHovered, setIsHovered] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hoverPlay && videoUrl && !videoFailed && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverPlay && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleImageError = () => {
    if (thumbnailFallback && imgSrc !== thumbnailFallback) {
      setImgSrc(thumbnailFallback);
    } else {
      setImgFailed(true);
    }
  };

  // Aspect ratio styling
  const aspectClass =
    aspectRatio === '9:16'
      ? 'aspect-[9/16]'
      : aspectRatio === '1:1'
      ? 'aspect-square'
      : aspectRatio === '4:5'
      ? 'aspect-[4/5]'
      : aspectRatio === '2.39:1'
      ? 'aspect-[2.39/1]'
      : 'aspect-video';

  return (
    <div
      className={`relative overflow-hidden bg-neutral-900 rounded-lg group ${aspectClass} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fallback gradient if image fails */}
      {imgFailed ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-neutral-900 p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg mb-2">
            {title.slice(0, 2).toUpperCase()}
          </div>
          <p className="text-xs text-white/80 font-medium line-clamp-2">{title}</p>
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={title}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered && !videoUrl ? 'scale-105' : ''
          }`}
          loading="lazy"
        />
      )}

      {/* Video Overlay */}
      {videoUrl && !videoFailed && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={imgSrc}
          muted
          playsInline
          loop
          preload="metadata"
          controls={controls}
          onError={() => setVideoFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered || controls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      {/* Badge if Video Preview Available */}
      {videoUrl && !videoFailed && !isHovered && !controls && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-semibold text-white/90 flex items-center gap-1 border border-white/10 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Preview
        </div>
      )}

      {/* Aspect Ratio Badge */}
      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white/70 pointer-events-none">
        {aspectRatio}
      </div>
    </div>
  );
};
