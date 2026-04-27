"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur de connexion");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      const profileRes = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      router.push(profileRes.status === 403 ? "/profile" : "/dashboard");
    } catch (err) {
      console.error(err);
      setError("Erreur serveur");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 transform transition-all hover:scale-105">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
          Connexion
        </h1>

        {error && (
          <p className="text-red-600 text-center font-medium mb-4 animate-pulse">
            {error}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition transform hover:scale-105"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm mt-5 text-gray-600">
          Pas de compte ?{" "}
          <Link href="/register" className="text-blue-600 font-semibold underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
