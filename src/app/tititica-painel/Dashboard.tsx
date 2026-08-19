'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard({ products }: { products: any[] }) {
  const topProducts = [...products]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)
    .map(p => ({ name: p.title.substring(0, 15) + '...', clicks: p.clicks }));

  const categoryMap = products.reduce((acc, p) => {
    const cat = p.category || 'Outros';
    acc[cat] = (acc[cat] || 0) + p.clicks;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  })).filter(cat => cat.value > 0);

  const COLORS = ['#f472b6', '#fb7185', '#e879f9', '#c084fc', '#a78bfa', '#818cf8'];

  const totalClicks = products.reduce((acc, p) => acc + p.clicks, 0);

  if (totalClicks === 0) {
    return <div className="text-center p-6 text-gray-500 bg-pink-50 rounded-xl mt-4">Nenhum clique registrado ainda. Comece a divulgar a sua loja!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
      <div className="bg-white p-4 border-2 border-pink-100 rounded-xl shadow-sm">
        <h3 className="text-center font-black text-pink-600 mb-4">Top 5 Produtos</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts}>
              <XAxis dataKey="name" fontSize={10} tick={{fill: '#ec4899'}} />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{fill: '#fce7f3'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="clicks" fill="#f472b6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 border-2 border-pink-100 rounded-xl shadow-sm">
        <h3 className="text-center font-black text-pink-600 mb-4">Cliques por Categoria</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
