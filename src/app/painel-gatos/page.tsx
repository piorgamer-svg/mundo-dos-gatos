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
    redirect("/login-gatos");
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
    revalidatePath("/painel-gatos");
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
    revalidatePath("/painel-gatos");
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.product.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/painel-gatos");
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
    <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-white">Adicionar Novo Produto do Mercado Livre</h2>
      <Suspense fallback={<p>Carregando formulário...</p>}>
        <ProductForm addProductAction={addProduct} existingCategories={existingCategories} />
      </Suspense>
    </div>
  );

  const listSection = (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">Produtos Cadastrados ({products.length})</h2>
      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className={`flex items-center justify-between p-4 border rounded shadow-sm transition bg-[#1a1a1a] ${p.isFeatured ? 'border-yellow-400 bg-[#2a2a2a]' : 'border-gray-700'}`}>
            <div className="flex items-center space-x-4">
              <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover rounded" />
              <div>
                <p className="font-bold flex items-center gap-2 text-white">
                  {p.title}
                  {p.isFeatured && <span className="text-xs bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-full font-bold">Destaque</span>}
                </p>
                <p className="text-sm text-gray-400">{p.price} | Categoria: {p.category}</p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs font-bold text-pink-400 bg-[#2a2a2a] px-2 py-1 rounded">👆 {p.clicks} Cliques</p>
                </div>
              </div>
            </div>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className="text-red-400 hover:bg-red-900/50 rounded font-bold px-3 py-2 transition">
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
    <div className="min-h-screen bg-[#242424] text-gray-100 p-8" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
      <div className="max-w-4xl mx-auto bg-[#1a1a1a] p-8 rounded-3xl shadow-2xl border-2 border-pink-400">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-yellow-300 bg-white">
              <img src="/logo.png" alt="O Mundo dos Gatos Logo" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-3xl font-black text-pink-400 tracking-widest uppercase">
              Painel de Controle 🐾
            </h1>
          </div>
          <a href="/" target="_blank" className="text-gray-400 hover:text-pink-400 hover:underline font-bold transition">Ver Loja</a>
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
