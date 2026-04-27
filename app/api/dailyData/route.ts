// app/api/dailyData/route.ts
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { DailyData } from "@/models/DailyData";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

// Fonction pour calculer la proximité
function calculateProximity(current: number, target: number) {
  if (!current || !target) return 0;
  if (current <= target) return (current / target) * 100;
  else return (target / current) * 100;
}

// ------------ POST : Ajouter une nouvelle donnée quotidienne ------------
export async function POST(req: Request) {
  await connectToDatabase();

  const userId = await getUserFromToken(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  try {
    const entry = await DailyData.create({
      userId,
      ...body,
      date: new Date(),
    });

    return NextResponse.json({ message: "Saved", entry }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error saving data" }, { status: 500 });
  }
}

// ------------ GET : Récupérer l’historique des données avec pourcentage de proximité ------------
export async function GET(req: Request) {
  await connectToDatabase();

  const userId = await getUserFromToken(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Récupérer l'utilisateur pour avoir les objectifs
    const user = await User.findById(userId).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Récupérer toutes les données quotidiennes
    const data = await DailyData.find({ userId }).sort({ date: -1 }).lean();

    // Calculer la proximité pour chaque donnée
    const dataWithProximity = data.map((entry) => ({
      ...entry,
      weightProximity: user.targetWeight ? calculateProximity(entry.weight, user.targetWeight) : null,
      sleepProximity: user.sleep ? calculateProximity(entry.sleep, user.sleep) : null,
      activityProximity: user.activity ? calculateProximity(entry.activity, user.activity) : null,
    }));

    return NextResponse.json(dataWithProximity, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
