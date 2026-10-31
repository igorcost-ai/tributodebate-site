"use client";

import Link from "next/link";

export default function Perfil() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] w-full">
      
      {/* HEADER PADRÃO */}
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
            <Link href="/perfil" className="text-[#D6A84F] transition-colors">Sobre</Link>
          </nav>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        
        {/* CARTÃO DO PERFIL */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* CAPA AZUL (Sem imagem de fundo para não quebrar) */}
          <div className="h-40 bg-[#0A192F] w-full"></div>

          {/* CONTEÚDO DO CARTÃO */}
          <div className="px-6 sm:px-10 pb-10">
            
            {/* FOTO DE PERFIL (Estrutura simples, sem flexbox complicado) */}
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 shadow-md overflow-hidden -mt-20 mb-6 relative z-10">
              {/* COLOQUE A URL DA SUA FOTO AQUI */}
              <img 
                src="/minha-foto.png" 
                alt="Igor Costa" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* TEXTOS E INFORMAÇÕES */}
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#0A192F]">Igor Costa</h1>
              <p className="text-[#8A6118] font-semibold mt-1">Advogado | Gestor Governamental | Mestre em Ciência Política</p>
              
              {/* COLOQUE SUA OAB AQUI */}
              <p className="text-slate-500 text-sm mt-1">OAB/BA 31.466</p>
              
              <div className="mt-6 text-slate-700 leading-relaxed space-y-4">
                <p>
                  Sou advogado especializado em <strong>Direito Tributário</strong> e <strong>Reestruturação de Empresas</strong>, com atuação focada em <strong>Transação Tributária</strong> e resolução de passivos fiscais complexos.
                </p>
                <p>
                  Minha trajetória combina a prática jurídica com uma formação sólida em <strong>Políticas Públicas</strong>. Essa visão dupla me permite entender não apenas a letra fria da lei, mas como o Estado brasileiro realmente funciona na prática — desde a criação de um tributo até a sua cobrança e negociação.
                </p>
                <p>
                  Criei o <strong>TributoDebate</strong> para ser um espaço de análise séria e aprofundada, onde empresários e gestores possam compreender o cenário tributário e tomar decisões mais seguras para seus negócios.
                </p>
              </div>

              {/* ÁREAS DE ATUAÇÃO */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-[#0A192F] mb-3">Áreas de Atuação</h3>
                <div className="flex flex-wrap gap-2">
                  {["Transação Tributária", "Execução Fiscal",  "Reforma Tributária", "Consultoria Empresarial"].map((area) => (
                    <span key={area} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* BOTÕES DE CONTATO */}
              <div className="mt-10 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-[#0A192F] mb-4">Vamos conversar?</h3>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* COLOQUE SEU WHATSAPP AQUI */}
                  <a 
                    href="https://wa.me/5571997374956" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3 px-6 rounded-lg text-center transition-colors shadow-sm flex items-center justify-center"
                  >
                    Falar no WhatsApp
                  </a>
                  
                  {/* COLOQUE SEU EMAIL AQUI */}
                  <a 
                    href="mailto:igorcostadv@gmail.com" 
                    className="flex-1 bg-[#0A192F] hover:bg-[#112240] text-white font-bold py-3 px-6 rounded-lg text-center transition-colors shadow-sm flex items-center justify-center"
                  >
                    Enviar E-mail
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}