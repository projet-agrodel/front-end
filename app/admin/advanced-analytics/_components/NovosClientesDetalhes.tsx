'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, UserPlus, DollarSign, ShoppingBag, Mail, Share2 } from 'lucide-react';

const mockNovosClientesData = [
  { mes: 'Jan', novosClientes: 65 },
  { mes: 'Fev', novosClientes: 59 },
  { mes: 'Mar', novosClientes: 80 },
  { mes: 'Abr', novosClientes: 81 },
  { mes: 'Mai', novosClientes: 56 },
  { mes: 'Jun', novosClientes: 72 },
  { mes: 'Jul', novosClientes: 95 }, // Mês atual (simulado)
];

const mockClientesRecentes = [
  { id: 'USR001', nome: 'Mariana Santos', dataRegistro: '2024-07-22', canal: 'Orgânico' },
  { id: 'USR002', nome: 'Rafael Oliveira', dataRegistro: '2024-07-21', canal: 'Referência' },
  { id: 'USR003', nome: 'Juliana Pereira', dataRegistro: '2024-07-21', canal: 'Social' },
  { id: 'USR004', nome: 'Lucas Martins', dataRegistro: '2024-07-20', canal: 'Campanha Email' },
  { id: 'USR005', nome: 'Beatriz Almeida', dataRegistro: '2024-07-19', canal: 'Orgânico' },
];

const getCanalIcon = (canal: string) => {
  switch (canal.toLowerCase()) {
    case 'orgânico': return <ShoppingBag size={16} className="text-green-500" />;
    case 'referência': return <Share2 size={16} className="text-blue-500" />;
    case 'social': return <Users size={16} className="text-purple-500" />;
    case 'campanha email': return <Mail size={16} className="text-orange-500" />;
    default: return <UserPlus size={16} className="text-gray-500" />;
  }
};

const NovosClientesDetalhes: React.FC = () => {
  const totalNovosClientesPeriodo = mockNovosClientesData.reduce((sum, item) => sum + item.novosClientes, 0);
  const mediaNovosClientesMes = totalNovosClientesPeriodo / mockNovosClientesData.length;
  // Simulação de crescimento
  const novosClientesMesAtual = mockNovosClientesData[mockNovosClientesData.length - 1].novosClientes;
  const novosClientesMesAnterior = mockNovosClientesData[mockNovosClientesData.length - 2].novosClientes;
  const crescimentoPercentual = ((novosClientesMesAtual - novosClientesMesAnterior) / novosClientesMesAnterior) * 100;

  return (
    <div className="space-y-6 p-1">
      <h2 className="text-2xl font-semibold text-gray-800">Análise de Novos Clientes</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users size={28} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Novos Clientes</p>
            <p className="text-2xl font-bold text-gray-800">{totalNovosClientesPeriodo}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-50 transition-colors">
          <div className={`p-3 rounded-full ${crescimentoPercentual >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            <TrendingUp size={28} className={`${crescimentoPercentual >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Crescimento (vs Mês Ant.)</p>
            <p className={`text-2xl font-bold ${crescimentoPercentual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {crescimentoPercentual.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-indigo-100 rounded-full">
            <DollarSign size={28} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">CPA Estimado</p>
            <p className="text-2xl font-bold text-gray-800">R$ 12,50</p> {/* Valor Simulado */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Novos Clientes por Mês</h3>
          <div className="h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockNovosClientesData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
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
          <h3 className="text-lg font-medium text-gray-700 mb-4">Clientes Recentes</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
            {mockClientesRecentes.map((cliente) => (
              <div key={cliente.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-full border border-gray-200">
                    {getCanalIcon(cliente.canal)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{cliente.nome}</p>
                    <p className="text-xs text-gray-500">Registrado em: {new Date(cliente.dataRegistro).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-full border border-gray-200">
                  {cliente.canal}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovosClientesDetalhes; 