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
        confidence: 94,
        isVip: true,
        time: "14:30 GMT",
        analysis: "Wogan's Take: Anfield is rocking for this early kick-off. Liverpool's high line might be risky, but their attacking firepower coached by Slot is currently outclassing Chelsea's transition defense. Banker."
      },
      {
        match: "Middlesbrough FC vs Southampton FC",
        league: "Championship",
        tip: "Draw (X)",
        odds: "3.31",
        confidence: 72,
        isVip: true,
        time: "14:30 GMT",
        analysis: "Wogan's Take: Two technically gifted sides that often cancel each other out. Middlesbrough are strong at home, but Southampton's possession-based game makes them hard to beat. I smell a cagey stalemate."
      },
      {
        match: "Elche CF vs Deportivo Alaves",
        league: "LaLiga",
        tip: "Home Win (1)",
        odds: "2.26",
        confidence: 86,
        isVip: true,
        time: "15:00 GMT",
        analysis: "Wogan's Take: Elche's defensive solidity is underrated. Alaves struggle for goals on the road. The '1' at over evens is value that my algorithm can't ignore today. 1-0 or 2-0."
      },
      {
        match: "Cagliari Calcio vs Udinese Calcio",
        league: "Serie A",
        tip: "Away Win (2)",
        odds: "2.94",
        confidence: 68,
        isVip: true,
        time: "16:00 GMT",
        analysis: "Wogan's Take: Udinese have more quality in the final third. Cagliari will be compact, but one moment of magic from Lucca or Samardzic could decide this low-scoring affair."
      },
      {
        match: "RB Leipzig vs FC St. Pauli",
        league: "Bundesliga",
        tip: "Home Win (1)",
        odds: "1.28",
        confidence: 97,
        isVip: false,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Complete mismatch in transition speed. Leipzig will exploit the gaps St. Pauli leaves when they push up. This is a banker for any accumulator today."
      },
      {
        match: "VfB Stuttgart vs Bayer Leverkusen",
        league: "Bundesliga",
        tip: "Away Win (2)",
        odds: "2.90",
        confidence: 81,
        isVip: true,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Champions' mentality. Leverkusen find ways to win even when played off the park. Stuttgart are elite, but Xabi Alonso has the tactical edge in mid-game adjustments."
      },
      {
        match: "FC Augsburg vs Borussia Monchengladbach",
        league: "Bundesliga",
        tip: "Home Win (1)",
        odds: "2.06",
        confidence: 84,
        isVip: false,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Augsburg's home atmosphere is toxic for visitors. Gladbach's away record is abysmal lately. The home win at 2.06 is the smart money choice."
      },
      {
        match: "TSG Hoffenheim vs Werder Bremen",
        league: "Bundesliga",
        tip: "Home Win (1)",
        odds: "1.47",
        confidence: 90,
        isVip: false,
        time: "16:30 GMT",
        analysis: "Wogan's Take: Hoffenheim are clinical at the PreZero Arena. Werder Bremen have a leaky defense that struggles against aerial threats. Expect multiple home goals here."
      },
      {
        match: "Sunderland AFC vs Manchester United",
        league: "Premier League",
        tip: "Away Win (2)",
        odds: "1.94",
        confidence: 79,
        isVip: false,
        time: "17:00 GMT",
        analysis: "Wogan's Take: United's individual quality usually shines in these 'trap' games. Sunderland will be brave, but Bruno Fernandes and Hojlund will have too much space on the counter."
      },
      {
        match: "Arsenal vs Tottenham Hotspur",
        league: "Premier League",
        tip: "Home Win (1)",
        odds: "1.75",
        confidence: 82,
        isVip: false,
        time: "16:30 GMT",
        analysis: "Wogan's Take: North London is Red today. Arsenal's tactical discipline in big derbies is far superior to Spurs' 'gung-ho' approach under Postecoglou."
      },
      {
        match: "Real Madrid vs FC Barcelona",
        league: "LaLiga",
        tip: "Home Win (1)",
        odds: "2.15",
        confidence: 88,
        isVip: true,
        time: "20:00 GMT",
        analysis: "Wogan's Take: El Clasico under the lights. Madrid's experience in these high-stakes moments is legendary. Bellingham to score and provide the difference."
      },
      {
        match: "Juventus vs AS Roma",
        league: "Serie A",
        tip: "Home Win (1)",
        odds: "1.80",
        confidence: 85,
        isVip: false,
        time: "19:45 GMT",
        analysis: "Wogan's Take: Allegri-style grind. Juventus will sit deep and frustrate Roma before nicking one on a set-piece. Solid 1-0 potential here."
      }
    ];
  }
}
