import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass glass-no-hover border-b border-b-[hsla(var(--border-subtle))]' : ''
      }`}
      style={{ backdropFilter: scrolled ? 'blur(20px)' : 'none' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-jf-text-primary" style={{ letterSpacing: '-0.02em' }}>
          Job<span className="text-accent-primary">Fit</span>
        </Link>
        <div className="flex items-center gap-6">
          {location.pathname === '/' && (
            <>
              <a href="#features" className="text-sm text-jf-text-secondary hover:text-jf-text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-jf-text-secondary hover:text-jf-text-primary transition-colors">
                How It Works
              </a>
            </>
          )}
          <Link
            to="/analyze"
            className="text-sm font-semibold px-5 py-2 rounded-btn border border-[hsla(var(--border-subtle))] text-jf-text-secondary hover:border-[hsla(var(--border-glow))] hover:shadow-[0_0_20px_hsla(var(--accent-glow))] transition-all duration-250"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
