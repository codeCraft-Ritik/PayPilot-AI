import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Send,
  Camera,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
  CreditCard,
  Users,
  Undo2,
} from 'lucide-react';
import {
  DecomposedMissionIntent,
  MultiMerchantSKU,
  ProcurementBundle,
  BundleTierType,
  SpendPolicyConfig,
  GuardrailEvaluation,
  PriceSniperRule,
  AgentTerminalLog,
} from '@paypilot/shared';
import { api } from '../../services/api.js';
import { JudgePresetsBar, JudgePreset } from '../../components/procurement/JudgePresetsBar.js';
import { ProcurementGrid } from '../../components/procurement/ProcurementGrid.js';
import { SpendPolicyPassport } from '../../components/procurement/SpendPolicyPassport.js';
import { PriceSniperWidget } from '../../components/procurement/PriceSniperWidget.js';
import { SplitInvoiceModal } from '../../components/procurement/SplitInvoiceModal.js';
import { AgentTerminal } from '../../components/procurement/AgentTerminal.js';

export const ProcurementWorkbenchPage: React.FC = () => {
  // State: Mission & Intent
  const [missionPrompt, setMissionPrompt] = useState(
    'Equip a two-person podcasting starter kit under $280 total with USB-C mics, closed-back headphones, and boom arms'
  );
  const [refinePrompt, setRefinePrompt] = useState('');
  const [activePresetId, setActivePresetId] = useState<string | null>('preset-podcasting');
  const [currentIntent, setCurrentIntent] = useState<DecomposedMissionIntent | null>(null);

  // State: Catalog Candidates & Bundles
  const [candidatePool, setCandidatePool] = useState<MultiMerchantSKU[]>([]);
  const [bundles, setBundles] = useState<Record<BundleTierType, ProcurementBundle> | null>(null);
  const [activeTier, setActiveTier] = useState<BundleTierType>('best_value');
  const [lockedItemIds, setLockedItemIds] = useState<Set<string>>(new Set());

  // State: Spend Policy Passport & Guardrails
  const [spendPolicy, setSpendPolicy] = useState<SpendPolicyConfig>({
    maxAutoApproveLimit: 250,
    hardTransactionCeiling: 300,
    dailySpendVelocityCap: 500,
    allowedCategories: ['Audio', 'Electronics', 'Office', 'Furniture', 'Kitchen'],
    requireVerifiedMerchants: true,
  });
  const [guardrailEval, setGuardrailEval] = useState<GuardrailEvaluation | null>(null);

  // State: Price Sniper Rules
  const [sniperRules, setSniperRules] = useState<PriceSniperRule[]>([]);

  // State: Modals & HITL
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isHitlModalOpen, setIsHitlModalOpen] = useState(false);
  const [isCheckoutExecuting, setIsCheckoutExecuting] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<any | null>(null);
  const [refundResult, setRefundResult] = useState<any | null>(null);

  // State: Logs & Status
  const [logs, setLogs] = useState<AgentTerminalLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Append formatted terminal log
  const addLog = useCallback(
    (
      tag: AgentTerminalLog['tag'],
      message: string,
      payload?: unknown,
      level: AgentTerminalLog['level'] = 'info'
    ) => {
      const newEntry: AgentTerminalLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toLocaleTimeString(),
        tag,
        level,
        message,
        payload,
      };
      setLogs((prev) => [...prev, newEntry]);
    },
    []
  );

  // Initialize Spend Policy and default sample rules on mount
  useEffect(() => {
    async function initData() {
      try {
        const policy = await api.getSpendPolicy();
        setSpendPolicy(policy);
        const rules = await api.getSniperRules();
        setSniperRules(rules);
      } catch (err) {
        console.warn('Initial data load error:', err);
      }
    }
    initData();
  }, []);

  // Run full procurement flow for a given prompt
  const executeMission = useCallback(
    async (promptText: string, presetKey?: string) => {
      try {
        setIsLoading(true);
        if (presetKey) setActivePresetId(presetKey);

        addLog('Intent', `Decomposing natural-language mission: "${promptText}"`);
        const intent = await api.parseMissionIntent(promptText);
        setCurrentIntent(intent);

        addLog('Intent', `Decomposed into ${intent.requiredCategories.length} categories with 5% tax/shipping buffer`, {
          missionTitle: intent.missionTitle,
          hardBudgetMax: intent.hardBudgetMax,
          buffer: intent.allocatedBufferUsd,
          categories: intent.requiredCategories,
        });

        // Search candidates across Channel3 discovery
        addLog('Channel3', `Querying Channel3 Universal Discovery graph for required categories...`);
        let allSkus: MultiMerchantSKU[] = [];

        for (const cat of intent.requiredCategories) {
          const res = await api.searchProcurementDiscovery(cat.categoryName, {
            maxPriceUsd: cat.allocatedSubBudgetUsd * 1.3,
            limit: 5,
          });
          allSkus = [...allSkus, ...res.skus];
          addLog(
            'Channel3',
            `Channel3 returned ${res.skus.length} multi-merchant candidate SKUs for category: "${cat.categoryName}"`,
            { skus: res.skus.map((s) => ({ title: s.title, price: s.price, merchant: s.merchantDomain })) }
          );
        }

        setCandidatePool(allSkus);

        // Run 3-tier Knapsack bundle optimizer
        addLog('Knapsack', `Running 3-tier knapsack combinatorial solver (Best Value, Max Performance, Fastest Dispatch)...`);
        const optimizedBundles = await api.optimizeProcurementBundles({
          requiredCategories: intent.requiredCategories,
          candidatePool: allSkus,
          hardBudgetMax: intent.hardBudgetMax,
          lockedItems: [],
        });

        setBundles(optimizedBundles);
        const chosenTier = intent.deliveryPriority === 'fastest' ? 'fastest_dispatch' : 'best_value';
        setActiveTier(chosenTier);

        const activeBundle = optimizedBundles[chosenTier];
        addLog('Knapsack', `Assembled 3 tiers. Selected "${chosenTier}" bundle ($${activeBundle.totalCost.toFixed(2)} total, +$${activeBundle.totalArbitrageSaved.toFixed(2)} arbitrage saved).`, {
          items: activeBundle.items.map((i) => ({ title: i.title, price: i.price, merchant: i.merchantDomain })),
        });

        // Evaluate Spend Policy Passport guardrails
        addLog('Guardrail', `Evaluating Spend Policy Passport against cart total $${activeBundle.totalCost.toFixed(2)}...`);
        const guardrail = await api.evaluateSpendGuardrails({
          items: activeBundle.items,
          totalCost: activeBundle.totalCost,
        });

        setGuardrailEval(guardrail);
        addLog(
          'Guardrail',
          `Policy Status: ${guardrail.zone} ZONE. Computed SHA-256 Passport Signature.`,
          { zone: guardrail.zone, hash: guardrail.policyPassportHash }
        );
      } catch (err: any) {
        addLog('Intent', `Mission execution failed: ${err.message}`, undefined, 'error');
        console.error('Procurement error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [addLog]
  );

  // Trigger default preset on initial load
  useEffect(() => {
    executeMission(missionPrompt, 'preset-podcasting');
  }, []);

  // Handle Preset selection
  const handleSelectPreset = (preset: JudgePreset) => {
    setMissionPrompt(preset.prompt);
    executeMission(preset.prompt, preset.id);
  };

  // Handle Vision Input upload simulation
  const handleVisionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      addLog('Intent', `Processing visual input "Snap-to-Cart" image: ${file.name} (${Math.round(file.size / 1024)} KB)`);

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const visionIntent = await api.parseVisionMission(base64, file.name);
        setCurrentIntent(visionIntent);
        setMissionPrompt(`[Vision] ${visionIntent.missionTitle}`);
        addLog('Intent', `Vision LLM detected items & reconstructed budget parameters`, visionIntent);
        await executeMission(`[Vision] ${visionIntent.missionTitle}`);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      addLog('Intent', `Vision input failed: ${err.message}`, undefined, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Conversational Refinement
  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinePrompt || !currentIntent) return;

    try {
      setIsLoading(true);
      addLog('Intent', `Applying conversational constraint refinement: "${refinePrompt}"`);
      const refined = await api.refineMissionConstraints(currentIntent, refinePrompt);
      setCurrentIntent(refined);
      addLog('Intent', `Mission state updated without restarting from scratch`, refined);

      // Re-run knapsack with current candidates & refined budget
      const updatedBundles = await api.optimizeProcurementBundles({
        requiredCategories: refined.requiredCategories,
        candidatePool,
        hardBudgetMax: refined.hardBudgetMax,
      });

      setBundles(updatedBundles);
      const activeBundle = updatedBundles[activeTier];
      const evaluation = await api.evaluateSpendGuardrails({
        items: activeBundle.items,
        totalCost: activeBundle.totalCost,
      });
      setGuardrailEval(evaluation);
      setRefinePrompt('');
      addLog('Knapsack', `Recalculated bundles for refined constraints.`);
    } catch (err: any) {
      addLog('Intent', `Constraint refinement failed: ${err.message}`, undefined, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Lock & Recalculate
  const handleLockToggle = async (skuId: string, locked: boolean) => {
    const updatedLocked = new Set(lockedItemIds);
    if (locked) updatedLocked.add(skuId);
    else updatedLocked.delete(skuId);
    setLockedItemIds(updatedLocked);

    if (!bundles || !currentIntent) return;

    const currentItems = bundles[activeTier].items;
    const lockedItems = currentItems.filter((i) => updatedLocked.has(i.skuId));

    addLog('Knapsack', `Lock toggled on ${skuId} (${locked ? 'LOCKED' : 'UNLOCKED'}). Recalculating remaining rows.`);
    const reoptimized = await api.optimizeProcurementBundles({
      requiredCategories: currentIntent.requiredCategories,
      candidatePool,
      hardBudgetMax: currentIntent.hardBudgetMax,
      lockedItems,
    });
    setBundles(reoptimized);
  };

  // Inline Alternative Swapper
  const handleSwapItem = async (oldSkuId: string, newSku: MultiMerchantSKU) => {
    if (!bundles) return;
    const currentBundle = bundles[activeTier];
    const newItems = currentBundle.items.map((i) => (i.skuId === oldSkuId ? newSku : i));
    const newTotal = Number(newItems.reduce((acc, i) => acc + i.price, 0).toFixed(2));
    const newSavings = Number(
      newItems.reduce((acc, i) => acc + (i.retailAvgPrice - i.price), 0).toFixed(2)
    );

    addLog(
      'Knapsack',
      `Swapped SKU: Replaced "${oldSkuId}" with "${newSku.title}" ($${newSku.price}) via ${newSku.merchantDomain}`
    );

    setBundles((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [activeTier]: {
          ...prev[activeTier],
          items: newItems,
          totalCost: newTotal,
          totalArbitrageSaved: newSavings,
        },
      };
    });

    const evalRes = await api.evaluateSpendGuardrails({
      items: newItems,
      totalCost: newTotal,
    });
    setGuardrailEval(evalRes);
  };

  // Autonomous or HITL Checkout
  const executePayPalCheckout = async () => {
    if (!bundles || !guardrailEval) return;
    const currentBundle = bundles[activeTier];

    // If Yellow Zone and modal not yet confirmed, open HITL modal
    if (guardrailEval.zone === 'YELLOW' && !isHitlModalOpen) {
      setIsHitlModalOpen(true);
      return;
    }

    try {
      setIsCheckoutExecuting(true);
      setIsHitlModalOpen(false);

      addLog('PayPal', `Initiating PayPal Order Creation via PayPal Agent Toolkit with custom_id SHA-256 hash...`);
      const orderRes = await api.createProcurementPayPalOrder({
        items: currentBundle.items,
        totalAmountUsd: currentBundle.totalCost,
        policyPassportHash: guardrailEval.policyPassportHash,
        orderReference: `BUYWARD-${Date.now()}`,
      });

      addLog('PayPal', `PayPal Order Created [${orderRes.paypalOrderId}]. Executing Autonomous Capture...`);
      const captureRes = await api.captureProcurementPayPalOrder(orderRes.paypalOrderId);

      addLog('PayPal', `Payment Captured Successfully! Capture ID: ${captureRes.captureId}`, {
        captureId: captureRes.captureId,
        status: captureRes.status,
        receiptId: captureRes.receiptId,
      });

      setCheckoutResult({
        orderId: orderRes.paypalOrderId,
        captureId: captureRes.captureId,
        totalUsd: currentBundle.totalCost,
        arbitrageSaved: currentBundle.totalArbitrageSaved,
        itemsCount: currentBundle.items.length,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      addLog('PayPal', `Checkout execution failed: ${err.message}`, undefined, 'error');
    } finally {
      setIsCheckoutExecuting(false);
    }
  };

  // SLA Watchdog Auto-Refund Trigger
  const handleTestSlaRefund = async () => {
    if (!checkoutResult?.captureId) {
      alert('Please complete a checkout order first to test SLA Watchdog refund.');
      return;
    }

    try {
      addLog('SLA', `SLA Watchdog triggered: Merchant delivery SLA breached on capture ${checkoutResult.captureId}. Executing automated full refund...`);
      const refund = await api.executeSLAWatchdogRefund(
        checkoutResult.captureId,
        'Merchant shipping SLA breached (72h tracking timeout)'
      );

      setRefundResult(refund);
      addLog('SLA', `Automated SLA Refund Executed: Refund ID ${refund.refundId}`, refund);
    } catch (err: any) {
      addLog('SLA', `SLA Refund failed: ${err.message}`, undefined, 'error');
    }
  };

  // Price Sniper Judge Simulation Trigger
  const handleSimulateDrop = async (ruleId: string, dropPrice?: number) => {
    try {
      addLog('Sniper', `Judge Trigger: Simulating real-time price drop on rule ${ruleId} to $${dropPrice}...`);
      const result = await api.simulatePriceDrop(ruleId, dropPrice);

      addLog('Sniper', `Price sniper triggered! Autonomous PayPal checkout executed: Order ${result.executedOrder?.paypalOrderId}`, result);

      // Refresh rules list
      const rules = await api.getSniperRules();
      setSniperRules(rules);
    } catch (err: any) {
      addLog('Sniper', `Price drop simulation failed: ${err.message}`, undefined, 'error');
    }
  };

  const currentBundle = bundles ? bundles[activeTier] : null;
  const currentTotal = currentBundle?.totalCost || 0;
  const currentZone = guardrailEval?.zone || 'GREEN';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-border rounded-2xl p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              BuyWard
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium text-xs">
              Agentic commerce
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-subtle border border-border text-foreground-muted text-xs">
              PayPal Hackathon
            </span>
          </div>
          <p className="text-xs sm:text-sm text-foreground-muted max-w-2xl leading-relaxed">
            Multi-merchant procurement matrix powered by <strong>Channel3 discovery</strong>, an interactive <strong>AG Grid</strong> arbitrage workbench, cryptographic <strong>Spend Policy Passport</strong>, and the <strong>PayPal Agent Toolkit</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-surface-subtle/80 border border-border text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-foreground-muted">PayPal Sandbox:</span>
            <span className="font-semibold text-foreground">v2 REST Live</span>
          </div>
        </div>
      </div>

      {/* Module 7: Judge Fast-Track Presets */}
      <JudgePresetsBar
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
        isLoading={isLoading}
      />

      {/* Module 1: Natural Language & Vision Intent Input Area */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-foreground">
              Shopping mission input
            </span>
          </div>
          <span className="text-xs text-foreground-muted">
            Natural language or visual snap-to-cart
          </span>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={missionPrompt}
              onChange={(e) => setMissionPrompt(e.target.value)}
              placeholder="e.g. Equip a two-person podcasting starter kit under $280 total..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-subtle/40 text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {/* Multimodal Vision Upload Button */}
            <label className="px-3.5 py-2.5 rounded-xl border border-border hover:bg-surface-subtle cursor-pointer text-xs font-medium flex items-center gap-1.5 transition-colors duration-150 text-foreground-muted hover:text-foreground">
              <Camera className="w-4 h-4 text-accent" />
              <span>Vision upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleVisionUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={() => executeMission(missionPrompt)}
              disabled={isLoading || !missionPrompt.trim()}
              className="px-4 py-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors duration-150 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute mission</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Conversational Constraint Refiner */}
        {currentIntent && (
          <form
            onSubmit={handleRefine}
            className="pt-2 border-t border-border/60 flex items-center gap-2"
          >
            <span className="text-xs text-accent shrink-0 font-medium">
              Refine constraints:
            </span>
            <input
              type="text"
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              placeholder='e.g. "Swap the keyboard for wireless mechanical and lower cap to $240"'
              className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={!refinePrompt.trim() || isLoading}
              className="px-3 py-1.5 rounded-lg border border-border hover:bg-surface-subtle text-xs font-medium transition-colors duration-150"
            >
              Apply refinement
            </button>
          </form>
        )}
      </div>

      {/* Main Grid & Workbench Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Spend Policy Passport + Wait-and-Buy Sniper */}
        <div className="lg:col-span-4 space-y-6">
          <SpendPolicyPassport
            policy={spendPolicy}
            evaluation={guardrailEval}
            onUpdatePolicy={async (p) => {
              const updated = await api.updateSpendPolicy(p);
              setSpendPolicy(updated);
              if (currentBundle) {
                const ev = await api.evaluateSpendGuardrails({
                  items: currentBundle.items,
                  totalCost: currentBundle.totalCost,
                  policyOverride: p,
                });
                setGuardrailEval(ev);
              }
            }}
            cartTotalUsd={currentTotal}
          />

          <PriceSniperWidget
            rules={sniperRules}
            candidateItems={candidatePool}
            onSimulatePriceDrop={handleSimulateDrop}
            onCreateRule={async (rule) => {
              const created = await api.createSniperRule(rule);
              setSniperRules((prev) => [...prev, created]);
              addLog('Sniper', `New sniper rule armed on ${created.productTitle} ($${created.targetPrice})`);
            }}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column (8 cols): Interactive Procurement AG Grid + Execution Bar */}
        <div className="lg:col-span-8 space-y-4">
          <ProcurementGrid
            bundles={bundles}
            activeTier={activeTier}
            onSelectTier={(tier) => {
              setActiveTier(tier);
              if (bundles) {
                const b = bundles[tier];
                api.evaluateSpendGuardrails({
                  items: b.items,
                  totalCost: b.totalCost,
                }).then(setGuardrailEval);
              }
            }}
            hardBudgetMax={currentIntent?.hardBudgetMax || 300}
            allCandidatePool={candidatePool}
            onLockToggle={handleLockToggle}
            onQuantityChange={() => {}}
            onSwapItem={handleSwapItem}
          />

          {/* Autonomous Checkout Action Bar */}
          <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div>
                <span className="text-xs text-foreground-muted block">
                  Multi-merchant cart total
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-bold text-foreground">
                    ${currentTotal.toFixed(2)}
                  </span>
                  {currentBundle && (
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Saved ${currentBundle.totalArbitrageSaved.toFixed(2)} vs retail
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Squad Buy Split Invoicing Button */}
              <button
                onClick={() => setIsSplitModalOpen(true)}
                disabled={!currentBundle || currentBundle.items.length === 0}
                className="px-3.5 py-2.5 rounded-xl border border-border hover:bg-surface-subtle text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors duration-150"
                title="Split invoice across teammates via PayPal REST v2 Invoicing"
              >
                <Users className="w-3.5 h-3.5 text-accent" />
                <span>Squad Buy</span>
              </button>

              {/* SLA Watchdog Test Refund Button */}
              {checkoutResult && (
                <button
                  onClick={handleTestSlaRefund}
                  className="px-3.5 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors duration-150"
                  title="Test SLA Watchdog: Auto-refund breached merchant order via /v2/payments/captures/{id}/refund"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Test SLA refund</span>
                </button>
              )}

              {/* Dynamic Autonomous Checkout Button */}
              {currentZone === 'RED' ? (
                <button
                  disabled
                  className="px-5 py-2.5 rounded-xl bg-rose-600/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-xs font-medium cursor-not-allowed flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" />
                  <span>Blocked by spend policy</span>
                </button>
              ) : currentZone === 'YELLOW' ? (
                <button
                  onClick={executePayPalCheckout}
                  disabled={isCheckoutExecuting || !currentBundle}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-500 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors duration-150 active:scale-95 disabled:opacity-50"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Request approval</span>
                </button>
              ) : (
                <button
                  onClick={executePayPalCheckout}
                  disabled={isCheckoutExecuting || !currentBundle}
                  className="px-5 py-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors duration-150 active:scale-95 disabled:opacity-50"
                >
                  {isCheckoutExecuting ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Executing checkout...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Execute autonomous checkout</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Checkout Confirmation Card */}
          {checkoutResult && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-semibold text-xs text-emerald-800 dark:text-emerald-300">
                    Autonomous checkout captured via PayPal Agent Toolkit
                  </h4>
                </div>
                <span className="text-xs text-foreground-muted">
                  {checkoutResult.timestamp}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-surface border border-border">
                  <span className="text-foreground-muted text-[11px] block">PayPal order ID</span>
                  <span className="font-mono font-medium text-foreground truncate block">{checkoutResult.orderId}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-border">
                  <span className="text-foreground-muted text-[11px] block">Capture reference</span>
                  <span className="font-mono font-medium text-foreground truncate block">{checkoutResult.captureId}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-border">
                  <span className="text-foreground-muted text-[11px] block">Total captured</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">${checkoutResult.totalUsd.toFixed(2)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-border">
                  <span className="text-foreground-muted text-[11px] block">Arbitrage savings</span>
                  <span className="font-mono font-bold text-accent">+${checkoutResult.arbitrageSaved.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* SLA Refund Confirmation Card */}
          {refundResult && (
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/25 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-semibold">
                <Shield className="w-4 h-4" />
                <span>SLA watchdog auto-refund issued</span>
              </div>
              <p className="text-foreground">
                Refund ID: <code className="font-mono font-medium">{refundResult.refundId}</code> • Funds refunded via PayPal REST v2 API.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Human-in-the-Loop (HITL) Yellow Zone Modal */}
      {isHitlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-semibold text-sm">
                Human-in-the-loop review required
              </h3>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              Cart total (<strong>${currentTotal.toFixed(2)}</strong>) exceeds the autonomous threshold (<strong>${spendPolicy.maxAutoApproveLimit.toFixed(2)}</strong>) by <strong>${(currentTotal - spendPolicy.maxAutoApproveLimit).toFixed(2)}</strong>.
            </p>
            <p className="text-xs text-foreground-muted">
              Because this amount is within your pre-set hard ceiling (${spendPolicy.hardTransactionCeiling.toFixed(2)}), manual authorization is required to execute the PayPal order.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsHitlModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs text-foreground hover:bg-surface-subtle transition-colors duration-150"
              >
                Reject and modify cart
              </button>
              <button
                onClick={executePayPalCheckout}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-medium hover:bg-amber-500 transition-colors duration-150"
              >
                Approve and execute checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Squad Buy Split Invoicing Modal */}
      {currentBundle && (
        <SplitInvoiceModal
          isOpen={isSplitModalOpen}
          onClose={() => setIsSplitModalOpen(false)}
          items={currentBundle.items}
          totalAmountUsd={currentTotal}
          onExecuteSplit={async (data) => {
            addLog('PayPal', `Executing Squad Buy split invoicing for ${data.teammates.length} recipients...`);
            const res = await api.executeSquadBuySplitInvoicing({
              items: currentBundle.items.map((i) => ({
                name: i.title,
                unitPrice: i.price,
                quantity: 1,
              })),
              totalAmountUsd: currentTotal,
              teammates: data.teammates.map((t) => ({
                email: t.email,
                name: t.name,
                amountUsd: t.shareUsd,
              })),
              note: data.note,
            });
            addLog('PayPal', `Split invoices dispatched via PayPal REST v2! Dispatched ${res.invoices.length} invoices.`, res);
            return res;
          }}
        />
      )}

      {/* Persistent Live Reasoning Terminal Drawer */}
      <AgentTerminal logs={logs} onClearLogs={() => setLogs([])} />
    </div>
  );
};
