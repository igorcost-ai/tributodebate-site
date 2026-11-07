"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function BlogIndex() {
  const [artigos, setArtigos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/publico/tributario/artigos`)
      .then((res) => res.json())
      .then((data) => {
        setArtigos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const artigoDestaque = artigos.length > 0 ? artigos[0] : null;
  const outrosArtigos = artigos.length > 1 ? artigos.slice(1) : [];

  const fallbackImage = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen relative">
      {/* HEADER */}
      <header className="bg-[#0A192F] text-white py-4 px-8 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
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
            <Link href="/" className="text-[#D6A84F] transition-colors">Início</Link>
            <Link href="/" className="hover:text-[#D6A84F] transition-colors">Artigos</Link>
            <Link href="/" className="hover:text-[#D6A84F] transition-colors">Categorias</Link>
            <Link href="/perfil" className="hover:text-[#D6A84F] transition-colors">Sobre</Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <input type="text" placeholder="Buscar no site..." className="bg-[#112240] text-sm text-white px-4 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-[#D6A84F]" />
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-[#D6A84F] transition-colors whitespace-nowrap">
              Área Restrita
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            {loading ? (
              <div className="text-center text-slate-500 py-20">Carregando artigos...</div>
            ) : artigos.length === 0 ? (
              <div className="text-center text-slate-500 py-20 bg-white/95 rounded-xl border border-slate-200 shadow-lg">Nenhum artigo publicado ainda.</div>
            ) : (
              <>
                {artigoDestaque && (
                  <article className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200 overflow-hidden group">
                    <Link href={`/blog/${artigoDestaque.slug}`}>
                      <div className="w-full h-80 bg-slate-200 overflow-hidden">
                        <img 
                          src={artigoDestaque.imagem_url || fallbackImage} 
                          alt={artigoDestaque.titulo} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-8">
                        <div className="text-xs font-bold text-[#D6A84F] uppercase tracking-wider mb-3">
                          {artigoDestaque.categoria || "Destaque"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0A192F] group-hover:text-[#8A6118] transition-colors mb-4 leading-tight">
                          {artigoDestaque.titulo}
                        </h2>
                        <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                          {artigoDestaque.meta_description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
                          <span>📅 {new Date(artigoDestaque.created_at).toLocaleDateString('pt-BR')}</span>
                          <span>⏱️ 8 min de leitura</span>
                          <span className="flex items-center"><span className="mr-1">👤</span> Por Igor Costa</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {artigoDestaque.tags ? artigoDestaque.tags.split(",").map((tag: string, i: number) => (
                            <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                              {tag.trim()}
                            </span>
                          )) : null}
                        </div>
                      </div>
                    </Link>
                  </article>
                )}

                <div className="space-y-6">
                  {outrosArtigos.map((artigo) => (
                    <article key={artigo.id} className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 group flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3 h-48 md:h-auto bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={artigo.imagem_url || fallbackImage} 
                          alt={artigo.titulo} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-xs font-bold text-[#D6A84F] uppercase tracking-wider mb-2">
                          {artigo.categoria || "Tributação"}
                        </div>
                        <Link href={`/blog/${artigo.slug}`}>
                          <h3 className="text-2xl font-serif font-bold text-[#0A192F] group-hover:text-[#8A6118] transition-colors mb-2 leading-tight">
                            {artigo.titulo}
                          </h3>
                        </Link>
                        <p className="text-slate-600 mb-4 line-clamp-2">{artigo.meta_description}</p>
                        <div className="flex items-center text-xs text-slate-500 mt-auto">
                          <span>{new Date(artigo.created_at).toLocaleDateString('pt-BR')}</span>
                          <span className="mx-2">•</span>
                          <span>Por Igor Costa</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="font-serif font-bold text-[#0A192F] text-lg mb-4 border-b pb-2">Últimos artigos</h3>
              <div className="space-y-4">
                {artigos.slice(0, 3).map((artigo, index) => (
                  <div key={index} className="flex space-x-3 group cursor-pointer">
                    <div className="w-16 h-16 bg-[#0A192F] rounded flex-shrink-0 overflow-hidden flex items-center justify-center text-[#D6A84F]">
                      📄
                    </div>
                    <div>
                      <Link href={`/blog/${artigo.slug}`}>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#8A6118] leading-tight mb-1 line-clamp-2">
                          {artigo.titulo}
                        </h4>
                      </Link>
                      <span className="text-xs text-slate-400">{new Date(artigo.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="font-serif font-bold text-[#0A192F] text-lg mb-4 border-b pb-2">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {["Tributação", "Legislação", "Economia", "Políticas públicas", "Jurisprudência"].map((cat) => (
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