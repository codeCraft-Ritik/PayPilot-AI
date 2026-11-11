import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Activity,
  Code2,
} from 'lucide-react';
import { AgentTerminalLog } from '@paypilot/shared';

interface AgentTerminalProps {
  logs: AgentTerminalLog[];
  onClearLogs?: () => void;
  isOpenDefault?: boolean;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  logs,
  onClearLogs,
  isOpenDefault = true,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedLogIds, setExpandedLogIds] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const toggleExpandLog = (id: string) => {
    setExpandedLogIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyAllLogs = () => {
    const text = logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.tag.toUpperCase()}] ${l.message} ${
            l.payload ? '\n' + JSON.stringify(l.payload, null, 2) : ''
          }`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTagBadgeStyle = (tag: AgentTerminalLog['tag']) => {
    switch (tag) {
      case 'Intent':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Channel3':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Knapsack':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Guardrail':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'PayPal':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Sniper':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'SLA':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <div
      className={`fixed bottom-0 right-4 z-40 transition-[width,height] duration-200 ease-out ${
        isExpanded
          ? 'w-[calc(100vw-2rem)] md:w-[720px] h-[580px]'
          : isOpen
          ? 'w-[calc(100vw-2rem)] md:w-[540px] h-[360px]'
          : 'w-[calc(100vw-2rem)] md:w-[380px] h-12'
      }`}
    >
      <div className="w-full h-full bg-zinc-950 text-zinc-100 rounded-t-2xl border border-zinc-800 shadow-lg flex flex-col overflow-hidden font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-900 border-b border-zinc-800 shrink-0 select-none">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center text-accent">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-100">
                Agent Reasoning Stream
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
              {logs.length} events
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isOpen && (
              <>
                <button
                  onClick={copyAllLogs}
                  title="Copy full trace to clipboard"
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                {onClearLogs && (
                  <button
                    onClick={onClearLogs}
                    title="Clear terminal trace"
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Restore window size' : 'Expand window'}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {isExpanded ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title={isOpen ? 'Collapse terminal' : 'Open terminal'}
            >
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        {isOpen && (
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 text-[11px] leading-relaxed space-y-2 select-text"
          >
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-8">
                <Activity className="w-6 h-6 mb-2 opacity-40 animate-pulse" />
                <p>Waiting for agent mission trigger…</p>
                <p className="text-[10px] text-zinc-600">
                  Select a Judge Preset or enter a shopping prompt to stream reasoning.
                </p>
              </div>
            ) : (
              logs.map((log) => {
                const isPayloadOpen = !!expandedLogIds[log.id];
                const tagStyle = getTagBadgeStyle(log.tag);

                return (
                  <div
                    key={log.id}
                    className="group border border-zinc-900 hover:border-zinc-800 rounded p-1.5 transition-colors bg-zinc-950/60"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 shrink-0 text-[10px]">
                        {log.timestamp}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${tagStyle}`}
                      >
                        {log.tag}
                      </span>
                      <span className="text-zinc-300 break-words flex-1">
                        {String(log.message)}
                      </span>
                      {log.payload !== undefined && (
                        <button
                          onClick={() => toggleExpandLog(log.id)}
                          className="shrink-0 text-zinc-500 hover:text-zinc-300 p-0.5 rounded"
                          title="Toggle JSON payload"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {log.payload !== undefined && isPayloadOpen && (
                      <div className="mt-1.5 p-2 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-300 overflow-x-auto text-[10.5px]">
                        <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
