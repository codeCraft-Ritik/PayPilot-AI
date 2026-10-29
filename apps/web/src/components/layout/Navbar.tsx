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
  ShieldCheck,
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
      setIsScrolled(scrollY > 20);
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
  }, [location.pathname]);

  const navLinks = [
    { to: '/workspace', label: 'AI Copilot', icon: Sparkles },
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
    <header className="fixed top-2.5 sm:top-4 inset-x-0 mx-auto w-[94%] max-w-6xl z-50 transition-all duration-300">
      <div
        className={`relative rounded-full transition-all duration-300 ${
          isScrolled ? 'glass-island-scrolled shadow-xl' : 'glass-island shadow-md'
        } px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between`}
      >
        {/* Subtle Ambient Scroll Progress Hairline */}
        <div className="absolute bottom-0 inset-x-6 h-[2px] overflow-hidden rounded-full pointer-events-none opacity-80">
          <div
            className="h-full bg-gradient-to-r from-accent via-indigo-500 to-accent transition-all duration-150 ease-out scroll-progress-line-css"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Brand Identity / Logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm group-hover:scale-105 group-hover:shadow-glow-subtle transition-all duration-200">
              <span className="relative z-10">P</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold tracking-tight text-foreground text-sm sm:text-base group-hover:text-accent transition-colors">
                  PayPilot
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/30 tracking-tight">
                  AI
                </span>
              </div>
              <span className="text-[9px] text-foreground-muted font-mono tracking-wider mt-0.5 hidden xs:block">
                SHOPPING COPILOT
              </span>
            </div>
          </Link>

          {/* Interactive Live PayPal & Gemini Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/70 border border-border/80 text-[11px] font-mono text-foreground-muted shadow-xs backdrop-blur-sm group/status relative cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-foreground font-medium text-[10px] tracking-tight">PAYPAL SANDBOX</span>
            <span className="text-foreground-muted/60">•</span>
            <span className="text-accent text-[10px] font-medium flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5" />
              <span>GEMINI 2.5</span>
            </span>

            {/* Hover Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 rounded-md bg-foreground text-surface text-[10px] font-sans font-medium whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover/status:opacity-100 transition-opacity z-50">
              Verified Sandbox REST API & Deterministic Grounding
            </div>
          </div>
        </div>

        {/* Center Navigation Links with Kinetic Sliding Pill */}
        <nav
          className="hidden md:flex items-center gap-1 p-1 rounded-full bg-surface-subtle/60 border border-border/50 backdrop-blur-xs"
          onMouseLeave={() => setHoveredTab(null)}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                onMouseEnter={() => setHoveredTab(link.to)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-accent font-semibold'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {/* Active Sliding Indicator Pill */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-surface rounded-full shadow-sm border border-border/60"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}

                {/* Hover Indicator Pill */}
                {!isActive && hoveredTab === link.to && (
                  <motion.div
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 bg-surface/50 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-0.5 px-1.5 py-0.2 rounded-full bg-accent text-white text-[9px] font-mono font-bold"
                    >
                      {link.badge}
                    </motion.span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Tactile Currency Switcher + Cart + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Segmented Currency Switcher */}
          <div className="flex items-center p-0.5 rounded-full border border-border/80 bg-surface-subtle/80 text-[11px] font-mono shadow-xs backdrop-blur-xs">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-0.5 rounded-full transition-all duration-200 ${
                currency === 'USD'
                  ? 'bg-surface text-foreground font-bold shadow-xs border border-border/40'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
              title="Browse in USD (Base PayPal Checkout Currency)"
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2.5 py-0.5 rounded-full transition-all duration-200 ${
                currency === 'INR'
                  ? 'bg-surface text-foreground font-bold shadow-xs border border-border/40'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
              title="Display INR conversion (1 USD ≈ ₹83.5)"
            >
              ₹ INR
            </button>
          </div>

          {/* Interactive Cart Button with Spring Pop Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-3 py-1.5 rounded-full border border-border/80 bg-surface hover:bg-surface-subtle text-foreground text-xs font-medium flex items-center gap-2 transition-all shadow-tactile hover:shadow-tactile-md active:scale-95"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-foreground-muted" />
            <span className="hidden sm:inline font-mono font-semibold text-xs">Cart</span>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-xs"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          {/* Quick AI Launch Icon on Mobile */}
          <Link
            to="/workspace"
            className="md:hidden p-2 rounded-full bg-accent text-white shadow-tactile active:scale-90 transition-transform"
            aria-label="Open AI Copilot"
          >
            <Sparkles className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full border border-border bg-surface text-foreground-muted hover:text-foreground transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Glass Dropdown */}
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
                <span>PAYPAL SANDBOX ACTIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-white font-semibold shadow-tactile'
                        : 'bg-surface-subtle/70 text-foreground hover:bg-surface'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="ml-auto px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-foreground-muted font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Zero Price Hallucination</span>
              </span>
              <span>v1.0 Hackathon</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
