"use client";

import { useState, useEffect, ChangeEvent } from "react";

export default function ProfilePage() {
  const [data, setData] = useState({
    age: "",
    sex: "",
    height: "",
    weight: "",
    targetWeight: "",
    sleep: "",
    activity: "",
    image: "",
    bmi: "",
    bmiMessage: "",
  });

  const [uploading, setUploading] = useState(false);

  function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const user = await res.json();
        setData({
          age: user.age || "",
          sex: user.sex || "",
          height: user.height || "",
          weight: user.weight || "",
          targetWeight: user.targetWeight || "",
          sleep: user.sleep || "",
          activity: user.activity || "",
          image: user.image || "",
          bmi: user.bmi || "",
          bmiMessage: user.bmiMessage || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };

    if (newData.height && newData.weight) {
      const heightInMeters = Number(newData.height) / 100;
      const weight = Number(newData.weight);
      if (heightInMeters > 0) {
        const bmi = parseFloat((weight / (heightInMeters ** 2)).toFixed(1));
        let bmiMessage = "";
        if (newData.age) {
          const age = Number(newData.age);
          if (bmi < 18.5) bmiMessage = "Votre BMI est faible pour votre âge. Vous êtes mince.";
          else if (bmi >= 18.5 && bmi < 25) bmiMessage = "Votre BMI est harmonique pour votre âge. Poids normal.";
          else if (bmi >= 25 && bmi < 30) bmiMessage = "Votre BMI est élevé pour votre âge. Surpoids.";
          else bmiMessage = "Votre BMI est très élevé pour votre âge. Obésité.";
        }
        newData.bmi = bmi.toFixed(1);
        newData.bmiMessage = bmiMessage;
      }
    }

    setData(newData);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const { url } = await res.json();
          setData((prev) => ({ ...prev, image: url }));
        } else {
          const fakeUrl = URL.createObjectURL(file);
          setData((prev) => ({ ...prev, image: fakeUrl }));
        }
      } catch (err) {
        console.error(err);
        const fakeUrl = URL.createObjectURL(file);
        setData((prev) => ({ ...prev, image: fakeUrl }));
      } finally {
        setUploading(false);
      }
    }
  };

  const saveData = async () => {
    try {
      const token = getToken();
      if (!token) { alert("Utilisateur non authentifié"); return; }

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Save failed");
      alert("Profil sauvegardé avec succès!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde du profil");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-50 flex justify-center items-start p-6">
      <div className="w-full max-w-4xl bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-200">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <img
              src={data.image || "/default-avatar.png"}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              alt="Profile"
            />
            <label className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all">
              📷
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
            </label>
          </div>
          {uploading && <p className="text-sm text-green-600 mt-2">Uploading...</p>}
          <h1 className="text-3xl font-bold mt-5 text-gray-800">Profil Utilisateur</h1>
          <p className="text-gray-500 mt-1">Gérez vos informations personnelles</p>
        </div>

        {/* Formulaire */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Âge</label>
              <input name="age" type="number" value={data.age} onChange={handleChange} placeholder="Votre âge" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none" />
            </div>
            <div>
              <label className="font-semibold">Genre</label>
              <select name="sex" value={data.sex} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none">
                <option value="">Sélectionner</option>
                <option value="Male">Homme</option>
                <option value="Female">Femme</option>
                <option value="Other">Autre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Taille (cm)</label>
              <input name="height" type="number" value={data.height} onChange={handleChange} placeholder="Votre taille" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none" />
            </div>
            <div>
              <label className="font-semibold">Poids (kg)</label>
              <input name="weight" type="number" value={data.weight} onChange={handleChange} placeholder="Votre poids" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl shadow-inner text-center">
            <p className="font-semibold text-lg">BMI : <span className="text-green-700">{data.bmi}</span></p>
            <p className="text-gray-700 mt-1">{data.bmiMessage}</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">Objectifs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Poids cible</label>
              <input name="targetWeight" type="number" value={data.targetWeight} onChange={handleChange} placeholder="Poids souhaité" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none" />
            </div>
            <div>
              <label className="font-semibold">Sommeil / jour (heures)</label>
              <input name="sleep" type="number" value={data.sleep} onChange={handleChange} placeholder="Heures de sommeil" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none" />
            </div>
          </div>
          <div>
            <label className="font-semibold">Activité / semaine (minutes)</label>
            <input name="activity" type="number" value={data.activity} onChange={handleChange} placeholder="Minutes d’activité" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none" />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={saveData} className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-300">
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
