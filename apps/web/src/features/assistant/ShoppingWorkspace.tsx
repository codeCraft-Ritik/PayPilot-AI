import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  Scale,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import {
  ShoppingAssistantResponse,
  SAMPLE_QUERIES,
} from '@paypilot/shared';
import { api } from '../../services/api.js';
import { useApp } from '../../context/AppContext.js';
import { ProductCard } from '../../components/shared/ProductCard.js';
import { BudgetBar } from '../../components/shared/BudgetBar.js';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  responsePayload?: ShoppingAssistantResponse;
  timestamp: string;
}

export const ShoppingWorkspace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const {
    currency,
    setUserBudgetUsd,
    comparedProductIds,
  } = useApp();

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeAssistantResponse, setActiveAssistantResponse] = useState<ShoppingAssistantResponse | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-run if query param is provided on mount
  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const trimmed = queryText.trim();
    setErrorMessage(null);
    setInputQuery('');

    // Add user message to thread
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await api.queryShoppingAssistant({
        query: trimmed,
        budgetCurrency: currency,
      });

      // Update user target budget in session if AI extracted one
      if (response.intent.targetBudget?.normalizedAmountUsd) {
        setUserBudgetUsd(response.intent.targetBudget.normalizedAmountUsd);
      }

      const assistantMsg: ChatMessage = {
        id: `msg_asst_${Date.now()}`,
        role: 'assistant',
        content: response.assistantMessage,
        responsePayload: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setActiveAssistantResponse(response);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process your request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClarifyingClick = (question: string) => {
    handleSend(question);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">AI Shopping Workspace</h1>
            <span className="px-2 py-0.5 rounded bg-accent-subtle text-accent border border-accent-border text-[11px] font-mono font-semibold">
              SPLIT INTELLIGENCE
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-0.5">
            Conversational requirement extraction paired with deterministic spec ranking and transparent budget intelligence.
          </p>
        </div>

        {/* Comparison Action Bar if items selected */}
        {comparedProductIds.length > 0 && (
          <Link
            to="/compare"
            className="px-3 py-1.5 rounded bg-foreground text-surface text-xs font-semibold flex items-center gap-1.5 shadow-tactile hover:bg-accent transition-colors self-start sm:self-auto"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare {comparedProductIds.length} Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Main Workspace Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Conversational Assistant Thread (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col h-[750px] rounded-xl border border-border bg-surface shadow-tactile overflow-hidden">
          {/* Thread Header */}
          <div className="p-3.5 border-b border-border bg-surface-subtle/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-foreground">Copilot Conversation</span>
            </div>

            {/* AI Model Badge */}
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-foreground-muted">
              {activeAssistantResponse?.modelIdentifier || 'Gemini 2.5 Flash / Smart Engine'}
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center text-center p-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent-subtle border border-accent-border text-accent flex items-center justify-center mx-auto">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">How can I guide your purchase today?</h3>
                  <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                    Describe what you are looking for in your own words, including desired battery life, connectivity, or budget constraints.
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className="space-y-1.5 text-left pt-2">
                  <span className="text-[10px] font-mono uppercase text-foreground-muted block">
                    Quick suggestions:
                  </span>
                  {SAMPLE_QUERIES.map((sq, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sq.prompt)}
                      className="w-full p-2.5 rounded border border-border bg-surface hover:bg-surface-subtle text-xs text-foreground text-left transition-colors flex items-center justify-between group"
                    >
                      <span className="font-medium truncate pr-2">{sq.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-foreground-muted group-hover:text-accent transition-transform group-hover:translate-x-0.5 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-xs ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-lg p-3 space-y-1.5 ${
                      msg.role === 'user'
                        ? 'bg-foreground text-surface rounded-tr-none'
                        : 'bg-surface-subtle border border-border text-foreground rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>

                    {/* Clarifying Questions (if returned) */}
                    {msg.responsePayload?.clarifyingQuestions && (
                      <div className="pt-2 mt-2 border-t border-border/80 space-y-1.5">
                        <span className="text-[10px] font-mono font-semibold uppercase text-accent flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          <span>Helpful Follow-up:</span>
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {msg.responsePayload.clarifyingQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleClarifyingClick(q)}
                              className="px-2 py-1 rounded bg-surface border border-border text-[11px] text-foreground hover:border-accent hover:text-accent transition-colors text-left"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <span className="text-[9px] font-mono text-foreground-muted/80 block text-right">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded bg-foreground text-surface flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold">
                      U
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3 text-xs items-center text-foreground-muted">
                <div className="w-6 h-6 rounded bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-lg bg-surface-subtle border border-border flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                  <span className="font-mono text-[11px]">
                    Analyzing requirements & scoring catalogue...
                  </span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded border border-danger-border bg-danger-subtle text-xs text-danger flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <div className="p-3 border-t border-border bg-surface space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputQuery);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about specs, budget, or alternatives..."
                disabled={isLoading}
                className="flex-1 py-2 px-3 rounded border border-border bg-surface text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-2 rounded bg-accent hover:bg-accent-hover disabled:bg-surface-subtle disabled:text-foreground-muted text-white transition-colors shadow-tactile active:scale-95"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] font-mono text-foreground-muted px-1">
              <span>Press Enter to send</span>
              <span>100% Grounded in Sample Catalogue</span>
            </div>
          </div>
        </div>

        {/* Right Column: Grounded Recommendations & Budget Intelligence (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeAssistantResponse ? (
            <>
              {/* Intent Summary Box */}
              <div className="rounded-xl border border-border bg-surface p-4 shadow-tactile space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold uppercase text-accent tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>EXTRACTED SHOPPING INTENT</span>
                  </span>
                  <span className="text-[11px] font-mono text-foreground-muted">
                    {activeAssistantResponse.processingTimeMs}ms latency
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-surface-subtle border border-border">
                    <span className="text-[10px] font-mono text-foreground-muted block">Category</span>
                    <span className="font-semibold text-foreground capitalize mt-0.5 block truncate">
                      {activeAssistantResponse.intent.category || 'All categories'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-surface-subtle border border-border">
                    <span className="text-[10px] font-mono text-foreground-muted block">Target Budget</span>
                    <span className="font-semibold text-foreground font-mono mt-0.5 block">
                      {activeAssistantResponse.intent.targetBudget
                        ? `${activeAssistantResponse.intent.targetBudget.currency === 'INR' ? '₹' : '$'}${activeAssistantResponse.intent.targetBudget.amount.toLocaleString()}`
                        : 'No cap specified'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-surface-subtle border border-border sm:col-span-2">
                    <span className="text-[10px] font-mono text-foreground-muted block">Identified Focus</span>
                    <span className="font-medium text-foreground mt-0.5 block truncate">
                      {activeAssistantResponse.intent.mustHaveFeatures.length > 0
                        ? activeAssistantResponse.intent.mustHaveFeatures.join(', ')
                        : 'Overall best value & rating'}
                    </span>
                  </div>
                </div>

                {/* Session Budget Bar */}
                {activeAssistantResponse.intent.targetBudget && (
                  <BudgetBar
                    currentAmountUsd={
                      activeAssistantResponse.recommendations[0]?.product.price || 0
                    }
                    targetBudgetUsd={
                      activeAssistantResponse.intent.targetBudget.normalizedAmountUsd
                    }
                    label="Top Recommendation vs Target Budget"
                  />
                )}
              </div>

              {/* Top Recommendations Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground">
                    Standout Recommendations ({activeAssistantResponse.recommendations.length})
                  </h2>
                  <span className="text-xs font-mono text-foreground-muted">
                    Ranked deterministically by spec match & budget fit
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeAssistantResponse.recommendations.map((recItem, idx) => (
                    <ProductCard
                      key={recItem.product.id}
                      product={recItem.product}
                      recommendation={recItem}
                      featured={idx === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Alternative Options Section (if any) */}
              {activeAssistantResponse.alternatives.length > 0 && (
                <div className="pt-4 border-t border-border space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Alternative Considerations
                    </h3>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      Slightly over-budget or alternative spec tiers worth evaluating.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeAssistantResponse.alternatives.map((altItem) => (
                      <ProductCard
                        key={altItem.product.id}
                        product={altItem.product}
                        recommendation={altItem}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State for Right Column */
            <div className="rounded-xl border border-border bg-surface p-12 text-center space-y-4 shadow-tactile">
              <div className="w-12 h-12 rounded-full bg-surface-subtle border border-border flex items-center justify-center mx-auto text-foreground-muted">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="font-bold text-sm text-foreground">Awaiting Your Requirements</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Type a query in the copilot on the left or click one of the suggested prompts to see real-time grounded recommendations, budget utilization, and spec breakdowns.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
