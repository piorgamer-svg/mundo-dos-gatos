'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ProductForm({ addProductAction, existingCategories = [] }: { addProductAction: any, existingCategories?: string[] }) {
  const searchParams = useSearchParams();
  
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [category, setCategory] = useState('');

  useEffect(() => {
    // Auto-preencher se vier via URL (Bookmarklet)
    if (searchParams) {
      if (searchParams.get('originalUrl')) setOriginalUrl(searchParams.get('originalUrl') || '');
      if (searchParams.get('title')) setTitle(searchParams.get('title') || '');
      if (searchParams.get('price')) setPrice(searchParams.get('price') || '');
      if (searchParams.get('imageUrl')) setImageUrl(searchParams.get('imageUrl') || '');
    }
  }, [searchParams]);

  const handleClear = () => {
    setOriginalUrl('');
    setTitle('');
    setPrice('');
    setImageUrl('');
    setCategory('');
  };

  return (
    <form action={addProductAction} className="space-y-4">
      <div>
        <label className="block font-semibold mb-1 text-gray-200">Link Original do Produto (Mercado Livre) *</label>
        <input 
          type="url" 
          name="originalUrl" 
          required 
          className="w-full bg-[#1a1a1a] border border-gray-600 text-white p-3 rounded-lg focus:border-pink-400 focus:ring-0" 
          placeholder="https://produto.mercadolivre.com.br/MLB-..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-200">Título do Produto</label>
        <input type="text" name="title" className="w-full bg-[#1a1a1a] border border-gray-600 text-white p-3 rounded-lg focus:border-pink-400 focus:ring-0" placeholder="Preencha manualmente ou use o atalho" value={title} onChange={(e) => setTitle(e.target.value)} required/>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1 text-gray-200">Categoria</label>
          <input 
            type="text" 
            list="categorias-salvas"
            name="category" 
            className="w-full bg-[#1a1a1a] border border-gray-600 text-white p-3 rounded-lg focus:border-pink-400 focus:ring-0" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Digite ou escolha da lista..."
            required
          />
          <datalist id="categorias-salvas">
            {existingCategories.map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1 text-gray-200">Preço</label>
          <input type="text" name="price" className="w-full bg-[#1a1a1a] border border-gray-600 text-white p-3 rounded-lg focus:border-pink-400 focus:ring-0" placeholder="R$ 99,90" value={price} onChange={(e) => setPrice(e.target.value)} required/>
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-200">URL da Imagem</label>
        <input type="url" name="imageUrl" className="w-full bg-[#1a1a1a] border border-gray-600 text-white p-3 rounded-lg focus:border-pink-400 focus:ring-0" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required/>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-pink-400">Seu Link de Afiliado *</label>
        <input type="url" name="affiliateUrl" required className="w-full bg-[#1a1a1a] border-2 border-pink-400 text-white p-3 rounded-lg focus:ring-0" placeholder="https://meli.la/..." />
      </div>
      
      <div className="flex items-center gap-2 bg-[#2a2a2a] p-4 rounded-xl border-2 border-yellow-400 mt-4">
        <input type="checkbox" id="isFeatured" name="isFeatured" className="w-6 h-6 text-pink-500 rounded bg-[#1a1a1a] border-gray-500 focus:ring-pink-500" />
        <label htmlFor="isFeatured" className="font-bold text-yellow-400 select-none cursor-pointer">⭐ Marcar como Destaque (Aparece no topo com selo)</label>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="reset" onClick={handleClear} className="bg-gray-700 text-gray-200 font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition">
          Limpar
        </button>
        <button type="submit" className="flex-1 bg-pink-500 text-white font-black py-3 px-6 rounded-xl hover:bg-pink-400 transition uppercase tracking-wide">
          Adicionar à Loja 🐾
        </button>
      </div>
    </form>
  );
}
