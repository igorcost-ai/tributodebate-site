"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

function ArticleContent() {
  const params = useParams();
  const [artigo, setArtigo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!params.slug) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/publico/tributario/artigos/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Artigo não encontrado");
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
  }, [params.slug]);

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando artigo...</div>;
  if (erro) return <div className="p-8 text-center text-red-600">{erro}</div>;
  if (!artigo) return <div className="p-8 text-center text-red-600">Artigo não encontrado.</div>;

  const fallbackImage = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen relative">
      {/* HEADER */}
      <header className="bg-[#0A192F] text-white py-4 px-8 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/blog" className="flex items-center space-x-3 group">
            <img src="/logo-icon.png" alt="TributoDebate" className="h-12 w-auto object-contain drop-shadow-md rounded-sm" />
            <div>
              <span className="text-2xl font-serif font-bold tracking-tight block leading-none">
                <span className="text-white">Tributo</span>
                <span className="text-[#D6A84F]">Debate</span>
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest block mt-1">
                Informação estratégica para o seu negócio
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-300">
            <Link href="/blog" className="hover:text-[#D6A84F] transition-colors">Início</Link>
            <Link href="/blog" className="hover:text-[#D6A84F] transition-colors">Artigos</Link>
            <Link href="/blog" className="hover:text-[#D6A84F] transition-colors">Categorias</Link>
            <Link href="/perfil" className="hover:text-[#D6A84F] transition-colors">Sobre</Link>
          </nav>
          <div className="hidden md:block">
            <input type="text" placeholder="Buscar no site..." className="bg-[#112240] text-sm text-white px-4 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-[#D6A84F]" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-8">
        <div className="text-xs text-slate-500 mb-6 flex items-center space-x-2">
          <Link href="/blog" className="hover:text-[#8A6118]">Início</Link>
          <span>/</span>
          <span>Artigos</span>
          <span>/</span>
          <span className="text-[#8A6118] font-medium">{artigo.categoria || "Tributação"}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <article className="lg:col-span-8 bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-xl shadow-xl border border-slate-200">
            
            <div className="text-xs font-bold text-[#D6A84F] uppercase tracking-wider mb-3">
              {artigo.categoria || "Tributação"}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0A192F] mb-4 leading-tight">
              {artigo.titulo}
            </h1>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              {artigo.meta_description}
            </p>

            <div className="flex items-center space-x-4 text-xs text-slate-500 mb-8 pb-6 border-b border-slate-200">
              <span>📅 {new Date(artigo.created_at).toLocaleDateString('pt-BR')}</span>
              <span>⏱️ 8 min de leitura</span>
              <Link href="/perfil" className="flex items-center hover:text-[#8A6118] transition-colors">
                <span className="mr-2">👤</span>
                <span className="mr-1">Por</span>
                <strong>Igor Costa</strong>
              </Link>
            </div>

            <div className="w-full h-80 bg-slate-200 rounded-lg mb-8 overflow-hidden">
              <img 
                src={artigo.imagem_url || fallbackImage} 
                alt="Imagem de capa" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {artigo.tags ? artigo.tags.split(",").map((tag: string, i: number) => (
                <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                  {tag.trim()}
                </span>
              )) : null}
            </div>

            <div className="prose prose-lg prose-slate max-w-none text-slate-700 prose-headings:font-serif prose-headings:text-[#0A192F] prose-a:text-[#8A6118]">
              <ReactMarkdown>{artigo.conteudo_blog}</ReactMarkdown>
            </div>
          </article>

          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="font-serif font-bold text-[#0A192F] text-lg mb-4 border-b pb-2">Últimos artigos</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex space-x-3 group cursor-pointer">
                    <div className="w-16 h-16 bg-[#0A192F] rounded flex-shrink-0 overflow-hidden flex items-center justify-center text-[#D6A84F]">
                      📄
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#8A6118] leading-tight mb-1">
                        Análise de impacto da nova reforma para o setor produtivo
                      </h4>
                      <span className="text-xs text-slate-400">15 de outubro de 2025</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="font-serif font-bold text-[#0A192F] text-lg mb-4 border-b pb-2">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {artigo.categoria ? (
                  <span className="bg-[#D6A84F] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                    {artigo.categoria}
                  </span>
                ) : null}
                {["Legislação", "Economia", "Políticas Públicas"].map((cat) => (
                  <span key={cat} className="bg-slate-100 hover:bg-[#D6A84F] hover:text-white text-slate-600 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#0A192F] p-6 rounded-xl shadow-lg border border-slate-800 text-white text-center">
              <h3 className="font-serif font-bold text-[#D6A84F] text-xl mb-2">Fique por dentro</h3>
              <p className="text-slate-400 text-sm mb-6">Receba análises exclusivas e alertas de novas teses tributárias diretamente no seu celular.</p>
              <a href="https://t.me/seu_canal_aqui" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-[#D6A84F] hover:bg-[#C2963A] text-[#0A192F] font-bold py-3 px-4 rounded-md transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.688 17.097c-.197.558-.97.872-1.544.583l-4.307-2.154-2.287 2.457c-.252.27-.65.278-.91.016l-1.638-1.636c-.26-.258-.252-.658.016-.908l2.457-2.287-2.154-4.307c-.29-.575.024-1.347.583-1.544l9.747-3.445c.505-.178 1.015.332.837.837l-3.445 9.747z"/></svg>
                Entrar no Canal do Telegram
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Carregando...</div>}>
      <ArticleContent />
    </Suspense>
  );
}