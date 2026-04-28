"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Bell, HeartPulse, Moon, Activity, Scale, Cpu } from "lucide-react";

interface DailyData {
  weight: string;
  bloodPressure: string;
  heartRate: string;
  sleep: string;
  activity: string;
  description: string;
}

interface AiResult {
  hypotheses: string;
  urgency: string;
  causes: string;
  advice: string;
  alerts: string;
}

interface Notification {
  message: string;
  type: "alerte" | "encouragement";
}

interface Profile {
  targetWeight?: number;
  sleep?: number;
  activity?: number;
  profileCompleted?: boolean;
}

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface InputCardProps {
  title: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}

interface ResultCardProps {
  title: string;
  content: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyData, setDailyData] = useState<DailyData>({
    weight: "",
    bloodPressure: "",
    heartRate: "",
    sleep: "",
    activity: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiResult | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  useEffect(() => {
    async function fetchProfile() {
      const token = getToken();
      if (!token) return router.push("/login");

      const res = await fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();

      if (!json.profileCompleted) return router.push("/profile");

      setProfile(json);
      setLoading(false);
    }
    fetchProfile();
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDailyData((prev) => ({ ...prev, [name]: value }));
  };

  const saveDailyData = async () => {
    const token = getToken();
    if (!token) return alert("Utilisateur non authentifié");

    try {
      const res = await fetch("/api/dailyData", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(dailyData),
      });
      if (!res.ok) throw new Error("Erreur sauvegarde");

      alert("Données quotidiennes enregistrées !");
      setDailyData({ weight: "", bloodPressure: "", heartRate: "", sleep: "", activity: "", description: "" });
      setAiAnalysis(null);

      const newNotifications: Notification[] = [];
      const bp = parseFloat(dailyData.bloodPressure);
      const weight = parseFloat(dailyData.weight);
      const sleep = parseFloat(dailyData.sleep);
      const activity = parseFloat(dailyData.activity);

      if (bp > 18) newNotifications.push({ type: "alerte", message: "⚠️ Attention : hypertension détectée !" });
      if (weight > 100) newNotifications.push({ type: "alerte", message: "⚠️ Attention : poids élevé (obésité) !" });
      if (sleep < 7) newNotifications.push({ type: "alerte", message: "⚠️ Sommeil insuffisant, essayez de dormir plus !" });
      if (activity < 30) newNotifications.push({ type: "encouragement", message: "💪 Faites plus d'activité physique aujourd'hui !" });

      setNotifications(newNotifications);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const analyzeWithAI = async () => {
    if (!dailyData.description.trim()) return alert("Veuillez saisir une description à analyser.");
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: dailyData.description }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Erreur IA");
      setAiAnalysis(parseAIResponse(json.analysis));
    } catch (err: unknown) {
      console.error("Erreur IA", err);
      alert("Erreur lors de l'analyse IA : " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setAnalyzing(false);
    }
  };

  const parseAIResponse = (text: string): AiResult => {
    const sections: AiResult = { hypotheses: "", urgency: "", causes: "", advice: "", alerts: "" };
    const regex = /1\.\s*([\s\S]*?)\s*2\.\s*([\s\S]*?)\s*3\.\s*([\s\S]*?)\s*4\.\s*([\s\S]*?)\s*5\.\s*([\s\S]*)/m;
    const match = text.match(regex);
    if (match) {
      sections.hypotheses = match[1].trim();
      sections.urgency = match[2].trim();
      sections.causes = match[3].trim();
      sections.advice = match[4].trim();
      sections.alerts = match[5].trim();
    } else {
      sections.hypotheses = text;
    }
    return sections;
  };

  if (loading) return <p className="text-center text-gray-500 p-10">Chargement...</p>;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-r from-green-100 via-green-50 to-green-100 min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-green-800">Objectifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Poids cible" value={profile?.targetWeight ? `${profile.targetWeight} kg` : "—"} icon={<Scale size={28} />} />
          <Card title="Sommeil cible" value={profile?.sleep ? `${profile.sleep} h` : "—"} icon={<Moon size={28} />} />
          <Card title="Activité cible" value={profile?.activity ? `${profile.activity} min` : "—"} icon={<Activity size={28} />} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-green-800">Vos données quotidiennes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputCard title="Poids (kg)" name="weight" value={dailyData.weight} onChange={handleChange} icon={<Scale size={28} />} />
          <InputCard title="Tension (mmHg)" name="bloodPressure" value={dailyData.bloodPressure} onChange={handleChange} icon={<HeartPulse size={28} />} />
          <InputCard title="Fréquence cardiaque (bpm)" name="heartRate" value={dailyData.heartRate} onChange={handleChange} icon={<HeartPulse size={28} />} />
          <InputCard title="Sommeil (h)" name="sleep" value={dailyData.sleep} onChange={handleChange} icon={<Moon size={28} />} />
          <InputCard title="Activité (min)" name="activity" value={dailyData.activity} onChange={handleChange} icon={<Activity size={28} />} />
        </div>

        <div className="mt-6 bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-2 text-green-700">Description</h3>
          <textarea
            name="description"
            value={dailyData.description}
            onChange={handleChange}
            placeholder="Ajoutez vos notes personnelles..."
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button onClick={saveDailyData} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg">
            Enregistrer
          </button>
          <button
            onClick={analyzeWithAI}
            disabled={analyzing || !dailyData.description.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Cpu size={20} /> {analyzing ? "Analyse en cours..." : "Analyser avec l'IA"}
          </button>
        </div>
      </section>

      {aiAnalysis && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Analyse IA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultCard title="Hypothèses possibles" content={aiAnalysis.hypotheses} />
            <ResultCard title="Niveau d&apos;urgence" content={aiAnalysis.urgency} />
            <ResultCard title="Causes fréquentes" content={aiAnalysis.causes} />
            <ResultCard title="Conseils pratiques" content={aiAnalysis.advice} />
            <ResultCard title="Signaux d&apos;alerte" content={aiAnalysis.alerts} />
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-red-600 flex items-center gap-2">
          <Bell size={24} /> Notifications
        </h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">Aucune notification</p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((notif, i) => (
              <li key={i} className={`p-3 rounded-md ${notif.type === "alerte" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                {notif.message}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Card({ title, value, icon }: CardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4 border-l-4 border-green-500">
      <div className="text-green-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function InputCard({ title, name, value, onChange, icon }: InputCardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-3 border-l-4 border-green-500">
      <div className="flex items-center gap-3">
        <div className="text-green-600">{icon}</div>
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-300"
      />
    </div>
  );
}

function ResultCard({ title, content }: ResultCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-blue-500">
      <h3 className="font-semibold text-lg mb-2 text-blue-700">{title}</h3>
      <p className="text-gray-700 whitespace-pre-line">{content}</p>
    </div>
  );
}