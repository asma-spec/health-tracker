import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json();
    if (!symptoms || symptoms.trim() === "") {
      return NextResponse.json({ success: false, error: "Le champ 'symptoms' est requis." }, { status: 400 });
    }

    const prompt = `
Tu es un assistant médical prudent. Tu n'établis jamais de diagnostic précis.
Analyse les données suivantes :
"${symptoms}"

Réponds avec les sections suivantes numérotées :
1. Hypothèses possibles
2. Niveau d'urgence (faible / modéré / élevé)
3. Causes fréquentes possibles
4. Conseils pratiques (sans médicaments)
5. Signaux d'alerte nécessitant une consultation médicale

Réponds en français, clair et complet.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "Tu es un assistant médical prudent et professionnel." },
        { role: "user", content: prompt },
      ],
      max_tokens: 1200,
      temperature: 0.4,
    });

    const response = completion?.choices?.[0]?.message?.content || "";

    return NextResponse.json({ success: true, analysis: response });
  } catch (err: any) {
    console.error("❌ AI Error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Erreur interne du serveur." }, { status: 500 });
  }
}
