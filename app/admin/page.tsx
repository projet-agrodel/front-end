'use client'; // Adicionar esta diretiva para componentes de cliente (gráficos)

import React from 'react';
import { useEffect } from 'react'; // Importar useEffect
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
// Importar ícones reais
import { DollarSign, ShoppingBag, Users, Archive } from 'lucide-react'; 
import { useSession } from 'next-auth/react'; // Importar useSession

import { 
  getDashboardSummary, 
  getMonthlySales, 
  getRecentSales,
  DashboardSummaryData,
  MonthlySalesData,
  RecentSalesData
} from '@/services/adminAnalyticsService'; // Importar serviços e interfaces

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
        {/* O ícone real será passado como prop aqui */}
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
  data: MonthlySalesData[]; // Usar a interface importada
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
  data: RecentSalesData[]; // Usar a interface importada
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
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  // Estados para armazenar os dados do backend
  const [summaryData, setSummaryData] = React.useState<DashboardSummaryData | null>(null);
  const [monthlySalesData, setMonthlySalesData] = React.useState<MonthlySalesData[] | null>(null);
  const [recentSalesData, setRecentSalesData] = React.useState<RecentSalesData[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Autenticação não encontrada. Não é possível carregar os dados.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [summary, monthly, recent] = await Promise.all([
          getDashboardSummary(token),
          getMonthlySales(token),
          getRecentSales(token)
        ]);
        setSummaryData(summary);
        setMonthlySalesData(monthly);
        setRecentSalesData(recent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao carregar dados do dashboard.');
        console.error("Erro ao buscar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchData();
    } else if (session === null) { // Sessão explicitamente nula (não está carregando, mas não há sessão)
      setError("Usuário não autenticado. Não é possível carregar os dados.");
      setLoading(false);
    }
  }, [session, token]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando dados...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-600">Erro: {error}</div>;
  }

  // Se os dados ainda não foram carregados ou há um erro, não renderize o dashboard
  if (!summaryData || !monthlySalesData || !recentSalesData) {
    return null; // Ou um fallback mais elaborado
  }

  return (
    <div className="space-y-6">
        {/* Cards de Métricas com ícones reais */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                title="Receita Total"
                value={formatCurrency(summaryData.totalRevenue)}
                icon={<DollarSign size={24} className="text-green-600" />}
                change="+12% vs mês passado" 
                changeType='positive'
            />
            <MetricCard
                title="Total de Vendas"
                value={summaryData.totalSalesCount.toLocaleString('pt-BR')}
                icon={<ShoppingBag size={24} className="text-blue-600" />}
                change="+80 pedidos"
                changeType='positive'
            />
            <MetricCard
                title="Usuários Ativos"
                value={summaryData.activeUsers.toLocaleString('pt-BR')}
                icon={<Users size={24} className="text-purple-600" />}
                change="-5% vs mês passado"
                changeType='negative'
            />
             <MetricCard
                title="Produtos Cadastrados"
                value={summaryData.productCount.toLocaleString('pt-BR')}
                icon={<Archive size={24} className="text-orange-500" />}
            />
        </div>

        {/* Gráfico e Tabela */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
          {/* Gráfico ocupando mais espaço */}
          <div className="lg:col-span-3">
             <RevenueChart data={monthlySalesData} />
          </div>

          {/* Tabela abaixo ou ao lado dependendo do espaço */}
           <div className="lg:col-span-3">
             <RecentSalesTable data={recentSalesData} />
          </div>
          {/* Você poderia adicionar mais gráficos/cards aqui, como o Donut e Bar Chart da imagem */}
        </div>
    </div>
  );
}
