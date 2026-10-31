import React from "react";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#F8F9FA] overflow-x-hidden">
      
      {/* --- FUNDO COM IMAGENS (Opacidade em 15% para você ver) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* Mapa no Centro */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.15]">
          <img src="/bg-mapa.png" alt="Mapa" className="w-[800px] object-contain" />
        </div>

        {/* Colunas na Esquerda */}
        <div className="absolute top-20 -left-20 opacity-[0.15]">
          <img src="/bg-colunas.png" alt="Colunas" className="w-[500px] object-contain" />
        </div>

        {/* Moedas embaixo na Esquerda */}
        <div className="absolute bottom-10 left-10 opacity-[0.15]">
          <img src="/bg-moedas.png" alt="Moedas" className="w-[400px] object-contain" />
        </div>

        {/* Balança na Direita */}
        <div className="absolute top-40 -right-20 opacity-[0.15]">
          <img src="/bg-balanca.png" alt="Balança" className="w-[400px] object-contain" />
        </div>

      </div>

      {/* Conteúdo real do site */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}