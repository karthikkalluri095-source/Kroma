import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Film,
  Link,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
  Video,
  Play,
  Pause,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Creator, PortfolioItem, WorkflowStep } from '../types';
import { dataService } from '../services/dataService';

interface PortfolioSubmissionModalProps {
  creator: Creator;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newItem: PortfolioItem) => void;
}

const POPULAR_AI_TOOLS = [
  'Runway Gen-3 Alpha',
  'Kling AI 1.5',
  'Midjourney v6.1',
  'Flux 1.1 Pro',
  'OpenAI Sora',
  'Luma Dream Machine',
  'ComfyUI',
  'ElevenLabs',
  'Adobe After Effects',
  'DaVinci Resolve',
  'Topaz Video AI',
  'Magnific AI',
  'Suno AI',
  'Adobe Firefly',
  'Stable Video Diffusion',
];

const SAMPLE_DEMO_REELS = [
  {
    label: 'Cinematic Sci-Fi / Urban (Landscape 16:9)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    aspectRatio: '16:9',
    tools: ['Runway Gen-3 Alpha', 'Midjourney v6.1', 'Topaz Video AI'],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Automotive Motion / Drone Push (Landscape 16:9)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    aspectRatio: '16:9',
    tools: ['Kling AI 1.5', 'ComfyUI', 'DaVinci Resolve'],
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Fashion Lookbook & Fluid Fabric (Landscape 16:9)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    aspectRatio: '16:9',
    tools: ['Flux 1.1 Pro', 'Runway Gen-3 Alpha', 'Adobe After Effects'],
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Nature & Abstract Macro (Landscape 16:9)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    aspectRatio: '16:9',
    tools: ['Luma Dream Machine', 'ElevenLabs', 'Topaz Video AI'],
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
  },
];

