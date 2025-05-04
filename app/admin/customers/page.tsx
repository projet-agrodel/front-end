'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search } from 'lucide-react'; // Ícone exemplo e Search
import { useRouter } from 'next/navigation'; // Importar useRouter

// --- Simulação de busca de dados de clientes ---
// Substitua pela sua lógica real
async function getCustomersData(): Promise<Customer[]> {
  await new Promise(resolve => setTimeout(resolve, 50)); // Simula atraso

  // Dados fictícios
  return [
    { id: 'usr_1', name: 'João Silva', email: 'joao.silva@example.com', registrationDate: '2024-05-10T10:30:00Z', status: 'Ativo' },
    { id: 'usr_2', name: 'Maria Oliveira', email: 'maria.oliveira@sample.net', registrationDate: '2024-04-22T15:00:00Z', status: 'Ativo' },
    { id: 'usr_3', name: 'Carlos Souza', email: 'carlos.souza@domain.org', registrationDate: '2024-03-15T09:12:00Z', status: 'Bloqueado' },
    { id: 'usr_4', name: 'Ana Pereira', email: 'ana.p@mail.co', registrationDate: '2024-06-01T11:05:00Z', status: 'Ativo' },
    { id: 'usr_5', name: 'Pedro Costa', email: 'pedro.costa@email.com', registrationDate: '2024-02-28T18:45:00Z', status: 'Ativo' },
    { id: 'usr_6', name: 'Luísa Martins', email: 'luisa.m@example.com', registrationDate: '2024-07-11T14:20:00Z', status: 'Bloqueado' },
    // Adicionar mais dados para testar paginação
    { id: 'usr_7', name: 'Ricardo Alves', email: 'ricardo.a@example.com', registrationDate: '2024-07-15T08:00:00Z', status: 'Ativo' },
    { id: 'usr_8', name: 'Sofia Ferreira', email: 'sofia.f@sample.net', registrationDate: '2024-07-18T11:30:00Z', status: 'Ativo' },
    { id: 'usr_9', name: 'Bruno Gomes', email: 'bruno.g@domain.org', registrationDate: '2024-07-20T16:45:00Z', status: 'Bloqueado' },
    { id: 'usr_10', name: 'Clara Dias', email: 'clara.d@mail.co', registrationDate: '2024-07-22T09:15:00Z', status: 'Ativo' },
    { id: 'usr_11', name: 'Daniel Lima', email: 'daniel.l@email.com', registrationDate: '2024-07-25T13:00:00Z', status: 'Ativo' },
  ];
}
// --- Fim da simulação ---

// Tipagem para os dados do cliente
interface Customer {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: 'Ativo' | 'Bloqueado';
}

// Componente da Tabela de Clientes
function CustomersTable({ customers }: { customers: Customer[] }) {
  const router = useRouter(); // Inicializar o router

  const handleRowClick = (customerId: string) => {
    router.push(`/admin/customers/${customerId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const statusClasses: { [key in Customer['status']]: string } = {
    'Ativo': 'bg-green-100 text-green-800',
    'Bloqueado': 'bg-red-100 text-red-800',
  };
  const getStatusClass = (status: Customer['status']) => statusClasses[status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mt-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Cadastro</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(customer.id)}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{customer.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.registrationDate)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                   <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(customer.status)}`}>
                     {customer.status}
                   </span>
                 </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500 italic">Nenhum cliente encontrado para os critérios selecionados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente Principal da Página
export default function AdminCustomersPage() {
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]); // Armazena todos os clientes
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5; // Define quantos itens por página

  // Busca inicial de dados
  useEffect(() => {
    setLoading(true);
    getCustomersData()
      .then(data => {
        setAllCustomers(data);
      })
      .catch(error => {
        console.error("Erro ao buscar dados dos clientes:", error);
        setAllCustomers([]); // Define como array vazio em caso de erro
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filtra os clientes com base no searchTerm
  const filteredCustomers = useMemo(() => {
    if (!searchTerm) {
      return allCustomers;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allCustomers.filter(customer =>
      customer.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      customer.email.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allCustomers, searchTerm]);

  // Calcula o total de páginas
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

  // Obtém os clientes para a página atual
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [filteredCustomers, currentPage, ITEMS_PER_PAGE]);

  // Funções para mudar de página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Atualiza a página para 1 quando o termo de busca muda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando clientes...</div>;
  }

  if (!allCustomers) { // Verifica allCustomers pois ele é setado mesmo em erro
     return <div className="flex items-center justify-center h-full text-red-600">Erro ao carregar dados dos clientes.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Título e Barra de Busca */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Users size={22} className="mr-2 text-gray-600" /> Lista de Clientes ({filteredCustomers.length})
        </h2>
        <div className="relative w-full sm:w-64">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm w-full"
          />
        </div>
      </div>

      {/* Tabela de Clientes */}
      <CustomersTable customers={paginatedCustomers} />

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 