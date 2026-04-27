"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    // Appel de la route API qui supprime le cookie
    await fetch("/api/auth/logout", { method: "POST" });

    // Redirection vers /login
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg"
    >
      Déconnexion
    </button>
  );
}
