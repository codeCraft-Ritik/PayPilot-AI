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
  Layers,
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
      to: '/procurement',
      label: 'BuyWard',
      icon: Layers,
      badgeText: 'New',
    },
    {
      to: '/workspace?mode=agent',
      label: 'Agent Pilot',
      icon: Zap,
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
    <header className="fixed top-2.5 sm:top-3 inset-x-0 mx-auto w-[95%] max-w-6xl z-50 transition-colors duration-200">
      <div
        className={`relative rounded-full transition-colors duration-200 ${
          isScrolled
            ? 'glass-island-scrolled shadow-md'
            : 'glass-island shadow-xs'
        } px-3.5 sm:px-4 py-2 flex items-center justify-between gap-3`}
      >
        {/* Subtle scroll progress line at bottom of bar */}
        <div className="absolute bottom-0 inset-x-6 h-[2px] overflow-hidden rounded-full pointer-events-none opacity-80">
          <div
            className="h-full bg-accent transition-transform duration-150 ease-out origin-left scroll-progress-line-css"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Left Branding */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs group-hover:scale-105 transition-transform duration-150">
              <span>P</span>
            </div>

            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold tracking-tight text-foreground text-sm sm:text-base group-hover:text-accent transition-colors duration-150">
                PayPilot
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 shrink-0">
                AI
              </span>
            </div>
          </Link>
        </div>

        {/* Center Desktop Navigation Pill */}
        <nav
          className="hidden lg:flex items-center gap-0.5 p-1 rounded-full bg-surface-subtle/80 border border-border/70 shrink-0 mx-auto"
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
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
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
                    <span className="px-1.5 py-0.2 rounded-full bg-accent text-white text-[9.5px] font-mono font-medium shrink-0">
                      {link.badge}
                    </span>
                  )}
                  {link.badgeText && (
                    <span className="px-1.5 py-0.5 rounded-full bg-accent/10 text-accent text-[9.5px] font-medium leading-none shrink-0">
                      {link.badgeText}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Sandbox, Currency & Cart */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Subtle Live Sandbox status */}
          <div
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-subtle border border-border/70 text-[11px] text-foreground-muted shrink-0"
            title="Connected to PayPal Sandbox REST v2 & Channel3 catalog"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-medium text-foreground">Sandbox</span>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center p-0.5 rounded-full border border-border/80 bg-surface-subtle text-[11px] font-sans shadow-xs shrink-0">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded-full transition-colors duration-150 shrink-0 ${
                currency === 'USD'
                  ? 'bg-surface text-foreground font-semibold shadow-xs border border-border/50'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
              title="Browse in USD"
            >
              USD
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2 py-1 rounded-full transition-colors duration-150 shrink-0 ${
                currency === 'INR'
                  ? 'bg-surface text-foreground font-semibold shadow-xs border border-border/50'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
              title="Display INR conversion (1 USD ≈ ₹83.5)"
            >
              INR
            </button>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-3 py-1.5 rounded-full border border-border/80 bg-surface hover:bg-surface-subtle text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors duration-150 shadow-xs shrink-0"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
            <span className="hidden sm:inline text-xs">Cart</span>
            {cartCount > 0 && (
              <span className="w-4.5 h-4.5 rounded-full bg-accent text-white text-[10px] font-mono font-medium flex items-center justify-center shadow-xs shrink-0">
                {cartCount}
              </span>
            )}
          </button>

          <Link
            to="/workspace?mode=agent"
            className="lg:hidden p-2 rounded-full bg-accent text-white shadow-xs transition-transform duration-150 shrink-0"
            aria-label="Open Agent Pilot"
            title="Open Agent Pilot"
          >
            <Zap className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-full border border-border bg-surface text-foreground-muted hover:text-foreground transition-colors duration-150 shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Dropdown Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="lg:hidden mt-2 rounded-2xl glass-island-scrolled p-4 border border-border shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs text-foreground-muted font-medium">
                Navigation
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>PayPal Sandbox Active</span>
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
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors duration-150 ${
                      isActive
                        ? 'bg-accent text-white font-semibold shadow-xs'
                        : 'bg-surface-subtle text-foreground hover:bg-surface'
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
                        <span className="px-1.5 py-0.5 rounded-full bg-accent/20 text-accent text-[9px] font-medium">
                          {link.badgeText}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-foreground-muted">
              <span className="flex items-center gap-1 text-emerald-600">
                <span>●</span>
                <span>Verified product catalog</span>
              </span>
              <span>PayPal AI Hackathon</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
