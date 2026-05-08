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
    // Fallback data reflecting the user's provided images
    return [
      {
        match: "Liverpool FC vs Chelsea FC",
        league: "Premier League",
        tip: "Home Win (1)",
        odds: "1.85",
        confidence: 92,
        isVip: true,
        time: "14:30 GMT",
        analysis: "Wogan's Take: Anfield is a fortress for these big 2:30 kick-offs. Chelsea's defense is still figuring itself out, while Salah and Diaz are in peak clinical form. The fire is on the home win for a reason."
      },
      {
        match: "Middlesbrough FC vs Southampton FC",
        league: "Championship",
        tip: "Home Win (1)",
        odds: "2.31",
        confidence: 81,
        isVip: true,
        time: "14:30 GMT",
        analysis: "Wogan's Take: Boro have a point to prove at home. Southampton are technically gifted but often struggle with the physicality of high-tempo Championship matches in the mid-afternoon slot."
      },
      {
        match: "Elche CF vs Deportivo Alaves",
        league: "LaLiga",
        tip: "Home Win (1)",
        odds: "2.26",
        confidence: 88,
        isVip: false,
        time: "15:00 GMT",
        analysis: "Wogan's Take: Elche have been quietly solid at home. Alaves are inconsistent travelers, and the data suggests a narrow but controlled home victory. Great value on the '1' here."
      },
      {
        match: "Cagliari Calcio vs Udinese Calcio",
        league: "Serie A",
        tip: "Draw (X)",
        odds: "3.11",
        confidence: 76,
        isVip: true,
        time: "16:00 GMT",
        analysis: "Wogan's Take: Two sides that prioritize defensive structure over attacking risk. I'm seeing a classic Italian stalemate where a 1-1 or 0-0 is the most probable outcome. Tactical battle."
      },
      {
        match: "RB Leipzig vs FC St. Pauli",
        league: "Bundesliga",
        tip: "Home Win (1)",
        odds: "1.28",
        confidence: 96,
        isVip: false,
        time: "16:30 GMT",
        analysis: "Wogan's Take: A complete mismatch in terms of transition speed. Leipzig will exploit the gaps St. Pauli leaves when they push up. This is a banker for any accumulator today."
      },
      {
        match: "VfB Stuttgart vs Bayer Leverkusen",
        league: "Bundesliga",
        tip: "Away Win (2)",
        odds: "2.90",
        confidence: 84,
        isVip: true,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Leverkusen's 'Neverkusen' days are over; they are clinical finishers now. Stuttgart are strong, but Alonso's tactical flexibility gives the away side the critical edge at these odds."
      },
      {
        match: "FC Augsburg vs Borussia Monchengladbach",
        league: "Bundesliga",
        tip: "Home Win (1)",
        odds: "2.06",
        confidence: 83,
        isVip: false,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Augsburg's press is purpose-built to disrupt Gladbach's build-up play. If the hosts maintain their intensity for 70 minutes, they'll walk away with all three points."
      },
      {
        match: "TSG Hoffenheim vs Werder Bremen",
        league: "Bundesliga",
        tip: "Home Win (1)",
        odds: "1.47",
        confidence: 89,
        isVip: false,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Hoffenheim's attacking efficiency at home is top-tier. Bremen's backline lacks the pace to track Kramaric's runs. Expect a high-scoring home win."
      },
      {
        match: "Sunderland AFC vs Manchester United",
        league: "Premier League",
        tip: "Away Win (2)",
        odds: "1.94",
        confidence: 80,
        isVip: false,
        time: "17:00 GMT",
        analysis: "Wogan's Take: United have a superior individual talent pool that usually shines through in these late games. Sunderland will be loud, but Man Utd's counter-attacking setup is lethal here."
      }
    ];
  }
}
