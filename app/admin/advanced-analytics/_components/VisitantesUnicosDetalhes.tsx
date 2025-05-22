'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Repeat, UserCheck, TrendingDown, Globe, Link2, ExternalLink, Search } from 'lucide-react';

const mockVisitantesData = [
  { dia: '01/07', visitantes: 350 }, { dia: '02/07', visitantes: 410 },
  { dia: '03/07', visitantes: 380 }, { dia: '04/07', visitantes: 520 },
  { dia: '05/07', visitantes: 480 }, { dia: '06/07', visitantes: 610 },
  { dia: '07/07', visitantes: 550 }, { dia: '08/07', visitantes: 700 },
  { dia: '09/07', visitantes: 650 }, { dia: '10/07', visitantes: 720 },
];

const mockFontesTrafego = [
  { nome: 'Busca Orgânica', visitantes: 5800, percentual: 45, icone: <Search size={18} className="text-blue-500" /> },
  { nome: 'Tráfego Direto', visitantes: 3200, percentual: 25, icone: <Globe size={18} className="text-green-500" /> },
  { nome: 'Redes Sociais', visitantes: 2500, percentual: 19, icone: <Users size={18} className="text-purple-500" /> },
  { nome: 'Referências', visitantes: 1500, percentual: 11, icone: <Link2 size={18} className="text-orange-500" /> },
];

const VisitantesUnicosDetalhes: React.FC = () => {
  const totalVisitantes = mockVisitantesData.reduce((sum, item) => sum + item.visitantes, 0);
  const mediaVisitantesDia = totalVisitantes / mockVisitantesData.length;

  return (
    <div className="space-y-6 p-1">
      <h2 className="text-2xl font-semibold text-gray-800">Análise de Visitantes Únicos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-teal-100 rounded-full"><Users size={24} className="text-teal-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Total Visitantes</p>
            <p className="text-xl font-bold text-gray-800">{totalVisitantes.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-sky-100 rounded-full"><Repeat size={24} className="text-sky-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Visitantes Recorrentes</p>
            <p className="text-xl font-bold text-gray-800">35%</p> {/* Simulado */}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-lime-100 rounded-full"><UserCheck size={24} className="text-lime-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Novas Sessões</p>
            <p className="text-xl font-bold text-gray-800">65%</p> {/* Simulado */}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-pink-100 rounded-full"><TrendingDown size={24} className="text-pink-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Taxa de Rejeição</p>
            <p className="text-xl font-bold text-gray-800">42%</p> {/* Simulado */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Visitantes Únicos por Dia (Últimos 10 dias)</h3>
          <div className="h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockVisitantesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', borderColor: '#e5e7eb' }}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: "14px" }}/>
                <Line type="monotone" dataKey="visitantes" name="Visitantes" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-5">Principais Fontes de Tráfego</h3>
          <div className="space-y-4">
            {mockFontesTrafego.map((fonte) => (
              <div key={fonte.nome} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2.5">
                    {fonte.icone}
                    <span className="text-sm font-medium text-gray-700">{fonte.nome}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{fonte.visitantes.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ width: `${fonte.percentual}%`, backgroundColor: fonte.icone.props.className.includes('blue') ? '#3b82f6' : fonte.icone.props.className.includes('green') ? '#22c55e' : fonte.icone.props.className.includes('purple') ? '#a855f7' : '#f97316' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitantesUnicosDetalhes; 