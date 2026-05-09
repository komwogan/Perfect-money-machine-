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
      contents: "Find today's top 10-12 major football matches and provide expert betting predictions. IMPORTANT: Exactly 4 matches must have 'isVip': false and exactly 6-8 matches must have 'isVip': true. The analysis should sound like it's from a professional expert named Wogan.",
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
    // Fallback data reflecting the 4 free matches from the user's image + VIP picks
    return [
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
        match: "Brighton & Hove Albion vs Wolves",
        league: "Premier League",
        tip: "Home Win (1)",
        odds: "1.25",
        confidence: 92,
        isVip: false,
        time: "17:00 GMT",
        analysis: "Wogan's Take: Brighton's system is light years ahead of Wolves' current disjointed defensive setup. Easy home victory expected."
      },
      {
        match: "VfB Stuttgart vs Bayer Leverkusen",
        league: "Bundesliga",
        tip: "Away Win (2)",
        odds: "2.90",
        confidence: 81,
        isVip: true,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Leverkusen's unbeaten spirit remains their greatest asset. Stuttgart are elite, but Alonso's tactical mid-game adjustments will be the difference."
      },
      {
        match: "Sevilla FC vs Espanyol Barcelona",
        league: "LaLiga",
        tip: "Home Win (1)",
        odds: "2.06",
        confidence: 80,
        isVip: true,
        time: "17:15 GMT",
        analysis: "Wogan's Take: Sevilla are masters of the home grind. Espanyol will sit deep, but the pressure will eventually tell."
      },
      {
        match: "Lazio Rome vs Inter Milano",
        league: "Serie A",
        tip: "Away Win (2)",
        odds: "1.82",
        confidence: 88,
        isVip: true,
        time: "19:00 GMT",
        analysis: "Wogan's Take: Inter are the class of Serie A. Lazio's inconsistency will be punished by Lautaro Martinez."
      },
      {
        match: "Atletico Madrid vs RC Celta de Vigo",
        league: "LaLiga",
        tip: "Home Win (1)",
        odds: "2.10",
        confidence: 85,
        isVip: true,
        time: "19:30 GMT",
        analysis: "Wogan's Take: Simeone's men are grinding out results in typical fashion. Celta struggle against low-block defenses."
      },
      {
        match: "VFL Wolfsburg vs Bayern Munich",
        league: "Bundesliga",
        tip: "Away Win (2)",
        odds: "1.56",
        confidence: 91,
        isVip: true,
        time: "19:30 GMT",
        analysis: "Wogan's Take: Bayern are chasing the title and cannot afford any slips. Harry Kane to find the net."
      }
    ];
  }
}
