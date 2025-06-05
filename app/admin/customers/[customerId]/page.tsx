'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Calendar, Users, ShieldCheck, AlertTriangle } from 'lucide-react';


interface CustomerDetail {
  id: number;
  name: string;
  email: string;
  phone?: string;
  type: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

async function getCustomerDetails(customerId: string): Promise<CustomerDetail | null> {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${customerId}`);

    if (!response.ok) {
      console.error("Erro ao buscar detalhes do cliente:", response.status, response.statusText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar dados do cliente:", error);
    return null;
  }
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter(); // Inicializar router para navegação
  const customerId = params.customerId as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      setLoading(true);
      getCustomerDetails(customerId)
        .then(data => {
          if (data) {
            setCustomer(data);
          } else {
            setError('Cliente não encontrado ou falha ao carregar dados.');
          }
        })
        .catch(() => {
          setError('Ocorreu um erro ao buscar os dados do cliente.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('ID do cliente não fornecido.');
      setLoading(false);
    }
  }, [customerId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando detalhes do cliente...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <AlertTriangle size={48} className="mb-4" />
        <p>{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!customer) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-gray-700">
            <AlertTriangle size={48} className="mb-4 text-yellow-500" />
            <p>Cliente não encontrado.</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Voltar
            </button>
        </div>
    );
  }
  
  const customerStatus = 'Ativo'; 
  const statusClass = customerStatus === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-green-600 hover:text-green-800 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Voltar para a lista de clientes
      </button>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center mb-2">
            <User size={32} className="mr-3" />
            <h1 className="text-3xl font-bold">{customer.name}</h1>
          </div>
          <p className="text-sm opacity-90">ID do Cliente: {customer.id}</p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card de Informações de Contato */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <Mail size={22} className="mr-2 text-green-600" />
                Informações de Contato
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong className="font-medium text-gray-800">E-mail:</strong> {customer.email}</p>
                <p><strong className="font-medium text-gray-800">Telefone:</strong> {customer.phone || 'Não informado'}</p>
              </div>
            </div>

            {/* Card de Detalhes da Conta */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <Users size={22} className="mr-2 text-green-600" />
                Detalhes da Conta
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong className="font-medium text-gray-800">Tipo:</strong> 
                  <span className={`ml-2 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.type === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {customer.type === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </p>
                <p><strong className="font-medium text-gray-800">Status:</strong>
                  <span className={`ml-2 px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                    {customerStatus} 
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Card de Histórico */}
          <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <Calendar size={22} className="mr-2 text-green-600" />
              Histórico
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong className="font-medium text-gray-800">Data de Cadastro:</strong> {formatDate(customer.created_at)}</p>
              <p><strong className="font-medium text-gray-800">Última Atualização:</strong> {formatDate(customer.updated_at)}</p>
            </div>
          </div>
          
          {/* Seção de Ações Futuras (Exemplo) */}
          {customer.type === 'user' && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Ações</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center">
                  <ShieldCheck size={18} className="mr-2" /> Bloquear Cliente (Exemplo)
                </button>
                {/* Adicionar outras ações como "Editar Cadastro", "Ver Pedidos", etc. */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 