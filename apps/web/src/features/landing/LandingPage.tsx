import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Cpu,
  Lock,
  ChevronRight,
  Check,
  X,
  CreditCard,
  Scale,
  Flame,
} from 'lucide-react';
import { SAMPLE_QUERIES, CATEGORIES } from '@paypilot/shared';
import { ProductCard } from '../../components/shared/ProductCard.js';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const samplePlaceholders = [
    'Find wireless headphones under $150 with ANC for Zoom meetings...',
    'Suggest a lightweight laptop for coding under $1,200 with 16GB RAM...',
    'Find mechanical keyboard with hot-swappable switches under $120...',
    'Best noise-cancelling headphones under $400 for travel and calls...',
  ];

  // Cycling animated placeholder effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % samplePlaceholders.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = queryInput.trim() || samplePlaceholders[placeholderIndex];
    navigate(`/workspace?q=${encodeURIComponent(q)}`);
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
    <div className="relative space-y-24 pb-20 overflow-hidden">
      {/* Ambient Studio Lighting Aura (Kinetic Labs / Vektor Motion vibe) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-accent/12 via-indigo-500/8 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-60 right-0 w-[400px] h-[400px] bg-accent/5 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-6 pb-4 sm:pt-10 sm:pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Interactive Query */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Kinetic Studio Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/80 bg-surface/80 backdrop-blur-md text-xs font-mono text-foreground-muted shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-foreground font-medium text-[11px] tracking-wide">
                NEXT-GEN AI SHOPPING COPILOT
              </span>
              <span className="text-border">•</span>
              <span className="text-accent font-semibold text-[11px] flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>PAYPAL SANDBOX V2</span>
              </span>
            </div>

            {/* Editorial Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.06]">
                Discover smarter.{' '}
                <br className="hidden sm:inline" />
                Compare better.{' '}
                <span className="bg-gradient-to-r from-accent via-indigo-600 to-accent bg-clip-text text-transparent underline decoration-accent/30 decoration-2 underline-offset-8">
                  Pay confidently.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-foreground-muted max-w-xl leading-relaxed">
                PayPilot AI replaces fragmented tabs and hallucinated specs with a conversational shopping journey, deterministic budget evaluation, and verified PayPal sandbox checkout.
              </p>
            </div>

            {/* Studio-Grade AI Search Command Bar */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="relative rounded-2xl border-2 border-border/90 focus-within:border-accent bg-surface/90 backdrop-blur-md shadow-tactile-lg transition-all duration-300 focus-within:shadow-glow-accent group">
                <div className="flex items-center p-2 sm:p-2.5 gap-2">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 ml-1">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>

                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                      placeholder={samplePlaceholders[placeholderIndex]}
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-muted/60 focus:outline-none py-1"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center gap-2 transition-all duration-200 shrink-0 shadow-tactile active:scale-95 group/btn"
                  >
                    <span>Ask Pilot</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Sample Queries Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-0.5">
                <span className="text-[11px] font-mono text-foreground-muted mr-1 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-warning" />
                  <span>Try:</span>
                </span>
                {SAMPLE_QUERIES.map((sq, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSample(sq.prompt)}
                    className="px-2.5 py-1 rounded-full bg-surface/80 hover:bg-surface border border-border/80 text-[11px] font-mono text-foreground-muted hover:text-accent hover:border-accent/40 transition-all duration-150 shadow-xs hover:shadow-sm"
                  >
                    {sq.title}
                  </button>
                ))}
              </div>
            </form>

            {/* Core Value Micro-Pills */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-border/80 max-w-xl text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success-subtle border border-success-border flex items-center justify-center text-success shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-foreground-muted font-medium">Grounded Specs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent-subtle border border-accent-border flex items-center justify-center text-accent shrink-0">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <span className="text-foreground-muted font-medium">Trade-off Matrix</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success-subtle border border-success-border flex items-center justify-center text-success shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-foreground-muted font-medium">PayPal Sandbox</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Interactive Preview Card (Vektor Motion style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-md">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-accent/25 via-indigo-500/20 to-accent/15 blur-md opacity-60 animate-pulse-glow" />

              <div className="relative rounded-2xl glass-island p-4 space-y-3.5 shadow-2xl">
                {/* Simulator Header */}
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-border/70">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                    </span>
                    <span className="font-semibold text-foreground text-[11px]">LIVE SPLIT-INTELLIGENCE</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold">
                    96% CONFIDENCE
                  </span>
                </div>

                {/* Hero Product Card */}
                <ProductCard product={sampleHeroProduct} recommendation={sampleHeroRec} featured />

                {/* Real-time Budget Utilization Metric */}
                <div className="p-3.5 rounded-xl border border-border/80 bg-surface-subtle/80 text-xs space-y-2 backdrop-blur-xs">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-foreground-muted flex items-center gap-1.5">
                      <CreditCard className="w-3 h-3 text-accent" />
                      <span>Target Budget Utilization</span>
                    </span>
                    <span className="text-foreground font-bold tabular-nums">$398 / $450 USD</span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full bg-success rounded-full transition-all duration-500" style={{ width: '88%' }} />
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] text-foreground-muted pt-0.5">
                    <span>Within Allocation</span>
                    <span className="text-success font-bold font-mono">+$52.00 Remaining Capital</span>
                  </div>
                </div>

                {/* Direct CTA */}
                <button
                  onClick={() => navigate('/workspace?q=Find%20wireless%20headphones%20under%20%24450%20with%20ANC')}
                  className="w-full py-2.5 rounded-xl bg-foreground text-surface hover:bg-accent text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-tactile"
                >
                  <span>Explore this query in AI Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kinetic Metrics Grid (Kinetic Labs & Vektor Motion Vibe) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-sm shadow-tactile space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                GROUNDING
              </span>
              <Cpu className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground tracking-tight">
              100%
            </div>
            <p className="text-[11px] text-foreground-muted leading-relaxed">
              Deterministic scoring from verifiable catalogue specs — zero fabricated claims.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-sm shadow-tactile space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-success font-semibold">
                LATENCY
              </span>
              <Zap className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground tracking-tight">
              &lt; 120ms
            </div>
            <p className="text-[11px] text-foreground-muted leading-relaxed">
              Instant sub-second requirement parsing: category, budget ceiling, & feature extraction.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-sm shadow-tactile space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-warning font-semibold">
                FINANCIAL INTEGRITY
              </span>
              <Lock className="w-4 h-4 text-warning" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground tracking-tight">
              0.00%
            </div>
            <p className="text-[11px] text-foreground-muted leading-relaxed">
              Zero price hallucination. All totals and taxes strictly recalculated by backend.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-sm shadow-tactile space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                PAYMENT PIPELINE
              </span>
              <CreditCard className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground tracking-tight">
              REST v2
            </div>
            <p className="text-[11px] text-foreground-muted leading-relaxed">
              Official PayPal Developer Sandbox API: OAuth2 token exchange & verified captures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The 4-Step Intelligent Journey (ShiftFrame & LoopCraft Vibe) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-border/80 pt-16 space-y-10">
          <div className="max-w-2xl space-y-2.5">
            <span className="text-xs font-mono font-bold uppercase text-accent tracking-widest">
              END-TO-END WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              A purposeful shopping journey designed for conviction.
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
              From intent extraction to server-verified capture — every step gives users full visibility and control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-border/80 bg-surface shadow-tactile space-y-3.5 relative overflow-hidden group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center font-mono font-bold text-sm text-foreground group-hover:bg-accent group-hover:text-white transition-colors">
                01
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent inline-block">
                NATURAL LANGUAGE
              </span>
              <h3 className="font-bold text-base text-foreground">Requirement Extraction</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Describe your exact needs, budget boundaries, and preferences without manual multi-level filter drilling.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-border/80 bg-surface shadow-tactile space-y-3.5 relative overflow-hidden group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center font-mono font-bold text-sm text-foreground group-hover:bg-accent group-hover:text-white transition-colors">
                02
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success inline-block">
                SCORING ENGINE
              </span>
              <h3 className="font-bold text-base text-foreground">Deterministic Grounding</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Algorithms score authoritative specifications, while AI explains precise rationale and honest compromises.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-border/80 bg-surface shadow-tactile space-y-3.5 relative overflow-hidden group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center font-mono font-bold text-sm text-foreground group-hover:bg-accent group-hover:text-white transition-colors">
                03
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning inline-block">
                MULTI-SPEC MATRIX
              </span>
              <h3 className="font-bold text-base text-foreground">Side-by-Side Trade-offs</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Compare up to 4 items simultaneously across specs, battery stamina, user ratings, and AI verdicts with AG Grid.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-border/80 bg-surface shadow-tactile space-y-3.5 relative overflow-hidden group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center font-mono font-bold text-sm text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                04
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-accent text-white inline-block">
                PAYPAL REST API
              </span>
              <h3 className="font-bold text-base text-foreground">Sandbox Checkout</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Explicit user authorization with zero-tamper server price recalculation and instant captured ledger receipts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Industry Gap: Why PayPilot AI is Different (Hackathon Differentiator) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/90 bg-surface/90 backdrop-blur-md p-6 sm:p-10 shadow-tactile-lg space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-accent tracking-widest">
              COMPETITIVE ADVANTAGE & INDUSTRY GAP
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              How PayPilot AI solves what existing platforms fail to address.
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
              Generic chatbots fabricate prices, and comparison sites push affiliate bias. PayPilot bridges intelligence with financial certainty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Traditional Sites */}
            <div className="p-5 rounded-2xl border border-border/70 bg-surface-subtle/50 space-y-3">
              <div className="flex items-center gap-2 text-danger font-semibold text-xs font-mono">
                <X className="w-4 h-4" />
                <span>Traditional Price Engines</span>
              </div>
              <h3 className="font-bold text-sm text-foreground">Cluttered & Biased</h3>
              <ul className="space-y-2 text-xs text-foreground-muted">
                <li className="flex items-start gap-1.5">
                  <span className="text-danger mt-0.5">•</span>
                  <span>Forces manual tab comparisons and tedious multi-dropdown filters.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-danger mt-0.5">•</span>
                  <span>Rankings driven by paid affiliate commissions rather than user fit.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-danger mt-0.5">•</span>
                  <span>No integrated payment verification or direct checkout flow.</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Generic AI Chatbots */}
            <div className="p-5 rounded-2xl border border-border/70 bg-surface-subtle/50 space-y-3">
              <div className="flex items-center gap-2 text-warning font-semibold text-xs font-mono">
                <X className="w-4 h-4" />
                <span>Generic AI Chatbots</span>
              </div>
              <h3 className="font-bold text-sm text-foreground">Hallucinated & Unsafe</h3>
              <ul className="space-y-2 text-xs text-foreground-muted">
                <li className="flex items-start gap-1.5">
                  <span className="text-warning mt-0.5">•</span>
                  <span>Frequently hallucinate prices, out-of-stock items, and non-existent specs.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-warning mt-0.5">•</span>
                  <span>Cannot calculate real cart totals, tax rates, or currency conversions.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-warning mt-0.5">•</span>
                  <span>Dead-end conversations with zero transaction capabilities.</span>
                </li>
              </ul>
            </div>

            {/* Column 3: PayPilot AI */}
            <div className="p-5 rounded-2xl border-2 border-accent bg-accent/5 space-y-3 shadow-tactile relative">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-accent text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                PAYPILOT AI
              </div>
              <div className="flex items-center gap-2 text-success font-semibold text-xs font-mono">
                <Check className="w-4 h-4" />
                <span>Split-Intelligence Architecture</span>
              </div>
              <h3 className="font-bold text-sm text-foreground">Deterministic & Verifiable</h3>
              <ul className="space-y-2 text-xs text-foreground leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-success font-bold mt-0.5">✓</span>
                  <span>Mathematical scoring on real specs + AI-explained compromises.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-success font-bold mt-0.5">✓</span>
                  <span>Zero-trust server price recalculation rejects client tampering.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-success font-bold mt-0.5">✓</span>
                  <span>Server-to-server PayPal Sandbox OAuth2 checkout with explicit approval.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-border/80 pt-14 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-accent tracking-widest">
                EXPLORE CATALOGUE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
                20+ Curated Demonstration Products
              </h2>
            </div>
            <Link
              to="/catalogue"
              className="text-xs font-mono font-semibold text-accent hover:underline flex items-center gap-1.5"
            >
              <span>View All Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogue?category=${cat.id}`}
                className="p-5 rounded-2xl border border-border/80 bg-surface hover:border-accent hover:shadow-tactile-md transition-all duration-200 space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                    {cat.label}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-surface-subtle group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 text-foreground-muted group-hover:text-white" />
                  </div>
                </div>
                <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* High-Impact Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border/90 bg-gradient-to-br from-surface via-surface to-accent/5 p-8 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
          <div className="space-y-3 max-w-xl relative z-10">
            <span className="text-[11px] font-mono font-bold uppercase text-accent tracking-widest">
              READY FOR HACKATHON EVALUATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Experience the future of conversational shopping.
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
              Launch the copilot workspace, test natural language requirements, inspect deterministic spec scores, and complete an official PayPal sandbox checkout.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 relative z-10">
            <Link
              to="/workspace"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-tactile-lg transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Copilot</span>
            </Link>
            <Link
              to="/insights"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-border bg-surface hover:bg-surface-subtle text-foreground text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>View Sandbox Insights</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
