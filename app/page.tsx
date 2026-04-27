// app/page.tsx
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* === Background Image FULL HD === */}
      <Image
        src="/baw.png"
        alt="Healthy lifestyle"
        fill
        priority
        quality={100}
        unoptimized
        className="object-cover object-center"
      />

      {/* === Dark overlay for readability === */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* === NAVBAR === */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-12 py-6 z-30">
        <h1 className="text-white font-extrabold text-3xl drop-shadow-lg tracking-wide">
          Health App
        </h1>

        <div className="flex gap-4">
          <a
            href="/register"
            className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            S’inscrire
          </a>

          <a
            href="/login"
            className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Connexion
          </a>
        </div>
      </header>

      {/* === TEXT OVERLAY === */}
      <div className="absolute inset-0 flex items-center px-20 z-20">
        <div className="max-w-3xl">
          <h2 className="text-white text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]">
            Suivez votre santé,<br />
            analysez vos habitudes,<br />
            améliorez votre bien-être.
          </h2>

          <p className="text-white mt-6 text-xl drop-shadow-[0_3px_5px_rgba(0,0,0,0.6)]">
            Une application intelligente qui vous aide à suivre vos mesures
            et à comprendre vos symptômes grâce à l’IA.
          </p>
        </div>
      </div>
    </div>
  );
}
