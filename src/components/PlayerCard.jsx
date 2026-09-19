import React from 'react';
import { ExternalLink, ShieldCheck, Globe } from 'lucide-react';

export default function PlayerCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-glass flex flex-col justify-between">
      <div className="flex items-center gap-5">
        <div className="relative">
          <img 
            src={profile.avatarfull} 
            alt={profile.personaname} 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-white/30 dark:border-white/10 shadow-lg object-cover"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 ${profile.personastate > 0 ? 'bg-emerald-500' : 'bg-slate-500'}`} />
        </div>
        <div className="overflow-hidden">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{profile.personaname}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">SteamID64: {profile.steamid}</p>
          <a href={profile.profileurl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-dota-red hover:underline mt-2 font-medium">
            Профиль Steam <ExternalLink size={12} />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-white/10 flex flex-col items-center text-center">
          <ShieldCheck size={18} className="text-emerald-400 mb-1" />
          <span className="text-[11px] text-slate-500">Статус</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{profile.communityvisibilitystate === 3 ? 'Открыт' : 'Скрыт'}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-white/10 flex flex-col items-center text-center">
          <Globe size={18} className="text-indigo-400 mb-1" />
          <span className="text-[11px] text-slate-500">Страна</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{profile.loccountrycode || 'Мир'}</span>
        </div>
      </div>
    </div>
  );
}