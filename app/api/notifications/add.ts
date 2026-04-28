import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, type, message } = body;
    if (!userId || !type || !message)
      return new Response(JSON.stringify({ success: false, error: "Données manquantes" }), { status: 400 });

    await connectToDatabase();
    const db = mongoose.connection.db;
    await db!.collection("notifications").insertOne({
      userId,
      type,
      message,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (err: unknown) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Erreur" }), { status: 500 });
  }
}