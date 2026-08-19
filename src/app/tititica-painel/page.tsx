import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import ProductForm from "./ProductForm";

const prisma = new PrismaClient();

export default async function AdminPanel() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/acesso-restrito");
  }

  async function addProduct(formData: FormData) {
    "use server";
    const originalUrl = formData.get("originalUrl") as string;
    let title = formData.get("title") as string;
    let imageUrl = formData.get("imageUrl") as string;
    let price = formData.get("price") as string;
    const affiliateUrl = formData.get("affiliateUrl") as string;

    if (!title) title = "Produto Adicionado";
    if (!price) price = "Preço sob consulta";
    
    // Fallback if client-side fetch failed to get an image
    if (!imageUrl) {
      imageUrl = "https://via.placeholder.com/400x400.png?text=Sem+Imagem";
    }

    await prisma.product.create({
      data: {
        originalUrl,
        affiliateUrl,
        title,
        imageUrl,
        price,
        source: "Mercado Livre",
      },
    });

    revalidatePath("/");
    revalidatePath("/tititica-painel");
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.product.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/tititica-painel");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-black text-pink-600">Painel de Controle Tititica 💅</h1>
          <a href="/" target="_blank" className="text-pink-500 hover:underline">Ver Loja</a>
        </div>

        <div className="bg-pink-100 p-6 rounded-xl mb-10">
          <h2 className="text-xl font-bold mb-4">Adicionar Novo Produto do Mercado Livre</h2>
          <ProductForm addProductAction={addProduct} />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Produtos Cadastrados ({products.length})</h2>
          <div className="space-y-4">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 border rounded shadow-sm hover:shadow-md transition bg-white">
                <div className="flex items-center space-x-4">
                  <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-bold">{p.title}</p>
                    <p className="text-sm text-gray-500">{p.price}</p>
                    <p className="text-xs text-blue-500 truncate max-w-xs">{p.originalUrl}</p>
                  </div>
                </div>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="text-red-500 hover:text-red-700 font-bold p-2">
                    Remover
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
