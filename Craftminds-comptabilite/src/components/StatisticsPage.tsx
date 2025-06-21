import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { Transaction } from '../types';

const COLORS = ['#60a5fa', '#f87171'];

interface StatisticsPageProps {
  transactions: Transaction[];
}

export function StatisticsPage({ transactions }: StatisticsPageProps) {
  // Regroupe les transactions par mois et type
  const monthlyData = useMemo(() => {
    const map: Record<string, { revenue: number; expense: number }> = {};
    transactions.forEach(t => {
      const month = t.date.slice(0, 7); // YYYY-MM
      if (!map[month]) map[month] = { revenue: 0, expense: 0 };
      if (t.type === 'revenue') map[month].revenue += t.amount;
      if (t.type === 'expense') map[month].expense += t.amount;
    });
    return Object.entries(map).sort().map(([month, vals]) => ({
      month,
      ...vals
    }));
  }, [transactions]);

  // Données pour le camembert
  const pieData = useMemo(() => {
    let revenue = 0, expense = 0;
    transactions.forEach(t => {
      if (t.type === 'revenue') revenue += t.amount;
      if (t.type === 'expense') expense += t.amount;
    });
    return [
      { name: 'Revenus', value: revenue },
      { name: 'Dépenses', value: expense }
    ];
  }, [transactions]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-8">Statistiques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="glass rounded-2xl p-6 shadow-xl border border-white/10 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Évolution mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip contentStyle={{ background: '#232946', border: 'none', color: '#fff' }} />
              <Legend />
              <Bar dataKey="revenue" fill="#60a5fa" name="Revenus" radius={[8,8,0,0]} />
              <Bar dataKey="expense" fill="#f87171" name="Dépenses" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Pie Chart */}
        <div className="glass rounded-2xl p-6 shadow-xl border border-white/10 animate-fade-in flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4">Répartition globale</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                fill="#8884d8"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 