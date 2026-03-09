import { ArrowRight, Upload, Target, Rocket, BarChart3, Sparkles, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView, useCountUp } from '@/hooks/use-animations';
import Navbar from '@/components/Navbar';

const LandingPage = () => {
  return (
    <div className="aurora-bg min-h-screen relative">
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        <div className="text-center max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 glass glass-md glass-no-hover px-4 py-2 mb-8 border-[hsla(var(--border-glow))]"
            style={{ animationDelay: '0s', opacity: 0, animation: 'hero-fade 0.6s ease-out 0.1s forwards' }}
          >
            <Sparkles size={14} className="text-accent-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.05em] text-jf-text-muted">
              AI-Powered Career Intelligence
            </span>
          </div>

          <h1
            className="text-4xl md:text-[56px] font-extrabold leading-[1.1] tracking-[-0.03em] text-jf-text-primary mb-6"
            style={{ opacity: 0, animation: 'hero-fade 0.6s ease-out 0.3s forwards' }}
          >
            Find Your Perfect
            <br />
            <span className="gradient-text">Career Fit</span>
          </h1>

          <p
            className="text-lg text-jf-text-secondary max-w-[540px] mx-auto mb-10 leading-relaxed"
            style={{ opacity: 0, animation: 'hero-fade 0.6s ease-out 0.5s forwards' }}
          >
            Upload your resume, match it against any job description, and get an AI-generated skill gap analysis with a personalized learning roadmap.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ opacity: 0, animation: 'hero-fade 0.6s ease-out 0.7s forwards' }}
          >
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold text-sm px-8 py-3.5 rounded-btn hover:shadow-[0_0_20px_hsla(var(--accent-glow))] hover:-translate-y-0.5 transition-all duration-250"
            >
              Analyze Resume <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-btn border border-[hsla(var(--border-subtle))] text-jf-text-secondary hover:border-[hsla(var(--border-glow))] hover:shadow-[0_0_20px_hsla(var(--accent-glow))] transition-all duration-250"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div
          className="mt-20 max-w-[900px] w-full mx-auto"
          style={{ perspective: '1200px', opacity: 0, animation: 'hero-fade 0.8s ease-out 0.9s forwards' }}
        >
          <div className="glass glass-lg glass-no-hover p-8" style={{ transform: 'rotateX(8deg)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: BarChart3, label: 'Match Score' },
                { icon: Target, label: 'Skill Gaps' },
                { icon: Rocket, label: 'Learning Path' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="glass glass-md glass-no-hover p-6 flex flex-col items-center gap-3">
                  <Icon size={28} className="text-accent-primary" />
                  <span className="text-sm font-medium text-jf-text-secondary">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-jf-text-primary mb-4">How It Works</h2>
          <p className="text-jf-text-secondary max-w-lg mx-auto">
            Three steps to bridge the gap between where you are and where you want to be.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Upload, title: 'Upload Resume', desc: 'Drop your PDF resume and we will parse it instantly using advanced AI document processing.', step: '01' },
            { icon: Target, title: 'AI Skill Analysis', desc: 'Our AI engine maps your skills against job requirements and identifies critical gaps.', step: '02' },
            { icon: Rocket, title: 'Career Roadmap', desc: 'Get a personalized week-by-week learning path to close your skill gaps efficiently.', step: '03' },
          ].map(({ icon: Icon, title, desc, step }, i) => (
            <FeatureCard key={step} icon={Icon} title={title} desc={desc} step={step} delay={i * 150} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <StatsBar />

      {/* Footer */}
      <footer className="py-16 text-center">
        <p className="text-sm text-jf-text-muted">Built with AI. Made for ambition.</p>
      </footer>

    </div>
  );
};

function FeatureCard({ icon: Icon, title, desc, step, delay }: { icon: any; title: string; desc: string; step: string; delay: number }) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className="glass glass-lg p-8 relative transition-all duration-300"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <span className="absolute top-4 right-5 text-xs font-semibold text-jf-text-muted">{step}</span>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(108, 58, 255, 0.1)' }}>
        <Icon size={22} className="text-accent-primary" />
      </div>
      <h3 className="text-lg font-semibold text-jf-text-primary mb-2">{title}</h3>
      <p className="text-[15px] leading-relaxed text-jf-text-secondary">{desc}</p>
    </div>
  );
}

function StatsBar() {
  const { ref, isInView } = useInView();
  const count1 = useCountUp(10000, isInView);
  const count2 = useCountUp(95, isInView);
  const count3 = useCountUp(200, isInView);

  const stats = [
    { value: `${count1.toLocaleString()}+`, label: 'Resumes Analyzed' },
    { value: `${count2}%`, label: 'Accuracy Rate' },
    { value: `${count3}+`, label: 'Job Roles Supported' },
  ];

  return (
    <div ref={ref} className="max-w-5xl mx-auto px-6 py-12">
      <div className="glass glass-lg glass-no-hover p-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[hsla(var(--border-subtle))]">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center py-4 sm:py-0">
            <div className="text-4xl font-bold gradient-text mb-1">{value}</div>
            <div className="text-xs font-medium uppercase tracking-[0.05em] text-jf-text-muted">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
