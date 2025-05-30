'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Repeat, UserCheck, TrendingDown, Globe, Link2, Search, HelpCircle, RefreshCw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  getVisitantesUnicosDetails,
  VisitantesUnicosDetailsData,
  VisitanteEvolucaoItem,
  FonteTrafegoItem,
  VisitantesUnicosSummaryCardsData
} from '@/services/adminAnalyticsService';

const LucideIcon = ({ name, ...props }: { name: string;[key: string]: any }) => {
  switch (name) {
    case 'Search': return <Search {...props} />;
    case 'Globe': return <Globe {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Link2': return <Link2 {...props} />;
    default: return <HelpCircle {...props} />;
  }
};

const initialEvolutionData: VisitanteEvolucaoItem[] = [];
const initialTrafficSourcesData: FonteTrafegoItem[] = [];
const initialSummaryCardsData: VisitantesUnicosSummaryCardsData = {
  totalVisitantes: 0,
  visitantesRecorrentesPercentual: 0,
  novasSessoesPercentual: 0,
  taxaRejeicaoPercentual: 0
};

const VisitantesUnicosDetalhes: React.FC = () => {
  const { data: session, status: sessionStatus } = useSession();
  const token = session?.accessToken as string | undefined;

  const [evolutionData, setEvolutionData] = useState<VisitanteEvolucaoItem[]>(initialEvolutionData);
  const [trafficSourcesData, setTrafficSourcesData] = useState<FonteTrafegoItem[]>(initialTrafficSourcesData);
  const [summaryCardsData, setSummaryCardsData] = useState<VisitantesUnicosSummaryCardsData>(initialSummaryCardsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (sessionStatus === 'loading' || !token) {
      if (sessionStatus !== 'authenticated') {
        setError("Usuário não autenticado ou token indisponível.");
      }
      setLoading(sessionStatus === 'loading');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data: VisitantesUnicosDetailsData = await getVisitantesUnicosDetails(token);
      setEvolutionData(data.evolutionData || []);
      setTrafficSourcesData(data.trafficSourcesData || []);
      setSummaryCardsData(data.summaryCardsData || initialSummaryCardsData); // Garante que não seja undefined
    } catch (err) {
      let errorMessage = "Ocorreu um erro desconhecido ao buscar dados de visitantes.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("Erro ao buscar dados para VisitantesUnicosDetalhes:", err);
    } finally {
      setLoading(false);
    }
  }, [sessionStatus, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && sessionStatus === 'loading') {
    return (
      <div className="flex items-center justify-center py-8 h-96">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando sessão...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 h-96">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando detalhes dos visitantes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 h-96">
        <p className="text-red-500 mb-4">{error}</p>
        {sessionStatus === 'authenticated' && token && (
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Tentar novamente</span>
          </button>
        )}
         {sessionStatus !== 'authenticated' && !token && (
            <p className="text-sm text-gray-500">Por favor, faça login para ver estes dados.</p>
        )}
      </div>
    );
  }

  if (evolutionData.length === 0 && trafficSourcesData.length === 0 && !loading) {
    return <div className="text-center py-8 text-gray-500 h-96 flex items-center justify-center">Não há dados de visitantes únicos disponíveis no momento.</div>
  }

  return (
    <div className="space-y-6 p-1">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Análise de Visitantes Únicos</h2>
         <button 
          onClick={fetchData}
          disabled={loading || sessionStatus === 'loading' || !token}
          className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-teal-100 rounded-full"><Users size={24} className="text-teal-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Total Visitantes</p>
            <p className="text-xl font-bold text-gray-800">{summaryCardsData.totalVisitantes.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-sky-100 rounded-full"><Repeat size={24} className="text-sky-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Visitantes Recorrentes</p>
            <p className="text-xl font-bold text-gray-800">{summaryCardsData.visitantesRecorrentesPercentual}%</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-lime-100 rounded-full"><UserCheck size={24} className="text-lime-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Novas Sessões</p>
            <p className="text-xl font-bold text-gray-800">{summaryCardsData.novasSessoesPercentual}%</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-pink-100 rounded-full"><TrendingDown size={24} className="text-pink-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Taxa de Rejeição</p>
            <p className="text-xl font-bold text-gray-800">{summaryCardsData.taxaRejeicaoPercentual}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Visitantes Únicos por Dia (Backend)</h3>
          <div className="h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
          <h3 className="text-lg font-medium text-gray-700 mb-5">Principais Fontes de Tráfego (Backend)</h3>
          <div className="space-y-4">
            {trafficSourcesData.map((fonte) => {
              // Determinar a cor da barra com base no nome do ícone ou em uma propriedade de cor se disponível
              let barColor = '#3b82f6'; // Cor padrão azul
              if (fonte.iconName === 'Globe') barColor = '#22c55e'; // Verde para Globe
              else if (fonte.iconName === 'Users') barColor = '#a855f7'; // Roxo para Users
              else if (fonte.iconName === 'Link2') barColor = '#f97316'; // Laranja para Link2

              return (
                <div key={fonte.nome} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2.5">
                      <LucideIcon name={fonte.iconName} size={18} className={`text-${barColor.replace('#', '')}-500`} />
                      <span className="text-sm font-medium text-gray-700">{fonte.nome}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{fonte.visitantes.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ width: `${fonte.percentual}%`, backgroundColor: barColor }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitantesUnicosDetalhes; 