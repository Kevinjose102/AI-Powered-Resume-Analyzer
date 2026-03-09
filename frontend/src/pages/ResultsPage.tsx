import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, AlertTriangle, BookOpen, FileText, RefreshCw, Copy,
  CheckCircle2, CalendarDays, Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAppToast } from '@/components/AppToast';
import type { AnalysisResult } from '@/lib/api';

type TabKey = 'skills' | 'gaps' | 'recommendations' | 'report';

const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'skills', label: 'Skills Match', icon: Target },
  { key: 'gaps', label: 'Skill Gaps', icon: AlertTriangle },
  { key: 'recommendations', label: 'Recommendations', icon: BookOpen },
  { key: 'report', label: 'Full Report', icon: FileText },
];

const ResultsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  const [activeTab, setActiveTab] = useState<TabKey>('skills');
  const [data, setData] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisResults');
    if (!stored) { navigate('/analyze'); return; }
    setData(JSON.parse(stored));
  }, [navigate]);

  if (!data) return null;

  const { analysis } = data;
  const score = analysis.overall_match_score;
  const scoreColor = score >= 75 ? '#34D399' : score >= 50 ? '#FBBF24' : '#F87171';

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', 'Copied to clipboard');
  };

  return (
    <div className="aurora-bg min-h-screen relative">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] flex-shrink-0">
            <div className="glass glass-lg glass-no-hover p-8 lg:sticky lg:top-24">
              <ScoreRing score={score} color={scoreColor} />

              <div className="mt-8 space-y-4">
                {Object.entries(analysis.category_scores).map(([key, val], i) => {
                  const color = val >= 75 ? '#34D399' : val >= 50 ? '#FBBF24' : '#F87171';
                  const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  return (
                    <div key={key} style={{ animationDelay: `${i * 300}ms` }}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-jf-text-secondary">{label}</span>
                        <span style={{ color }}>{val}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsla(var(--border-subtle))' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${val}%`, background: color, animation: `fill-bar 1s ease-out ${i * 0.3}s both` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => navigate('/analyze')}
                  className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-btn border border-[hsla(var(--border-subtle))] text-jf-text-secondary hover:border-[hsla(var(--border-glow))] hover:shadow-[0_0_20px_hsla(var(--accent-glow))] transition-all duration-250"
                >
                  <RefreshCw size={14} /> New Analysis
                </button>
                <CopyButton text={analysis.executive_summary} />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="glass glass-lg glass-no-hover p-1.5 flex gap-1 mb-8 overflow-x-auto">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-[10px] whitespace-nowrap transition-all duration-200 ${
                    activeTab === key
                      ? 'text-accent-primary border-b-2 border-accent-primary bg-[rgba(108,58,255,0.08)]'
                      : 'text-jf-text-muted hover:text-jf-text-secondary'
                  }`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>

            <div className="transition-opacity duration-200">
              {activeTab === 'skills' && <SkillsMatchTab analysis={analysis} />}
              {activeTab === 'gaps' && <SkillGapsTab analysis={analysis} />}
              {activeTab === 'recommendations' && <RecommendationsTab analysis={analysis} />}
              {activeTab === 'report' && <FullReportTab analysis={analysis} copyText={copyText} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 70, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="hsla(var(--border-subtle))" strokeWidth="8" />
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
          style={{
            '--circumference': `${c}`,
            '--target-offset': `${offset}`,
            animation: 'draw-ring 1s ease-out forwards',
          } as any}
        />
        <text x="80" y="76" textAnchor="middle" fill={color} fontSize="48" fontWeight="700" fontFamily="Plus Jakarta Sans">
          {score}
        </text>
        <text x="80" y="100" textAnchor="middle" fill="#5C5775" fontSize="11" fontWeight="500" letterSpacing="0.05em" fontFamily="Plus Jakarta Sans" style={{ textTransform: 'uppercase' }}>
          MATCH SCORE
        </text>
      </svg>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-btn border border-[hsla(var(--border-subtle))] text-jf-text-secondary hover:border-[hsla(var(--border-glow))] hover:shadow-[0_0_20px_hsla(var(--accent-glow))] transition-all duration-250"
    >
      {copied ? <><CheckCircle2 size={14} /> Copied</> : <><Copy size={14} /> Copy Summary</>}
    </button>
  );
}

function SkillsMatchTab({ analysis }: { analysis: AnalysisResult['analysis'] }) {
  const [filter, setFilter] = useState('All');
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    [...analysis.matched_skills, ...analysis.skill_gaps, ...analysis.bonus_skills].forEach((s: any) => {
      if (s.category) cats.add(s.category);
    });
    return Array.from(cats);
  }, [analysis]);

  const rows = useMemo(() => {
    const result: Array<{ type: 'matched' | 'missing' | 'bonus'; skill: string; required?: string; category?: string }> = [];
    analysis.matched_skills.forEach(s => result.push({ type: 'matched', skill: s.skill, required: s.skill, category: s.category }));
    analysis.skill_gaps.forEach(s => result.push({ type: 'missing', skill: '', required: s.skill, category: (s as any).category }));
    analysis.bonus_skills.forEach(s => result.push({ type: 'bonus', skill: s.skill, category: s.category }));
    return filter === 'All' ? result : result.filter(r => r.category === filter);
  }, [analysis, filter]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-pill transition-all duration-200 ${
              filter === cat ? 'bg-accent-primary text-white' : 'glass glass-md glass-no-hover text-jf-text-muted hover:text-jf-text-secondary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="glass glass-lg glass-no-hover overflow-hidden">
        <div className="grid grid-cols-[1fr_40px_1fr] gap-0 px-5 py-3 border-b border-[hsla(var(--border-subtle))]">
          <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-jf-text-muted">Your Skills</span>
          <span />
          <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-jf-text-muted">Required Skills</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_40px_1fr] gap-0 px-5 py-3 border-b border-[hsla(var(--border-subtle))] last:border-0 transition-all duration-300"
            style={{
              opacity: 0,
              animation: `hero-fade 0.4s ease-out ${i * 80}ms forwards`,
              borderLeftWidth: '3px',
              borderLeftColor: row.type === 'matched' ? 'rgba(52,211,153,0.3)' : row.type === 'missing' ? 'rgba(251,191,36,0.3)' : 'rgba(108,58,255,0.3)',
            }}
          >
            <span className="text-sm text-jf-text-primary">
              {row.type === 'missing' ? <span className="text-jf-text-muted">&mdash;</span> : row.skill}
              {row.type === 'bonus' && (
                <span className="ml-2 inline-flex px-1.5 py-0.5 text-[11px] rounded-pill bg-[rgba(108,58,255,0.15)] text-accent-primary">Bonus</span>
              )}
            </span>
            <span className="flex items-center justify-center">
              {row.type === 'matched' && <CheckCircle2 size={16} className="text-accent-success" />}
              {row.type === 'missing' && <AlertTriangle size={16} className="text-accent-warning" />}
              {row.type === 'bonus' && <Sparkles size={16} className="text-accent-primary" />}
            </span>
            <span className="text-sm text-jf-text-primary">
              {row.type === 'bonus' ? <span className="text-jf-text-muted">&mdash;</span> : row.required}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillGapsTab({ analysis }: { analysis: AnalysisResult['analysis'] }) {
  const priorityColor = (p: string) => {
    const l = p.toLowerCase();
    return l.includes('high') ? '#F87171' : l.includes('medium') ? '#FBBF24' : '#34D399';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {analysis.skill_gaps.map((gap, i) => {
        const color = priorityColor(gap.priority);
        return (
          <div
            key={i}
            className="glass glass-lg glass-no-hover p-6"
            style={{
              borderLeftWidth: '4px',
              borderLeftColor: color,
              opacity: 0,
              animation: `hero-fade 0.4s ease-out ${i * 150}ms forwards`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-pill" style={{ background: `${color}20`, color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                {gap.priority}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-jf-text-primary mb-2">{gap.skill}</h3>
            <p className="text-sm italic text-jf-text-secondary mb-4">{gap.why_important}</p>

            <div className="space-y-2 mb-4">
              <ProgressRow label="Current Level" value={gap.current_level_pct} sublabel={gap.current_level} color="#5C5775" />
              <ProgressRow label="Required Level" value={gap.required_level_pct} sublabel={gap.required_level} color="#6C3AFF" />
            </div>

            {gap.resource_title && (
              <div className="glass glass-md glass-no-hover p-3 flex items-start gap-3">
                <BookOpen size={16} className="text-accent-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-jf-text-primary">{gap.resource_title}</p>
                  <p className="text-xs text-jf-text-muted">{gap.resource_platform} &middot; {gap.resource_hours}h</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProgressRow({ label, value, sublabel, color }: { label: string; value: number; sublabel: string; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-jf-text-muted">{label}</span>
        <span className="text-jf-text-secondary">{sublabel}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsla(var(--border-subtle))' }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color, animation: 'fill-bar 1s ease-out both' }} />
      </div>
    </div>
  );
}

function RecommendationsTab({ analysis }: { analysis: AnalysisResult['analysis'] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <CalendarDays size={20} className="text-accent-primary" />
        <h3 className="text-xl font-semibold text-jf-text-primary">Personalized Learning Path</h3>
      </div>

      {/* Timeline */}
      <div className="relative pl-8 mb-12">
        <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ background: 'hsla(var(--border-subtle))' }} />
        {analysis.learning_path.map((item, i) => (
          <div key={i} className="relative mb-8 last:mb-0" style={{ opacity: 0, animation: `hero-fade 0.4s ease-out ${i * 150}ms forwards` }}>
            <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-accent-primary" />
            <div className="glass glass-lg glass-no-hover p-5">
              <span className="text-xs font-medium uppercase tracking-[0.05em] text-jf-text-muted">{item.week_range}</span>
              <h4 className="text-base font-semibold text-jf-text-primary mt-1">{item.focus}</h4>
              <p className="text-sm text-jf-text-secondary mt-1">{item.resource}</p>
              <p className="text-sm text-jf-text-muted mt-1">{item.goal}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass glass-lg glass-no-hover overflow-hidden">
        <div className="grid grid-cols-4 gap-0 px-5 py-3 border-b border-[hsla(var(--border-subtle))]">
          {['Week', 'Focus Area', 'Resource', 'Goal'].map(h => (
            <span key={h} className="text-[11px] font-medium uppercase tracking-[0.05em] text-jf-text-muted">{h}</span>
          ))}
        </div>
        {analysis.learning_path.map((item, i) => (
          <div key={i} className={`grid grid-cols-4 gap-0 px-5 py-3 border-b border-[hsla(var(--border-subtle))] last:border-0 ${i % 2 === 0 ? 'bg-[rgba(255,255,255,0.015)]' : ''}`}>
            <span className="text-sm text-jf-text-primary">{item.week_range}</span>
            <span className="text-sm text-jf-text-primary">{item.focus}</span>
            <span className="text-sm text-jf-text-secondary">{item.resource}</span>
            <span className="text-sm text-jf-text-secondary">{item.goal}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FullReportTab({ analysis, copyText }: { analysis: AnalysisResult['analysis']; copyText: (text: string) => void }) {
  const sections = [
    { title: 'Executive Summary', content: analysis.executive_summary },
    { title: 'Strengths Analysis', content: analysis.strengths_narrative },
    { title: 'Gap Analysis', content: analysis.gaps_narrative },
    { title: 'Market Positioning', content: analysis.market_positioning },
    { title: 'Action Plan', content: analysis.action_plan },
  ];

  return (
    <div className="space-y-6">
      {sections.map(({ title, content }, i) => (
        <div key={i} className="glass glass-lg glass-no-hover p-6" style={{ opacity: 0, animation: `hero-fade 0.4s ease-out ${i * 100}ms forwards` }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-jf-text-primary">{title}</h3>
            <SectionCopyButton text={content} onCopy={copyText} />
          </div>
          <p className="text-[15px] leading-[1.7] text-jf-text-secondary whitespace-pre-wrap">{content}</p>
        </div>
      ))}
    </div>
  );
}

function SectionCopyButton({ text, onCopy }: { text: string; onCopy: (t: string) => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { onCopy(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-xs text-jf-text-muted hover:text-jf-text-secondary transition-colors"
    >
      {copied ? <><CheckCircle2 size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
    </button>
  );
}

export default ResultsPage;
