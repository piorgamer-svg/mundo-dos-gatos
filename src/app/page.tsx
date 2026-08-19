import { PrismaClient } from "@prisma/client";
import { ShoppingBag } from "lucide-react";

const prisma = new PrismaClient();

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-pink-50 font-sans text-gray-800 selection:bg-pink-300 selection:text-white">
      {/* Header */}
      <header className="bg-white border-b border-pink-200 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-pink-400 bg-white">
              {/* O usuário precisará colocar o logo na pasta public */}
              <img src="/logo.png" alt="Lojinha da Tititica Logo" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-widest uppercase text-pink-400" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
              Lojinha da Tititica
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-pink-100 py-20 sm:py-24 lg:py-32 border-b border-dashed border-pink-300">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cotton-candy.png")' }}></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="h-32 w-32 sm:h-48 sm:w-48 mb-8 overflow-hidden rounded-full border-4 border-dashed border-pink-400 shadow-xl bg-white transform -rotate-3">
            <img src="/logo.png" alt="Mascote Tititica" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-pink-400" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
            <span className="drop-shadow-sm">Moda, Beleza</span> <span className="text-pink-500 drop-shadow-sm">e</span> <span className="drop-shadow-sm">Estilo!</span>
          </h2>
          <p className="mt-6 max-w-2xl text-xl text-pink-800 mx-auto font-medium">
            Os artigos femininos mais lindos e maravilhosos separados com muito carinho pela Tititica para você!
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white text-gray-800 shadow-[8px_8px_0px_0px_rgba(251,207,232,1)] border-2 border-pink-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(244,114,182,1)]"
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden border-b-2 border-pink-100 sm:aspect-none sm:h-64">
                  <img
                    src={product.imageUrl || "https://placehold.co/400x400/ffe4e6/ff87a?text=Sem+Imagem"}
                    alt={product.title}
                    className="h-full w-full object-cover object-center sm:h-full sm:w-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2 min-h-[3.5rem]" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                    {product.title}
                  </h3>
                  <div className="mt-4 flex flex-col">
                    <p className="text-2xl font-black text-pink-500 tracking-tight">{product.price}</p>
                    <p className="text-[10px] text-gray-400 mt-1 leading-tight">* Preço sujeito a alteração. O valor válido é o do site oficial no momento da compra.</p>
                  </div>
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center rounded-xl border-2 border-pink-300 bg-pink-200 px-4 py-3 text-sm font-black uppercase text-pink-800 shadow-[4px_4px_0px_0px_rgba(244,114,182,0.5)] hover:bg-pink-300 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(244,114,182,0.5)] active:translate-y-2 active:shadow-none transition-all"
                  >
                    Eu Quero! 💖👗
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-24 bg-white border-2 border-dashed border-pink-300 rounded-3xl shadow-sm">
              <span className="text-6xl">👗</span>
              <h3 className="mt-4 text-xl font-bold text-pink-500" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>Nenhum artigo feminino ainda</h3>
              <p className="mt-2 text-pink-400">A vitrine está sendo preparada com novidades em breve.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-200 py-8 text-center px-4">
        <div className="max-w-4xl mx-auto text-xs text-gray-500 space-y-2">
          <p className="font-bold text-pink-400">Lojinha da Tititica - Agregador de Ofertas</p>
          <p>
            <strong>Aviso Legal:</strong> A Lojinha da Tititica atua como vitrine de produtos de lojas parceiras (como o Mercado Livre) através de programas de afiliados. 
            Nós não realizamos a venda, cobrança ou entrega dos produtos. 
            O preço e a disponibilidade dos produtos podem sofrer alterações sem aviso prévio. 
            O valor e as condições finais válidas são sempre as do site oficial do vendedor no momento de fechar o pedido.
          </p>
        </div>
      </footer>
    </div>
  );
}
