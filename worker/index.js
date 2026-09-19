export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

    try {
      const { searchId } = await request.json();
      const STEAM_KEY = env.STEAM_API_KEY;

      if (!STEAM_KEY) throw new Error("STEAM_API_KEY не задан в Cloudflare.");

      let steamId64 = searchId;
      let accountId32 = searchId;
      const STEAM64_BASE = 76561197960265728n;

      if (searchId.length > 16) {
        accountId32 = (BigInt(searchId) - STEAM64_BASE).toString();
      } else {
        steamId64 = (BigInt(searchId) + STEAM64_BASE).toString();
      }

      const playerRes = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamId64}`);
      const playerData = await playerRes.json();
      const profile = playerData.response?.players?.[0];

      if (!profile) throw new Error("Профиль не найден.");

      const matchRes = await fetch(`https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1/?key=${STEAM_KEY}&account_id=${accountId32}&matches_requested=5`);
      const matchData = await matchRes.json();
      
      if (matchData.result?.status === 15) throw new Error("История матчей скрыта настройками приватности.");

      const rawMatches = matchData.result?.matches || [];
      const detailedMatches = await Promise.all(
        rawMatches.map(async (m) => {
          const detRes = await fetch(`https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key=${STEAM_KEY}&match_id=${m.match_id}`);
          const detData = await detRes.json();
          const match = detData.result;

          const p = match.players.find(x => x.account_id?.toString() === accountId32.toString()) || {};
          const isRadiant = p.player_slot < 128;
          const isWin = (match.radiant_win && isRadiant) || (!match.radiant_win && !isRadiant);

          return {
            match_id: match.match_id,
            duration: match.duration,
            kills: p.kills || 0,
            deaths: p.deaths || 0,
            assists: p.assists || 0,
            hero_damage: p.hero_damage || 0,
            isWin
          };
        })
      );

      let aiVerdict = "ИИ не подключен.";
      if (env.AI_API_KEY) {
        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.AI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "google/gemma-4-31b-it",
            messages: [
              { role: "system", content: "Короткий вердикт (3 предложения) по игроку Dota 2. Смурф, руинер или трайхард? Дай совет." },
              { role: "user", content: `Статистика: ${JSON.stringify(detailedMatches)}` }
            ]
          })
        });
        const aiJson = await aiRes.json();
        aiVerdict = aiJson.choices?.[0]?.message?.content || "Ошибка нейросети.";
      }

      return new Response(JSON.stringify({ profile, matches: detailedMatches, aiVerdict }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
  }
};