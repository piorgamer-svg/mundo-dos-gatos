import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import ProductForm from "./ProductForm";
import Dashboard from "./Dashboard";
import AdminTabs from "./AdminTabs";
import UserManagement from "./UserManagement";

const prisma = new PrismaClient();

export default async function AdminPanel() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/acesso-restrito");
  }

  async function createUser(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!email || !password) return { error: "Preencha tudo!" };
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Email já existe" };

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password: hashedPassword } });
    revalidatePath("/tititica-painel");
    return { success: true };
  }

  async function updatePassword(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const newPassword = formData.get("newPassword") as string;
    
    if (!email || !newPassword) return { error: "Preencha tudo!" };
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    return { success: true };
  }

  async function addProduct(formData: FormData) {
    "use server";
    const originalUrl = formData.get("originalUrl") as string;
    let title = formData.get("title") as string;
    let imageUrl = formData.get("imageUrl") as string;
    let price = formData.get("price") as string;
    const affiliateUrl = formData.get("affiliateUrl") as string;
    const category = formData.get("category") as string || "Outros";
    const isFeatured = formData.get("isFeatured") === "on";

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
        category,
        isFeatured,
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

  const categoriesDb = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
    where: { category: { not: null } }
  });
  
  const existingCategories = categoriesDb.map(c => c.category as string).filter(Boolean);

  const users = await prisma.user.findMany({
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" }
  });

  const formSection = (
    <div className="bg-pink-100 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Adicionar Novo Produto do Mercado Livre</h2>
      <Suspense fallback={<p>Carregando formulário...</p>}>
        <ProductForm addProductAction={addProduct} existingCategories={existingCategories} />
      </Suspense>
    </div>
  );

  const listSection = (
    <div>
      <h2 className="text-xl font-bold mb-4">Produtos Cadastrados ({products.length})</h2>
      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className={`flex items-center justify-between p-4 border rounded shadow-sm transition bg-white ${p.isFeatured ? 'border-yellow-400 bg-yellow-50' : ''}`}>
            <div className="flex items-center space-x-4">
              <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover rounded" />
              <div>
                <p className="font-bold flex items-center gap-2">
                  {p.title}
                  {p.isFeatured && <span className="text-xs bg-yellow-300 text-yellow-800 px-2 py-0.5 rounded-full">Destaque</span>}
                </p>
                <p className="text-sm text-gray-500">{p.price} | Categoria: {p.category}</p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-1 rounded">👀 {p.clicks} Cliques</p>
                </div>
              </div>
            </div>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className="text-red-500 hover:bg-red-50 rounded font-bold px-3 py-2 transition">
                🗑️ Apagar
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );

  const usersSection = (
    <UserManagement 
      users={users} 
      createUserAction={createUser} 
      updatePasswordAction={updatePassword} 
    />
  );

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-black text-pink-600">Painel de Controle Tititica 💅</h1>
          <a href="/" target="_blank" className="text-pink-500 hover:underline">Ver Loja</a>
        </div>

        <AdminTabs 
          dashboard={<Dashboard products={products} />}
          form={formSection}
          list={listSection}
          users={usersSection}
        />
      </div>
    </div>
  );
}
