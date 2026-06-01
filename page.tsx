'use client';

import { useState, useEffect, useCallback } from 'react';
import type { JobOffer } from '@/types';

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 9 ? '#10b981' :
    score >= 7 ? '#3b82f6' :
    score >= 5 ? '#f59e0b' : '#ef4444';
  const pct = (score / 10) * 100;
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={r} fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

// ─── Source Badge ─────────────────────────────────────────────────────────────
const SOURCE_LABELS: Record<string, string> = {
  wttj: 'WTTJ', apec: 'APEC', linkedin: 'LinkedIn', indeed: 'Indeed', hellowork: 'HelloWork'
};

function SourceBadge({ source }: { source: string }) {
  return (
    <span className={`source-${source} text-xs px-2 py-0.5 rounded-full border font-medium`}>
      {SOURCE_LABELS[source] || source}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  new: { label: 'Nouveau', color: 'rgba(168,85,247,0.15)', text: '#c084fc', border: 'rgba(168,85,247,0.3)' },
  saved: { label: 'Sauvegardé', color: 'rgba(59,130,246,0.15)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  applied: { label: 'Candidaté', color: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.3)' },
  rejected: { label: 'Refusé', color: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.3)' },
  interview: { label: 'Entretien 🎉', color: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
};

// ─── Cover Letter Modal ───────────────────────────────────────────────────────
function CoverLetterModal({ job, onClose }: { job: JobOffer; onClose: () => void }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [cvSuggestions, setCvSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'letter' | 'cv'>('letter');

  useEffect(() => {
    async function generate() {
      setLoading(true);
      try {
        const res = await fetch('/api/cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job, score: job.score }),
        });
        const data = await res.json();
        setCoverLetter(data.coverLetter || '');
        setCvSuggestions(data.cvSuggestions || []);
      } catch {
        setCoverLetter('Erreur lors de la génération.');
      } finally {
        setLoading(false);
      }
    }
    generate();
  }, [job]);

  async function handleSend() {
    if (!recipientEmail) return;
    setSending(true);
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, coverLetter, recipientEmail }),
      });
      if (res.ok) setSent(true);
    } catch {
      alert('Erreur envoi email');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col" style={{ border: '1px solid rgba(168,85,247,0.3)' }}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <h3 className="font-bold text-white">{job.title}</h3>
            <p className="text-sm text-slate-400">{job.company} · {job.location}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">×</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {(['letter', 'cv'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {tab === 'letter' ? '✉️ Lettre de motivation' : '📋 Suggestions CV'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="loader" />
              <p className="text-slate-400 text-sm">Gemini AI rédige votre lettre...</p>
            </div>
          ) : activeTab === 'letter' ? (
            <textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              className="w-full h-64 bg-transparent text-slate-200 text-sm leading-relaxed resize-none outline-none"
              placeholder="Génération en cours..."
            />
          ) : (
            <div className="space-y-3">
              <p className="text-slate-400 text-sm mb-4">Suggestions pour optimiser votre CV pour ce poste :</p>
              {cvSuggestions.length > 0 ? cvSuggestions.map((s, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <span className="text-blue-400 font-bold">{i + 1}.</span>
                  <p className="text-slate-300 text-sm">{s}</p>
                </div>
              )) : <p className="text-slate-500 text-sm">Aucune suggestion — votre profil correspond bien !</p>}
            </div>
          )}
        </div>

        {/* Send section */}
        {activeTab === 'letter' && !loading && (
          <div className="p-5 border-t space-y-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {sent ? (
              <div className="flex items-center gap-2 justify-center py-2 text-emerald-400 font-medium">
                ✅ Candidature envoyée avec succès !
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  placeholder="Email du recruteur..."
                  className="flex-1 px-3 py-2 rounded-xl text-sm bg-transparent text-white outline-none"
                  style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!recipientEmail || sending}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}
                >
                  {sending ? '⏳' : '📨 Envoyer'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({
  job,
  onStatusChange,
  onOpenLetter,
}: {
  job: JobOffer;
  onStatusChange: (id: string, status: JobOffer['status']) => void;
  onOpenLetter: (job: JobOffer) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const score = job.score?.score || 0;
  const statusCfg = STATUS_CONFIG[job.status || 'new'];

  return (
    <div
      className="glass glass-hover rounded-2xl p-5 cursor-pointer"
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-start gap-4">
        {/* Score */}
        <ScoreRing score={score} />

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-white text-sm leading-tight">{job.title}</h3>
              <p className="text-slate-400 text-xs mt-0.5">{job.company} · {job.location}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <SourceBadge source={job.source} />
              <span
                className="text-xs px-2 py-0.5 rounded-full border font-medium"
                style={{ background: statusCfg.color, color: statusCfg.text, borderColor: statusCfg.border }}
              >
                {statusCfg.label}
              </span>
            </div>
          </div>

          {/* Skills preview */}
          {job.score && (
            <div className="flex flex-wrap gap-1 mt-2">
              {job.score.matchingSkills.slice(0, 4).map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}>
                  ✓ {s}
                </span>
              ))}
              {job.score.missingSkills.slice(0, 2).map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
                  ✗ {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-4 space-y-4" onClick={e => e.stopPropagation()}>
          {/* Score summary */}
          {job.score?.summary && (
            <p className="text-slate-300 text-sm p-3 rounded-xl" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
              {job.score.summary}
            </p>
          )}

          {/* Description */}
          <p className="text-slate-400 text-sm line-clamp-3">{job.description}</p>

          {/* Salary */}
          {job.salary && (
            <p className="text-emerald-400 text-sm font-medium">💰 {job.salary}</p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs rounded-lg font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}
            >
              🔗 Voir l'offre
            </a>
            <button
              onClick={() => onOpenLetter(job)}
              className="px-3 py-1.5 text-xs rounded-lg font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
            >
              ✉️ Lettre de motivation
            </button>

            {/* Status selector */}
            <select
              value={job.status || 'new'}
              onChange={e => onStatusChange(job.id, e.target.value as JobOffer['status'])}
              className="px-3 py-1.5 text-xs rounded-lg font-medium text-slate-300 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <option value="new">Nouveau</option>
              <option value="saved">Sauvegardé</option>
              <option value="applied">Candidaté</option>
              <option value="interview">Entretien</option>
              <option value="rejected">Refusé</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetch, setLastFetch] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [filter, setFilter] = useState<'all' | 'top' | 'saved' | 'applied'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [minScore, setMinScore] = useState(0);

  const fetchJobs = useCallback(async (forceRefresh = false) => {
    try {
      const res = await fetch('/api/jobs', {
        method: forceRefresh ? 'POST' : 'GET',
      });
      const data = await res.json();
      setJobs(data.jobs || []);
      setLastFetch(data.lastFetchTime || new Date().toISOString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  function handleRefresh() {
    setRefreshing(true);
    fetchJobs(true);
  }

  function handleStatusChange(id: string, status: JobOffer['status']) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
  }

  const filteredJobs = jobs.filter(job => {
    if (filter === 'top' && (job.score?.score || 0) < 7) return false;
    if (filter === 'saved' && job.status !== 'saved') return false;
    if (filter === 'applied' && job.status !== 'applied') return false;
    if (sourceFilter !== 'all' && job.source !== sourceFilter) return false;
    if ((job.score?.score || 0) < minScore) return false;
    return true;
  });

  // Stats
  const avgScore = jobs.length
    ? Math.round((jobs.reduce((s, j) => s + (j.score?.score || 0), 0) / jobs.length) * 10) / 10
    : 0;
  const topMatches = jobs.filter(j => (j.score?.score || 0) >= 7).length;
  const applied = jobs.filter(j => j.status === 'applied').length;
  const sourceStats = jobs.reduce<Record<string, number>>((acc, j) => {
    acc[j.source] = (acc[j.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h1 className="text-xl md:text-2xl font-bold gradient-text">
                  Job Hunter Agent
                </h1>
                <p className="text-slate-400 text-sm">for Kamila Chudzik</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastFetch && (
              <span className="text-slate-500 text-xs hidden md:block">
                Dernière MàJ: {new Date(lastFetch).toLocaleTimeString('fr-FR')}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}
            >
              <span className={refreshing ? 'animate-spin' : ''}>⟳</span>
              {refreshing ? 'Recherche...' : 'Actualiser'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Offres trouvées', value: jobs.length, icon: '📋', color: '#a855f7' },
          { label: 'Score moyen', value: avgScore + '/10', icon: '⭐', color: '#f59e0b' },
          { label: 'Top matches (≥7)', value: topMatches, icon: '🎯', color: '#3b82f6' },
          { label: 'Candidatures', value: applied, icon: '📨', color: '#10b981' },
        ].map(stat => (
          <div key={stat.label} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span>{stat.icon}</span>
              <span className="text-slate-400 text-xs">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Source breakdown */}
      {Object.keys(sourceStats).length > 0 && (
        <div className="glass rounded-2xl p-4 mb-6">
          <p className="text-slate-400 text-xs mb-3">Répartition par source</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(sourceStats).map(([source, count]) => (
              <span key={source} className={`source-${source} text-xs px-3 py-1 rounded-full border`}>
                {SOURCE_LABELS[source]} · {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Tab filters */}
        {(['all', 'top', 'saved', 'applied'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'text-white'
                : 'text-slate-400 glass hover:text-white'
            }`}
            style={filter === f ? { background: 'linear-gradient(135deg, #a855f7, #3b82f6)' } : {}}
          >
            {f === 'all' ? 'Toutes' : f === 'top' ? '🌟 Top matches' : f === 'saved' ? '🔖 Sauvegardés' : '📨 Candidatés'}
          </button>
        ))}

        {/* Source filter */}
        <select
          value={sourceFilter}
          onChange={e => setSourceFilter(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-xl text-slate-300 cursor-pointer ml-auto"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <option value="all">Toutes les sources</option>
          {['wttj', 'apec', 'linkedin', 'indeed', 'hellowork'].map(s => (
            <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
          ))}
        </select>

        {/* Min score */}
        <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl">
          <span className="text-slate-400 text-xs">Score min:</span>
          <input
            type="range" min={0} max={9} step={1} value={minScore}
            onChange={e => setMinScore(Number(e.target.value))}
            className="w-20 accent-purple-500"
          />
          <span className="text-purple-400 text-xs font-bold w-4">{minScore}</span>
        </div>
      </div>

      {/* Jobs list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div className="loader" style={{ width: 56, height: 56, borderWidth: 4 }} />
          <div className="text-center">
            <p className="text-slate-300 font-medium">Recherche en cours...</p>
            <p className="text-slate-500 text-sm mt-1">
              Scan de WTTJ, APEC, LinkedIn, Indeed, HelloWork + scoring Gemini AI
            </p>
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-300 font-medium">Aucune offre trouvée</p>
          <p className="text-slate-500 text-sm mt-1">Modifiez les filtres ou actualisez la recherche</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-slate-500 text-xs mb-4">
            {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} · triées par score Gemini AI
          </p>
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onStatusChange={handleStatusChange}
              onOpenLetter={setSelectedJob}
            />
          ))}
        </div>
      )}

      {/* Cover letter modal */}
      {selectedJob && (
        <CoverLetterModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-slate-600 text-xs pb-6">
        Job Hunter Agent for Kamila Chudzik · Powered by Gemini AI · Antigravity Developer Challenge
      </div>
    </div>
  );
}
