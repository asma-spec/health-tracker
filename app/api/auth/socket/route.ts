import { NextResponse } from "next/server";
import { Server, Socket } from "socket.io";

let io: Server | null = null;

export function GET() {
  if (!io) {
    io = new Server(3001, {
      cors: { origin: "*" },
    });

    io.on("connection", (socket: Socket) => {
      console.log("Client connecté :", socket.id);

      // Exemple : envoyer une notif toutes les 5 sec
      setInterval(() => {
        socket.emit("notification", "Nouvelle notification !");
      }, 5000);
    });
  }

  return NextResponse.json({ status: "Socket server running" });
}
