import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: any = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set.");
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
      contents: "Find today's top 12 major football matches (Premier League, La Liga, Bundesliga, Serie A, etc.) and provide expert betting predictions for each. Format the output as a JSON array. IMPORTANT: Exactly 6 matches must have 'isVip': false and exactly 6 matches must have 'isVip': true. The analysis should sound like it's from a professional expert named Wogan.",
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
              isVip: { type: Type.BOOLEAN, description: "Randomly assign true to 2-3 matches" },
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
    // Fallback data reflecting the user's provided image
    return [
      {
        match: "Borussia Dortmund vs Eintracht Frankfurt",
        league: "Bundesliga",
        tip: "Home Win (1)",
        odds: "1.65",
        confidence: 94,
        isVip: true,
        time: "21:30 GMT",
        analysis: "Wogan's Take: Dortmund are lethal at the Signal Iduna Park. Frankfurt struggle on the break against high-press teams. I'm backing the home side to dominate possession and find the net twice."
      },
      {
        match: "Liverpool FC vs Chelsea FC",
        league: "Premier League",
        tip: "Home Win (1)",
        odds: "1.86",
        confidence: 89,
        isVip: true,
        time: "14:30 GMT",
        analysis: "Wogan's Take: Anfield under the lights is a different beast. Chelsea's transition defense is still leaky, and Salah loves scoring against his former club. Value is on the Reds."
      },
      {
        match: "AC Monza vs Empoli FC",
        league: "Serie B",
        tip: "Home Win (1)",
        odds: "1.69",
        confidence: 85,
        isVip: false,
        time: "21:30 GMT",
        analysis: "Wogan's Take: Monza are solid at home and Empoli's strike force has been blunt lately. A narrow 1-0 or 2-0 win expected here."
      },
      {
        match: "Venezia FC vs Palermo FC",
        league: "Serie B",
        tip: "Home Win (1)",
        odds: "1.61",
        confidence: 87,
        isVip: false,
        time: "21:30 GMT",
        analysis: "Wogan's Take: Venezia's home form is the only reason they are climbing the table. Palermo are inconsistent travelers."
      },
      {
        match: "KKS Lech Poznan vs MKS Arka Gdynia",
        league: "Ekstraklasa",
        tip: "Home Win (1)",
        odds: "1.35",
        confidence: 96,
        isVip: false,
        time: "21:30 GMT",
        analysis: "Wogan's Take: This is a bankroll builder. Lech Poznan are miles ahead in terms of quality and depth. Safe bet."
      },
      {
        match: "Frosinone Calcio vs Mantova 1911",
        league: "Serie B",
        tip: "Home Win (1)",
        odds: "1.63",
        confidence: 84,
        isVip: false,
        time: "21:30 GMT",
        analysis: "Wogan's Take: Frosinone's tactical setup is purpose-built to break down low blocks like Mantova's."
      },
      {
        match: "Racing Club De Lens vs FC Nantes",
        league: "Ligue 1",
        tip: "Home Win (1)",
        odds: "1.43",
        confidence: 91,
        isVip: false,
        time: "21:45 GMT",
        analysis: "Wogan's Take: Lens have the best defensive record at home this season. Nantes won't find a way through."
      },
      {
        match: "Torino FC vs Sassuolo Calcio",
        league: "Serie A",
        tip: "Draw (X)",
        odds: "3.21",
        confidence: 78,
        isVip: true,
        time: "21:45 GMT",
        analysis: "Wogan's Take: Both teams play cagey football against mid-table rivals. The draw offers massive value here."
      },
      {
        match: "Hull City vs Millwall FC",
        league: "Championship",
        tip: "Away Win (2)",
        odds: "2.39",
        confidence: 82,
        isVip: true,
        time: "22:00 GMT",
        analysis: "Wogan's Take: Millwall's physicality will be too much for Hull's young midfield. Expect a set-piece goal."
      },
      {
        match: "Levante UD vs CA Osasuna",
        league: "LaLiga",
        tip: "Home Win (1)",
        odds: "2.49",
        confidence: 80,
        isVip: true,
        time: "22:00 GMT",
        analysis: "Wogan's Take: Levante are fighting for survival and their intensity at home has spiked. Osasuna are safe and may rotate."
      },
      {
        match: "Middlesbrough FC vs Southampton FC",
        league: "Championship",
        tip: "Home Win (1)",
        odds: "2.26",
        confidence: 83,
        isVip: true,
        time: "14:30 GMT",
        analysis: "Wogan's Take: Boro have found their rhythm. Southampton are struggling with injuries to key creative players."
      },
      {
        match: "Elche CF vs Deportivo Alaves",
        league: "LaLiga",
        tip: "Under 2.5 Goals",
        odds: "1.75",
        confidence: 88,
        isVip: false,
        time: "15:00 GMT",
        analysis: "Wogan's Take: A relegation 6-pointer usually ends in a stalemate or a single goal. Discipline over flair today."
      }
    ];
  }
}
