import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Flame } from 'lucide-react';
import { useDotaStore } from './store/useDotaStore';
import PlayerCard from './components/PlayerCard';
import AIAnalystCard from './components/AIAnalystCard';
import RecentMatches from './components/RecentMatches';

export default function App() {
  const [searchVal, setSearchVal] = useState('');
  const { fetchPlayerData, isLoading, error, profile, matches, aiVerdict, theme, toggleTheme } = useDotaStore();

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) fetchPlayerData(searchVal.trim());
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-dota-red flex items-center justify-center text-white shadow-lg">
            <Flame size={20} />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-dota-red to-orange-500 bg-clip-text text-transparent">
            Dota 2 AI Insights
          </span>
        </div>
        <button onClick={toggleTheme} className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 text-slate-700 dark:text-yellow-400 hover:scale-105 transition-all shadow-sm">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <section className="w-full max-w-2xl text-center mb-10">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            placeholder="Введите SteamID64 (напр. 76561197960265728)..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full py-4 pl-12 pr-32 rounded-2xl bg-white/20 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dota-red/50 shadow-glass transition-all"
          />
          <Search className="absolute left-4 text-slate-400" size={20} />
          <button type="submit" disabled={isLoading} className="absolute right-2 px-6 py-2.5 rounded-xl bg-dota-red hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-50">
            {isLoading ? 'Поиск...' : 'Найти'}
          </button>
        </form>
        {error && <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">{error}</div>}
      </section>

      {profile && (
        <main className="w-full max-w-5xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlayerCard profile={profile} />
            <AIAnalystCard verdict={aiVerdict} isLoading={isLoading} />
          </div>
          <RecentMatches matches={matches} />
        </main>
      )}
    </div>
  );
}