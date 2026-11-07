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
  
  // Estados do Modal de Pauta Manual
  const [modalAberto, setModalAberto] = useState(false);
  const [temaManual, setTemaManual] = useState("");
  const [contextoManual, setContextoManual] = useState("");
  const [salvandoManual, setSalvandoManual] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    buscarArtigos();
  }, [activeTenant, router]);

  const buscarArtigos = () => {
    setLoading(true);
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
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleGerarPautas = async () => {
    if (!confirm(`Deseja gerar 100 novas pautas via IA para o tenant ${activeTenant}?`)) return;
    setGerandoPautas(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/pipeline/pautas/gerar-lote/${activeTenant}?quantidade=100`, { method: "POST" });
      if (!res.ok) throw new Error("Erro ao gerar pautas");
      const data = await res.json();
      alert(`✅ Sucesso! ${data.quantidade} pautas adicionadas.`);
    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setGerandoPautas(false);
    }
  };

  const handleDeletarArtigo = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este artigo?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/artigos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.detail || "Erro ao deletar");
      }
      alert("Artigo deletado!");
      buscarArtigos();
    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    }
  };

  const handleSalvarPautaManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoManual(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/pipeline/pauta-manual/${activeTenant}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema: temaManual, contexto: contextoManual }),
      });
      if (!res.ok) throw new Error("Erro ao gerar pauta manual");
      
      alert("✅ Pauta manual criada! O pipeline está rodando em segundo plano.");
      setModalAberto(false);
      setTemaManual("");
      setContextoManual("");
      buscarArtigos();
    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setSalvandoManual(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col md:flex-row items-center justify-between border-b pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
            <p className="text-sm text-gray-500">Gerencie as análises e publicações</p>
          </div>
          
          <div className="flex items-center bg-gray-200 rounded-lg p-1">
            <button onClick={() => setActiveTenant("agro")} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTenant === "agro" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>AgroDebate</button>
            <button onClick={() => setActiveTenant("tributario")} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTenant === "tributario" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>TributoDebate</button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setModalAberto(true)} className="font-bold py-2 px-4 rounded-md text-sm shadow bg-blue-600 hover:bg-blue-700 text-white">
              ✍️ Pauta Manual
            </button>
            <button onClick={handleGerarPautas} disabled={gerandoPautas} className={`font-bold py-2 px-4 rounded-md text-sm shadow ${gerandoPautas ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700 text-white"}`}>
              {gerandoPautas ? "⏳ Gerando..." : "⚡ Gerar 100 Pautas"}
            </button>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline ml-2">Sair</button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-sm border-l-4 border-blue-500"><p className="text-sm text-gray-500">Notícias Coletadas</p><p className="text-2xl font-bold text-gray-900">-</p></div>
            <div className="rounded-lg bg-white p-6 shadow-sm border-l-4 border-yellow-500"><p className="text-sm text-gray-500">Aguardando Revisão</p><p className="text-2xl font-bold text-green-600">{artigos.filter(a => a.status !== "publicado").length}</p></div>
            <div className="rounded-lg bg-white p-6 shadow-sm border-l-4 border-green-500"><p className="text-sm text-gray-500">Publicados</p><p className="text-2xl font-bold text-gray-900">{artigos.filter(a => a.status === "publicado").length}</p></div>
            <div className="rounded-lg bg-white p-6 shadow-sm border-l-4 border-purple-500"><p className="text-sm text-gray-500">Custo IA (Mês)</p><p className="text-2xl font-bold text-gray-900">R$ 4,20</p></div>
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
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${artigo.status === "publicado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {artigo.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {artigo.status !== "publicado" && (
                      <button 
                        onClick={() => handleDeletarArtigo(artigo.id)}
                        className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-100 transition-colors"
                        title="Deletar artigo"
                      >
                        🗑️
                      </button>
                    )}
                    <Link href={`/dashboard/${artigo.id}`} className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-green-600">
                      Revisar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Criar Pauta Manual</h2>
            <form onSubmit={handleSalvarPautaManual}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tema (Título)</label>
                <input required type="text" value={temaManual} onChange={(e) => setTemaManual(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: O impacto da nova MP no setor de serviços" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contexto (Ângulo de análise)</label>
                <textarea required rows={3} value={contextoManual} onChange={(e) => setContextoManual(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="Explique o que deve ser abordado no artigo..." />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancelar</button>
                <button type="submit" disabled={salvandoManual} className={`px-4 py-2 rounded-md text-white font-medium ${salvandoManual ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}>
                  {salvandoManual ? "Criando..." : "Criar e Rodar Pipeline"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}