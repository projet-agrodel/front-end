'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, Gift, RefreshCw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { 
  getTicketMedioEvolution, 
  getTicketMedioProductsImpact,
  TicketMedioEvolucaoItem,
  ProdutoImpactoItem
} from '@/services/adminAnalyticsService';

const TicketMedioDetalhes: React.FC = () => {
  const { data: session, status: sessionStatus } = useSession();
  const token = session?.accessToken as string | undefined;

  const [ticketMedioData, setTicketMedioData] = useState<TicketMedioEvolucaoItem[]>([]);
  const [produtosImpactoTicket, setProdutosImpactoTicket] = useState<ProdutoImpactoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (sessionStatus === 'loading' || !token) {
      if (sessionStatus !== 'authenticated') { // Não definir erro se estiver apenas carregando a sessão
        setError("Usuário não autenticado ou token indisponível.");
      }
      setLoading(sessionStatus === 'loading'); // Mantém loading true se a sessão estiver carregando
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [evolutionData, productsData] = await Promise.all([
        getTicketMedioEvolution(token),
        getTicketMedioProductsImpact(token)
      ]);

      setTicketMedioData(evolutionData);
      setProdutosImpactoTicket(productsData);

    } catch (err) {
      let errorMessage = "Ocorreu um erro desconhecido ao buscar dados do ticket médio.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("Erro ao buscar dados para TicketMedioDetalhes:", err);
    } finally {
      setLoading(false);
    }
  }, [sessionStatus, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calcula as métricas com base nos dados do estado
  const ticketMedioAtual = ticketMedioData.length > 0 ? ticketMedioData[ticketMedioData.length - 1].valor : 0;
  const ticketMedioAnterior = ticketMedioData.length > 1 ? ticketMedioData[ticketMedioData.length - 2].valor : 0;
  const variacaoTicket = ticketMedioData.length > 1 ? ticketMedioAtual - ticketMedioAnterior : 0;
  const variacaoPercentual = ticketMedioAnterior !== 0 && ticketMedioData.length > 1 ? (variacaoTicket / ticketMedioAnterior) * 100 : 0;

  const maiorTicket = ticketMedioData.length > 0 ? Math.max(...ticketMedioData.map(item => item.valor)) : 0;
  const menorTicket = ticketMedioData.length > 0 ? Math.min(...ticketMedioData.map(item => item.valor)) : 0;

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
        <span className="ml-2 text-gray-600">Carregando detalhes do ticket médio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 h-96">
        <p className="text-red-500 mb-4">{error}</p>
        {sessionStatus === 'authenticated' && token && ( // Só mostra o botão de tentar novamente se autenticado
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
  
  if (ticketMedioData.length === 0 && produtosImpactoTicket.length === 0 && !loading) {
    return <div className="text-center py-8 text-gray-500 h-96 flex items-center justify-center">Não há dados de ticket médio disponíveis no momento.</div>
  }

  return (
    <div className="space-y-6 p-1">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Análise do Ticket Médio</h2>
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
              <LineChart data={ticketMedioData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
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
            {produtosImpactoTicket.length > 0 ? (
              produtosImpactoTicket.map((produto) => (
              <div key={produto.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img src={produto.imagemUrl} alt={produto.nome} className="w-12 h-12 rounded-md object-cover mr-4 border" />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800 truncate">{produto.nome}</p>
                  <p className="text-xs text-green-600">+ R$ {produto.valorMedioAdicionado.toFixed(2)} no ticket</p>
                </div>
                <Gift size={18} className="text-indigo-500 ml-2 flex-shrink-0" />
              </div>
              ))
            ) : (
              <p className='text-sm text-gray-500 text-center py-4'>Nenhum produto de impacto encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketMedioDetalhes; 