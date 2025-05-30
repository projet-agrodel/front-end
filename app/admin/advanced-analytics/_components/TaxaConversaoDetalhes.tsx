'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, ShoppingCart, Eye, CheckCircle, AlertOctagon, Zap, TrendingDown, MailCheck, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { getTaxaConversaoDetails, TaxaConversaoDetailsData, FunnelStageData, OptimizationData } from '@/services/adminAnalyticsService';
import { useSession } from 'next-auth/react';

// Interfaces locais podem ser removidas se as do serviço forem suficientes ou renomeadas para evitar conflitos
// interface FunnelStage { ... }
// interface Optimization { ... }

interface ConversionRate {
  from: string;
  to: string;
  rate: string;
}

// Função para mapear nome do ícone para componente Lucide
const LucideIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  switch (name) {
    case 'Zap': return <Zap {...props} />;
    case 'AlertOctagon': return <AlertOctagon {...props} />;
    case 'MailCheck': return <MailCheck {...props} />;
    default: return <HelpCircle {...props} />;
  }
};

const TaxaConversaoDetalhes: React.FC = () => {
  const [funnelData, setFunnelData] = useState<FunnelStageData[]>([]);
  const [optimizations, setOptimizations] = useState<OptimizationData[]>([]);
  const [conversionRates, setConversionRates] = useState<ConversionRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: session, status: sessionStatus } = useSession();
  const token = session?.accessToken as string | undefined;

  useEffect(() => {
    const fetchData = async () => {
      if (sessionStatus === 'loading') {
        setLoading(true);
        return;
      }

      if (!session || !token) {
        setError("Usuário não autenticado ou token indisponível. Não é possível buscar os dados.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const data: TaxaConversaoDetailsData = await getTaxaConversaoDetails(token);
        
        setFunnelData(data.funnelData || []);
        setOptimizations(data.optimizations || []);

        if (data.funnelData && data.funnelData.length > 0) {
          const rates: ConversionRate[] = [];
          for (let i = 0; i < data.funnelData.length - 1; i++) {
            const currentStageValue = data.funnelData[i].value;
            const nextStageValue = data.funnelData[i+1].value;
            if (currentStageValue > 0) {
              const rate = (nextStageValue / currentStageValue) * 100;
              rates.push({
                from: data.funnelData[i].stage,
                to: data.funnelData[i+1].stage,
                rate: rate.toFixed(1) + '%',
              });
            } else {
              rates.push({
                from: data.funnelData[i].stage,
                to: data.funnelData[i+1].stage,
                rate: 'N/A',
              });
            }
          }
          setConversionRates(rates);
        }

      } catch (err) {
        let errorMessage = "Ocorreu um erro desconhecido ao buscar dados da taxa de conversão.";
        if (err instanceof Error) {
          errorMessage = err.message;
        } 
        setError(errorMessage);
        console.error("Erro ao buscar dados para TaxaConversaoDetalhes:", errorMessage, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, token, sessionStatus]);

  const taxaConversaoGeral = funnelData.length > 0 
    ? ((funnelData[funnelData.length -1].value / funnelData[0].value) * 100).toFixed(2) 
    : "0.00";

  const totalConversoes = funnelData.length > 0 ? funnelData[funnelData.length -1].value : 0;
  const visualizacoesProduto = funnelData.length > 1 ? funnelData[1].value : 0;
  const carrinhosCriados = funnelData.length > 2 ? funnelData[2].value : 0;

  if (loading) {
    return <div className="p-6 text-center"><p>Carregando detalhes da taxa de conversão...</p></div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500"><p>Erro ao carregar dados: {error}</p></div>;
  }
  
  if (funnelData.length === 0 && !loading) {
    return <div className="p-6 text-center"><p>Não há dados de taxa de conversão disponíveis.</p></div>;
  }

  return (
    <div className="space-y-6 p-1">
      <h2 className="text-2xl font-semibold text-gray-800">Análise da Taxa de Conversão (Dados do Backend)</h2>

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
            <p className="text-xl font-bold text-gray-800">{totalConversoes.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-sky-100 rounded-full"><Eye size={24} className="text-sky-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Visualizações de Produto</p>
            <p className="text-xl font-bold text-gray-800">{visualizacoesProduto.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-purple-100 rounded-full"><ShoppingCart size={24} className="text-purple-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Carrinhos Criados</p>
            <p className="text-xl font-bold text-gray-800">{carrinhosCriados.toLocaleString()}</p>
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
                    style={{ width: `${funnelData[0] && funnelData[0].value > 0 ? (item.value / funnelData[0].value) * 100 : 0}%`, backgroundColor: item.color }}
                    className="h-6 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500 ease-out"
                  >
                    {funnelData[0] && funnelData[0].value > 0 ? ((item.value / funnelData[0].value) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                {index < funnelData.length - 1 && conversionRates[index] && (
                  <div className="flex justify-end items-center mt-0.5 pr-2">
                    <TrendingDown size={12} className="text-gray-400 mr-1" />
                    <div className="mt-1 text-right">
                      <span className="text-xs text-gray-500 block">
                      {conversionRates[index]?.rate} para "{conversionRates[index]?.to}"
                    </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Otimizações e Alertas (Backend)</h3>
          <div className="space-y-4">
            {optimizations.length > 0 ? optimizations.map(item => (
              <div key={item.id} className={`p-4 rounded-md flex items-start space-x-3 ${
                item.tipo === 'sucesso' ? 'bg-green-50' : item.tipo === 'alerta' ? 'bg-yellow-50' : 'bg-blue-50'
              }`}>
                <div className={`mt-0.5 ${
                  item.tipo === 'sucesso' ? 'text-green-600' : item.tipo === 'alerta' ? 'text-yellow-600' : 'text-blue-600'
                }`}><LucideIcon name={item.iconName} size={16}/></div>
                <p className={`text-sm ${
                  item.tipo === 'sucesso' ? 'text-green-800' : item.tipo === 'alerta' ? 'text-yellow-800' : 'text-blue-800'
                }`}>{item.texto}</p>
              </div>
            )) : <p className='text-sm text-gray-500'>Nenhuma otimização ou alerta encontrado.</p>}
            {optimizations.length > 0 && (
            <button className="w-full mt-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors py-2 rounded-md bg-indigo-50 hover:bg-indigo-100 font-medium">
              Ver todas as otimizações
            </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxaConversaoDetalhes; 