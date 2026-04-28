import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import { User, IUser } from "@/models/User";

async function getUserFromToken(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;

  const token = auth.split(" ")[1];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  await connectToDatabase();
  const userId = await getUserFromToken(req);
  if (!userId) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const user = await User.findById(userId).lean<IUser>();
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const userId = await getUserFromToken(req);
  if (!userId) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const body = await req.json();

  // 🔥 Calcul BMI serveur corrigé
  let bmi, bmiMessage;
  if (body.height && body.weight) {
    const heightInMeters = Number(body.height) / 100; // convertir cm -> m
    const weight = Number(body.weight);

    if (heightInMeters > 0) {
      bmi = parseFloat((weight / (heightInMeters ** 2)).toFixed(1));

      if (body.age) {
        const _age = Number(body.age);
        if (bmi < 18.5) bmiMessage = "Votre BMI est faible pour votre âge. Vous êtes mince.";
        else if (bmi >= 18.5 && bmi < 25) bmiMessage = "Votre BMI est harmonique pour votre âge. Poids normal.";
        else if (bmi >= 25 && bmi < 30) bmiMessage = "Votre BMI est élevé pour votre âge. Surpoids.";
        else bmiMessage = "Votre BMI est très élevé pour votre âge. Obésité.";
      }
    }
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { ...body, bmi, bmiMessage, profileCompleted: true },
    { new: true }
  );

  return NextResponse.json({
    message: "Profile updated successfully",
    user: updated
  });
}

