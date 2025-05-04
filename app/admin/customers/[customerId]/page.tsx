'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Esta página receberá o ID do cliente pela URL
export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.customerId; // O nome do parâmetro deve corresponder ao nome da pasta [customerId]

  // Aqui você buscaria os dados detalhados do cliente usando o customerId
  // const { data: customer, isLoading, error } = useCustomerData(customerId);

  // Placeholder enquanto não temos a busca de dados real:
  if (!customerId) {
    return <div>ID do cliente não encontrado.</div>;
  }

  return (
    <div className="space-y-4">
      <Link href="/admin/customers" className="inline-flex items-center text-sm text-green-600 hover:text-green-800 mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Voltar para a Lista de Clientes
      </Link>

      <h2 className="text-xl font-semibold text-gray-800">
        Detalhes do Cliente
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-700">ID do Cliente: <span className="font-medium text-gray-900">{customerId}</span></p>
        {/*
          Aqui você adicionaria os campos para exibir/editar os detalhes do cliente:
          - Nome
          - Email
          - Data de Cadastro
          - Status (Ativo/Bloqueado) - talvez com um botão para alterar
          - Histórico de Pedidos (se aplicável)
          - Etc.

          Exemplo:
          <div className="mt-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" id="name" value={customer?.name || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div className="mt-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" value={customer?.email || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          // ... outros campos e botão de salvar
        */}
        <p className="mt-6 text-sm text-gray-500 italic">
          (Funcionalidade de exibição/edição detalhada a ser implementada aqui.)
        </p>
      </div>
    </div>
  );
} 