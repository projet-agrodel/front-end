'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Package, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

// Dados simulados permanecem os mesmos
const mockPedidos = [
  { id: '#PED001', cliente: 'Ana Silva', data: '2024-07-23', valor: 150.00, status: 'Entregue', itens: 3 },
  { id: '#PED002', cliente: 'Bruno Costa', data: '2024-07-23', valor: 75.50, status: 'Enviado', itens: 1 },
  { id: '#PED003', cliente: 'Carlos Dias', data: '2024-07-22', valor: 220.00, status: 'Processando', itens: 5 },
  { id: '#PED004', cliente: 'Daniela Lima', data: '2024-07-22', valor: 99.90, status: 'Pendente', itens: 2 },
  { id: '#PED005', cliente: 'Eduardo Souz', data: '2024-07-21', valor: 310.75, status: 'Entregue', itens: 4 },
  { id: '#PED006', cliente: 'Fernanda Rui', data: '2024-07-20', valor: 180.20, status: 'Cancelado', itens: 2 },
  { id: '#PED007', cliente: 'Gabriel Alves', data: '2024-07-20', valor: 55.00, status: 'Entregue', itens: 1 },
];

const statusData = [
  { name: 'Entregue', value: mockPedidos.filter(p => p.status === 'Entregue').length, color: '#22c55e' },
  { name: 'Enviado', value: mockPedidos.filter(p => p.status === 'Enviado').length, color: '#3b82f6' },
  { name: 'Processando', value: mockPedidos.filter(p => p.status === 'Processando').length, color: '#eab308' },
  { name: 'Pendente', value: mockPedidos.filter(p => p.status === 'Pendente').length, color: '#f97316' },
  { name: 'Cancelado', value: mockPedidos.filter(p => p.status === 'Cancelado').length, color: '#ef4444' },
];

// Função para estilizar o status como um badge
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-800';

  switch (status) {
    case 'Entregue':
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      break;
    case 'Enviado':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-700';
      break;
    case 'Processando':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
      break;
    case 'Pendente':
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-700';
      break;
    case 'Cancelado':
      bgColor = 'bg-red-100';
      textColor = 'text-red-700';
      break;
  }
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

const TotalPedidosDetalhes: React.FC = () => {
  const totalPedidos = mockPedidos.length;
  const totalValorPedidos = mockPedidos.reduce((acc, pedido) => acc + pedido.valor, 0);

  return (
    <div className="space-y-6 p-1"> {/* Adicionado p-1 para evitar corte de sombra no modal */} 
      <h2 className="text-2xl font-semibold text-gray-800">Detalhamento de Pedidos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Resumo dos Status</h3>
          <div className="h-60 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Estatísticas Gerais</h3>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-3">
                    <Package size={20} className="text-blue-600"/>
                    <span className="text-sm text-gray-700">Total de Pedidos:</span>
                </div>
                <span className="text-lg font-semibold text-blue-700">{totalPedidos}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-md hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-3">
                     <CheckCircle size={20} className="text-green-600"/>
                    <span className="text-sm text-gray-700">Valor Total:</span>
                </div>
                <span className="text-lg font-semibold text-green-700">R$ {totalValorPedidos.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md hover:bg-yellow-100 transition-colors">
                 <div className="flex items-center space-x-3">
                    <Clock size={20} className="text-yellow-600"/>
                    <span className="text-sm text-gray-700">Pendentes:</span>
                </div>
                <span className="text-lg font-semibold text-yellow-700">{statusData.find(s => s.name === 'Pendente')?.value || 0}</span>
            </div>
             <div className="flex items-center justify-between p-3 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                 <div className="flex items-center space-x-3">
                    <AlertTriangle size={20} className="text-red-600"/>
                    <span className="text-sm text-gray-700">Cancelados:</span>
                </div>
                <span className="text-lg font-semibold text-red-700">{statusData.find(s => s.name === 'Cancelado')?.value || 0}</span>
            </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4 mt-6">Pedidos Recentes</h3>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockPedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pedido.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.cliente}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(pedido.data).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{pedido.itens}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">R$ {pedido.valor.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <StatusBadge status={pedido.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Para adicionar uma barra de rolagem se a tabela for muito alta, o wrapper do modal já faz isso. 
              Se for necessário dentro desta seção especificamente, um div com max-h- e overflow-auto pode ser adicionado envolvendo a table. */}
        </div>
      </div>
    </div>
  );
};

export default TotalPedidosDetalhes; 