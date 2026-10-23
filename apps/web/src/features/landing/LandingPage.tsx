import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SAMPLE_QUERIES, CATEGORIES } from '@paypilot/shared';
import { ProductCard } from '../../components/shared/ProductCard.js';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    navigate(`/workspace?q=${encodeURIComponent(queryInput.trim())}`);
  };

  const handleSelectSample = (prompt: string) => {
    navigate(`/workspace?q=${encodeURIComponent(prompt)}`);
  };

  // Preview product for hero demonstration
  const sampleHeroProduct = {
    id: 'prod-aud-01',
    name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    brand: 'Sony',
    category: 'audio' as const,
    description: 'Industry-leading noise cancellation with Auto NC Optimizer, 8 microphones, and up to 30 hours playback.',
    price: 398.0,
    priceInr: 33233,
    currency: 'USD' as const,
    rating: 4.8,
    reviewCount: 3840,
    inStock: true,
    stockCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    tags: ['wireless', 'anc', 'microphone'],
    specs: { batteryHours: 30, weightGrams: 250 },
    keyFeatures: ['Dual Processors and 8 Microphones', 'Ultra-comfortable fit'],
    pros: ['Unrivaled noise cancellation', 'Superb call clarity for Zoom/Teams'],
    cons: ['Non-folding hinge takes more bag space'],
    highlightedFeature: 'Industry-leading Active Noise Cancellation with Auto NC Optimizer',
    isSampleData: true,
  };

  const sampleHeroRec = {
    product: sampleHeroProduct,
    matchScore: 96,
    breakdown: { overallScore: 96, budgetScore: 94, featureScore: 98, ratingScore: 96 },
    budgetStatus: 'under-budget' as const,
    budgetDifferenceUsd: 52,
    whyItFits: 'Matches your focus on meeting mic clarity (8 beamforming mics) and industry-leading ANC.',
    tradeOffs: 'Carry case is larger due to non-collapsible headband.',
    keyDifferentiator: '8-microphone beamforming array with auto-noise suppression',
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Interactive Query */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface-subtle text-xs font-mono text-foreground-muted shadow-xs">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>Independent PayPal AI Hackathon Submission</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
                Discover smarter. Compare better.{' '}
                <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-4">
                  Pay confidently.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-foreground-muted max-w-xl leading-relaxed">
                PayPilot AI transforms online shopping from tedious spec sheets into an intelligent, conversational purchasing journey with transparent budget evaluation and verified PayPal checkout.
              </p>
            </div>

            {/* Functional AI Shopping Prompt Input */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="relative rounded-lg border-2 border-border focus-within:border-accent bg-surface shadow-tactile transition-all">
                <div className="flex items-center p-2 sm:p-2.5">
                  <Sparkles className="w-5 h-5 text-accent shrink-0 ml-2 mr-3" />
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Find wireless headphones under $150 with ANC for Zoom meetings..."
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-muted/70 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-tactile"
                  >
                    <span>Ask Pilot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sample Queries Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-1">
                <span className="text-[11px] font-mono text-foreground-muted mr-1">
                  Try sample:
                </span>
                {SAMPLE_QUERIES.map((sq, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSample(sq.prompt)}
                    className="px-2.5 py-1 rounded bg-surface hover:bg-surface-subtle border border-border text-[11px] font-mono text-foreground-muted hover:text-foreground transition-colors shadow-xs"
                  >
                    {sq.title}
                  </button>
                ))}
              </div>
            </form>

            {/* Core Value Micro-Pills */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/80 max-w-xl text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <span className="text-foreground-muted">Grounded Specs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <span className="text-foreground-muted">Side-by-side Matrix</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success shrink-0" />
                <span className="text-foreground-muted">PayPal Sandbox</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Card Preview */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent/20 to-foreground/5 blur-sm opacity-50" />
              <div className="relative space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-foreground-muted px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    LIVE ASSISTANT PREVIEW
                  </span>
                  <span>96% CONFIDENCE</span>
                </div>

                <ProductCard product={sampleHeroProduct} recommendation={sampleHeroRec} featured />

                <div className="p-3 rounded-lg border border-border bg-surface text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-foreground-muted">Selected Target Budget:</span>
                    <span className="text-foreground font-semibold">$450.00 USD</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-foreground-muted">Remaining Capital:</span>
                    <span className="text-success font-semibold">+$52.00 saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Intelligent Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-border pt-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-semibold uppercase text-accent tracking-wider">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              A purposeful shopping journey designed for high conviction.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg border border-border bg-surface shadow-tactile space-y-3">
              <div className="w-8 h-8 rounded bg-surface-subtle border border-border flex items-center justify-center font-mono font-bold text-xs text-foreground">
                01
              </div>
              <h3 className="font-semibold text-sm text-foreground">Natural Language Intent</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Describe your requirements, constraints, and budget without navigating multi-level dropdown filters.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-border bg-surface shadow-tactile space-y-3">
              <div className="w-8 h-8 rounded bg-surface-subtle border border-border flex items-center justify-center font-mono font-bold text-xs text-foreground">
                02
              </div>
              <h3 className="font-semibold text-sm text-foreground">Grounded Evidence</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Deterministic algorithms score verifiable specs while AI explains exact match reasons and honest compromises.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-border bg-surface shadow-tactile space-y-3">
              <div className="w-8 h-8 rounded bg-surface-subtle border border-border flex items-center justify-center font-mono font-bold text-xs text-foreground">
                03
              </div>
              <h3 className="font-semibold text-sm text-foreground">Side-by-Side Trade-offs</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Compare up to 4 shortlisted items side-by-side across pricing, ergonomics, battery, and AI verdicts.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-border bg-surface shadow-tactile space-y-3">
              <div className="w-8 h-8 rounded bg-surface-subtle border border-border flex items-center justify-center font-mono font-bold text-xs text-accent">
                04
              </div>
              <h3 className="font-semibold text-sm text-foreground">PayPal Sandbox Payment</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Explicit user authorization with server-recalculated prices and instant verified API capture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-border pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-semibold uppercase text-accent tracking-wider">
                EXPLORE CATALOGUE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
                20+ Curated Demonstration Products
              </h2>
            </div>
            <Link
              to="/catalogue"
              className="text-xs font-mono font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogue?category=${cat.id}`}
                className="p-4 rounded-lg border border-border bg-surface hover:border-accent hover:bg-surface-subtle transition-all duration-200 shadow-tactile space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-foreground group-hover:text-accent">
                    {cat.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-foreground-muted group-hover:text-accent transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[11px] text-foreground-muted line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-surface p-8 sm:p-12 shadow-tactile-md flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Ready to test the future of shopping intelligence?
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
              Launch the conversational copilot workspace, test natural-language queries, compare products, and complete a server-verified PayPal sandbox checkout.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/workspace"
              className="w-full sm:w-auto px-6 py-3 rounded bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-tactile transition-colors active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Copilot</span>
            </Link>
            <Link
              to="/insights"
              className="w-full sm:w-auto px-6 py-3 rounded border border-border bg-surface hover:bg-surface-subtle text-foreground text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>View Insights</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
