'use client';

import { useState } from 'react';

export default function ProductForm({ addProductAction }: { addProductAction: any }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlBlur = async () => {
    if (!originalUrl) return;
    
    // Extrai o ID
    let mlbId = null;
    const urlParamsMatch = originalUrl.match(/(?:wid=|item_id(?:%3A|:))(MLB\d+)/i);
    if (urlParamsMatch) {
      mlbId = urlParamsMatch[1].toUpperCase();
    } else {
      const match = originalUrl.match(/MLB-?(\d+)/i);
      if (match) mlbId = 'MLB' + match[1];
    }

    if (mlbId) {
      setIsLoading(true);
      try {
        // Fetch feito pelo NAVEGADOR do usuario (caseiro), burlando o bloqueio da Vercel!
        const response = await fetch(https://api.mercadolibre.com/items/ + mlbId);
        if (response.ok) {
          const data = await response.json();
          if (!title) setTitle(data.title);
          if (!price && data.price) {
            setPrice(R$  + data.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
          }
          if (!imageUrl && data.pictures && data.pictures.length > 0) {
            setImageUrl(data.pictures[0].secure_url || data.pictures[0].url);
          }
        }
      } catch (e) {
        console.error("Erro ao buscar no cliente:", e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form action={addProductAction} className="space-y-4">
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
          onBlur={handleUrlBlur}
        />
        {isLoading && <p className="text-pink-500 text-sm mt-1">Puxando dados mágicos do Mercado Livre...</p>}
      </div>
      <div>
        <label className="block font-semibold mb-1">Título do Produto (Opcional)</label>
        <input type="text" name="title" className="w-full border p-2 rounded" placeholder="Se deixar em branco, tentaremos puxar do link" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="block font-semibold mb-1">URL da Imagem (Opcional)</label>
        <input type="url" name="imageUrl" className="w-full border p-2 rounded" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>
      <div>
        <label className="block font-semibold mb-1">Preço (Opcional)</label>
        <input type="text" name="price" className="w-full border p-2 rounded" placeholder="R$ 99,90" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-pink-600">Seu Link de Afiliado *</label>
        <input type="url" name="affiliateUrl" required className="w-full border p-2 rounded border-pink-300" placeholder="https://meli.la/..." />
      </div>
      <button type="submit" className="bg-pink-600 text-white font-bold py-3 px-6 rounded-lg w-full hover:bg-pink-700 transition">
        Adicionar Produto à Loja
      </button>
    </form>
  );
}
