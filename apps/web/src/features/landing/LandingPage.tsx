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
  CheckCheck,
  Headphones,
  Keyboard,
  Mouse,
  LucideIcon,
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

  // 3 Interactive Demo Presets with Lucide Icons
  const presets: Record<
    'audio' | 'keyboard' | 'mouse',
    {
      label: string;
      icon: LucideIcon;
      product: Product;
      rec: any;
      targetBudget: number;
      savedAmount: number;
      prompt: string;
    }
  > = {
    audio: {
      label: 'Audio Studio',
      icon: Headphones,
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
      icon: Keyboard,
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
      icon: Mouse,
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
    <div className="relative space-y-20 pb-20 overflow-x-clip">
      {/* Background canvas texture */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-25 -z-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/8 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-6 pb-2 sm:pt-10 sm:pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Interactive Query */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Humanized Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-surface/90 text-xs text-foreground-muted shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-foreground font-medium text-xs">
                Autonomous procurement copilot
              </span>
              <span className="text-border">/</span>
              <span className="text-accent font-medium text-xs flex items-center gap-1">
                <span>PayPal Sandbox active</span>
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08]">
                Discover smarter.{' '}
                <br className="hidden sm:inline" />
                Compare better.{' '}
                <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-8">
                  Pay confidently.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-foreground-muted max-w-xl leading-relaxed">
                Search 100M+ real products, score technical trade-offs against your hard budget ceiling, and check out securely through the official PayPal Sandbox API.
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="relative rounded-2xl border border-border/90 focus-within:border-accent bg-surface/90 shadow-sm transition-colors duration-150 group">
                <div className="flex items-center p-2 sm:p-2.5 gap-2">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 ml-1">
                    <Sparkles className="w-4 h-4" />
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
                    className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center gap-2 transition-colors duration-150 shrink-0 shadow-xs active:scale-95 group/btn"
                  >
                    <span>Ask Pilot</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-150" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-0.5">
                <span className="text-xs text-foreground-muted mr-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-warning shrink-0" />
                  <span>Trending:</span>
                </span>
                {SAMPLE_QUERIES.map((sq, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSample(sq.prompt)}
                    className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-subtle border border-border/80 text-xs text-foreground-muted hover:text-accent hover:border-accent/40 transition-colors duration-150 shadow-xs active:scale-95"
                  >
                    {sq.title}
                  </button>
                ))}
              </div>
            </form>

            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-border/80 max-w-xl text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-foreground-muted font-medium text-xs">Grounded specs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <span className="text-foreground-muted font-medium text-xs">Trade-off matrix</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-foreground-muted font-medium text-xs">PayPal Sandbox</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Interactive 3-Preset Simulator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-md">
              <div className="relative rounded-3xl bg-surface p-4.5 space-y-4 shadow-lg border border-border">
                {/* Simulator Header & Preset Switcher */}
                <div className="space-y-2 pb-2 border-b border-border/70">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-foreground text-xs">
                        Split-intelligence simulator
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[11px] font-medium">
                      {currentPreset.rec.matchScore}% match
                    </span>
                  </div>

                  {/* 3 Clickable Category Switchers */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface-subtle border border-border/60">
                    {(['audio', 'keyboard', 'mouse'] as const).map((key) => {
                      const item = presets[key];
                      const Icon = item.icon;
                      const isActive = activePresetTab === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActivePresetTab(key)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors duration-150 flex items-center justify-center gap-1.5 ${
                            isActive
                              ? 'bg-surface text-foreground font-semibold shadow-xs border border-border/60 text-accent'
                              : 'text-foreground-muted hover:text-foreground'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
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
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard
                      product={currentPreset.product}
                      recommendation={currentPreset.rec}
                      featured
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Real-time Budget Utilization Metric */}
                <div className="p-3.5 rounded-2xl border border-border/80 bg-surface-subtle text-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground-muted flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-accent" />
                      <span>Budget utilization</span>
                    </span>
                    <span className="text-foreground font-semibold font-mono tabular-nums">
                      ${currentPreset.product.price} / ${currentPreset.targetBudget} USD
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <motion.div
                      key={activePresetTab}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.round(
                          (currentPreset.product.price / currentPreset.targetBudget) * 100
                        )}%`,
                      }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-0.5">
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCheck className="w-3 h-3" />
                      <span>Within allocation</span>
                    </span>
                    <span className="text-emerald-600 font-semibold font-mono">
                      +${currentPreset.savedAmount.toFixed(2)} saved
                    </span>
                  </div>
                </div>

                {/* Direct CTA */}
                <button
                  onClick={() =>
                    navigate(`/workspace?mode=agent&q=${encodeURIComponent(currentPreset.prompt)}`)
                  }
                  className="w-full py-2.5 rounded-xl bg-foreground text-surface hover:bg-accent text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-150 shadow-xs active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span>Launch in Autonomous Agent Pilot</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Humanized Metrics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-border/80 bg-surface shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted font-medium">
                Grounding
              </span>
              <Cpu className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight tabular-nums">
              100%
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Deterministic scoring from verifiable catalogue specs, with zero fabricated claims.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/80 bg-surface shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted font-medium">
                Latency
              </span>
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight tabular-nums">
              &lt; 120ms
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Fast sub-second requirement parsing: category, budget ceiling, and feature extraction.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/80 bg-surface shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted font-medium">
                Spend guardrails
              </span>
              <Lock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight tabular-nums">
              0.00%
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Zero price hallucination. All totals and taxes strictly recalculated by backend.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/80 bg-surface shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted font-medium">
                Payment pipeline
              </span>
              <CreditCard className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
              REST v2
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Official PayPal Developer Sandbox API: OAuth2 token exchange and verified captures.
            </p>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Built for speed. Grounded in truth.
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
              How PayPilot AI divides tasks between natural language synthesis, deterministic mathematics, and financial payment rails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7 rounded-3xl border border-border/80 bg-surface p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  01 Intent parser
                </span>
                <span className="text-xs text-foreground-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>&lt;110ms latency</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground">
                Token-level natural language extraction
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed max-w-lg">
                The AI parses unformatted user requests into strict typed JSON schemas, extracting budget ceilings, essential features, and priorities.
              </p>

              {/* Visual Token Output Simulation */}
              <div className="p-4 rounded-2xl bg-surface-subtle border border-border/80 font-mono text-xs space-y-2">
                <div className="text-xs text-foreground-muted flex items-center justify-between border-b border-border/60 pb-1.5 font-sans">
                  <span>Input: "Headphones under $150 with ANC for Zoom meetings"</span>
                  <span className="text-accent font-semibold font-mono text-[11px]">Validated schema</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-accent/10 text-accent font-medium text-[11px]">
                    category: "audio"
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-medium text-[11px]">
                    targetBudget: $150.00
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 font-medium text-[11px]">
                    mustHave: ["anc", "mic"]
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 font-medium text-[11px]">
                    priority: "comfort"
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/workspace?mode=agent"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent text-white text-xs font-semibold shadow-xs hover:bg-accent-hover transition-colors duration-150"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Test Autonomous Agent Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bento 2: Anti-Tamper Security Gate */}
            <div className="md:col-span-5 rounded-3xl border border-border/80 bg-surface p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-medium">
                  02 Spend guardrails
                </span>
                <Lock className="w-4 h-4 text-amber-600" />
              </div>

              <h3 className="text-xl font-bold text-foreground">
                Zero-trust price verification
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Client price tampering is blocked. The backend recalculates line items, taxes, and shipping directly from catalogue truth.
              </p>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Anti-tamper guarantee</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Client attempts to inject falsified prices trigger immediate 400 Bad Request rejections.
                </p>
              </div>
            </div>

            {/* Bento 3: Math Scoring */}
            <div className="md:col-span-5 rounded-3xl border border-border/80 bg-surface p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-medium">
                  03 Spec scoring
                </span>
                <Cpu className="w-4 h-4 text-emerald-600" />
              </div>

              <h3 className="text-xl font-bold text-foreground">
                Deterministic spec engine
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Rankings use mathematical weights on real battery hours, microphone counts, and ratings (not opaque hallucinations).
              </p>

              <div className="p-3 rounded-2xl bg-surface-subtle border border-border text-xs space-y-1">
                <div className="text-[11px] text-foreground-muted font-sans">Formula:</div>
                <div className="text-accent font-semibold font-mono text-xs">
                  Score = 0.40(Spec) + 0.35(Budget) + 0.25(Rating)
                </div>
              </div>
            </div>

            {/* Bento 4: PayPal REST v2 */}
            <div className="md:col-span-7 rounded-3xl border border-border/80 bg-surface p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-accent text-white text-xs font-medium">
                  04 PayPal execution
                </span>
                <CreditCard className="w-4 h-4 text-accent" />
              </div>

              <h3 className="text-xl font-bold text-foreground">
                One-click verified Sandbox checkout
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed max-w-lg">
                Direct server-to-server OAuth2 order authorization. Every purchase creates a verifiable PayPal reference and spending receipt.
              </p>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-subtle border border-border/80 text-xs">
                <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white font-bold font-mono text-sm">
                  P
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-foreground">
                    PayPal REST v2 orders engine
                  </div>
                  <div className="text-[11px] text-emerald-600">
                    Idempotent capture, sandbox verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparative Analysis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/90 bg-surface p-6 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              How PayPilot AI solves what existing platforms fail to address
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
              Generic chatbots fabricate prices, and comparison sites push affiliate bias. PayPilot bridges intelligence with financial certainty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Traditional Sites */}
            <div className="p-5 rounded-2xl border border-border/70 bg-surface-subtle space-y-3">
              <div className="flex items-center gap-2 text-rose-600 font-semibold text-xs">
                <X className="w-4 h-4 shrink-0" />
                <span>Traditional price engines</span>
              </div>
              <h3 className="font-semibold text-sm text-foreground">Cluttered & biased</h3>
              <ul className="space-y-2 text-xs text-foreground-muted">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>Forces manual tab comparisons and tedious multi-dropdown filters.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>Rankings driven by paid affiliate commissions rather than user fit.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>No integrated payment verification or direct checkout flow.</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Generic AI Chatbots */}
            <div className="p-5 rounded-2xl border border-border/70 bg-surface-subtle space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs">
                <X className="w-4 h-4 shrink-0" />
                <span>Generic AI chatbots</span>
              </div>
              <h3 className="font-semibold text-sm text-foreground">Hallucinated & unsafe</h3>
              <ul className="space-y-2 text-xs text-foreground-muted">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Frequently hallucinate prices, out-of-stock items, and non-existent specs.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Cannot calculate real cart totals, tax rates, or currency conversions.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Dead-end conversations with zero transaction capabilities.</span>
                </li>
              </ul>
            </div>

            {/* Column 3: PayPilot AI */}
            <div className="p-5 rounded-2xl border-2 border-accent bg-accent/5 space-y-3 shadow-xs relative">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
                <Check className="w-4 h-4 shrink-0" />
                <span>Split-intelligence architecture</span>
              </div>
              <h3 className="font-bold text-sm text-foreground">Deterministic & verifiable</h3>
              <ul className="space-y-2 text-xs text-foreground leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>Mathematical scoring on real specs + AI-explained compromises.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>Zero-trust server price recalculation rejects client tampering.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
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
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Curated demonstration catalog
              </h2>
              <p className="text-xs text-foreground-muted mt-1">
                Explore real products evaluated with grounded specifications.
              </p>
            </div>
            <Link
              to="/catalogue"
              className="text-xs font-medium text-accent hover:underline flex items-center gap-1.5"
            >
              <span>View all catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogue?category=${cat.id}`}
                className="p-5 rounded-2xl border border-border/80 bg-surface hover:border-accent hover:shadow-sm transition-colors duration-150 space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors duration-150">
                    {cat.label}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-surface-subtle group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-colors duration-150">
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

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border/90 bg-surface p-8 sm:p-14 shadow-md flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
          <div className="space-y-3 max-w-xl relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Experience conversational shopping grounded in truth.
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
              Launch the copilot workspace, test natural language requirements, inspect deterministic spec scores, and complete an official PayPal sandbox checkout.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 relative z-10">
            <Link
              to="/workspace"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors duration-150 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Copilot</span>
            </Link>
            <Link
              to="/insights"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-border bg-surface hover:bg-surface-subtle text-foreground text-xs font-medium flex items-center justify-center gap-2 transition-colors duration-150 shadow-xs"
            >
              <span>View Sandbox Insights</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
