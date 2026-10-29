import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Radio,
  Sliders,
  CheckCheck,
} from 'lucide-react';
import { SAMPLE_QUERIES, CATEGORIES, Product } from '@paypilot/shared';
import { ProductCard } from '../../components/shared/ProductCard.js';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activePresetTab, setActivePresetTab] = useState<'audio' | 'keyboard' | 'mouse'>('audio');

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

  // 3 Interactive Demo Presets
  const presets: Record<
    'audio' | 'keyboard' | 'mouse',
    {
      label: string;
      icon: string;
      product: Product;
      rec: any;
      targetBudget: number;
      savedAmount: number;
      prompt: string;
    }
  > = {
    audio: {
      label: 'Audio Studio',
      icon: '🎧',
      targetBudget: 450,
      savedAmount: 52,
      prompt: 'Find wireless headphones under $450 with ANC for Zoom meetings',
      product: {
        id: 'prod-aud-01',
        name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
        brand: 'Sony',
        category: 'audio',
        description: 'Industry-leading noise cancellation with Auto NC Optimizer, 8 microphones, and up to 30 hours playback.',
        price: 398.0,
        priceInr: 33233,
        currency: 'USD',
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
      },
      rec: {
        matchScore: 96,
        breakdown: { overallScore: 96, budgetScore: 94, featureScore: 98, ratingScore: 96 },
        budgetStatus: 'under-budget',
        budgetDifferenceUsd: 52,
        whyItFits: 'Matches your focus on meeting mic clarity (8 beamforming mics) and industry-leading ANC.',
        tradeOffs: 'Carry case is larger due to non-collapsible headband.',
        keyDifferentiator: '8-microphone beamforming array with auto-noise suppression',
      },
    },
    keyboard: {
      label: 'Custom Keeb',
      icon: '⌨️',
      targetBudget: 250,
      savedAmount: 51,
      prompt: 'Mechanical keyboard under $250 with aluminum body and hot-swap switches',
      product: {
        id: 'prod-per-01',
        name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
        brand: 'Keychron',
        category: 'peripherals',
        description: 'Full CNC machined aluminum body with double-gasket design, QMK/VIA programmable keymaps, and hot-swappable switches.',
        price: 199.0,
        priceInr: 16616,
        currency: 'USD',
        rating: 4.9,
        reviewCount: 1240,
        inStock: true,
        stockCount: 18,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        tags: ['mechanical', 'wireless', 'aluminum', 'hot-swap'],
        specs: { batteryHours: 300, weightGrams: 1730 },
        keyFeatures: ['Full CNC Aluminum Case', 'Double-Gasket Acoustic Mount', 'QMK/VIA Support'],
        pros: ['Sublime build quality and acoustic feedback', 'Effortless switching between Mac and Windows'],
        cons: ['Heavy desktop anchor (1.7kg) not meant for travel'],
        highlightedFeature: 'CNC-machined aluminum body with double-gasket acoustic typing feel',
        isSampleData: true,
      },
      rec: {
        matchScore: 94,
        breakdown: { overallScore: 94, budgetScore: 95, featureScore: 93, ratingScore: 98 },
        budgetStatus: 'under-budget',
        budgetDifferenceUsd: 51,
        whyItFits: 'Premium double-gasket acoustics, hot-swappable switches, and multi-device Bluetooth pairing.',
        tradeOffs: 'Heavy 1.7kg desk weight requires dedicated wrist rest.',
        keyDifferentiator: 'Sublime double-gasket acoustic dampening',
      },
    },
    mouse: {
      label: 'Ergo Precision',
      icon: '🖱️',
      targetBudget: 120,
      savedAmount: 20.01,
      prompt: 'Ergonomic wireless mouse under $120 for daily coding and spreadsheet navigation',
      product: {
        id: 'prod-per-02',
        name: 'Logitech MX Master 3S Performance Wireless Mouse',
        brand: 'Logitech',
        category: 'peripherals',
        description: 'Ergonomic sculptured silhouette with 8,000 DPI track-on-glass sensor, MagSpeed electromagnetic scroll wheel, and Quiet Clicks.',
        price: 99.99,
        priceInr: 8349,
        currency: 'USD',
        rating: 4.9,
        reviewCount: 8900,
        inStock: true,
        stockCount: 110,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        tags: ['wireless', 'mouse', 'ergonomic', 'bluetooth'],
        specs: { batteryHours: 70, weightGrams: 141 },
        keyFeatures: ['Quiet Clicks reducing 90% click noise', 'Thumb scroll wheel for horizontal timelines', 'Logi Bolt & Bluetooth'],
        pros: ['Flawless ergonomic thumb support', 'Near-instant MagSpeed freewheel scrolling', 'Tracks reliably on glass'],
        cons: ['Right-handed orientation only'],
        highlightedFeature: 'MagSpeed electromagnetic scroll wheel & thumb horizontal navigation',
        isSampleData: true,
      },
      rec: {
        matchScore: 98,
        breakdown: { overallScore: 98, budgetScore: 97, featureScore: 99, ratingScore: 99 },
        budgetStatus: 'under-budget',
        budgetDifferenceUsd: 20.01,
        whyItFits: 'MagSpeed scroll wheel and Quiet Clicks deliver unrivaled ergonomics under your $120 budget ceiling.',
        tradeOffs: 'Right-handed form factor only.',
        keyDifferentiator: '8,000 DPI sensor tracking on any surface including glass',
      },
    },
  };

  const currentPreset = presets[activePresetTab];

  return (
    <div className="relative space-y-20 pb-20 overflow-hidden">
      {/* Cyber Grid & Ambient Lighting Aura */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40 -z-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-gradient-to-b from-accent/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full animate-pulse-glow" />
      <div className="absolute top-80 right-0 w-[450px] h-[450px] bg-cyan-400/8 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-6 pb-2 sm:pt-10 sm:pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Interactive Query */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Gen-Z Cyber Pill Badge with Equalizer */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/80 bg-surface/85 backdrop-blur-md text-xs font-mono text-foreground-muted shadow-sm hover:border-accent/50 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-foreground font-semibold text-[11px] tracking-wide">
                NEXT-GEN AI SHOPPING COPILOT
              </span>
              <span className="text-border">•</span>
              <span className="text-accent font-bold text-[11px] flex items-center gap-1">
                <Zap className="w-3 h-3 text-accent" />
                <span>PAYPAL SANDBOX V2</span>
              </span>

              {/* Live soundwave visualizer */}
              <div className="hidden sm:flex items-center gap-0.5 h-3 pl-1 border-l border-border/80">
                <span className="w-0.5 bg-accent rounded-full animate-soundwave-1" />
                <span className="w-0.5 bg-accent rounded-full animate-soundwave-2" />
                <span className="w-0.5 bg-accent rounded-full animate-soundwave-3" />
                <span className="w-0.5 bg-accent rounded-full animate-soundwave-4" />
              </div>
            </div>

            {/* Editorial Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.06]">
                Discover smarter.{' '}
                <br className="hidden sm:inline" />
                Compare better.{' '}
                <span className="bg-gradient-to-r from-accent via-indigo-600 to-cyan-500 bg-clip-text text-transparent underline decoration-accent/30 decoration-2 underline-offset-8">
                  Pay confidently.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-foreground-muted max-w-xl leading-relaxed">
                PayPilot AI transforms online shopping from tedious spec sheets into an intelligent, conversational purchasing journey with transparent budget evaluation and verified PayPal sandbox checkout.
              </p>
            </div>

            {/* Studio-Grade AI Search Command Bar */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="relative rounded-2xl border-2 border-border/90 focus-within:border-accent bg-surface/90 backdrop-blur-md shadow-tactile-lg transition-all duration-300 focus-within:shadow-glow-accent group holo-border">
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
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-muted/60 focus:outline-none py-1 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center gap-2 transition-all duration-200 shrink-0 shadow-tactile active:scale-95 group/btn"
                  >
                    <span>Ask Pilot</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Sample Queries Chips with Flame Icons */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-0.5">
                <span className="text-[11px] font-mono text-foreground-muted mr-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-warning animate-bounce" />
                  <span className="font-semibold">Trending:</span>
                </span>
                {SAMPLE_QUERIES.map((sq, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSample(sq.prompt)}
                    className="px-2.5 py-1 rounded-full bg-surface/90 hover:bg-surface border border-border/80 text-[11px] font-mono text-foreground-muted hover:text-accent hover:border-accent/40 transition-all duration-150 shadow-xs hover:shadow-sm active:scale-95"
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
                <span className="text-foreground-muted font-semibold text-[11px]">Grounded Specs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent-subtle border border-accent-border flex items-center justify-center text-accent shrink-0">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <span className="text-foreground-muted font-semibold text-[11px]">Trade-off Matrix</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success-subtle border border-success-border flex items-center justify-center text-success shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-foreground-muted font-semibold text-[11px]">PayPal Sandbox</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Interactive 3-Preset Simulator (Hero Showcase) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-md">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-accent/25 via-indigo-500/20 to-cyan-400/20 blur-md opacity-70 animate-pulse-glow" />

              <div className="relative rounded-3xl glass-island p-4.5 space-y-4 shadow-2xl holo-border">
                {/* Simulator Header & Preset Switcher */}
                <div className="space-y-2 pb-2 border-b border-border/70">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                      </span>
                      <span className="font-bold text-foreground text-[11px] tracking-tight">
                        LIVE SPLIT-INTELLIGENCE SIMULATOR
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold">
                      {currentPreset.rec.matchScore}% MATCH
                    </span>
                  </div>

                  {/* 3 Clickable Vibe Switchers */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface-subtle/80 border border-border/60">
                    {(['audio', 'keyboard', 'mouse'] as const).map((key) => {
                      const item = presets[key];
                      const isActive = activePresetTab === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActivePresetTab(key)}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                            isActive
                              ? 'bg-surface text-foreground font-bold shadow-xs border border-border/60 text-accent'
                              : 'text-foreground-muted hover:text-foreground'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Animated Product Card Preview */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePresetTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProductCard
                      product={currentPreset.product}
                      recommendation={currentPreset.rec}
                      featured
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Real-time Budget Utilization Metric */}
                <div className="p-3.5 rounded-2xl border border-border/80 bg-surface-subtle/90 text-xs space-y-2 backdrop-blur-xs">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-foreground-muted flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-accent" />
                      <span>Budget Utilization</span>
                    </span>
                    <span className="text-foreground font-bold tabular-nums">
                      ${currentPreset.product.price} / ${currentPreset.targetBudget} USD
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                    <motion.div
                      key={activePresetTab}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.round(
                          (currentPreset.product.price / currentPreset.targetBudget) * 100
                        )}%`,
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                    />
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] text-foreground-muted pt-0.5">
                    <span className="flex items-center gap-1 text-success font-semibold">
                      <CheckCheck className="w-3 h-3" />
                      <span>Within Allocation</span>
                    </span>
                    <span className="text-success font-bold font-mono">
                      +${currentPreset.savedAmount.toFixed(2)} Saved Capital
                    </span>
                  </div>
                </div>

                {/* Direct CTA */}
                <button
                  onClick={() =>
                    navigate(`/workspace?q=${encodeURIComponent(currentPreset.prompt)}`)
                  }
                  className="w-full py-2.5 rounded-xl bg-foreground text-surface hover:bg-accent text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-tactile active:scale-95"
                >
                  <span>Test this in Live AI Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kinetic Infinite Marquee Ticker (Gen-Z & Studio signature element) */}
      <div className="w-full overflow-hidden border-y border-border/80 bg-surface/70 backdrop-blur-md py-3 shadow-xs relative">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-mono font-bold tracking-wider text-foreground">
          <span className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span>100% SPEC INTEGRITY</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-success" />
            <span>PAYPAL SANDBOX REST V2</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>GOOGLE GEMINI 2.5 FLASH</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-warning" />
            <span>ZERO PRICE HALLUCINATION</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-accent" />
            <span>MULTI-SPEC AG GRID MATRIX</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-danger" />
            <span>BUDGET ALLOCATION PROGRESS</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-success" />
            <span>STRICT SERVER-SIDE VERIFICATION</span>
          </span>
          <span className="text-border">•</span>
          {/* Duplicate set for seamless continuous loop */}
          <span className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span>100% SPEC INTEGRITY</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-success" />
            <span>PAYPAL SANDBOX REST V2</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>GOOGLE GEMINI 2.5 FLASH</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-warning" />
            <span>ZERO PRICE HALLUCINATION</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-accent" />
            <span>MULTI-SPEC AG GRID MATRIX</span>
          </span>
        </div>
      </div>

      {/* Kinetic Metrics Grid (Kinetic Labs & Vektor Motion Vibe) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-sm shadow-tactile space-y-2 holo-border group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">
                GROUNDING
              </span>
              <Cpu className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
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
            className="p-5 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-sm shadow-tactile space-y-2 holo-border group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-success font-bold">
                LATENCY
              </span>
              <Zap className="w-4 h-4 text-success group-hover:scale-110 transition-transform" />
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
            className="p-5 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-sm shadow-tactile space-y-2 holo-border group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-warning font-bold">
                FINANCIAL INTEGRITY
              </span>
              <Lock className="w-4 h-4 text-warning group-hover:scale-110 transition-transform" />
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
            className="p-5 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-sm shadow-tactile space-y-2 holo-border group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">
                PAYMENT PIPELINE
              </span>
              <CreditCard className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
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

      {/* Gen-Z Bento Grid Showcase: "Bento Box of AI Commerce" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-accent tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>ARCHITECTURAL BENTO BOX</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Built for speed. Grounded in truth.
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
              Explore how PayPilot AI divides tasks between natural language synthesis, deterministic mathematics, and financial payment rails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Bento 1: Natural Language Intent Engine (7 Cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-7 rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-md p-6 sm:p-8 shadow-tactile-lg space-y-4 holo-border relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-mono text-xs font-bold">
                  01 // INTENT PARSER
                </span>
                <span className="text-[11px] font-mono text-foreground-muted flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span>&lt;110ms Synapse</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground">
                Token-Level Natural Language Extraction
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed max-w-lg">
                The AI parses unformatted user requests into strict typed JSON schemas, extracting budget ceilings, essential features, and priorities.
              </p>

              {/* Visual Token Output Simulation */}
              <div className="p-4 rounded-2xl bg-surface-subtle/80 border border-border/80 font-mono text-xs space-y-2">
                <div className="text-[11px] text-foreground-muted flex items-center justify-between border-b border-border/60 pb-1.5">
                  <span>Input: "Headphones under $150 with ANC for Zoom meetings"</span>
                  <span className="text-accent font-bold">VALIDATED JSON</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-accent/10 text-accent font-semibold text-[10px]">
                    category: "audio"
                  </span>
                  <span className="px-2 py-0.5 rounded bg-success/10 text-success font-semibold text-[10px]">
                    targetBudget: $150.00
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-semibold text-[10px]">
                    mustHave: ["anc", "mic"]
                  </span>
                  <span className="px-2 py-0.5 rounded bg-warning/10 text-warning font-semibold text-[10px]">
                    priority: "comfort"
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Bento 2: Anti-Tamper Security Gate (5 Cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-5 rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-md p-6 sm:p-8 shadow-tactile-lg space-y-4 holo-border relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-warning/10 text-warning font-mono text-xs font-bold">
                  02 // FINANCIAL SECURITY
                </span>
                <Lock className="w-4 h-4 text-warning" />
              </div>

              <h3 className="text-xl font-bold text-foreground">
                Zero-Trust Price Verification
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Client price tampering is blocked. The backend recalculates line items, taxes, and shipping directly from catalogue truth.
              </p>

              <div className="p-3.5 rounded-2xl bg-warning/5 border border-warning/20 text-xs font-mono text-warning space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-warning" />
                  <span>ANTI-TAMPER GUARANTEE</span>
                </div>
                <p className="text-[10px] text-foreground-muted">
                  Client attempts to inject falsified prices trigger immediate 400 Bad Request rejections.
                </p>
              </div>
            </motion.div>

            {/* Bento 3: Deterministic Scoring (5 Cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-5 rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-md p-6 sm:p-8 shadow-tactile-lg space-y-4 holo-border relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-success/10 text-success font-mono text-xs font-bold">
                  03 // MATH SCORING
                </span>
                <Cpu className="w-4 h-4 text-success" />
              </div>

              <h3 className="text-xl font-bold text-foreground">
                Deterministic Spec Engine
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Rankings use mathematical weights on real battery hours, microphone counts, and ratings — not opaque hallucinated guesses.
              </p>

              <div className="p-3 rounded-2xl bg-surface-subtle border border-border text-[11px] font-mono text-foreground space-y-1">
                <div className="text-[10px] text-foreground-muted">ALGORITHM FORMULA:</div>
                <div className="text-accent font-bold">
                  Score = 0.40(Spec) + 0.35(Budget) + 0.25(Rating)
                </div>
              </div>
            </motion.div>

            {/* Bento 4: PayPal Sandbox Checkout (7 Cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-7 rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-md p-6 sm:p-8 shadow-tactile-lg space-y-4 holo-border relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-accent text-white font-mono text-xs font-bold">
                  04 // PAYPAL REST V2
                </span>
                <CreditCard className="w-4 h-4 text-accent" />
              </div>

              <h3 className="text-xl font-bold text-foreground">
                One-Click Verified Sandbox Checkout
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed max-w-lg">
                Seamless server-to-server OAuth2 order authorization. Every purchase creates a verifiable PayPal reference and spending receipt.
              </p>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-subtle/80 border border-border/80 text-xs font-mono">
                <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white font-bold font-mono text-sm">
                  P
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-foreground">
                    PAYPAL REST V2 ORDER ENGINE
                  </div>
                  <div className="text-[10px] text-success font-semibold">
                    v2/checkout/orders • Idempotent Capture • Sandbox Active
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Industry Gap: Why PayPilot AI is Different (Hackathon Differentiator) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/90 bg-surface/90 backdrop-blur-md p-6 sm:p-10 shadow-tactile-lg space-y-8 holo-border">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-accent tracking-widest flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              <span>COMPETITIVE ADVANTAGE & INDUSTRY GAP</span>
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
                className="p-5 rounded-2xl border border-border/80 bg-surface hover:border-accent hover:shadow-tactile-md transition-all duration-200 space-y-2 group holo-border"
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
        <div className="relative rounded-3xl border border-border/90 bg-gradient-to-br from-surface via-surface to-accent/8 p-8 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden holo-border">
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
