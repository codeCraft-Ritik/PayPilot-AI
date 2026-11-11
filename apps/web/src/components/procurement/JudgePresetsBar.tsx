import React from 'react';
import { Sparkles, Mic, Monitor, Coffee, Zap } from 'lucide-react';

export interface JudgePreset {
  id: string;
  title: string;
  subtitle: string;
  budgetMax: number;
  deliveryPriority: 'fastest' | 'balanced' | 'cheapest';
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

export const JUDGE_PRESETS: JudgePreset[] = [
  {
    id: 'preset-podcasting',
    title: 'Podcasting Starter Kit',
    subtitle: 'Two-person recording setup',
    budgetMax: 280,
    deliveryPriority: 'fastest',
    prompt:
      'Equip a two-person podcasting starter kit under $280 total with USB-C mics, closed-back headphones, and boom arms',
    icon: Mic,
    tags: ['USB-C mics', 'Closed-back headphones', 'Boom arms', 'Fast dispatch'],
  },
  {
    id: 'preset-devdesk',
    title: 'Ergonomic Developer Desk',
    subtitle: 'Daily workstation ergonomics',
    budgetMax: 350,
    deliveryPriority: 'balanced',
    prompt:
      'Equip an ergonomic developer workspace under $350 total with an ergonomic mesh chair, split mechanical keyboard, and monitor light bar',
    icon: Monitor,
    tags: ['Ergonomic chair', 'Split keyboard', 'Light bar', 'Balanced'],
  },
  {
    id: 'preset-espresso',
    title: 'Dorm Espresso Station',
    subtitle: 'Compact espresso and grinding',
    budgetMax: 220,
    deliveryPriority: 'cheapest',
    prompt:
      'Equip a compact dorm espresso bar under $220 total with an espresso machine, conical burr grinder, and stainless milk frothing pitcher',
    icon: Coffee,
    tags: ['Espresso machine', 'Burr grinder', 'Milk pitcher', 'Best value'],
  },
];

interface JudgePresetsBarProps {
  onSelectPreset: (preset: JudgePreset) => void;
  activePresetId?: string | null;
  isLoading?: boolean;
}

export const JudgePresetsBar: React.FC<JudgePresetsBarProps> = ({
  onSelectPreset,
  activePresetId,
  isLoading = false,
}) => {
  return (
    <div className="w-full bg-surface border border-border rounded-2xl p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">
                Judge Fast-Track
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
                100% sandbox seeded
              </span>
            </div>
            <p className="text-xs text-foreground-muted">
              Pre-configured shopping missions demonstrating Channel3 discovery, 3-tier knapsack optimization, and PayPal guardrails.
            </p>
          </div>
        </div>

        <div className="text-xs text-foreground-muted hidden sm:block">
          Select a preset to run the full autonomous pipeline
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {JUDGE_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = activePresetId === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              disabled={isLoading}
              className={`text-left p-3.5 rounded-xl border transition-colors duration-150 relative overflow-hidden group flex flex-col justify-between ${
                isActive
                  ? 'border-accent bg-accent/5 ring-1 ring-accent/30 shadow-xs'
                  : 'border-border/70 bg-surface-subtle/40 hover:bg-surface-subtle hover:border-border'
              } ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}`}
            >
              <div className="flex items-start justify-between gap-2 w-full mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'bg-surface text-foreground-muted group-hover:text-accent border border-border'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground leading-tight">
                      {preset.title}
                    </h4>
                    <p className="text-[11px] text-foreground-muted leading-tight mt-0.5">
                      {preset.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-foreground">
                    ${preset.budgetMax}
                  </div>
                  <div className="text-[10px] text-foreground-muted">
                    budget cap
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-1">
                {preset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-surface border border-border/70 text-foreground-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {isActive && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[11px] font-medium text-accent">
                  <Sparkles className="w-3 h-3" />
                  <span>Selected</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
