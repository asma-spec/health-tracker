// lib/auth.ts
import jwt from "jsonwebtoken";

export function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.userId; // doit exister dans ton JWT
  } catch (error) {
    return null;
  }
}
