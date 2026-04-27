
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const publicRoutes = ["/login", "/register", "/"];

  // Si route publique → laisser passer
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Si pas de token → rediriger vers /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si token existe, laisser passer
  // La vérification JWT sera faite dans chaque page protégée
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/profile",
    "/historique",
  ],
};
