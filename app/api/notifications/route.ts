import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function POST(req: Request) {
  await connectToDatabase();

  const { userId, type, message } = await req.json();

  if (!userId || !type || !message) {
    return NextResponse.json({ success: false, message: "Données manquantes" }, { status: 400 });
  }

  const notification = await Notification.create({ userId, type, message });
  return NextResponse.json({ success: true, notification });
}
