"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, Moon, Activity, HeartPulse } from "lucide-react";

interface DailyData {
  _id?: string;
  weight: string;
  bloodPressure: string;
  heartRate: string;
  sleep: string;
  activity: string;
  description: string;
  createdAt?: string;
}

interface Profile {
  targetWeight?: number;
  sleep?: number;
  activity?: number;
  profileCompleted?: boolean;
}

interface ObjectiveCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface HistoryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface StatCardProps {
  title: string;
  value: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);

  function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  const calculateProximity = (current: number, target: number) => {
    if (!current || !target) return 0;
    if (current <= target) return (current / target) * 100;
    else return (target / current) * 100;
  };

  useEffect(() => {
    async function fetchData() {
      const token = getToken();
      if (!token) return router.push("/login");

      try {
        const profileRes = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileJson = await profileRes.json();
        if (!profileJson.profileCompleted) return router.push("/profile");
        setProfile(profileJson);

        const historyRes = await fetch("/api/dailyData", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const historyJson = await historyRes.json();
        setHistory(historyJson);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  if (loading) return <p className="text-center text-gray-500 p-10">Chargement...</p>;

  const latestEntry = history.length > 0 ? history[0] : null;
  const weightProximity = latestEntry && profile?.targetWeight ? calculateProximity(Number(latestEntry.weight), profile.targetWeight) : null;
  const sleepProximity = latestEntry && profile?.sleep ? calculateProximity(Number(latestEntry.sleep), profile.sleep) : null;
  const activityProximity = latestEntry && profile?.activity ? calculateProximity(Number(latestEntry.activity), profile.activity) : null;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-50 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-green-800">Objectifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ObjectiveCard title="Poids cible" value={profile?.targetWeight ? `${profile.targetWeight} kg` : "—"} icon={<Scale size={28} />} />
          <ObjectiveCard title="Sommeil cible" value={profile?.sleep ? `${profile.sleep} h` : "—"} icon={<Moon size={28} />} />
          <ObjectiveCard title="Activité cible" value={profile?.activity ? `${profile.activity} min` : "—"} icon={<Activity size={28} />} />
        </div>
      </section>

      {latestEntry && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-green-800">Statistiques par rapport à l&apos;objectif (dernière entrée)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Poids" value={weightProximity ? `${weightProximity.toFixed(1)} %` : "—"} />
            <StatCard title="Sommeil" value={sleepProximity ? `${sleepProximity.toFixed(1)} %` : "—"} />
            <StatCard title="Activité" value={activityProximity ? `${activityProximity.toFixed(1)} %` : "—"} />
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-4 text-green-800">Historique quotidien</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-center">Aucune donnée quotidienne enregistrée.</p>
        ) : (
          <div className="space-y-4">
            {history
              .toSorted((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
              .map((entry) => (
                <div key={entry._id} className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-green-500">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">{new Date(entry.createdAt!).toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <HistoryCard title="Poids (kg)" value={entry.weight} icon={<Scale size={24} />} />
                    <HistoryCard title="Tension (mmHg)" value={entry.bloodPressure} icon={<HeartPulse size={24} />} />
                    <HistoryCard title="Fréquence cardiaque (bpm)" value={entry.heartRate} icon={<HeartPulse size={24} />} />
                    <HistoryCard title="Sommeil (h)" value={entry.sleep} icon={<Moon size={24} />} />
                    <HistoryCard title="Activité (min)" value={entry.activity} icon={<Activity size={24} />} />
                  </div>
                  {entry.description && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-700">{entry.description}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ObjectiveCard({ title, value, icon }: ObjectiveCardProps) {
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

function HistoryCard({ title, value, icon }: HistoryCardProps) {
  return (
    <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
      <div className="text-green-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="font-semibold">{value || "—"}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: StatCardProps) {
  const numericValue = Number(value?.replace("%", "")) || 0;
  let barColor = "bg-red-500";
  if (numericValue >= 90) barColor = "bg-green-500";
  else if (numericValue >= 70) barColor = "bg-yellow-400";

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-3 border-l-4 border-green-500">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-lg font-bold text-green-700">{value}</p>
      </div>
      <div className="w-full bg-gray-200 h-3 rounded-full">
        <div className={`${barColor} h-3 rounded-full`} style={{ width: `${Math.min(numericValue, 100)}%` }} />
      </div>
    </div>
  );
}