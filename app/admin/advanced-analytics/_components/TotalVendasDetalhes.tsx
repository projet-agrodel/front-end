'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getTotalSales, TotalSalesData } from '@/services/adminAnalyticsService';
import { TrendingUp, TrendingDown, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Tick
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TotalVendasDetalhes() {
  const { data: session } = useSession();
  const [salesData, setSalesData] = useState<TotalSalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesData = useCallback(async () => {
    if (!session?.accessToken) return;
    
    try {
      setLoading(true);
      const data = await getTotalSales(session.accessToken);
      setSalesData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando dados de vendas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchSalesData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }
  if (!salesData) {
    return <div className="text-center py-8 text-gray-500">Nenhum dado disponível</div>;
  }

  const chartData = {
    labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    datasets: [
      {
        label: 'Vendas Diárias',
        data: salesData.daily_sales_chart,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Vendas dos Últimos 7 Dias',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          callback: function(tickValue: string | number, _index: number, _ticks: Tick[]) {
            if (typeof tickValue === 'number') {
              return 'R$ ' + tickValue.toLocaleString('pt-BR');
            }
            return tickValue;
          }
        }
      }
    }
  };

  const getTrendIcon = () => {
    if (salesData.trend_direction === 'up') {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    } else if (salesData.trend_direction === 'down') {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    }
    return <DollarSign className="h-5 w-5 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (salesData.trend_direction === 'up') return 'text-green-500';
    if (salesData.trend_direction === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header com métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-blue-100 rounded-full">
            <DollarSign className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Vendas</p>
            <p className="text-2xl font-bold text-gray-800">{salesData.formatted_total}</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-indigo-100 rounded-full">
            <Calendar className="h-7 w-7 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Período Anterior</p>
            <p className="text-2xl font-bold text-gray-800">
              R$ {salesData.previous_period_sales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-50 transition-colors">
          <div className={`p-3 rounded-full ${getTrendColor() === 'text-green-500' ? 'bg-green-100' : 'bg-red-100'}`}>
            {getTrendIcon()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Variação</p>
            <span className={`text-2xl font-bold ${getTrendColor().replace('-500', '-600')}`}>
              {salesData.trend_percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>      {/* Gráfico de vendas diárias */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Detalhes das vendas diárias */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h4 className="text-lg font-semibold mb-4 text-gray-700">Vendas por Dia</h4>
        <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((label, index) => (
            <div key={index} className="text-center p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
              <div className="text-xs font-medium text-gray-600">{label}</div>
              <div className="text-sm font-bold text-gray-900 mt-1">
                R$ {salesData.daily_sales_chart[index]?.toLocaleString('pt-BR', { minimumFractionDigits: 0 }) || '0'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informações do período */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h4 className="font-semibold text-gray-700 mb-3">Informações do Período</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="text-gray-600">Data inicial: </span>
            <span className="font-medium">{new Date(salesData.period.start_date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="text-gray-600">Data final: </span>
            <span className="font-medium">{new Date(salesData.period.end_date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="text-gray-600">Moeda: </span>
            <span className="font-medium">{salesData.currency}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="text-gray-600">Última atualização: </span>
            <span className="font-medium">{new Date(salesData.last_updated).toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Botão de atualização */}
      <div className="flex justify-end">
        <button 
          onClick={fetchSalesData}
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
