'use client';

import React from 'react';
import { TrendingUp, ShoppingCart, Eye, CheckCircle, AlertOctagon, Zap, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'; // Usaremos BarChart para o funil

const funnelData = [
  { stage: 'Visitantes', value: 12000, color: '#3b82f6' },         // Azul
  { stage: 'Visualizaram Produto', value: 7500, color: '#22d3ee' }, // Ciano
  { stage: 'Adicionaram Carrinho', value: 2500, color: '#a3e635' },// Verde claro
  { stage: 'Concluíram Compra', value: 980, color: '#22c55e' },   // Verde
];

interface ConversionRate {
  from: string;
  to: string;
  rate: string;
}

// Calcular taxas de conversão entre etapas
const conversionRates: ConversionRate[] = [];
for (let i = 0; i < funnelData.length - 1; i++) {
  const rate = (funnelData[i+1].value / funnelData[i].value) * 100;
  conversionRates.push({
    from: funnelData[i].stage,
    to: funnelData[i+1].stage,
    rate: rate.toFixed(1) + '%',
  });
}

const mockOtimizacoes = [
  { id: 1, texto: "Melhoria na velocidade de carregamento da página de produto (+5% conversão em Add to Cart)", tipo: "sucesso", icon: <Zap size={16} className="text-green-500" /> },
  { id: 2, texto: "Checkout simplificado em 2 etapas resultou em +3% na finalização de compra.", tipo: "sucesso", icon: <Zap size={16} className="text-green-500" /> },
  { id: 3, texto: "Investigar abandono de carrinho na etapa de seleção de frete.", tipo: "alerta", icon: <AlertOctagon size={16} className="text-yellow-500" /> },
];

const TaxaConversaoDetalhes: React.FC = () => {
  const taxaConversaoGeral = ((funnelData[funnelData.length -1].value / funnelData[0].value) * 100).toFixed(2);

  return (
    <div className="space-y-6 p-1">
      <h2 className="text-2xl font-semibold text-gray-800">Análise da Taxa de Conversão</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-emerald-100 rounded-full"><TrendingUp size={24} className="text-emerald-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Taxa de Conversão Geral</p>
            <p className="text-xl font-bold text-gray-800">{taxaConversaoGeral}%</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-green-100 rounded-full"><CheckCircle size={24} className="text-green-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Total Conversões (Período)</p>
            <p className="text-xl font-bold text-gray-800">{funnelData[funnelData.length -1].value}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-sky-100 rounded-full"><Eye size={24} className="text-sky-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Visualizações de Produto</p>
            <p className="text-xl font-bold text-gray-800">{funnelData[1].value.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-purple-100 rounded-full"><ShoppingCart size={24} className="text-purple-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Carrinhos Criados</p>
            <p className="text-xl font-bold text-gray-800">{funnelData[2].value.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-1">Funil de Conversão</h3>
          <p className="text-xs text-gray-500 mb-4">Visualização das etapas do processo de compra.</p>
          <div className="space-y-3">
            {funnelData.map((item, index) => (
              <div key={item.stage} className="w-full">
                <div className="flex justify-between items-center mb-0.5">
                    <span className="text-sm font-medium text-gray-600">{item.stage}</span>
                    <span className="text-sm font-semibold text-gray-800">{item.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    style={{ width: `${(item.value / funnelData[0].value) * 100}%`, backgroundColor: item.color }}
                    className="h-6 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500 ease-out"
                  >
                    {((item.value / funnelData[0].value) * 100).toFixed(1)}%
                  </div>
                </div>
                {index < funnelData.length - 1 && (
                  <div className="flex justify-end items-center mt-0.5 pr-2">
                    <TrendingDown size={12} className="text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      {conversionRates[index]?.rate} para "{conversionRates[index]?.to}"
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Otimizações e Alertas</h3>
          <div className="space-y-4">
            {mockOtimizacoes.map(item => (
              <div key={item.id} className={`p-4 rounded-md flex items-start space-x-3 ${item.tipo === 'sucesso' ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div className={`mt-0.5 ${item.tipo === 'sucesso' ? 'text-green-600' : 'text-yellow-600'}`}>{item.icon}</div>
                <p className={`text-sm ${item.tipo === 'sucesso' ? 'text-green-800' : 'text-yellow-800'}`}>{item.texto}</p>
              </div>
            ))}
            <button className="w-full mt-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors py-2 rounded-md bg-indigo-50 hover:bg-indigo-100 font-medium">
              Ver todas as otimizações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxaConversaoDetalhes; 