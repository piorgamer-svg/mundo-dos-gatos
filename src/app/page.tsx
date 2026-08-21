import { PrismaClient } from "@prisma/client";
import { ShoppingBag } from "lucide-react";

const prisma = new PrismaClient();

export const revalidate = 60; // Revalidate every minute

export default async function Home({ searchParams }: { searchParams: { category?: string, q?: string } }) {
  // Use await para searchParams devido às novas regras do Next.js 15+ (turbopack)
  const params = await searchParams;
  const currentCategory = params?.category || "Todas";
  const searchQuery = params?.q || "";

  const products = await prisma.product.findMany({
    where: {
      AND: [
        currentCategory !== "Todas" ? { category: currentCategory } : {},
        searchQuery ? { title: { contains: searchQuery, mode: 'insensitive' } } : {},
      ]
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" }
    ],
  });

  const categoriesDb = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
    where: { category: { not: null } }
  });
  
  const fetchedCategories = categoriesDb.map(c => c.category as string).filter(Boolean);
  const CATEGORIAS = ['Todas', ...fetchedCategories];

  return (
    <div className="min-h-screen bg-[#242424] font-sans text-gray-100 selection:bg-pink-300 selection:text-black">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-10 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-pink-400 bg-white">
              {/* O usuário precisará colocar o logo na pasta public */}
              <img src="/logo.png" alt="O Mundo dos Gatos Logo" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-widest uppercase" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
              <span className="text-pink-400">O </span>
              <span className="text-yellow-300">Mun</span>
              <span className="text-blue-400">do </span>
              <span className="text-green-400">dos </span>
              <span className="text-pink-400">Ga</span>
              <span className="text-yellow-300">tos</span>
            </h1>
          </div>
          <a href="/painel-gatos" className="text-sm font-medium text-gray-400 hover:text-pink-400 transition-colors">
            Admin
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#2a2a2a] py-20 sm:py-24 lg:py-32 border-b border-dashed border-gray-600 bg-fixed">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-felt.png")' }}></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="h-32 w-32 sm:h-48 sm:w-48 mb-8 overflow-hidden rounded-full border-4 border-dashed border-yellow-400 shadow-2xl bg-white transform -rotate-3 animate-float">
            <img src="/logo.png" alt="Personagem O Mundo dos Gatos" className="h-full w-full object-cover" />
          </div>
          <h2 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
            <span className="text-yellow-300 drop-shadow-md">Tudo</span> <span className="text-pink-400 drop-shadow-md">Para</span> <span className="text-blue-400 drop-shadow-md">Seu</span> <span className="text-green-400 drop-shadow-md">Gatinho!</span>
          </h2>
          <p className="animate-fade-in-up mt-6 max-w-2xl text-xl text-gray-300 mx-auto font-medium" style={{ animationDelay: '0.2s' }}>
            Os melhores produtos, brinquedos e acessórios escolhidos a dedo para fazer a alegria do seu felino.
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Barra de Pesquisa */}
        <div className="mb-8">
          <form action="/" method="GET" className="relative max-w-xl mx-auto">
            <input type="hidden" name="category" value={currentCategory} />
            <input 
              type="search" 
              name="q" 
              defaultValue={searchQuery}
              placeholder="O que você está procurando?" 
              className="w-full pl-5 pr-12 py-3 rounded-full bg-[#1a1a1a] border-2 border-gray-700 text-white focus:border-pink-400 focus:ring-0 shadow-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400">
              🔍
            </button>
          </form>
        </div>

        {/* Filtro de Categorias */}
        <div className="flex space-x-2 sm:space-x-4 mb-10 overflow-x-auto pb-2 scrollbar-hide justify-center">
          {CATEGORIAS.map((cat) => (
            <a
              key={cat}
              href={cat === 'Todas' ? '/' : `/?category=${encodeURIComponent(cat)}`}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                currentCategory === cat
                  ? 'bg-pink-500 text-black border-2 border-pink-600'
                  : 'bg-[#1a1a1a] text-gray-300 border-2 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
              }`}
            >
              {cat}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className={`product-card group relative flex flex-col overflow-hidden rounded-3xl bg-[#1a1a1a] text-gray-200 transition-all duration-300 hover:-translate-y-2 ${
                  product.isFeatured 
                    ? 'border-4 border-yellow-300 shadow-[8px_8px_0px_0px_rgba(253,224,71,1)] hover:shadow-[12px_12px_0px_0px_rgba(250,204,21,1)]'
                    : 'border-2 border-pink-400 shadow-[8px_8px_0px_0px_rgba(244,114,182,1)] hover:shadow-[12px_12px_0px_0px_rgba(244,114,182,1)]'
                }`}
              >
                {product.isFeatured && (
                  <div className="absolute top-3 left-3 bg-yellow-300 text-yellow-900 text-xs font-black px-3 py-1 rounded-full z-10 shadow-sm flex items-center gap-1">
                    💖 Mais Vendido
                  </div>
                )}
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden border-b-2 border-gray-800 sm:aspect-none sm:h-64 bg-white p-2">
                  <img
                    src={product.imageUrl || "https://placehold.co/400x400/1a1a1a/fbcfe8?text=Sem+Imagem"}
                    alt={product.title}
                    className="h-full w-full object-contain object-center sm:h-full sm:w-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-gray-100 line-clamp-2 min-h-[3.5rem]" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                    {product.title}
                  </h3>
                  <div className="mt-4 flex flex-col">
                    <p className="text-2xl font-black text-pink-400 tracking-tight">{product.price}</p>
                    <p className="text-[10px] text-gray-500 mt-1 leading-tight">* Preço sujeito a alteração.</p>
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <a
                      href={`/api/go?id=${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center rounded-xl border-2 border-pink-500 bg-pink-400 px-4 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(244,114,182,0.5)] hover:bg-pink-300 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(244,114,182,0.5)] active:translate-y-2 active:shadow-none transition-all"
                    >
                      Miau! Eu Quero! 🐾
                    </a>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Olha que lindo que achei n'O Mundo dos Gatos!\n\n${product.title}\n${product.price}\n\n👉 https://mundo-dos-gatos.vercel.app/api/go?id=${product.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-xl border-2 border-green-500 bg-green-400 px-4 py-3 shadow-[4px_4px_0px_0px_rgba(74,222,128,0.5)] hover:bg-green-300 hover:translate-y-1 active:translate-y-2 transition-all text-black"
                        title="Compartilhar no WhatsApp"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                        </svg>
                      </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-24 bg-[#1a1a1a] border-2 border-dashed border-gray-600 rounded-3xl shadow-sm">
              <span className="text-6xl">😿</span>
              <h3 className="mt-4 text-xl font-bold text-gray-300" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>Nenhum gatinho brincando aqui ainda</h3>
              <p className="mt-2 text-gray-500">A vitrine está sendo preparada com novidades em breve.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-gray-800 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          
          <div className="text-center md:text-left text-xs text-gray-500 max-w-3xl space-y-2">
            <p className="font-bold text-pink-400 text-sm">O Mundo dos Gatos</p>
            <p>
              <strong>Aviso Legal:</strong> O Mundo dos Gatos atua como vitrine de produtos de lojas parceiras através de programas de afiliados. 
              Nós não realizamos a venda, cobrança ou entrega dos produtos. 
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