export const PortfolioSubmissionModal: React.FC<PortfolioSubmissionModalProps> = ({
  creator,
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientContext, setClientContext] = useState('');
  const [contentType, setContentType] = useState('ai-film');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [durationSec, setDurationSec] = useState<number>(30);
  const [commercialStatus, setCommercialStatus] = useState<'cleared' | 'showcase' | 'needs-review'>('cleared');
  const [licenseNote, setLicenseNote] = useState('Full commercial rights cleared across all generated model weights and audio.');

  // Project URLs (Array of links)
  const [projectUrls, setProjectUrls] = useState<string[]>(['']);
  const [urlInput, setUrlInput] = useState('');

  // AI Tool Stacks used
  const [selectedTools, setSelectedTools] = useState<string[]>(['Runway Gen-3 Alpha', 'Midjourney v6.1']);
  const [customToolInput, setCustomToolInput] = useState('');

  // Aesthetic tags
  const [aestheticTags, setAestheticTags] = useState<string[]>(['Photorealistic', 'Cinematic Lighting', 'Consistent Character']);
  const [customTagInput, setCustomTagInput] = useState('');

  // Highlight reel file upload & preview
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [highlightReelFile, setHighlightReelFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string>('');
  const [uploadedFileSizeMB, setUploadedFileSizeMB] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Workflow receipts
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([
    { tool: 'Midjourney v6.1', step: 'Style & Look-Dev', note: 'Crafted hero aesthetic frames with custom lighting prompt parameters' },
    { tool: 'Runway Gen-3 Alpha', step: 'Motion & Camera Direction', note: 'Rendered 24fps camera dolly and character movement preserving facial fidelity' },
    { tool: 'Topaz Video AI', step: 'Upscale & Artifact Removal', note: 'Upscaled to 4K resolution with temporal stabilization' }
  ]);
  const [newStepTool, setNewStepTool] = useState('');
  const [newStepName, setNewStepName] = useState('');
  const [newStepNote, setNewStepNote] = useState('');

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdItem, setCreatedItem] = useState<PortfolioItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle local video file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  const processVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setErrorMsg('Please select a valid video file (.mp4, .webm, or .mov).');
      return;
    }
    setErrorMsg(null);
    setHighlightReelFile(file);
    setUploadedFileSizeMB((file.size / (1024 * 1024)).toFixed(1));
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

    // Default thumbnail fallback
    if (!videoThumbnailUrl) {
      setVideoThumbnailUrl('https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80');
    }
  };

  // Quick select demo reel
  const handleSelectSampleReel = (sample: typeof SAMPLE_DEMO_REELS[0]) => {
    setVideoPreviewUrl(sample.url);
    setVideoThumbnailUrl(sample.thumbnail);
    setAspectRatio(sample.aspectRatio);
    setUploadedFileSizeMB('38.4');
    setHighlightReelFile(null);

    // Merge tools
    const combined = Array.from(new Set([...selectedTools, ...sample.tools]));
    setSelectedTools(combined);
    if (!title) {
      setTitle(`${sample.label.split('(')[0].trim()} Showcase`);
    }
  };

  // Toggle tool
  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const addCustomTool = () => {
    const trimmed = customToolInput.trim();
    if (trimmed && !selectedTools.includes(trimmed)) {
      setSelectedTools([...selectedTools, trimmed]);
      setCustomToolInput('');
    }
  };

  // Manage Project URLs
  const addProjectUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      setProjectUrls([...projectUrls.filter(u => u.trim().length > 0), trimmed]);
      setUrlInput('');
    }
  };

  const removeProjectUrl = (idx: number) => {
    setProjectUrls(projectUrls.filter((_, i) => i !== idx));
  };

  // Aesthetic tag management
  const addAestheticTag = () => {
    const trimmed = customTagInput.trim();
    if (trimmed && !aestheticTags.includes(trimmed)) {
      setAestheticTags([...aestheticTags, trimmed]);
      setCustomTagInput('');
    }
  };

  const removeAestheticTag = (tag: string) => {
    setAestheticTags(aestheticTags.filter(t => t !== tag));
  };

  // Add workflow receipt step
  const addWorkflowStep = () => {
    if (!newStepTool.trim() || !newStepName.trim()) return;
    setWorkflow([
      ...workflow,
      {
        tool: newStepTool.trim(),
        step: newStepName.trim(),
        note: newStepNote.trim() || 'Prompt and output generation'
      }
    ]);
    setNewStepTool('');
    setNewStepName('');
    setNewStepNote('');
  };

  const removeWorkflowStep = (idx: number) => {
    setWorkflow(workflow.filter((_, i) => i !== idx));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please provide a project title.');
      return;
    }

    if (!videoPreviewUrl) {
      setErrorMsg('Please upload a highlight reel video file or choose a sample reel.');
      return;
    }

    if (selectedTools.length === 0) {
      setErrorMsg('Please select at least one AI tool from your stack.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Clean up project URLs
      const cleanedUrls = projectUrls.filter(u => u && u.trim().length > 0);
      if (urlInput.trim() && !cleanedUrls.includes(urlInput.trim())) {
        cleanedUrls.push(urlInput.trim());
      }

      const itemPayload: Omit<PortfolioItem, 'id'> = {
        creatorId: creator.id,
        title: title.trim(),
        description: description.trim() || 'AI-generated highlight reel exploring cinematic aesthetics, consistent characters, and prompt fidelity.',
        mediaType: 'video',
        contentType,
        aspectRatio,
        durationSec: Number(durationSec) || 30,
        year: 2026,
        clientContext: clientContext.trim() || 'Commercial Showcase & Spec Reel',
        thumbnail: videoThumbnailUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
        videoUrl: videoPreviewUrl,
        projectUrl: cleanedUrls[0] || null,
        projectUrls: cleanedUrls,
        aestheticTags,
        tools: selectedTools,
        workflow,
        iterations: 64,
        hoursSpent: 18,
        commercialStatus,
        licenseNote,
        verified: true,
        isDemo: false,
      };

      const newItem = await dataService.addPortfolioItem(itemPayload);

      // Also ensure creator's tool list includes these new tools
      const updatedTools = Array.from(new Set([...creator.tools, ...selectedTools]));
      const updatedCreator: Creator = {
        ...creator,
        tools: updatedTools,
        trustScore: Math.min(100, (creator.trustScore || 85) + 3),
        profileCompleteness: Math.min(100, (creator.profileCompleteness || 80) + 5),
      };
      await dataService.updateCreator(updatedCreator);

      setCreatedItem(newItem);
      setSubmitSuccess(true);
      onSuccess(newItem);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit portfolio item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Portfolio Submission & Reel Upload
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Manager Review
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Publishing for <span className="text-indigo-300 font-semibold">{creator.name}</span> (@{creator.handle})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State Screen */}
        {submitSuccess && createdItem ? (
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Reel Successfully Published to Marketplace!</h3>
              <p className="text-xs text-neutral-300 max-w-lg mx-auto leading-relaxed">
                Company managers, agency directors, and brand leads can now observe your highlight reel in the aesthetic video player, inspect your AI tool stacks, and hire you directly for paid briefs.
              </p>
            </div>

            {/* Reel summary card */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left max-w-md mx-auto space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                {createdItem.videoUrl && (
                  <video
                    src={createdItem.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                )}
              </div>
              <h4 className="font-bold text-sm text-white">{createdItem.title}</h4>
              <div className="flex flex-wrap gap-1.5">
                {createdItem.tools.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded bg-neutral-900 text-[10px] font-mono text-indigo-300 border border-neutral-800">
                    {t}
                  </span>
                ))}
              </div>
              {createdItem.projectUrls && createdItem.projectUrls.length > 0 && (
                <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1">
                  <Link className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Linked URL: {createdItem.projectUrls[0]}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20"
              >
                Back to Creator Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* SECTION 1: Highlight Reel Video Upload & Live Player */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-white text-xs flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-400" />
                  Highlight Reel Video File <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-neutral-400">Accepted formats: MP4, WebM, MOV</span>
              </div>

              {/* Upload Dropzone / Video Preview */}
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed transition-all p-5 text-center ${
                  videoPreviewUrl
                    ? 'border-indigo-500/50 bg-neutral-950'
                    : 'border-neutral-700 hover:border-indigo-500/60 bg-neutral-950/60'
                }`}
              >
                {videoPreviewUrl ? (
                  <div className="space-y-4">
                    {/* Video Player Preview */}
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-64 mx-auto shadow-2xl flex items-center justify-center border border-neutral-800">
                      <video
                        ref={videoRef}
                        src={videoPreviewUrl}
                        playsInline
                        loop
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="flex items-center gap-2 text-left">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="font-semibold text-white truncate max-w-[280px]">
                            {highlightReelFile ? highlightReelFile.name : 'Master Highlight Reel Loaded'}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            {uploadedFileSizeMB ? `${uploadedFileSizeMB} MB · ` : ''}Aesthetic playback ready
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors"
                        >
                          Change Video File
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoPreviewUrl(null);
                            setHighlightReelFile(null);
                          }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        Drag and drop your highlight reel here
                      </p>
                      <p className="text-neutral-400 text-xs mt-0.5">
                        or browse files from your computer to showcase your aesthetic style
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-colors"
                    >
                      Browse Video File (.mp4)
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Sample high-fidelity reels shortcut */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
                <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Quick Test: Select a Sample Aesthetic Video Reel
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_DEMO_REELS.map(sample => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => handleSelectSampleReel(sample)}
                      className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800/90 border border-neutral-800 text-left transition-colors flex items-center gap-2 group"
                    >
                      <img
                        src={sample.thumbnail}
                        alt={sample.label}
                        className="w-10 h-8 rounded object-cover bg-neutral-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-neutral-200 group-hover:text-indigo-300 truncate">
                          {sample.label}
                        </p>
                        <p className="text-[9px] text-neutral-500 font-mono">
                          {sample.tools.join(', ')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 2: Project Details & URLs */}
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <h3 className="font-bold text-white text-xs flex items-center gap-2">
                <Film className="w-4 h-4 text-purple-400" />
                Project Details & Metadata
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">
                    Project Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Cyberpunk Kinetic Saree Campaign 2026"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">
                    Client Context / Brand Name
                  </label>
                  <input
                    type="text"
                    value={clientContext}
                    onChange={e => setClientContext(e.target.value)}
                    placeholder="e.g. Nakshatra Weaves / Spec Commercial"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Project URLs input fields */}
              <div>
                <label className="font-semibold text-neutral-300 block mb-1">
                  Project URLs & Portfolio References
                </label>
                <p className="text-[11px] text-neutral-400 mb-2">
                  Add links to Behance, Vimeo, YouTube 4K master, ArtStation, Instagram, or live marketing campaigns.
                </p>

                <div className="space-y-2">
                  {projectUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Link className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={url}
                          onChange={e => {
                            const updated = [...projectUrls];
                            updated[idx] = e.target.value;
                            setProjectUrls(updated);
                          }}
                          placeholder="https://vimeo.com/... or https://behance.net/..."
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                        />
                      </div>
                      {projectUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProjectUrl(idx)}
                          className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-neutral-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      placeholder="Add another project URL..."
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={addProjectUrl}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add URL</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Type, Aspect Ratio, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Content Type</label>
                  <select
                    value={contentType}
                    onChange={e => setContentType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ai-film">AI Film / Short Movie</option>
                    <option value="product-ads">Product & Commercial Ad</option>
                    <option value="social-shorts">Social Reel (9:16)</option>
                    <option value="virtual-influencer">Virtual Influencer</option>
                    <option value="motion-graphics">Generative Motion Graphics</option>
                    <option value="music-video">AI Music Video</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={e => setAspectRatio(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="16:9">16:9 Landscape</option>
                    <option value="9:16">9:16 Vertical Reel</option>
                    <option value="1:1">1:1 Square</option>
                    <option value="2.39:1">2.39:1 CinemaScope</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    min="5"
                    max="600"
                    value={durationSec}
                    onChange={e => setDurationSec(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: AI Tool Stacks Used */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <label className="font-bold text-white text-xs flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  AI Tool Stacks Used <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-neutral-400">
                  {selectedTools.length} tools selected
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Company managers inspect tool stacks to verify enterprise commercial compliance, render fidelity, and pipeline sophistication.
              </p>

              {/* Clickable Tool Badges */}
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_AI_TOOLS.map(tool => {
                  const isSelected = selectedTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/50'
                          : 'bg-neutral-950 text-neutral-300 border border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {tool}
                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Tool */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customToolInput}
                  onChange={e => setCustomToolInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomTool();
                    }
                  }}
                  placeholder="Add custom tool (e.g. Wan2.1, HunyuanVideo, Kling 2.0)..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={addCustomTool}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tool</span>
                </button>
              </div>
            </div>

            {/* SECTION 4: Aesthetic Direction & Style Tags */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <label className="font-bold text-white text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Aesthetic Direction & Stylistic Notes
              </label>

              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the aesthetic vision: lighting palette, camera choreography, temporal consistency approach (e.g. ControlNet face-lock), and how prompt iterations were curated..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
              />

              {/* Aesthetic Tags */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-neutral-400 block">Aesthetic Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {aestheticTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-neutral-800 text-[11px] text-amber-300 border border-neutral-700 flex items-center gap-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeAestheticTag(tag)}
                        className="hover:text-rose-400 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={e => setCustomTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAestheticTag();
                      }
                    }}
                    placeholder="Add aesthetic tag (e.g. Surrealism, 24fps Film Grain, Volumetric Fog)..."
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={addAestheticTag}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tag</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 5: Commercial Clearance & Rights */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <label className="font-bold text-white text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Commercial Rights & Licensing Clearance
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Commercial Status</label>
                  <select
                    value={commercialStatus}
                    onChange={e => setCommercialStatus(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="cleared">Cleared for Commercial Campaigns</option>
                    <option value="showcase">Showcase Only (Spec / Non-Exclusive)</option>
                    <option value="needs-review">Needs Review</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Licensing Note</label>
                  <input
                    type="text"
                    value={licenseNote}
                    onChange={e => setLicenseNote(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 6: Workflow Receipts (Proof of Process) */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <label className="font-bold text-white text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  Workflow Receipts (Proof of Process)
                </label>
                <span className="text-[11px] text-neutral-400">{workflow.length} verified steps</span>
              </div>

              <div className="space-y-2">
                {workflow.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                          {step.tool}
                        </span>
                        <span className="font-semibold text-white">{step.step}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">{step.note}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWorkflowStep(idx)}
                      className="p-1 text-neutral-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/80 space-y-2">
                  <span className="text-[11px] font-semibold text-neutral-400">Add Workflow Step:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newStepTool}
                      onChange={e => setNewStepTool(e.target.value)}
                      placeholder="Tool (e.g. Kling AI)"
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      value={newStepName}
                      onChange={e => setNewStepName(e.target.value)}
                      placeholder="Step name (e.g. Motion Pass 2)"
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newStepNote}
                      onChange={e => setNewStepNote(e.target.value)}
                      placeholder="Brief note on prompt / parameters used..."
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white"
                    />
                    <button
                      type="button"
                      onClick={addWorkflowStep}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
                    >
                      Add Step
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmitting ? 'Publishing Reel...' : 'Publish Reel to Marketplace'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
