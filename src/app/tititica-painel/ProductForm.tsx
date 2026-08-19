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
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <h3 className="font-bold text-blue-800 mb-2">⚡ Super Atalho (Bookmarklet)</h3>
        <p className="text-sm text-blue-700 mb-2">Arraste o botão abaixo para a sua barra de favoritos. Quando estiver na página de um produto no Mercado Livre, basta clicar nele!</p>
        <a 
          href="javascript:(function(){var t=document.querySelector('h1.ui-pdp-title')?.innerText||'';var f=document.querySelector('.ui-pdp-price__second-line .andes-money-amount__fraction')?.innerText||'';var c=document.querySelector('.ui-pdp-price__second-line .andes-money-amount__cents')?.innerText||'00';var p=f?'R$ '+f+','+c:'';var i=document.querySelector('.ui-pdp-gallery__figure img')?.src||'';if(!i){i=document.querySelector('.ui-pdp-gallery__column img')?.src||'';}var u=window.location.href;window.open('https://lojinha-tititica.vercel.app/tititica-painel?originalUrl='+encodeURIComponent(u)+'&title='+encodeURIComponent(t)+'&price='+encodeURIComponent(p)+'&imageUrl='+encodeURIComponent(i),'_blank');})();"
          className="inline-block bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm hover:bg-blue-700 cursor-grab"
          onClick={(e) => e.preventDefault()}
        >
          ➕ Mandar pra Tititica
        </a>
      </div>

      <div>
        <label className="block font-semibold mb-1">Link Original do Produto (Mercado Livre) *</label>
        <input 
          type="url" 
          name="originalUrl" 
          required 
          className="w-full border p-2 rounded" 
          placeholder="https://produto.mercadolivre.com.br/MLB-..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Título do Produto</label>
        <input type="text" name="title" className="w-full border p-2 rounded" placeholder="Preencha manualmente ou use o atalho" value={title} onChange={(e) => setTitle(e.target.value)} required/>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Categoria</label>
          <input 
            type="text" 
            list="categorias-salvas"
            name="category" 
            className="w-full border p-2 rounded bg-white" 
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
          <label className="block font-semibold mb-1">Preço</label>
          <input type="text" name="price" className="w-full border p-2 rounded" placeholder="R$ 99,90" value={price} onChange={(e) => setPrice(e.target.value)} required/>
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-1">URL da Imagem</label>
        <input type="url" name="imageUrl" className="w-full border p-2 rounded" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required/>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-pink-600">Seu Link de Afiliado *</label>
        <input type="url" name="affiliateUrl" required className="w-full border p-2 rounded border-pink-300" placeholder="https://meli.la/..." />
      </div>
      
      <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <input type="checkbox" id="isFeatured" name="isFeatured" className="w-5 h-5 text-pink-600 rounded border-gray-300 focus:ring-pink-500" />
        <label htmlFor="isFeatured" className="font-bold text-yellow-800">💖 Marcar como Destaque (Aparece no topo com selo)</label>
      </div>

      <div className="flex gap-4 pt-2">
        <button type="reset" onClick={handleClear} className="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition">
          Limpar
        </button>
        <button type="submit" className="flex-1 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition">
          Adicionar Produto à Loja
        </button>
      </div>
    </form>
  );
}
