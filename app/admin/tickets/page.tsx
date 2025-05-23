'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TicketList } from '@/app/_components/ticket/TicketList';
import { Button } from '@/app/_components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';
import { PlusIcon } from '@/app/_components/icons/plus';
import { Ticket } from '@/services/interfaces/interfaces';
import { MessageSquare, Search, Filter, Clock, CheckCircle, AlertCircle, XCircle, LucideProps } from 'lucide-react';
import { motion } from 'framer-motion';
import { TicketPriority, TicketStatus } from '@/services/types/types';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

// Componente de Status Badge
const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const statusConfig: Record<TicketStatus, { color: string, icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>  }> = {
    'Aberto': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    'Em Andamento': { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
    'Fechado': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    'Resolvido': { color: 'bg-red-100 text-red-800', icon: CheckCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

// Componente de Prioridade Badge
const PriorityBadge = ({ priority }: { priority: Ticket['priority'] }) => {
  const priorityConfig: Record<TicketPriority, { text: string, color: string }> = {
    'Baixa': { color: 'bg-gray-100 text-gray-800', text: 'Baixa' },
    'Média': { color: 'bg-yellow-100 text-yellow-800', text: 'Média' },
    'Alta': { color: 'bg-red-100 text-red-800', text: 'Alta' },
    'Urgente': { color: 'bg-red-100 text-red-1000', text: 'Urgente' }
  };

  const config = priorityConfig[priority];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

export default function AdminTicketsPage() {
  const session = useSession()
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const router = useRouter();

  const { data: tickets, isLoading } = useQuery<Ticket[]>({
    queryKey: ['tickets_admin'],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/tickets`);
      if (!response.ok) throw new Error('Erro ao carregar ticket');
      return response.json();
    },
  });


  // Filtrar tickets
  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.user?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
          <MessageSquare size={28} className="mr-3 text-green-600" />
          Gerenciamento de Tickets
        </h1>
      </div>

      {/* Filtros e Busca */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar tickets..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
          >
            <option value="all">Todos os Status</option>
            <option value="Aberto">Abertos</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Resolvido">Resolvido</option>
            <option value="Fechado">Fechado</option>
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Ticket['priority'] | 'all')}
          >
            <option value="all">Todas as Prioridades</option>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>
      </div>

      {/* Lista de Tickets */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Atualização
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets?.map((ticket) => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                     router.replace(`/admin/tickets/${ticket.id}`)
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ticket?.user?.name}</div>
                    <div className="text-sm text-gray-500">{ticket?.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ticket?.updated_at)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mensagem quando não há tickets */}
      {filteredTickets?.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum ticket encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar seus filtros ou termos de busca.
          </p>
        </div>
      )}
    </div>
  );
}
