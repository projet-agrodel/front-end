'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, UserPlus, MessageSquare, CreditCard, Tag, Bell, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Atividade {
  id: string;
  tipo: 'venda' | 'usuario' | 'ticket' | 'pagamento' | 'produto';
  descricao: string;
  timestamp: string; // Alterado para string para corresponder ao ISO format do backend
  detalhes?: Record<string, any>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getIconeAtividade = (tipo: Atividade['tipo']) => {
  switch (tipo) {
    case 'venda': return <ShoppingCart size={18} className="text-green-500" />;
    case 'usuario': return <UserPlus size={18} className="text-blue-500" />;
    case 'ticket': return <MessageSquare size={18} className="text-orange-500" />;
    case 'pagamento': return <CreditCard size={18} className="text-purple-500" />;
    case 'produto': return <Tag size={18} className="text-indigo-500" />;
    default: return <Bell size={18} className="text-gray-500" />;
  }
};

function formatTimeAgo(timestamp: string) {
    const date = new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000; // anos
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " ano atrás" : " anos atrás");
    interval = seconds / 2592000; // meses
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " mês atrás" : " meses atrás");
    interval = seconds / 86400; // dias
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " dia atrás" : " dias atrás");
    interval = seconds / 3600; // horas
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " hora atrás" : " horas atrás");
    interval = seconds / 60; // minutos
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " min atrás" : " mins atrás");
    return Math.floor(seconds) + (Math.floor(seconds) === 1 ? " seg atrás" : " segs atrás");
}

const ITEMS_PER_PAGE = 7;

const AtividadeRecenteLog: React.FC = () => {
  const { data: session, status } = useSession();
  const [activities, setActivities] = useState<Atividade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchActivities = useCallback(async () => {
    if (status !== 'authenticated' || !session?.accessToken) {
      setIsLoading(false);
      setError("Usuário não autenticado ou sessão inválida.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/analytics/recent-activities`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || `Erro ao buscar atividades: ${response.status}`);
      }

      const data: Atividade[] = await response.json();
      setActivities(data);
    } catch (err) {
      console.error("Erro ao buscar atividades recentes:", err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar atividades recentes.');
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);

  const currentActivities = activities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">Carregando atividades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-6">
        <p>Erro ao carregar atividades: {error}</p>
        <p>Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">Log de Atividades Recentes</h2>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center">
            <Filter size={14} className="mr-1.5" /> Filtros
          </button>
          {/* Placeholder para um DatePicker ou seletor de período */}
          <input 
            type="text" 
            placeholder="Período: Últimas 24h" 
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-44"
            disabled // Apenas visual
          /> 
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {currentActivities.map((atividade) => (
            <li key={atividade.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5 p-1.5 bg-gray-100 rounded-full">
                  {getIconeAtividade(atividade.tipo)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{atividade.descricao}</p>
                  {atividade.detalhes && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {Object.entries(atividade.detalhes).map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join(', ')}
                    </p>
                  )}
                </div>
                <time className="text-xs text-gray-500 whitespace-nowrap mt-0.5">{formatTimeAgo(atividade.timestamp)}</time>
              </div>
            </li>
          ))}
          {currentActivities.length === 0 && (
             <li className="p-6 text-center text-gray-500">
                Nenhuma atividade recente no período selecionado.
             </li>
          )}
        </ul>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center"
          >
            <ChevronLeft size={16} className="mr-1" /> Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center"
          >
            Próxima <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AtividadeRecenteLog;
