"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await fetch(`/api/notifications/get?userId=${userId}`);
        const json = await res.json();
        if (json.success) setNotifications(json.notifications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  if (loading) return <p className="text-center p-10">Chargement des notifications...</p>;
  if (notifications.length === 0) return <p className="text-center p-10">Aucune notification.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Bell /> Notifications
      </h1>
      <ul className="space-y-2">
        {notifications.map((notif) => (
          <li
            key={notif._id}
            className={`p-4 rounded-lg shadow-md ${
              notif.type === "alerte" ? "bg-red-100 border-l-4 border-red-500" : "bg-green-100 border-l-4 border-green-500"
            }`}
          >
            <p>{notif.message}</p>
            <p className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
