'use client';
import { useState } from 'react';

export default function UserManagement({ 
  users, 
  createUserAction, 
  updatePasswordAction 
}: { 
  users: any[]; 
  createUserAction: (data: FormData) => Promise<{error?: string, success?: boolean}>;
  updatePasswordAction: (data: FormData) => Promise<{error?: string, success?: boolean}>;
}) {
  const [createMsg, setCreateMsg] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  const handleCreate = async (formData: FormData) => {
    setCreateMsg('Criando...');
    const res = await createUserAction(formData);
    if (res?.error) setCreateMsg(`❌ ${res.error}`);
    else setCreateMsg('✅ Usuário criado com sucesso!');
  };

  const handleUpdate = async (formData: FormData) => {
    setUpdateMsg('Atualizando...');
    const res = await updatePasswordAction(formData);
    if (res?.error) setUpdateMsg(`❌ ${res.error}`);
    else setUpdateMsg('✅ Senha atualizada com sucesso!');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 border-2 border-pink-100 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold text-pink-600 mb-4">👥 Membros da Equipe ({users.length})</h3>
        <div className="space-y-3 mb-8">
          {users.map(u => (
            <div key={u.id} className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg">
              <div>
                <p className="font-bold">{u.email}</p>
                <p className="text-xs text-gray-500">Criado em: {new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>

        <hr className="my-6 border-pink-100" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Criar Usuario */}
          <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
            <h4 className="font-bold text-pink-800 mb-4">➕ Adicionar Novo Acesso</h4>
            <form action={handleCreate} className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input type="email" name="email" required className="w-full border p-2 rounded" placeholder="novo@loja.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Senha</label>
                <input type="password" name="password" required className="w-full border p-2 rounded" placeholder="******" />
              </div>
              <button type="submit" className="w-full bg-pink-600 text-white font-bold py-2 rounded hover:bg-pink-700 transition">
                Criar Usuário
              </button>
              {createMsg && <p className="text-sm font-bold text-center mt-2">{createMsg}</p>}
            </form>
          </div>

          {/* Alterar Senha */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-4">🔑 Alterar Senha de Acesso</h4>
            <form action={handleUpdate} className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Email do Usuário</label>
                <select name="email" required className="w-full border p-2 rounded bg-white">
                  {users.map(u => (
                    <option key={u.id} value={u.email}>{u.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Nova Senha</label>
                <input type="password" name="newPassword" required className="w-full border p-2 rounded" placeholder="******" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
                Atualizar Senha
              </button>
              {updateMsg && <p className="text-sm font-bold text-center mt-2">{updateMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
