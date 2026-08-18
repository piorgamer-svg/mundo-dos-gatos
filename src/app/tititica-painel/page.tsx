import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import * as cheerio from "cheerio";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/acesso-restrito");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function addProduct(formData: FormData) {
    "use server";
    
    const originalUrl = formData.get("url") as string;
    const affiliateUrl = formData.get("affiliateUrl") as string || originalUrl;
    
    // Campos manuais
    let title = formData.get("title") as string;
    let imageUrl = formData.get("imageUrl") as string;
    let price = formData.get("price") as string;

    if (!originalUrl) return;

    // Tenta extrair apenas se o usuário não preencheu os dados manualmente
    if (!title || !imageUrl || !price) {
      try {
        const match = originalUrl.match(/MLB-?(\d+)/i);
        if (match) {
          const mlbId = 'MLB' + match[1];
          const response = await fetch(`https://api.mercadolibre.com/items/` + mlbId);
          if (response.ok) {
            const data = await response.json();
            
            if (!title) title = data.title;
            if (!imageUrl && data.pictures && data.pictures.length > 0) {
              imageUrl = data.pictures[0].secure_url || data.pictures[0].url;
            }
            if (!price && data.price) {
              price = `R$ ` + data.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            }
          }
        }
      } catch (error) {
        console.error("Erro ao puxar da API do ML:", error);
      }
    }

    await prisma.product.create({
      data: {
        originalUrl,
        affiliateUrl,
        title: title || "Produto Adicionado",
        price: price || "Preço sob consulta",
        imageUrl: imageUrl || "",
        source: "Mercado Livre",
      },
    });

    revalidatePath("/tititica-painel");
    revalidatePath("/");
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (id) {
      await prisma.product.delete({ where: { id } });
      revalidatePath("/tititica-painel");
      revalidatePath("/");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel de Administração</h1>
          <a href="/" className="text-blue-600 hover:underline">Ver Loja</a>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Adicionar Novo Produto</h2>
          <form action={addProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link Original do Produto (Mercado Livre) *
              </label>
              <input
                type="url"
                name="url"
                required
                placeholder="https://produto.mercadolivre.com.br/..."
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="pt-4 border-t border-gray-200 mt-4">
              <p className="text-sm text-gray-500 mb-4">
                O Mercado Livre costuma bloquear extrações automáticas. Se a imagem ou título não carregarem, preencha manualmente abaixo:
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título do Produto (Opcional)
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Ex: Ração Whiskas Sachê Gato Adulto..."
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (Opcional)
                  </label>
                  <input
                    type="text"
                    name="price"
                    placeholder="Ex: R$ 59,90"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL da Imagem (Opcional)
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    placeholder="https://http2.mlstatic.com/D_NQ_NP_..."
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Clique com botão direito na foto do Mercado Livre e escolha "Copiar endereço da imagem".</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seu Link de Afiliado (Opcional se for usar o link original)
              </label>
              <input
                type="url"
                name="affiliateUrl"
                placeholder="Seu link com a tag de afiliado"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 font-bold mt-4"
            >
              Adicionar Produto à Loja
            </button>
          </form>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Produtos Cadastrados ({products.length})</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center space-x-4">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.title} className="h-16 w-16 rounded-md object-cover" />
                  )}
                  <div>
                    <h3 className="font-medium line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-gray-500">{product.price}</p>
                  </div>
                </div>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button type="submit" className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Remover
                  </button>
                </form>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum produto adicionado ainda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
