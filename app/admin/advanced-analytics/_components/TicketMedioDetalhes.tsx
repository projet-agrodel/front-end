'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, Gift } from 'lucide-react';

const mockTicketMedioData = [
  { data: '01/Jul', valor: 115.50 }, { data: '02/Jul', valor: 122.30 },
  { data: '03/Jul', valor: 118.90 }, { data: '04/Jul', valor: 125.60 },
  { data: '05/Jul', valor: 130.10 }, { data: '06/Jul', valor: 128.75 },
  { data: '07/Jul', valor: 135.20 }, { data: '08/Jul', valor: 132.40 },
  { data: '09/Jul', valor: 140.00 }, { data: '10/Jul', valor: 138.50 },
];

const mockProdutosImpactoTicket = [
  { id: 'PROD078', nome: 'Kit Gourmet Especial', valorMedioAdicionado: 45.50, imagemUrl: '/images/placeholder-prod1.svg' },
  { id: 'PROD102', nome: 'Vinho Reserva Premium', valorMedioAdicionado: 35.20, imagemUrl: '/images/placeholder-prod2.svg' },
  { id: 'PROD030', nome: 'Cesta de Orgânicos Grande', valorMedioAdicionado: 28.90, imagemUrl: '/images/placeholder-prod3.svg' },
  { id: 'PROD254', nome: 'Azeite Extra Virgem Importado', valorMedioAdicionado: 18.75, imagemUrl: '/images/placeholder-prod4.svg' },
];

const TicketMedioDetalhes: React.FC = () => {
  const ticketMedioAtual = mockTicketMedioData[mockTicketMedioData.length - 1].valor;
  const ticketMedioAnterior = mockTicketMedioData[mockTicketMedioData.length - 2].valor;
  const variacaoTicket = ticketMedioAtual - ticketMedioAnterior;
  const variacaoPercentual = (variacaoTicket / ticketMedioAnterior) * 100;

  const maiorTicket = Math.max(...mockTicketMedioData.map(item => item.valor));
  const menorTicket = Math.min(...mockTicketMedioData.map(item => item.valor));

  return (
    <div className="space-y-6 p-1">
      <h2 className="text-2xl font-semibold text-gray-800">Análise do Ticket Médio</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-green-100 rounded-full"><DollarSign size={24} className="text-green-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Ticket Médio Atual</p>
            <p className="text-xl font-bold text-gray-800">R$ {ticketMedioAtual.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className={`p-3 rounded-full ${variacaoTicket >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {variacaoTicket >= 0 ? 
              <TrendingUp size={24} className="text-emerald-600" /> : 
              <TrendingDown size={24} className="text-red-600" />
            }
          </div>
          <div>
            <p className="text-xs text-gray-500">Variação (vs Dia Ant.)</p>
            <p className={`text-xl font-bold ${variacaoTicket >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {variacaoTicket >= 0 ? '+' : ''}R$ {variacaoTicket.toFixed(2)} ({variacaoPercentual.toFixed(1)}%)
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-sky-100 rounded-full"><ArrowUpCircle size={24} className="text-sky-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Maior Ticket (Período)</p>
            <p className="text-xl font-bold text-gray-800">R$ {maiorTicket.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-amber-100 rounded-full"><ArrowDownCircle size={24} className="text-amber-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Menor Ticket (Período)</p>
            <p className="text-xl font-bold text-gray-800">R$ {menorTicket.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Evolução do Ticket Médio (Últimos 10 dias)</h3>
          <div className="h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTicketMedioData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="data" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tickFormatter={(value) => `R$${value.toFixed(0)}`} tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip 
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Ticket Médio']}
                    contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', borderColor: '#e5e7eb' }}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: "14px" }} />
                <Line type="monotone" dataKey="valor" name="Ticket Médio" stroke="#10b981" strokeWidth={2.5} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-5">Produtos de Maior Impacto no Ticket</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
            {mockProdutosImpactoTicket.map((produto) => (
              <div key={produto.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img src={produto.imagemUrl} alt={produto.nome} className="w-12 h-12 rounded-md object-cover mr-4 border" />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800 truncate">{produto.nome}</p>
                  <p className="text-xs text-green-600">+ R$ {produto.valorMedioAdicionado.toFixed(2)} no ticket</p>
                </div>
                <Gift size={18} className="text-indigo-500 ml-2 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketMedioDetalhes; 