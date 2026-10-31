"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

function ReviewContent() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("blog");
  const [artigo, setArtigo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [publicando, setPublicando] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/artigos/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}: Artigo não encontrado.`);
        return res.json();
      })
      .then((data) => {
        setArtigo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErro(err.message);
        setLoading(false);
      });
  }, [params.id]);

  const handleAprovar = async () => {
    if (!artigo) return;
    setPublicando(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/artigos/${artigo.id}/aprovar`, {
        method: "POST",
      });

      if (res.ok) {
        alert("Artigo aprovado e publicado no Telegram!");
        setArtigo({ ...artigo, status: "publicado" });
      } else {
        alert("Erro ao aprovar o artigo no backend.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o backend.");
    } finally {
      setPublicando(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Buscando artigo...</div>;
  if (erro) return <div className="p-8 text-center text-red-500 font-bold">{erro}</div>;
  if (!artigo) return <div className="p-8 text-center text-red-500">Artigo não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 font-medium">
            ← Voltar
          </Link>
          <span className="text-gray-300">|</span>
          <span className="font-semibold text-gray-900">Revisão de Artigo</span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              artigo.status === "publicado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}>
            {artigo.status.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAprovar}
            disabled={artigo.status === "publicado" || publicando}
            className={`px-6 py-2 rounded-md font-medium text-white shadow-sm transition-colors ${
              artigo.status === "publicado" || publicando
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {publicando
              ? "Publicando..."
              : artigo.status === "publicado"
              ? "Publicado"
              : "Aprovar e Publicar"}
          </button>
        </div>
      </header>

      {/* O SEGREDO ESTÁ AQUI: O grid dividido em 3 colunas */}
      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda (2/3 da tela): Texto Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{artigo.titulo}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              <span>{new Date(artigo.created_at).toLocaleDateString("pt-BR")}</span>
            </div>

            <div className="flex space-x-4 mb-4 border-b">
              <button
                onClick={() => setActiveTab("blog")}
                className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "blog" ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Texto do Blog
              </button>
              <button
                onClick={() => setActiveTab("telegram")}
                className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "telegram" ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Resumo do Telegram
              </button>
            </div>

            {/* Renderização do Markdown */}
            <div className="prose prose-green max-w-none text-gray-800">
              {activeTab === "blog" ? (
                <ReactMarkdown>{artigo.conteudo_blog}</ReactMarkdown>
              ) : (
                <ReactMarkdown>{artigo.conteudo_telegram}</ReactMarkdown>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita (1/3 da tela): Metadados de SEO e GEO */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-blue-500 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              🚀 Otimização (SEO & GEO)
            </h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700 block mb-1">Slug (URL)</span>
                <code className="bg-gray-100 p-1 rounded text-blue-600 break-all block">
                  /blog/{artigo.slug || "pendente"}
                </code>
              </div>

              <div>
                <span className="font-semibold text-gray-700 block mb-1">Meta Description (Google)</span>
                <p className="text-gray-600 bg-gray-50 p-2 rounded">
                  {artigo.meta_description || "Não gerada."}
                </p>
              </div>

              <div>
                <span className="font-semibold text-gray-700 block mb-1">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {artigo.tags ? artigo.tags.split(",").map((tag: string, i: number) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {tag.trim()}
                    </span>
                  )) : "Nenhuma tag."}
                </div>
              </div>

              <div>
                <span className="font-semibold text-gray-700 block mb-1">Resumo para IAs (GEO)</span>
                <p className="text-gray-600 bg-gray-50 p-2 rounded italic text-xs leading-relaxed">
                  "{artigo.resumo_ia || "Não gerado."}"
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Carregando painel...</div>}>
      <ReviewContent />
    </Suspense>
  );
}