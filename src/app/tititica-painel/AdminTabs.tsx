'use client';
import { useState } from 'react';

export default function AdminTabs({ dashboard, form, list }: { dashboard: React.ReactNode, form: React.ReactNode, list: React.ReactNode }) {
  const [tab, setTab] = useState('graficos'); // Inicia na aba de graficos ou cadastro

  return (
    <div>
      <div className="flex space-x-2 sm:space-x-4 mb-8 border-b-2 border-pink-200 pb-0">
        <button onClick={() => setTab('cadastro')} className={`font-bold px-6 py-3 rounded-t-xl transition-all ${tab === 'cadastro' ? 'bg-pink-100 text-pink-700 border-t-2 border-l-2 border-r-2 border-pink-200 translate-y-[2px]' : 'bg-white text-gray-500 hover:bg-pink-50'}`}>🛍️ Produtos & Cadastro</button>
        <button onClick={() => setTab('graficos')} className={`font-bold px-6 py-3 rounded-t-xl transition-all ${tab === 'graficos' ? 'bg-pink-100 text-pink-700 border-t-2 border-l-2 border-r-2 border-pink-200 translate-y-[2px]' : 'bg-white text-gray-500 hover:bg-pink-50'}`}>📈 Gráficos (Analytics)</button>
      </div>

      <div className="min-h-[500px]">
        {tab === 'cadastro' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {form}
            {list}
          </div>
        )}
        
        {tab === 'graficos' && (
          <div className="animate-in fade-in duration-300">
            {dashboard}
          </div>
        )}
      </div>
    </div>
  );
}
