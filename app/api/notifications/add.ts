import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, type, message } = body;
    if (!userId || !type || !message)
      return new Response(JSON.stringify({ success: false, error: "Données manquantes" }), { status: 400 });

    const { db } = await connectToDatabase();
    await db.collection("notifications").insertOne({
      userId,
      type,
      message,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
