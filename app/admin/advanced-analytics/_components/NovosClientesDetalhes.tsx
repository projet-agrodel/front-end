'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, UserPlus, DollarSign, ShoppingBag, Mail, Share2, RefreshCw } from 'lucide-react';
import { getNewCustomers, NewCustomersData } from '@/services/adminAnalyticsService';

const getCanalIcon = (canal: string) => {
  switch (canal.toLowerCase()) {
    case 'orgânico': return <ShoppingBag size={16} className="text-green-500" />;
    case 'referência': return <Share2 size={16} className="text-blue-500" />;
    case 'social': return <Users size={16} className="text-purple-500" />;
    case 'campanha email': return <Mail size={16} className="text-orange-500" />;
    case 'direto': return <UserPlus size={16} className="text-gray-700" />;
    default: return <UserPlus size={16} className="text-gray-500" />;
  }
};

const NovosClientesDetalhes: React.FC = () => {
  const { data: session } = useSession();
  const [newCustomersData, setNewCustomersData] = useState<NewCustomersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewCustomersData = useCallback(async () => {
    if (!session?.accessToken) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getNewCustomers(session.accessToken);
      setNewCustomersData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de novos clientes');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchNewCustomersData();
    }
  }, [session, fetchNewCustomersData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 h-96">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando dados de novos clientes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchNewCustomersData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Tentar novamente</span>
        </button>
      </div>
    );
  }

  if (!newCustomersData) {
    return <div className="text-center py-8 text-gray-500 h-96 flex items-center justify-center">Nenhum dado disponível para novos clientes.</div>;
  }

  const { monthly_new_customers_chart, recent_customers, summary_metrics } = newCustomersData;

  return (
    <div className="space-y-6 p-1">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Análise de Novos Clientes</h2>
        <button 
          onClick={fetchNewCustomersData}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users size={28} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Novos Clientes</p>
            <p className="text-2xl font-bold text-gray-800">{summary_metrics.total_new_customers_period}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-50 transition-colors">
          <div className={`p-3 rounded-full ${summary_metrics.growth_percentage_vs_previous_month >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            <TrendingUp size={28} className={`${summary_metrics.growth_percentage_vs_previous_month >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Crescimento (vs Mês Ant.)</p>
            <p className={`text-2xl font-bold ${summary_metrics.growth_percentage_vs_previous_month >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary_metrics.growth_percentage_vs_previous_month.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-indigo-100 rounded-full">
            <DollarSign size={28} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">CPA Estimado</p>
            <p className="text-2xl font-bold text-gray-800">R$ {summary_metrics.estimated_cpa_brl.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Novos Clientes por Mês</h3>
          <div className="h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly_new_customers_chart} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', borderColor: '#e5e7eb' }}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                  itemStyle={{ color: '#4f46e5' }}
                />
                <Legend wrapperStyle={{ fontSize: "14px" }} />
                <Bar dataKey="novosClientes" name="Novos Clientes" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Clientes Recentes (Últimos {recent_customers.length > 0 ? 'Registrados' : '...'})</h3>
          {recent_customers.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
              {recent_customers.map((cliente) => (
                <div key={cliente.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-full border border-gray-200">
                      {getCanalIcon(cliente.canal)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{cliente.nome}</p>
                      <p className="text-xs text-gray-500">Registrado em: {new Date(cliente.dataRegistro).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-full border border-gray-200">
                    {cliente.canal}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-4">Nenhum cliente recente para exibir.</p>
          )}
        </div>
      </div>
      
      <div className="bg-gray-100 p-3 rounded-lg mt-4 text-xs text-gray-600 text-center">
        Última atualização dos dados: {new Date(newCustomersData.last_updated).toLocaleString('pt-BR')}
      </div>
    </div>
  );
};

export default NovosClientesDetalhes; 