'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TicketDetail } from '@/app/_components/ticket/TicketDetail';
import { Button } from '@/app/_components/ui/button';
import { ArrowLeftIcon } from '@/app/_components/icons/arrow-left';
import { Ticket, TicketMessage } from '@/services/interfaces/interfaces';

// Dados de exemplo para demonstração
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
] as Ticket[];

// Mensagens de exemplo
const mockMessages = [
  {
    id: 1,
    ticket_id: 1,
    user_id: 1,
    message: 'Não consigo acessar minha conta. A página fica carregando infinitamente.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 dias atrás
  },
  {
    id: 2,
    ticket_id: 1,
    user_id: null,
    message: 'Olá! Poderia por favor nos informar qual navegador está utilizando e se tentou limpar o cache?',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 dias atrás
  },
  {
    id: 3,
    ticket_id: 1,
    user_id: 1,
    message: 'Estou usando o Chrome versão 108. Já tentei limpar o cache e os cookies, mas o problema persiste.',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 dia atrás
  },
  {
    id: 4,
    ticket_id: 1,
    user_id: null,
    message: 'Obrigado pelas informações. Vamos verificar o problema e retornaremos em breve.',
    created_at: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 12 horas atrás
  },
] as TicketMessage[];

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(Promise.resolve(params)) 
  const ticketId = parseInt(resolvedParams.id);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Em um ambiente real, isso seria uma chamada de API
    const foundTicket = mockTickets.find(t => t.id === ticketId);
    if (foundTicket) {
      setTicket(foundTicket as Ticket);
      
      // Filtrar mensagens para este ticket
      const ticketMessages = mockMessages.filter(m => m.ticket_id === ticketId);
      setMessages(ticketMessages);
    }
  }, [ticketId]);

  if (!ticket) {
    return notFound();
  }

  const handleStatusChange = (ticketId: number, newStatus: 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado') => {
    // Em um ambiente real, isso seria uma chamada de API
    setTicket(prev => {
      if (!prev) return null;
      return { ...prev, status: newStatus, updated_at: new Date().toISOString() };
    });
  };

  const handleSendMessage = async (ticketId: number, message: string) => {
    try {
      setIsLoading(true);
      
      // Em um ambiente real, isso seria uma chamada de API
      // const response = await fetch(`/api/tickets/${ticketId}/messages`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ message }),
      // });
      
      // Simular atraso para demonstração
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Criar nova mensagem simulada
      const newMessage: TicketMessage = {
        id: Date.now(),
        ticket_id: ticketId,
        user_id: 1, // ID do usuário atual (mockado)
        message,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Implementar notificação de erro aqui
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/tickets" passHref>
          <Button variant="outline" className="mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Voltar para Tickets
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Ticket #{ticket.id}</h1>
      </div>

      <TicketDetail
        ticket={ticket}
        messages={messages}
        onSendMessage={handleSendMessage}
        onStatusChange={handleStatusChange}
        isLoading={isLoading}
      />
    </div>
  );
} 