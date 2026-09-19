import { create } from 'zustand';

// Временно стоит заглушка. Позже заменишь на свой Cloudflare Worker.
const WORKER_URL = 'https://dota-ai-analyst.workers.dev';

export const useDotaStore = create((set, get) => ({
  profile: null,
  matches: [],
  aiVerdict: null,
  isLoading: false,
  error: null,
  theme: 'dark',

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: nextTheme });
  },

  fetchPlayerData: async (searchId) => {
    set({ isLoading: true, error: null, profile: null, matches: [], aiVerdict: null });

    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchId: searchId.trim() })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Ошибка при получении данных из Steam API');
      }

      set({
        profile: data.profile,
        matches: data.matches || [],
        aiVerdict: data.aiVerdict,
        isLoading: false
      });
    } catch (err) {
      set({ 
        error: err.message === "Failed to fetch" 
          ? "Ошибка сети или Worker не развернут. Проверь ссылку WORKER_URL." 
          : err.message, 
        isLoading: false 
      });
    }
  }
}));