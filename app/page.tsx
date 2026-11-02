"use client";

import { useState, useEffect } from "react"; // Adicionado o useEffect
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  // NOVO: Verifica se o usuário já está logado ao abrir a página
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard"); // Se tem crachá, entra direto
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    
    try {
      // Chama a rota de login do backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`, {
        method: "POST",
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token); // Salva o crachá (token)
        router.push("/dashboard"); // Entra no painel
      } else {
        setErro("E-mail ou senha incorretos.");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">TributoDebate</h1>
          <p className="mt-2 text-sm text-gray-600">Acesso restrito ao Painel</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="admin@tributodebate.com.br"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}