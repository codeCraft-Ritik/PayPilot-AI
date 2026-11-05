import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Sparkles,
  Scale,
  BarChart3,
  Radio,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';

export const Navbar: React.FC = () => {
  const {
    currency,
    setCurrency,
    cartCount,
    setIsCartOpen,
    comparedProductIds,
  } = useApp();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(scrollY > 15);
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollY / totalScroll) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const navLinks = [
    { to: '/workspace', label: 'AI Copilot', icon: Sparkles },
    {
      to: '/workspace?mode=agent',
      label: 'Agent Pilot',
      icon: Zap,
      badgeText: '5K TRACK',
    },
    { to: '/catalogue', label: 'Catalogue', icon: Radio },
    {
      to: '/compare',
      label: 'Compare',
      icon: Scale,
      badge: comparedProductIds.length > 0 ? comparedProductIds.length : undefined,
    },
    { to: '/insights', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <header className="fixed top-2 sm:top-3.5 inset-x-0 mx-auto w-[95%] max-w-6xl z-50 transition-all duration-300">
      <div
        className={`relative rounded-full transition-all duration-300 ${
          isScrolled
            ? 'glass-island-scrolled shadow-lg'
            : 'glass-island shadow-sm'
        } px-3 sm:px-5 py-2 flex items-center justify-between gap-2`}
      >
        <div className="absolute bottom-0 inset-x-8 h-[2px] overflow-hidden rounded-full pointer-events-none opacity-80">
          <div
            className="h-full bg-gradient-to-r from-accent via-indigo-500 to-accent transition-all duration-150 ease-out scroll-progress-line-css"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs group-hover:scale-105 transition-transform duration-200">
              <span className="relative z-10">P</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold tracking-tight text-foreground text-sm sm:text-base group-hover:text-accent transition-colors">
                PayPilot
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/25 tracking-tight shrink-0">
                AI
              </span>
            </div>
          </Link>

          <div
            className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-subtle/90 border border-border/80 text-[10px] font-mono text-foreground-muted cursor-default relative group/status shrink-0 transition-colors hover:border-accent/40"
            title="PayPal Sandbox v2 & Channel3 100M+ Graph Connected"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="font-semibold text-foreground tracking-tight whitespace-nowrap">SANDBOX</span>
            <span className="text-foreground-muted/40">•</span>
            <span className="text-success font-semibold tracking-tight whitespace-nowrap">100M+ GRAPH</span>

            <div className="flex items-center gap-0.5 h-2.5 ml-0.5 pl-1.5 border-l border-border/80 shrink-0">
              <span className="w-0.5 bg-accent rounded-full animate-soundwave-1" />
              <span className="w-0.5 bg-accent rounded-full animate-soundwave-2" />
              <span className="w-0.5 bg-accent rounded-full animate-soundwave-3" />
            </div>

            <div className="absolute top-full left-0 mt-2 px-3 py-1.5 rounded-lg bg-foreground text-surface text-[11px] font-sans font-medium whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover/status:opacity-100 transition-opacity z-50">
              PayPal Sandbox v2 • Gemini 2.5 Flash • Channel3 100M+ Catalog
            </div>
          </div>
        </div>

        <nav
          className="hidden md:flex items-center gap-1 p-1 rounded-full bg-surface-subtle/70 border border-border/50 shrink-0"
          onMouseLeave={() => setHoveredTab(null)}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const currentFullPath = `${location.pathname}${location.search}`;
            const isActive = link.to.includes('?')
              ? currentFullPath === link.to
              : location.pathname === link.to && !location.search.includes('mode=agent');

            return (
              <Link
                key={link.to}
                to={link.to}
                onMouseEnter={() => setHoveredTab(link.to)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'text-accent font-semibold'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-surface rounded-full shadow-xs border border-border/60"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}

                {!isActive && hoveredTab === link.to && (
                  <motion.div
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 bg-surface/60 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="shrink-0">{link.label}</span>
                  {link.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-1.5 py-0.2 rounded-full bg-accent text-white text-[9px] font-mono font-bold shrink-0"
                    >
                      {link.badge}
                    </motion.span>
                  )}
                  {link.badgeText && (
                    <span className="px-1.5 py-0.5 rounded-full bg-accent/12 text-accent text-[8.5px] font-mono font-bold border border-accent/25 tracking-wide uppercase shrink-0">
                      {link.badgeText}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="flex items-center p-0.5 rounded-full border border-border/80 bg-surface-subtle/80 text-[11px] font-mono shadow-xs shrink-0">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-full transition-all duration-150 shrink-0 ${
                currency === 'USD'
                  ? 'bg-surface text-foreground font-bold shadow-xs border border-border/50'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
              title="Browse in USD"
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2.5 py-1 rounded-full transition-all duration-150 shrink-0 ${
                currency === 'INR'
                  ? 'bg-surface text-foreground font-bold shadow-xs border border-border/50'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
              title="Display INR conversion (1 USD ≈ ₹83.5)"
            >
              ₹ INR
            </button>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-3 py-1.5 rounded-full border border-border/80 bg-surface hover:bg-surface-subtle text-foreground text-xs font-semibold flex items-center gap-2 transition-all shadow-xs active:scale-95 shrink-0"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-foreground-muted shrink-0" />
            <span className="hidden sm:inline font-mono text-xs">Cart</span>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-xs shrink-0"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          <Link
            to="/workspace?mode=agent"
            className="md:hidden p-2 rounded-full bg-accent text-white shadow-xs active:scale-90 transition-transform shrink-0"
            aria-label="Open Agent Pilot"
            title="Open Agent Pilot ($5,000 Track)"
          >
            <Zap className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full border border-border bg-surface text-foreground-muted hover:text-foreground transition-colors shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden mt-2 rounded-2xl glass-island-scrolled p-4 border border-border shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-[11px] font-mono text-foreground-muted uppercase tracking-wider">
                NAVIGATION
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span>PAYPAL SANDBOX • CHANNEL3</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const currentFullPath = `${location.pathname}${location.search}`;
                const isActive = link.to.includes('?')
                  ? currentFullPath === link.to
                  : location.pathname === link.to && !location.search.includes('mode=agent');

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-white font-semibold shadow-xs'
                        : 'bg-surface-subtle/80 text-foreground hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{link.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {link.badge && (
                        <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                          {link.badge}
                        </span>
                      )}
                      {link.badgeText && (
                        <span className="px-1.5 py-0.5 rounded-full bg-accent/20 text-accent text-[9px] font-mono font-bold">
                          {link.badgeText}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-foreground-muted font-mono">
              <span className="flex items-center gap-1 text-success">
                <span>●</span>
                <span>Zero Price Hallucination</span>
              </span>
              <span>PayPal AI Hackathon</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
