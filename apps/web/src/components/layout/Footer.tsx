import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { APP_METADATA } from '@paypilot/shared';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-surface text-foreground-muted mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-foreground text-sm">PayPilot AI</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-subtle border border-border">
                HACKATHON EDITION
              </span>
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed max-w-md">
              {APP_METADATA.brandStatement} An intelligent shopping intelligence copilot that transforms natural language requests into grounded recommendations, side-by-side spec trade-offs, and verified PayPal sandbox checkout.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-foreground-muted pt-2">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>Zero-hallucination prices • Authoritative server verification • Sandbox safe</span>
            </div>
          </div>

          {/* Core Flows */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase text-foreground tracking-wider">
              Product Journeys
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/workspace" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span>AI Shopping Copilot</span>
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="hover:text-foreground transition-colors">
                  Sample Catalogue (20+ Items)
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-foreground transition-colors">
                  Product Comparison Matrix
                </Link>
              </li>
              <li>
                <Link to="/insights" className="hover:text-foreground transition-colors">
                  Sandbox Spending Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Compliance */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase text-foreground tracking-wider">
              Architecture
            </span>
            <ul className="space-y-1.5 text-xs font-mono text-foreground-muted">
              <li>• Gemini 2.5 Flash / Smart Heuristics</li>
              <li>• PayPal REST API (v2 Orders)</li>
              <li>• TypeScript Monorepo & Zod</li>
              <li>• Idempotent Server Verification</li>
            </ul>
          </div>
        </div>

        {/* Hackathon Disclaimer Banner */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-foreground-muted text-[11px]">
            {APP_METADATA.disclaimer}
          </p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-accent">
              <Terminal className="w-3.5 h-3.5" />
              <span>v{APP_METADATA.version}</span>
            </span>
            <span>REST API / Sandbox Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
