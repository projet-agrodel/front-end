'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getTotalOrders, TotalOrdersData } from '@/services/adminAnalyticsService';
import { TrendingUp, TrendingDown, ShoppingCart, Calendar, RefreshCw, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function TotalPedidosDetalhes() {
  const { data: session } = useSession();
  const [ordersData, setOrdersData] = useState<TotalOrdersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersData = async () => {
    if (!session?.accessToken) return;
    
    try {
      setLoading(true);
      const data = await getTotalOrders(session.accessToken);
      setOrdersData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando dados de pedidos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchOrdersData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }
  if (!ordersData) {
    return <div className="text-center py-8 text-gray-500">Nenhum dado disponível</div>;
  }

  const weekdayChartData = {
    labels: ordersData.weekday_orders_chart.map(item => item.day),
    datasets: [
      {
        label: 'Pedidos por Dia',
        data: ordersData.weekday_orders_chart.map(item => item.orders),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(6, 182, 212, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(6, 182, 212, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const statusChartData = {
    labels: ['Concluídos', 'Pendentes', 'Cancelados'],
    datasets: [
      {
        data: [
          ordersData.status_breakdown.completed,
          ordersData.status_breakdown.pending,
          ordersData.status_breakdown.cancelled,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const getTrendIcon = () => {
    if (ordersData.trend_direction === 'up') {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    } else if (ordersData.trend_direction === 'down') {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    }
    return <ShoppingCart className="h-5 w-5 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (ordersData.trend_direction === 'up') return 'text-green-500';
    if (ordersData.trend_direction === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header com métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
              <p className="text-3xl font-bold text-gray-900">{ordersData.total_orders.toLocaleString('pt-BR')}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Período Anterior</p>
              <p className="text-2xl font-bold text-gray-700">
                {ordersData.previous_period_orders.toLocaleString('pt-BR')}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Variação</p>
              <div className="flex items-center space-x-2">
                {getTrendIcon()}
                <span className={`text-2xl font-bold ${getTrendColor()}`}>
                  {ordersData.trend_percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Média Diária</p>
              <p className="text-2xl font-bold text-gray-900">
                {ordersData.average_orders_per_day.toFixed(1)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Status dos pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-600">Concluídos</p>
              <p className="text-2xl font-bold text-green-700">
                {ordersData.status_breakdown.completed.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-yellow-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-700">
                {ordersData.status_breakdown.pending.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center space-x-3">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-600">Cancelados</p>
              <p className="text-2xl font-bold text-red-700">
                {ordersData.status_breakdown.cancelled.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h4 className="text-lg font-semibold mb-4">Pedidos por Dia da Semana</h4>
          <Bar data={weekdayChartData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h4 className="text-lg font-semibold mb-4">Status dos Pedidos</h4>
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Doughnut data={statusChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Informações do período */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Informações do Período</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Data inicial: </span>
            <span className="font-medium">{new Date(ordersData.period.start_date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div>
            <span className="text-gray-600">Data final: </span>
            <span className="font-medium">{new Date(ordersData.period.end_date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div>
            <span className="text-gray-600">Última atualização: </span>
            <span className="font-medium">{new Date(ordersData.last_updated).toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Botão de atualização */}
      <div className="flex justify-end">
        <button 
          onClick={fetchOrdersData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Dados</span>
        </button>
      </div>
    </div>
  );
}
