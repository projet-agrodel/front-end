"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Pedido } from '@/services/interfaces/interfaces';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PedidoDetalhesPage = () => {
  const { id } = useParams();

  const { data: pedido, isLoading } = useQuery<Pedido>({
    queryKey: ['pedido', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`);
      if (!response.ok) throw new Error('Erro ao carregar pedido');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Pedido não encontrado</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluido':
        return 'bg-green-100 text-green-800';
      case 'Em Processamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Não autorizado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cabeçalho do Pedido */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pedido #{pedido.id}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Realizado em {format(new Date(pedido.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.status)}`}>
              {pedido.status}
            </span>
          </div>
        </div>

        {/* Detalhes do Pagamento */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações de Pagamento</h2>
          <div className="space-y-4">
            {pedido.payments?.map((payment) => (
              <div key={payment.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">
                      Método: {payment.payment_method}
                    </p>
                    <p className="text-sm text-gray-500">
                      ID da Transação: {payment.transaction_id || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    <p className="mt-1 font-semibold text-gray-900">
                      R$ {payment.amount.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Itens do Pedido</h2>
          <div className="space-y-4">
            {pedido.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-200 py-4 last:border-0">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                  <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-sm text-gray-500">
                    R$ {item.price.toFixed(2).replace('.', ',')} cada
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total do Pedido */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total do Pedido</span>
              <span className="text-2xl font-bold text-green-600">
                R$ {pedido.amount.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoDetalhesPage; 