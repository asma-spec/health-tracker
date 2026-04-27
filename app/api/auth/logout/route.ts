import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Déconnecté avec succès" });

  // Supprimer le cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0
  });

  return response;
}
