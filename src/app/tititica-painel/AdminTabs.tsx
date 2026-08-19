'use client';
import { useState } from 'react';

export default function AdminTabs({ dashboard, form, list, users }: { dashboard: React.ReactNode, form: React.ReactNode, list: React.ReactNode, users: React.ReactNode }) {
  const [tab, setTab] = useState('cadastro'); // Inicia na aba de cadastro

  return (
    <div>
      <div className="flex space-x-2 sm:space-x-4 mb-8 border-b-2 border-pink-200 pb-0 overflow-x-auto scrollbar-hide">
        <button onClick={() => setTab('cadastro')} className={`whitespace-nowrap font-bold px-6 py-3 rounded-t-xl transition-all ${tab === 'cadastro' ? 'bg-pink-100 text-pink-700 border-t-2 border-l-2 border-r-2 border-pink-200 translate-y-[2px]' : 'bg-white text-gray-500 hover:bg-pink-50'}`}>🛍️ Produtos & Cadastro</button>
        <button onClick={() => setTab('graficos')} className={`whitespace-nowrap font-bold px-6 py-3 rounded-t-xl transition-all ${tab === 'graficos' ? 'bg-pink-100 text-pink-700 border-t-2 border-l-2 border-r-2 border-pink-200 translate-y-[2px]' : 'bg-white text-gray-500 hover:bg-pink-50'}`}>📈 Gráficos (Analytics)</button>
        <button onClick={() => setTab('equipe')} className={`whitespace-nowrap font-bold px-6 py-3 rounded-t-xl transition-all ${tab === 'equipe' ? 'bg-pink-100 text-pink-700 border-t-2 border-l-2 border-r-2 border-pink-200 translate-y-[2px]' : 'bg-white text-gray-500 hover:bg-pink-50'}`}>👥 Equipe & Acessos</button>
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

        {tab === 'equipe' && (
          <div className="animate-in fade-in duration-300">
            {users}
          </div>
        )}
      </div>
    </div>
  );
}
