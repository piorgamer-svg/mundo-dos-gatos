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
      <div className="relative overflow-hidden bg-pink-100 py-20 sm:py-24 lg:py-32 border-b border-dashed border-pink-300 bg-fixed">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cotton-candy.png")' }}></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="h-32 w-32 sm:h-48 sm:w-48 mb-8 overflow-hidden rounded-full border-4 border-dashed border-pink-400 shadow-xl bg-white animate-float">
            <img src="/logo.png" alt="Mascote Tititica" className="h-full w-full object-cover" />
          </div>
          <h2 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-pink-400" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
            <span className="drop-shadow-sm">Moda, Beleza</span> <span className="text-pink-500 drop-shadow-sm">e</span> <span className="drop-shadow-sm">Estilo!</span>
          </h2>
          <p className="animate-fade-in-up mt-6 max-w-2xl text-xl text-pink-800 mx-auto font-medium" style={{ animationDelay: '0.2s' }}>
            Os artigos femininos mais lindos e maravilhosos separados com muito carinho pela Tititica para você!
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
              className="w-full pl-5 pr-12 py-3 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:ring-0 shadow-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600">
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
                  ? 'bg-pink-500 text-white border-2 border-pink-600'
                  : 'bg-white text-pink-600 border-2 border-pink-200 hover:bg-pink-100 hover:border-pink-300'
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
                className={`product-card group relative flex flex-col overflow-hidden rounded-3xl bg-white text-gray-800 transition-all duration-300 hover:-translate-y-2 ${
                  product.isFeatured 
                    ? 'border-4 border-yellow-300 shadow-[8px_8px_0px_0px_rgba(253,224,71,1)] hover:shadow-[12px_12px_0px_0px_rgba(250,204,21,1)]'
                    : 'border-2 border-pink-200 shadow-[8px_8px_0px_0px_rgba(251,207,232,1)] hover:shadow-[12px_12px_0px_0px_rgba(244,114,182,1)]'
                }`}
              >
                {product.isFeatured && (
                  <div className="absolute top-3 left-3 bg-yellow-300 text-yellow-800 text-xs font-black px-3 py-1 rounded-full z-10 shadow-sm flex items-center gap-1">
                    💖 Escolha da Tititica
                  </div>
                )}
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden border-b-2 border-pink-100 sm:aspect-none sm:h-64 bg-white p-2">
                  <img
                    src={product.imageUrl || "https://placehold.co/400x400/ffe4e6/ff87a?text=Sem+Imagem"}
                    alt={product.title}
                    className="h-full w-full object-contain object-center sm:h-full sm:w-full group-hover:scale-105 transition-transform duration-500"
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
                  
                  <div className="mt-6 flex gap-2">
                    <a
                      href={`/api/go?id=${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center rounded-xl border-2 border-pink-300 bg-pink-200 px-4 py-3 text-sm font-black uppercase text-pink-800 shadow-[4px_4px_0px_0px_rgba(244,114,182,0.5)] hover:bg-pink-300 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(244,114,182,0.5)] active:translate-y-2 active:shadow-none transition-all"
                    >
                      Eu Quero! 🛍️
                    </a>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Olha que lindo que achei na Lojinha da Tititica!\n\n${product.title}\n${product.price}\n\n👉 https://lojinha-tititica.vercel.app/api/go?id=${product.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-xl border-2 border-green-400 bg-green-100 px-4 py-3 shadow-[4px_4px_0px_0px_rgba(74,222,128,0.5)] hover:bg-green-200 hover:translate-y-1 active:translate-y-2 transition-all text-green-700"
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
            <div className="col-span-full text-center py-24 bg-white border-2 border-dashed border-pink-300 rounded-3xl shadow-sm">
              <span className="text-6xl">👗</span>
              <h3 className="mt-4 text-xl font-bold text-pink-500" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>Nenhum artigo feminino ainda</h3>
              <p className="mt-2 text-pink-400">A vitrine está sendo preparada com novidades em breve.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-200 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          
          <div className="text-center md:text-left text-xs text-gray-500 max-w-3xl space-y-2">
            <p className="font-bold text-pink-400 text-sm">Lojinha da Tititica - Agregador de Ofertas</p>
            <p>
              <strong>Aviso Legal:</strong> A Lojinha da Tititica atua como vitrine de produtos de lojas parceiras (como o Mercado Livre) através de programas de afiliados. 
              Nós não realizamos a venda, cobrança ou entrega dos produtos. 
              O preço e a disponibilidade dos produtos podem sofrer alterações sem aviso prévio. 
              O valor e as condições finais válidas são sempre as do site oficial do vendedor no momento de fechar o pedido.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-3 shrink-0">
            <p className="font-bold text-pink-400 text-sm">Siga a Tititica</p>
            <div className="flex space-x-4">
              <a href="https://www.youtube.com/@Tititica" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-600 hover:-translate-y-1 transition-all" title="YouTube">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@tititica_news" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-600 hover:-translate-y-1 transition-all" title="TikTok">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61590394447759" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-600 hover:-translate-y-1 transition-all" title="Facebook">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
