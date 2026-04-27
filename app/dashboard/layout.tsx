// app/dashboard/layout.tsx
import Link from "next/link";
import "../globals.css";
import LogoutButton from "../components/LogoutButton";

import { Bell, User, History } from "lucide-react"; // Icônes

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">Health App</h2>

        <nav className="space-y-4">

          {/* Dashboard */}
          <a 
            href="/dashboard" 
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            {/* Icône Dashboard simplifiée (emoji pour style clean) */}
            <span className="text-lg">📊</span>
            Dashboard
          </a>

          {/* Profil */}
          <a 
            href="/profile" 
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <User size={18} />
            Profil
          </a>

          {/* Historique */}
          <a 
            href="/history" 
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <History size={18} />
            Historique
          </a>

        

        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">

        {/* Top bar */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>

          {/* Déconnexion */}
          <LogoutButton />
        </header>

        {/* Page content */}
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}
