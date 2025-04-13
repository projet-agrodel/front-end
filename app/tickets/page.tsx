'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TicketList } from '@/app/_components/ticket/TicketList';
import { Button } from '@/app/_components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';
import { PlusIcon } from '@/app/_components/icons/plus';
import { Ticket } from '@/services/interfaces/interfaces';

const mockTickets = [
  {
    id: 1,
    user_id: 1,
    title: 'Problema ao fazer login',
    description: 'Não consigo acessar minha conta, a página fica carregando infinitamente quando tento fazer login.',
    status: 'Aberto',
    priority: 'Alta',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    messages: [{
      id: 1,
      ticket_id: 1,
      user_id: 1,
      message: 'Por favor, me ajudem a resolver esse problema urgente.',
      created_at: new Date().toISOString(),
    }]
  },
  {
    id: 2,
    user_id: 2,
    title: 'Dúvida sobre faturamento',
    description: 'Estou com dúvidas sobre a cobrança no meu cartão que apareceu este mês.',
    status: 'Em Andamento',
    priority: 'Média',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 dias atrás
    updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
    messages: [{
      id: 2,
      ticket_id: 2,
      user_id: 2,
      message: 'Gostaria de entender melhor sobre a cobrança.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    }]
  },
  {
    id: 3,
    user_id: 1,
    title: 'Solicitação de nova funcionalidade',
    description: 'Gostaria de sugerir a implementação de uma nova funcionalidade para exportar relatórios em PDF.',
    status: 'Resolvido',
    priority: 'Baixa',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 dias atrás
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 dia atrás
    messages: [{
      id: 3,
      ticket_id: 3,
      user_id: 1,
      message: 'Seria muito útil ter essa funcionalidade no sistema.',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    }]
  },
  {
    id: 4,
    user_id: 3,
    title: 'Erro ao finalizar pedido',
    description: 'Quando tento finalizar um pedido, aparece a mensagem "Erro de processamento" e não consigo concluir a compra.',
    status: 'Fechado',
    priority: 'Urgente',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 dias atrás
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 dias atrás
    messages: [{
      id: 4,
      ticket_id: 4,
      user_id: 3,
      message: 'Preciso urgentemente finalizar essa compra.',
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    }]
  }
] as Ticket[];

export default function TicketsPage() {
  const [tickets, setTickets] = useState(mockTickets);
  const router = useRouter();

  const handleStatusChange = (ticketId: number, newStatus: 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado') => {
    // Em um ambiente real, isso seria uma chamada de API
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus, updated_at: new Date().toISOString() } : ticket
    );
    setTickets(updatedTickets);
  };

  const handleTicketClick = (ticket: any) => {
    router.push(`/tickets/${ticket.id}`);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tickets de Suporte</h1>
        <Link href="/tickets/create" passHref>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Ticket
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="open">Abertos</TabsTrigger>
          <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
          <TabsTrigger value="closed">Fechados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TicketList 
            tickets={tickets} 
            onTicketClick={handleTicketClick} 
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
        
        <TabsContent value="open">
          <TicketList 
            tickets={tickets.filter(t => t.status === 'Aberto')} 
            onTicketClick={handleTicketClick} 
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
        
        <TabsContent value="in-progress">
          <TicketList 
            tickets={tickets.filter(t => t.status === 'Em Andamento')} 
            onTicketClick={handleTicketClick} 
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
        
        <TabsContent value="resolved">
          <TicketList 
            tickets={tickets.filter(t => t.status === 'Resolvido')} 
            onTicketClick={handleTicketClick} 
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
        
        <TabsContent value="closed">
          <TicketList 
            tickets={tickets.filter(t => t.status === 'Fechado')} 
            onTicketClick={handleTicketClick} 
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
