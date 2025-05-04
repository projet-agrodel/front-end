'use client'; // Adicionar esta diretiva para componentes de cliente (gráficos)

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line // Importar LineChart e Line
} from 'recharts';

// Ícones placeholder (substitua por ícones reais)
const IconPlaceholder = ({ className }: { className?: string }) => <span className={`inline-block w-6 h-6 ${className}`}>●</span>;

// --- Simulação de busca de dados ---
// Substitua esta função pela sua lógica real de busca de dados (API, banco de dados, etc.)
async function getAdminDashboardData() {
  // Simula um pequeno atraso de rede
  await new Promise(resolve => setTimeout(resolve, 50));

  // Dados fictícios
  return {
    activeUsers: 1250,
    totalSalesCount: 580,
    totalRevenue: 45890.75,
    productCount: 215,
    // Dados para gráfico de vendas mensais (últimos 6 meses)
    monthlySales: [
      { month: 'Jan', sales: 6500.50, revenue: 8000 },
      { month: 'Fev', sales: 5900.00, revenue: 7500 },
      { month: 'Mar', sales: 8000.75, revenue: 10000 },
      { month: 'Abr', sales: 7100.25, revenue: 9000 },
      { month: 'Mai', sales: 9500.00, revenue: 11000 },
      { month: 'Jun', sales: 8890.25, revenue: 10500 },
    ],
    // Dados para tabela de vendas recentes
    recentSales: [
      { id: 'ORD-001', customer: 'João Silva', date: '2024-07-27', total: 150.00, status: 'Concluído' },
      { id: 'ORD-002', customer: 'Maria Oliveira', date: '2024-07-26', total: 85.50, status: 'Pendente' },
      { id: 'ORD-003', customer: 'Carlos Souza', date: '2024-07-26', total: 210.75, status: 'Concluído' },
      { id: 'ORD-004', customer: 'Ana Pereira', date: '2024-07-25', total: 55.00, status: 'Enviado' },
      { id: 'ORD-005', customer: 'Pedro Costa', date: '2024-07-25', total: 320.00, status: 'Concluído' },
    ]
  };
}
// --- Fim da simulação ---

// Componente de Card - Estilo ajustado
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string; // Ex: +5% vs last month
  changeType?: 'positive' | 'negative';
}

function MetricCard({ title, value, icon, change, changeType }: MetricCardProps) {
  const changeColor = changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-500';
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-start space-x-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        {change && (
          <p className={`mt-1 text-xs ${changeColor}`}>{change}</p>
        )}
      </div>
    </div>
  );
}

// Componente Gráfico Principal (agora LineChart)
interface RevenueChartProps {
  data: { month: string; revenue: number; sales: number }[]; // Adicionado sales como exemplo
}
function RevenueChart({ data }: RevenueChartProps) {
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 col-span-1 lg:col-span-3">
       <h3 className="text-lg font-medium text-gray-800 mb-4">Receita vs Vendas (Últimos 6 Meses)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
          <YAxis tickFormatter={formatCurrency} stroke="#6b7280" fontSize={12} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} name="Receita (R$)" dot={false} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="sales" stroke="#fb923c" strokeWidth={2} name="Vendas (R$)" dot={false} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Tabela de Vendas Recentes (estilo ajustado)
interface RecentSalesTableProps {
  data: { id: string; customer: string; date: string; total: number; status: string }[];
}
function RecentSalesTable({ data }: RecentSalesTableProps) {
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  const statusClasses: { [key: string]: string } = {
      'Concluído': 'bg-green-100 text-green-800',
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Enviado': 'bg-blue-100 text-blue-800',
      'Cancelado': 'bg-red-100 text-red-800',
  };
  const getStatusClass = (status: string) => statusClasses[status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mt-6 col-span-1 lg:col-span-3">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Vendas Recentes</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 hover:text-green-800 cursor-pointer">{sale.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{sale.customer}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(sale.date)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{formatCurrency(sale.total)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                   <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(sale.status)}`}>
                     {sale.status}
                   </span>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Componente Principal da Página ---
export default function AdminDashboardPage() {
  // Estado para armazenar os dados (necessário para 'use client')
  const [data, setData] = React.useState<Awaited<ReturnType<typeof getAdminDashboardData>> | null>(null);

  React.useEffect(() => {
    getAdminDashboardData().then(fetchedData => {
      setData(fetchedData);
    });
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!data) {
    return <div className="flex items-center justify-center h-full">Carregando dados...</div>;
  }

  return (
    <div className="space-y-6">
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                title="Receita Total"
                value={formatCurrency(data.totalRevenue)}
                icon={<IconPlaceholder className="text-green-600" />}
                change="+12% vs mês passado" // Exemplo
                changeType='positive'
            />
            <MetricCard
                title="Total de Vendas"
                value={data.totalSalesCount.toLocaleString('pt-BR')}
                icon={<IconPlaceholder className="text-blue-600" />}
                change="+80 pedidos" // Exemplo
                changeType='positive'
            />
            <MetricCard
                title="Usuários Ativos"
                value={data.activeUsers.toLocaleString('pt-BR')}
                icon={<IconPlaceholder className="text-purple-600" />}
                change="-5% vs mês passado" // Exemplo
                changeType='negative'
            />
             <MetricCard
                title="Produtos Cadastrados"
                value={data.productCount.toLocaleString('pt-BR')}
                icon={<IconPlaceholder className="text-orange-500" />}
            />
        </div>

        {/* Gráfico e Tabela */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Gráfico ocupando mais espaço */}
          <div className="lg:col-span-3">
             <RevenueChart data={data.monthlySales} />
          </div>

          {/* Tabela abaixo ou ao lado dependendo do espaço */}
           <div className="lg:col-span-3">
             <RecentSalesTable data={data.recentSales} />
          </div>
          {/* Você poderia adicionar mais gráficos/cards aqui, como o Donut e Bar Chart da imagem */}
        </div>
    </div>
  );
} 