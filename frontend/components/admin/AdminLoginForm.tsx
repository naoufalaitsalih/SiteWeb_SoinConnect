"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";

const REMEMBER_KEY = "soinsconnect_admin_email";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    console.log("STEP 1 - Début login");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      console.log("STEP 2 - Réponse reçue", {
        status: res.status,
        ok: res.ok,
        statusText: res.statusText,
      });

      const rawBody = await res.text();
      let data: Record<string, unknown>;

      try {
        data = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
      } catch (parseError) {
        console.error("STEP 3 - Erreur parsing JSON", parseError, rawBody);
        setError("Réponse serveur invalide (JSON)");
        return;
      }

      console.log("STEP 3 - JSON reçu", data);

      if (!res.ok) {
        setError(
          typeof data.message === "string" ? data.message : "Connexion impossible"
        );
        return;
      }

      if (data.success !== true) {
        setError(
          typeof data.message === "string" ? data.message : "Connexion impossible"
        );
        return;
      }

      const token = data.token;
      const admin = data.admin ?? data.user;

      if (typeof token !== "string" || token.length === 0) {
        setError("TOKEN_MISSING_FROM_PROXY");
        return;
      }

      if (!admin || typeof admin !== "object") {
        setError("ADMIN_PROFILE_MISSING_FROM_PROXY");
        return;
      }

      console.log("STEP 4 - Sauvegarde token");
      localStorage.setItem("admin_token", token);

      console.log("STEP 5 - Sauvegarde admin");
      localStorage.setItem("admin", JSON.stringify(admin));

      if (remember) {
        localStorage.setItem(REMEMBER_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      console.log("STEP 6 - Avant redirection");
      router.replace("/admin/dashboard");

      // Navigation complète : garantit l'envoi du cookie httpOnly au middleware
      window.location.assign("/admin/dashboard");

      console.log("STEP 7 - Après redirection");
    } catch (error) {
      console.error("STEP ERROR - Exception capturée", error);
      setError(
        error instanceof Error ? error.message : "Erreur réseau. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[480px] rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.12)] sm:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Connexion Administrateur
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Accédez à votre espace sécurisé.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#4F6FFF] focus:ring-4 focus:ring-[#4F6FFF]/10"
            placeholder="admin@soinsconnect.ma"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pe-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#4F6FFF] focus:ring-4 focus:ring-[#4F6FFF]/10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 end-0 flex items-center px-4 text-slate-400 transition hover:text-slate-600"
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#4F6FFF] focus:ring-[#4F6FFF]/20"
          />
          <span className="text-sm text-slate-600">Se souvenir de moi</span>
        </label>

        {error && (
          <p
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F6FFF] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4F6FFF]/25 transition hover:bg-[#3B5BDB] focus:outline-none focus:ring-4 focus:ring-[#4F6FFF]/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connexion...
            </>
          ) : (
            "Se connecter"
          )}
        </button>

        <p className="flex items-center justify-center gap-2 pt-1 text-xs font-medium text-slate-500">
          <Shield className="h-4 w-4 text-[#4F6FFF]" strokeWidth={2} />
          Plateforme sécurisée
        </p>
      </form>
    </div>
  );
}
