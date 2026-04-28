import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return new Response(JSON.stringify({ success: false, error: "UserId manquant" }), { status: 400 });

    await connectToDatabase();
    const db = mongoose.connection.db;
    const notifications = await db!
      .collection("notifications")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return new Response(JSON.stringify({ success: true, notifications }));
  } catch (err: unknown) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Erreur" }), { status: 500 });
  }
}