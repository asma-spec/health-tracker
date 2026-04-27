"use client";

import { useEffect, useState } from "react";

interface Notification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  scheduledAt: string;
}

interface Props {
  userId: string;
}

export default function Notifications({ userId }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications", {
          headers: { "userId": userId },
        });
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Erreur récupération notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [userId]);

  if (loading) return <p className="text-gray-500">Chargement des notifications...</p>;
  if (!notifications.length) return <p className="text-gray-500">Aucune notification pour le moment.</p>;

  return (
    <div className="space-y-4">
      {notifications.map((notif) => (
        <div
          key={notif._id}
          className={`p-4 rounded-xl shadow-md border-l-4 ${
            notif.read ? "border-gray-300 bg-white" : "border-blue-500 bg-blue-50"
          }`}
        >
          <p className="text-gray-800 font-medium">{notif.message}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(notif.scheduledAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
