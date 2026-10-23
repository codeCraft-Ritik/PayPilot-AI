import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sparkles, Scale, BarChart3, Radio } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded border border-border bg-foreground flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm group-hover:bg-accent transition-colors">
              P
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold tracking-tight text-foreground text-base">PayPilot</span>
                <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-accent-subtle text-accent border border-accent-border">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-foreground-muted font-mono tracking-wide mt-0.5">
                SHOPPING COPILOT
              </span>
            </div>
          </Link>

          {/* Sandbox Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-subtle border border-border text-[11px] font-mono text-foreground-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span>PAYPAL SANDBOX</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-subtle'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-accent text-white text-[10px] font-mono flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Currency Toggle + Cart */}
        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center p-0.5 rounded border border-border bg-surface-subtle text-xs font-mono">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded transition-colors ${
                currency === 'USD'
                  ? 'bg-surface text-foreground font-semibold shadow-xs'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
              title="Browse in USD (Base PayPal Checkout Currency)"
            >
              USD $
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2 py-1 rounded transition-colors ${
                currency === 'INR'
                  ? 'bg-surface text-foreground font-semibold shadow-xs'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
              title="Display INR conversion (1 USD ≈ ₹83.5)"
            >
              INR ₹
            </button>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-subtle text-foreground text-xs font-medium flex items-center gap-2 transition-colors shadow-tactile active:scale-95"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-foreground-muted" />
            <span className="hidden sm:inline font-mono">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-foreground text-surface text-[11px] font-mono font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Quick Copilot CTA on Mobile */}
          <Link
            to="/workspace"
            className="md:hidden p-2 rounded bg-accent text-white"
            aria-label="Open AI Copilot"
          >
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
