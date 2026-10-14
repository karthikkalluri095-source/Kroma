import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Film,
  Wrench,
  History,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { VerificationRequest, Creator } from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { role, loginAsDemo } = useAuth();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [reqs, crs] = await Promise.all([
      dataService.getVerificationRequests(),
      dataService.getCreators(),
    ]);
    setRequests(reqs);
    setCreators(crs);
    setLoading(false);
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    await dataService.updateVerificationRequest(id, status);
    await loadData();
    alert(`Verification request ${status}! Creator badges and trust score updated.`);
  };

  const handleReset = async () => {
    if (confirm('Reset all demo verification requests and trust scores back to seed defaults?')) {
      await dataService.resetDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-bold">
              Verification Administration
            </span>
            <span className="text-xs text-neutral-400">Trust Score Enforcement Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Platform Verification Signals</h1>
          <p className="text-xs text-neutral-400">
            Review proof artifacts for Verified Tools (+30), Verified Workflow (+30), and Verified Past Work (+25).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {role !== 'admin' && (
            <button
              onClick={() => loginAsDemo('admin')}
              className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow-md shadow-purple-600/20"
            >
              Switch to Admin Persona
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-rose-300 font-semibold text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Trust Score Breakdown Info Box */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-neutral-900 border border-blue-500/20 flex items-start gap-3">
          <Wrench className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white">Verified Tools (30 pts)</h4>
            <p className="text-neutral-400 text-[11px] mt-1">
              Active commercial subscription receipts & engine metadata exports.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-purple-500/20 flex items-start gap-3">
          <Film className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white">Verified Workflow (30 pts)</h4>
            <p className="text-neutral-400 text-[11px] mt-1">
              Screen recording timeline from prompt formulation to final master export.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-emerald-500/20 flex items-start gap-3">
          <History className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white">Verified Past Work (25 pts)</h4>
            <p className="text-neutral-400 text-[11px] mt-1">
              Live campaign URL reference and brand client testimonial on record.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-amber-500/20 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white">Completeness (15 pts)</h4>
            <p className="text-neutral-400 text-[11px] mt-1">
              Detailed bio, multilingual tags, transparent pricing, and turnaround specs.
            </p>
          </div>
        </div>
      </div>

      {/* Pending Requests Queue */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Verification Requests Queue ({requests.length})
        </h2>

        <div className="space-y-3">
          {requests.map(req => {
            const creator = creators.find(c => c.id === req.creatorId);

            return (
              <div
                key={req.id}
                className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={creator?.avatar}
                    alt={creator?.name}
                    className="w-10 h-10 rounded-xl bg-neutral-800 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{creator?.name}</span>
                      <span className="text-xs font-mono text-neutral-500">@{creator?.handle}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          req.type === 'workflow'
                            ? 'bg-purple-950 text-purple-300'
                            : req.type === 'tools'
                            ? 'bg-blue-950 text-blue-300'
                            : 'bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {req.type}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 mt-1">
                      <strong>Submitted Evidence:</strong> {req.evidence}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                      <span>Submitted on {req.submittedAt}</span>
                      <span>·</span>
                      <span>Current Trust: {creator?.trustScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAction(req.id, 'rejected')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-rose-300 text-xs font-semibold"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleAction(req.id, 'approved')}
                        className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Badge</span>
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
                        req.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
