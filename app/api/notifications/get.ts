import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return new Response(JSON.stringify({ success: false, error: "UserId manquant" }), { status: 400 });

    const { db } = await connectToDatabase();
    const notifications = await db
      .collection("notifications")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return new Response(JSON.stringify({ success: true, notifications }));
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
