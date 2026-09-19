import React from 'react';
import { Bot, Sparkles, BrainCircuit } from 'lucide-react';

export default function AIAnalystCard({ verdict, isLoading }) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent dark:from-indigo-500/20 dark:via-purple-500/10 dark:to-transparent backdrop-blur-2xl border border-indigo-500/30 dark:border-indigo-400/20 shadow-glass flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 border border-indigo-500/30">
              <Bot size={26} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Gemma 4 31B <Sparkles size={16} className="text-amber-400" />
              </h3>
              <p className="text-xs text-slate-500">ИИ-Разбор стиля игры</p>
            </div>
          </div>
        </div>
        <div className="mt-4 min-h-[120px] text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {isLoading ? (
            <div className="space-y-3 animate-pulse pt-2">
              <div className="h-4 bg-indigo-400/20 rounded-full w-4/5"></div>
              <div className="h-4 bg-indigo-400/20 rounded-full w-full"></div>
              <div className="h-4 bg-indigo-400/20 rounded-full w-2/3"></div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-black/20 border border-white/5 whitespace-pre-line">
              {verdict || "Введите SteamID64, чтобы получить жесткий вердикт от нейросети."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}