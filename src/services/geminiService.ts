import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: any = null;

function getAI() {
  if (!aiInstance) {
    let apiKey = '';
    try {
      apiKey = (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) || '';
    } catch (e) {
      console.warn("Could not access process.env.GEMINI_API_KEY safely", e);
    }
    
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set or accessible.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
  }
  return aiInstance;
}

export interface MatchPrediction {
  match: string;
  league: string;
  tip: string;
  odds: string;
  confidence: number;
  isVip: boolean;
  time: string;
  analysis: string;
}

export async function getDailyPredictions(): Promise<MatchPrediction[]> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Find today's football matches. YOU MUST GENERATE EXACTLY 4 'FREE' PREDICTIONS (isVip: false) AND THE TEAMS MUST BE: 1) FC Augsburg vs Borussia Monchengladbach, 2) TSG Hoffenheim vs Werder Bremen, 3) Sunderland AFC vs Manchester United, 4) Brighton & Hove Albion vs Wolverhampton Wanderers. Do not change these pairings. If search doesn't find them for today, use reasonably realistic data for them anyway. Then you can add 6-8 other VIP matches (isVip: true) of your choice. Output as JSON array only.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              match: { type: Type.STRING, description: "Home Team vs Away Team" },
              league: { type: Type.STRING },
              tip: { type: Type.STRING, description: "e.g., 1X2, Over/Under, BTTS" },
              odds: { type: Type.STRING, description: "e.g., 1.85" },
              confidence: { type: Type.NUMBER, description: "0 to 100" },
              isVip: { type: Type.BOOLEAN },
              time: { type: Type.STRING, description: "Kick-off time (GMT)" },
              analysis: { type: Type.STRING, description: "Brief data-backed explanation" }
            },
            required: ["match", "league", "tip", "odds", "confidence", "isVip", "time", "analysis"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    // Fallback data reflecting the matches from the user's images
    return [
      {
        match: "FC Augsburg vs Borussia Monchengladbach",
        league: "Bundesliga",
        tip: "Home Win (1)",
        odds: "2.06",
        confidence: 84,
        isVip: false,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Augsburg's home atmosphere is toxic for visitors. Gladbach's away record is abysmal lately."
      },
      {
        match: "TSG Hoffenheim vs Werder Bremen",
        league: "Bundesliga",
        tip: "Home Win (1)",
        odds: "1.47",
        confidence: 90,
        isVip: false,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Hoffenheim are clinical at the PreZero Arena. Werder Bremen have a leaky defense that struggles against aerial threats."
      },
      {
        match: "Sunderland AFC vs Manchester United",
        league: "Premier League",
        tip: "Away Win (2)",
        odds: "1.94",
        confidence: 79,
        isVip: false,
        time: "17:00 GMT",
        analysis: "Wogan's Take: United's individual quality usually shines in these 'trap' games. Bruno Fernandes to dictate the tempo."
      },
      {
        match: "Brighton & Hove Albion vs Wolverhampton Wanderers",
        league: "Premier League",
        tip: "Home Win (1)",
        odds: "1.25",
        confidence: 92,
        isVip: false,
        time: "17:00 GMT",
        analysis: "Wogan's Take: Brighton's system is light years ahead of Wolves' current disjointed defensive setup. Easy home victory expected."
      },
      {
        match: "Manchester City vs Brentford FC",
        league: "Premier League",
        tip: "Home Win (1)",
        odds: "1.35",
        confidence: 95,
        isVip: true,
        time: "19:30 GMT",
        analysis: "Wogan's Take: City at home is a fortress. Haaland will feast on any defensive errors from Brentford."
      },
      {
        match: "RB Leipzig vs FC St. Pauli",
        league: "Bundesliga",
        tip: "Home Win (1)",
        odds: "1.28",
        confidence: 96,
        isVip: true,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Leipzig are relentless at home. St. Pauli's defensive structure will struggle."
      },
      {
        match: "VfB Stuttgart vs Bayer Leverkusen",
        league: "Bundesliga",
        tip: "Away Win (2)",
        odds: "2.90",
        confidence: 81,
        isVip: true,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Leverkusen's unbeaten spirit remains their greatest asset. Xabi Alonso has the edge."
      },
      {
        match: "Liverpool FC vs Chelsea FC",
        league: "Premier League",
        tip: "Home Win (1)",
        odds: "1.85",
        confidence: 91,
        isVip: true,
        time: "14:30 GMT",
        analysis: "Wogan's Take: Anfield is rocking. Liverpool's attacking firepower is currently outclassing Chelsea's transition defense."
      },
      {
        match: "Middlesbrough FC vs Southampton FC",
        league: "Championship",
        tip: "Draw (X)",
        odds: "3.31",
        confidence: 72,
        isVip: true,
        time: "14:30 GMT",
        analysis: "Wogan's Take: Two technically gifted sides that often cancel each other out. Cagey stalemate expected."
      },
      {
        match: "Elche CF vs Deportivo Alaves",
        league: "LaLiga",
        tip: "Home Win (1)",
        odds: "2.26",
        confidence: 86,
        isVip: true,
        time: "15:00 GMT",
        analysis: "Wogan's Take: Elche's defensive solidity is underrated. Alaves struggle for goals on the road."
      },
      {
        match: "Cagliari Calcio vs Udinese Calcio",
        league: "Serie A",
        tip: "Away Win (2)",
        odds: "2.94",
        confidence: 68,
        isVip: true,
        time: "16:00 GMT",
        analysis: "Wogan's Take: Udinese have more quality in the final third. One moment of magic decides this."
      },
      {
        match: "Fulham FC vs AFC Bournemouth",
        league: "Premier League",
        tip: "Away Win (2)",
        odds: "2.55",
        confidence: 74,
        isVip: true,
        time: "17:00 GMT",
        analysis: "Wogan's Take: Bournemouth are being underrated. Their high pressing will cause major problems for Fulham."
      },
      {
        match: "Sevilla FC vs Espanyol Barcelona",
        league: "LaLiga",
        tip: "Home Win (1)",
        odds: "2.06",
        confidence: 80,
        isVip: true,
        time: "17:15 GMT",
        analysis: "Wogan's Take: Sevilla are masters of the home grind. The pressure will eventually tell."
      },
      {
        match: "Lazio Rome vs Inter Milano",
        league: "Serie A",
        tip: "Away Win (2)",
        odds: "1.82",
        confidence: 88,
        isVip: true,
        time: "19:00 GMT",
        analysis: "Wogan's Take: Inter are the class of Serie A. Lazio's inconsistency will be punished."
      },
      {
        match: "Atletico Madrid vs RC Celta de Vigo",
        league: "LaLiga",
        tip: "Home Win (1)",
        odds: "2.10",
        confidence: 85,
        isVip: true,
        time: "19:30 GMT",
        analysis: "Wogan's Take: Simeone's men are grinding out results. Celta struggle against low-block defenses."
      },
      {
        match: "VFL Wolfsburg vs Bayern Munich",
        league: "Bundesliga",
        tip: "Away Win (2)",
        odds: "1.56",
        confidence: 91,
        isVip: true,
        time: "19:30 GMT",
        analysis: "Wogan's Take: Bayern are chasing the title and cannot afford any slips. Kane to find the net."
      }
    ];
  }
}
