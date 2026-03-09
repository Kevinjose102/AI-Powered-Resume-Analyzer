import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle2, BarChart3, Target, Brain } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { fetchPresets, analyzeResume, type Preset } from '@/lib/api';
import { useAppToast } from '@/components/AppToast';

const AnalyzePage = () => {
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'paste' | 'preset'>('paste');
  const [description, setDescription] = useState('');
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPresets().then(setPresets).catch(() => {});
  }, []);

  useEffect(() => {
    if (file) setStep(1);
    if (file && (description || selectedPreset)) setStep(2);
  }, [file, description, selectedPreset]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === 'application/pdf') setFile(f);
    else showToast('error', 'Please upload a PDF file.');
  }, [showToast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 3000);

    try {
      const result = await analyzeResume(file, description, selectedPreset);
      sessionStorage.setItem('analysisResults', JSON.stringify(result));
      showToast('success', 'Analysis complete!');
      navigate('/results');
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Analysis failed. Please try again.';
      showToast('error', msg);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const steps = ['Upload Resume', 'Job Description', 'Analyze'];
  const canAnalyze = file && (description.trim() || selectedPreset);

  return (
    <div className="aurora-bg min-h-screen relative">
      <Navbar />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(2,1,7,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="glass glass-lg glass-no-hover p-10 max-w-md w-full text-center">
            <div className="spinner mx-auto mb-8" />
            <div className="space-y-4 text-left">
              {[
                { icon: FileText, text: 'Parsing resume...' },
                { icon: Brain, text: 'Extracting skills with AI...' },
                { icon: Target, text: 'Matching against job requirements...' },
                { icon: BarChart3, text: 'Generating skill gap report...' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className={`flex items-center gap-3 transition-colors duration-300 ${
                  i < loadingStep ? 'text-accent-success' : i === loadingStep ? 'text-jf-text-primary' : 'text-jf-text-muted'
                }`}>
                  {i < loadingStep ? (
                    <CheckCircle2 size={18} />
                  ) : i === loadingStep ? (
                    <span className="pulse-dot"><Icon size={18} /></span>
                  ) : (
                    <Icon size={18} />
                  )}
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[720px] mx-auto px-6 pt-28 pb-20 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-jf-text-primary mb-2">Analyze Your Resume</h1>
        <p className="text-jf-text-secondary mb-10">Upload your resume and provide a target job description to get started.</p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  i < step ? 'bg-accent-success text-white' :
                  i === step ? 'bg-accent-primary text-white' :
                  'glass glass-no-hover text-jf-text-muted'
                }`}>
                  {i < step ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className="text-[11px] font-medium text-jf-text-muted mt-2 whitespace-nowrap">{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-16 sm:w-24 h-0.5 mx-2 mb-5 rounded-full overflow-hidden" style={{ background: 'hsla(var(--border-subtle))' }}>
                  <div
                    className="h-full bg-accent-primary transition-all duration-500"
                    style={{ width: i < step ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* File Upload */}
        <div
          className={`glass glass-lg glass-no-hover min-h-[200px] flex flex-col items-center justify-center p-8 mb-6 cursor-pointer transition-all duration-300 ${
            dragOver ? 'border-accent-primary border-solid' : 'border-dashed border-2'
          }`}
          style={{
            borderStyle: file ? 'solid' : dragOver ? 'solid' : 'dashed',
            borderWidth: file ? '1px' : '2px',
            background: dragOver ? 'rgba(108,58,255,0.05)' : undefined,
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !file && inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          {file ? (
            <div className="flex items-center gap-4 w-full">
              <FileText size={28} className="text-accent-primary" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-jf-text-primary">{file.name}</p>
                <p className="text-xs text-jf-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <CheckCircle2 size={20} className="text-accent-success" />
            </div>
          ) : (
            <>
              <Upload size={40} className="text-jf-text-muted mb-3" />
              <p className="text-sm text-jf-text-secondary mb-1">Drag and drop your resume here</p>
              <p className="text-sm text-jf-text-muted">
                or <span className="text-accent-primary underline">browse</span>
              </p>
              <p className="text-xs text-jf-text-muted mt-3">Accepted format: PDF</p>
            </>
          )}
        </div>
        {file && (
          <button onClick={() => { setFile(null); setStep(0); }} className="text-xs text-jf-text-muted hover:text-jf-text-secondary transition-colors mb-6">
            Change file
          </button>
        )}

        {/* Job Description */}
        <div className="glass glass-lg glass-no-hover p-6 mb-8">
          <div className="flex rounded-btn overflow-hidden mb-4 border border-[hsla(var(--border-subtle))]">
            {(['paste', 'preset'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 text-sm font-medium py-2.5 transition-all duration-200 ${
                  mode === m ? 'bg-accent-primary text-white' : 'text-jf-text-secondary hover:text-jf-text-primary'
                }`}
              >
                {m === 'paste' ? 'Paste Description' : 'Select Preset'}
              </button>
            ))}
          </div>

          {mode === 'preset' && presets.length > 0 && (
            <select
              value={selectedPreset}
              onChange={e => { setSelectedPreset(e.target.value); setDescription(''); }}
              className="w-full mb-4 px-4 py-3 text-sm rounded-btn border border-[hsla(var(--border-subtle))] bg-[rgba(255,255,255,0.03)] text-jf-text-primary focus:outline-none focus:border-accent-primary"
            >
              <option value="">Select a job preset...</option>
              {presets.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          )}

          <div className="relative">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={6}
              className="w-full px-4 py-3 text-[15px] rounded-btn border border-[hsla(var(--border-subtle))] bg-[rgba(255,255,255,0.03)] text-jf-text-primary placeholder:text-jf-text-muted focus:outline-none focus:border-accent-primary resize-none"
            />
            <span className="absolute bottom-3 right-3 text-xs text-jf-text-muted">{description.length} chars</span>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || loading}
          className={`w-full flex items-center justify-center gap-2 bg-accent-primary text-white font-semibold text-sm py-4 rounded-btn transition-all duration-250 ${
            canAnalyze && !loading ? 'hover:bg-accent-primary-hover hover:shadow-[0_0_20px_hsla(var(--accent-glow))] hover:-translate-y-0.5' : 'opacity-40 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              Analyzing
              <span className="bouncing-dots">
                <span /><span /><span />
              </span>
            </>
          ) : (
            <>
              <BarChart3 size={18} /> Run Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AnalyzePage;
