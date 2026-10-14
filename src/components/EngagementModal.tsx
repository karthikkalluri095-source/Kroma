import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Film,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Upload,
  Lock,
  Layers
} from 'lucide-react';
import { Engagement, DeliverableVersion } from '../types';
import { dataService } from '../services/dataService';
import { MediaPreview } from './MediaPreview';
import { useAuth } from '../context/AuthContext';

interface EngagementModalProps {
  engagement: Engagement | null;
  onClose: () => void;
  onRefresh: () => void;
}

const STAGES = ['kickoff', 'in_production', 'review', 'revisions', 'approved', 'delivered', 'completed'];

export const EngagementModal: React.FC<EngagementModalProps> = ({
  engagement,
  onClose,
  onRefresh,
}) => {
  if (!engagement) return null;

  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'deliverables' | 'milestones' | 'messages' | 'license'>('deliverables');
  const [selectedVersion, setSelectedVersion] = useState<DeliverableVersion>(
    engagement.versions[engagement.versions.length - 1] || engagement.versions[0]
  );
  const [feedbackText, setFeedbackText] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  // Uploading next version state
  const [showUploadVersion, setShowUploadVersion] = useState(false);
  const [newVersionLabel, setNewVersionLabel] = useState(`v${engagement.versions.length + 1} Revision`);
  const [newVersionChangeSummary, setNewVersionChangeSummary] = useState('');
  const [newVersionTools, setNewVersionTools] = useState('midjourney, veo, kling, elevenlabs');

  // Stage transition helper
  const handleApproveCurrentVersion = async () => {
    const updated = { ...engagement };
    const latest = updated.versions[updated.versions.length - 1];
    if (latest) {
      latest.status = 'approved';
    }
    updated.stage = 'approved';
    // Release escrow milestone 2 if pending
    if (updated.milestones[1]) {
      updated.milestones[1].status = 'released';
    }
    await dataService.updateEngagement(updated);
    onRefresh();
    alert('Version approved! Milestone escrow marked released.');
  };

  const handleRequestChanges = async () => {
    if (!feedbackText.trim()) {
      alert('Please provide change feedback notes.');
      return;
    }
    const updated = { ...engagement };
    const latest = updated.versions[updated.versions.length - 1];
    if (latest) {
      latest.status = 'changes_requested';
      latest.feedback = feedbackText;
    }
    updated.revisionsUsed += 1;
    updated.stage = 'revisions';
    await dataService.updateEngagement(updated);
    setFeedbackText('');
    onRefresh();
    alert('Feedback submitted to creator.');
  };

  const handleUploadNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...engagement };
    const newVer: DeliverableVersion = {
      version: `v${updated.versions.length + 1}`,
      label: newVersionLabel,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'in_review',
      toolsUsed: newVersionTools.split(',').map(s => s.trim()),
      changeSummary: newVersionChangeSummary,
      feedback: null,
    };
    updated.versions.push(newVer);
    updated.stage = 'review';
    await dataService.updateEngagement(updated);
    setShowUploadVersion(false);
    setSelectedVersion(newVer);
    onRefresh();
    alert('New version uploaded for brand review.');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const updated = { ...engagement };
    updated.messages.push({
      from: role === 'creator' ? 'creator' : 'brand',
      text: chatMessage,
      at: new Date().toISOString(),
    });
    await dataService.updateEngagement(updated);
    setChatMessage('');
    onRefresh();
  };

  const currentStageIndex = STAGES.indexOf(engagement.stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto text-neutral-200">
        {/* Top Header */}
        <div className="p-6 border-b border-neutral-800 bg-neutral-950/60 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/20">
                Engagement #{engagement.id}
              </span>
              <span className="text-xs font-semibold text-emerald-400">
                ${engagement.agreedPriceUSD} USD Total
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Production & Delivery Workspace</h2>
            <p className="text-xs text-neutral-400">
              Revisions: {engagement.revisionsUsed} of {engagement.revisionsIncluded} rounds used · Due {engagement.dueDate}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State Machine Stage Progress Bar */}
        <div className="px-6 py-3 bg-neutral-950/90 border-b border-neutral-800 overflow-x-auto">
          <div className="flex items-center min-w-[600px] justify-between text-[11px]">
            {STAGES.map((stg, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stg} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isPast
                        ? 'bg-emerald-500 text-neutral-950'
                        : isCurrent
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/40 animate-pulse'
                        : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`capitalize font-medium ${
                      isCurrent ? 'text-white font-bold' : isPast ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {stg.replace('_', ' ')}
                  </span>
                  {idx < STAGES.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 ${isPast ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-6 border-b border-neutral-800 bg-neutral-900/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('deliverables')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
              activeTab === 'deliverables' ? 'border-indigo-500 text-white' : 'border-transparent text-neutral-400'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Deliverables ({engagement.versions.length} versions)</span>
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
              activeTab === 'milestones' ? 'border-indigo-500 text-white' : 'border-transparent text-neutral-400'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Mock Escrow ({engagement.milestones.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
              activeTab === 'messages' ? 'border-indigo-500 text-white' : 'border-transparent text-neutral-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Messages ({engagement.messages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('license')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
              activeTab === 'license' ? 'border-indigo-500 text-white' : 'border-transparent text-neutral-400'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Licence & Rights</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'deliverables' && (
            <div className="space-y-6">
              {/* Version Selector Pill Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-semibold mr-1">Version:</span>
                  {engagement.versions.map(v => (
                    <button
                      key={v.version}
                      onClick={() => setSelectedVersion(v)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedVersion.version === v.version
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {v.version} ({v.status.replace('_', ' ')})
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowUploadVersion(!showUploadVersion)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Next Cut</span>
                </button>
              </div>

              {/* Upload Form if expanded */}
              {showUploadVersion && (
                <form
                  onSubmit={handleUploadNewVersion}
                  className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs"
                >
                  <h4 className="font-bold text-white">Upload New Cut Version</h4>
                  <div>
                    <label className="text-neutral-400 block mb-1">Version Title</label>
                    <input
                      type="text"
                      value={newVersionLabel}
                      onChange={e => setNewVersionLabel(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Change Summary & Revisions Addressed</label>
                    <textarea
                      required
                      value={newVersionChangeSummary}
                      onChange={e => setNewVersionChangeSummary(e.target.value)}
                      placeholder="e.g. Slowed cuts by 20%, colour graded skin tones with DaVinci Resolve, re-prompted product closeup with Kling AI..."
                      rows={2}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadVersion(false)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold"
                    >
                      Submit Version for Review
                    </button>
                  </div>
                </form>
              )}

              {/* Version Media & Inspector */}
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{selectedVersion.label}</h3>
                    <p className="text-[11px] text-neutral-400">
                      Submitted on {selectedVersion.submittedAt} · Status: <span className="text-indigo-400 font-mono capitalize">{selectedVersion.status.replace('_', ' ')}</span>
                    </p>
                  </div>
                </div>

                {selectedVersion.videoUrl ? (
                  <div className="rounded-xl overflow-hidden border border-neutral-800 bg-black flex justify-center">
                    <MediaPreview
                      thumbnail="https://picsum.photos/seed/kroma-eng/960/540"
                      videoUrl={selectedVersion.videoUrl}
                      title={selectedVersion.label}
                      controls={true}
                      hoverPlay={false}
                      className="max-h-72 w-auto"
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center text-neutral-500 text-xs bg-neutral-900 rounded-lg">
                    Storyboards & Scripts version (no video rendered yet).
                  </div>
                )}

                <div>
                  <h5 className="text-[11px] font-semibold uppercase text-neutral-400 mb-1">What changed in this cut:</h5>
                  <p className="text-xs text-neutral-300 bg-neutral-900 p-2.5 rounded-lg border border-neutral-800/80">
                    {selectedVersion.changeSummary}
                  </p>
                </div>

                {selectedVersion.feedback && (
                  <div>
                    <h5 className="text-[11px] font-semibold uppercase text-amber-400 mb-1">Client Feedback:</h5>
                    <p className="text-xs text-amber-200 bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                      {selectedVersion.feedback}
                    </p>
                  </div>
                )}

                {/* Brand Review Actions */}
                {selectedVersion.status !== 'approved' && (
                  <div className="pt-3 border-t border-neutral-800 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                      <div className="flex-1 w-full">
                        <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                          Request Changes (Uses 1 revision round)
                        </label>
                        <input
                          type="text"
                          value={feedbackText}
                          onChange={e => setFeedbackText(e.target.value)}
                          placeholder="e.g. Adjust lighting in scene 2, make audio louder..."
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={handleRequestChanges}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-semibold text-xs border border-amber-500/30"
                        >
                          Request Changes
                        </button>
                        <button
                          onClick={handleApproveCurrentVersion}
                          className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20"
                        >
                          Approve Cut
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400">
                <p className="font-semibold text-neutral-200 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Mock Escrow Protection
                </p>
                <p>{engagement.escrowNote}</p>
              </div>

              <div className="space-y-3">
                {engagement.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-xs text-white">
                        Milestone {idx + 1}: {m.title}
                      </p>
                      <p className="text-[11px] text-neutral-400">Target: {m.dueDate}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-white text-sm">${m.amountUSD}</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          m.status === 'released'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : m.status === 'held-in-escrow'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {m.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="flex flex-col h-96">
              <div className="flex-1 overflow-y-auto space-y-3 p-2">
                {engagement.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.from === 'brand' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-xl text-xs leading-relaxed ${
                        msg.from === 'brand'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-neutral-800 text-neutral-200 rounded-bl-none'
                      }`}
                    >
                      <p className="font-bold text-[10px] opacity-75 uppercase mb-1">
                        {msg.from}
                      </p>
                      <p>{msg.text}</p>
                      <span className="text-[9px] opacity-50 block mt-1 text-right">
                        {new Date(msg.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-3 border-t border-neutral-800 flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  placeholder="Type a message to collaborator..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'license' && (
            <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h4 className="font-bold text-sm text-white">Commercial Rights & Tool Receipts</h4>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-semibold">
                  {engagement.licenseSummary.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-neutral-500 text-[11px]">Usage Scope</p>
                  <p className="text-neutral-200 font-semibold">{engagement.licenseSummary.usageTypes.join(', ')}</p>
                </div>
                <div>
                  <p className="text-neutral-500 text-[11px]">Territory & Exclusivity</p>
                  <p className="text-neutral-200 font-semibold">
                    {engagement.licenseSummary.territory} ({engagement.licenseSummary.exclusivity})
                  </p>
                </div>
              </div>

              <div>
                <p className="text-neutral-500 text-[11px] mb-1">Disclosed Generative Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {engagement.licenseSummary.toolsDisclosed.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-neutral-400 text-[11px]">
                <span>Voice Talent Consent on File:</span>
                <span className="text-emerald-400 font-bold">
                  {engagement.licenseSummary.voiceConsentOnFile ? 'Verified Yes' : 'Not Required'}
                </span>
              </div>

              <p className="text-[10px] text-neutral-500 italic">
                {engagement.licenseSummary.disclaimer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
