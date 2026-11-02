"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [artigos, setArtigos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTenant, setActiveTenant] = useState("tributario");
  const [gerandoPautas, setGerandoPautas] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Ajustado para /login
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/artigos?tenant=${activeTenant}`)
      .then((res) => res.json())
      .then((data) => {
        setArtigos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar artigos:", err);
        setLoading(false);
      });
  }, [activeTenant, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login"); // Ajustado para /login
  };

  const handleGerarPautas = async () => {
    if (!confirm(`Deseja gerar 100 novas pautas via IA para o tenant ${activeTenant}? Isso pode levar alguns minutos.`)) return;
    
    setGerandoPautas(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/pipeline/pautas/gerar-lote/${activeTenant}?quantidade=100`, {
        method: "POST",
      });
      
      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.detail || "Erro ao gerar pautas");
      }
      
      const data = await res.json();
      alert(`✅ Sucesso! ${data.quantidade} pautas foram adicionadas ao banco.`);
    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setGerandoPautas(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
            <p className="text-sm text-gray-500">Gerencie as análises e publicações</p>
          </div>
          
          <div className="flex items-center bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setActiveTenant("agro")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTenant === "agro" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
            >
              AgroDebate
            </button>
            <button
              onClick={() => setActiveTenant("tributario")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTenant === "tributario" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
            >
              TributoDebate
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={handleGerarPautas}
              disabled={gerandoPautas}
              className={`font-bold py-2 px-4 rounded-md text-sm shadow transition-colors ${
                gerandoPautas 
                  ? "bg-gray-400 text-white cursor-not-allowed" 
                  : "bg-yellow-600 hover:bg-yellow-700 text-white"
              }`}
            >
              {gerandoPautas ? "⏳ Gerando..." : "⚡ Gerar 100 Pautas"}
            </button>

            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
              Sair
            </button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Notícias Coletadas</p>
            <p className="text-2xl font-bold text-gray-900">-</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Aguardando Revisão</p>
            <p className="text-2xl font-bold text-green-600">
              {artigos.filter(a => a.status !== "publicado").length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Publicados</p>
            <p className="text-2xl font-bold text-gray-900">
              {artigos.filter(a => a.status === "publicado").length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Custo IA (Mês)</p>
            <p className="text-2xl font-bold text-gray-900">R$ 4,20</p>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Artigos Recentes ({activeTenant})</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando artigos...</div>
          ) : artigos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhum artigo gerado ainda.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {artigos.map((artigo) => (
                <li key={artigo.id} className="flex items-center justify-between p-6 hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-900">{artigo.titulo}</h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{new Date(artigo.created_at).toLocaleDateString('pt-BR')}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        artigo.status === "publicado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {artigo.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/${artigo.id}`}
                    className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-green-600"
                  >
                    Revisar
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}