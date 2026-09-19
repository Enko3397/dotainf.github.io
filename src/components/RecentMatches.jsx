import React from 'react';
import { Swords, Clock, Target } from 'lucide-react';

export default function RecentMatches({ matches }) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-glass">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Swords size={20} className="text-dota-red" /> Последние игры (Steam API)
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {matches.map((match) => {
          const durationMin = Math.floor(match.duration / 60);
          const durationSec = match.duration % 60;
          return (
            <div key={match.match_id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 dark:bg-white/[0.02] border border-white/5 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-10 rounded-full ${match.isWin ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Матч #{match.match_id}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className={match.isWin ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-semibold'}>{match.isWin ? 'Победа' : 'Поражение'}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {durationMin}:{durationSec < 10 ? '0' : ''}{durationSec}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
                  {match.kills} / <span className="text-rose-500">{match.deaths}</span> / {match.assists}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center justify-end gap-1">
                  <Target size={12} /> Урон: {match.hero_damage}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}