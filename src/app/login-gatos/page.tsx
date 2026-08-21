"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciais inválidas");
    } else {
      router.push("/painel-gatos");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#242424] px-4 text-gray-100" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-[#1a1a1a] p-8 shadow-2xl border-2 border-pink-400">
        <div>
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-dashed border-yellow-300">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-black tracking-widest uppercase text-pink-400">
            Mundo dos Gatos
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Painel de Administração
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-900/50 p-4 text-sm text-red-300 border border-red-500">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-xl bg-[#2a2a2a] border-2 border-gray-600 py-3 px-4 text-white placeholder:text-gray-500 focus:border-pink-400 focus:ring-0 sm:text-sm font-medium transition-colors"
                placeholder="Email de Acesso"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-xl bg-[#2a2a2a] border-2 border-gray-600 py-3 px-4 text-white placeholder:text-gray-500 focus:border-pink-400 focus:ring-0 sm:text-sm font-medium transition-colors"
                placeholder="Senha Secreta"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center items-center rounded-xl border-2 border-pink-500 bg-pink-400 px-4 py-3 text-lg font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(244,114,182,0.5)] hover:bg-pink-300 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(244,114,182,0.5)] active:translate-y-2 active:shadow-none transition-all"
            >
              Entrar 🐾
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
