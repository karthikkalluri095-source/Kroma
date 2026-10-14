import React from 'react';
import { X, CheckCircle, Clock, RotateCw, AlertTriangle, ShieldCheck, Film, ExternalLink } from 'lucide-react';
import { PortfolioItem, Creator } from '../types';
import { MediaPreview } from './MediaPreview';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  creator?: Creator | null;
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ item, creator, onClose }) => {
  if (!item) return null;

  const statusConfig = {
    cleared: {
      label: 'Commercial Use Cleared',
      icon: CheckCircle,
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    showcase: {
      label: 'Showcase / Personal Use',
      icon: Film,
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    'needs-review': {
      label: 'Licence Review Required',
      icon: AlertTriangle,
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
  };

  const status = statusConfig[item.commercialStatus] || statusConfig['showcase'];
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/50">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {item.title}
              {item.isDemo && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                  Demo
                </span>
              )}
            </h2>
            <p className="text-xs text-neutral-400">
              {item.clientContext} · {item.year} · {item.contentType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-200">
          {/* Main Media Display */}
          <div className="flex justify-center bg-black/60 rounded-xl p-2 border border-neutral-800">
            <MediaPreview
              thumbnail={item.thumbnail}
              thumbnailFallback={item.thumbnailFallback}
              videoUrl={item.videoUrl}
              title={item.title}
              aspectRatio={item.aspectRatio}
              className="max-h-[50vh] w-auto mx-auto shadow-2xl"
              controls={true}
              hoverPlay={false}
            />
          </div>

          {/* Description & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Creative Overview
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">{item.description}</p>
              </div>

              {/* Tools Used */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  AI Tools & Models Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.tools.map(tool => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 text-xs font-mono font-medium text-indigo-300 border border-neutral-700"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Meta Column */}
            <div className="space-y-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs">
              <div>
                <p className="text-neutral-400 text-[11px] mb-1">Commercial Status</p>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium ${status.badgeClass}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>{status.label}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-neutral-800/80">
                <span className="text-neutral-400 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5 text-neutral-500" /> Iterations
                </span>
                <span className="font-mono font-bold text-white">{item.iterations} takes</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                <span className="text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" /> Production Hours
                </span>
                <span className="font-mono font-bold text-white">{item.hoursSpent}h</span>
              </div>

              <div>
                <p className="text-neutral-400 text-[11px] mb-1">Aspect Ratio</p>
                <p className="font-mono font-bold text-white">{item.aspectRatio}</p>
              </div>
            </div>
          </div>

          {/* Workflow Timeline Section */}
          <div className="pt-4 border-t border-neutral-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Film className="w-4 h-4 text-purple-400" />
              Verifiable AI Workflow Pipeline
            </h3>
            <div className="relative pl-6 border-l-2 border-neutral-800 space-y-4">
              {item.workflow.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-neutral-900" />
                  <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-white">
                        Step {idx + 1}: {step.step}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950/50 text-indigo-300 border border-indigo-500/30">
                        {step.tool}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal / Licensing Note */}
          <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-400">
            <p className="font-semibold text-neutral-200 mb-1">Licence & Rights Disclosure</p>
            <p className="leading-relaxed">{item.licenseNote}</p>
            <p className="text-[10px] text-neutral-500 mt-2 italic">
              Self-declared by creator. Kroma provides tool disclosure receipts; not legal advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
