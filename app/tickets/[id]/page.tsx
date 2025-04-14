'use client';

import React, { useState, useEffect } from 'react';
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
  // Extrai e converte o ID diretamente dos params
  const ticketId = parseInt(params.id, 10); // Adiciona radix 10 para segurança

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Adiciona se for necessário para navegação programática

  useEffect(() => {
    if (isNaN(ticketId)) {
      // Se o ID não for um número válido, redireciona ou mostra notFound
      console.error("ID de ticket inválido:", params.id);
      return notFound(); // Ou router.push('/tickets') ou outra lógica
    }

    // Simulação de busca de dados (API ou mock)
    setIsLoading(true); // Inicia o carregamento
    console.log("Buscando ticket com ID:", ticketId);

    // Simula atraso da API
    const timer = setTimeout(() => {
      const foundTicket = mockTickets.find(t => t.id === ticketId);
      console.log("Ticket encontrado:", foundTicket);

      if (foundTicket) {
        setTicket(foundTicket); // Define como Ticket, não precisa de 'as Ticket'
        const ticketMessages = mockMessages.filter(m => m.ticket_id === ticketId);
        setMessages(ticketMessages);
      } else {
        // Se não encontrou o ticket após a busca (mesmo com ID válido)
        console.log("Ticket não encontrado no mock após busca.");
        notFound();
      }
      setIsLoading(false); // Finaliza o carregamento
    }, 500); // Simula 500ms de delay

    return () => clearTimeout(timer); // Limpa o timeout se o componente desmontar

  }, [params.id]); // Depende de params.id para re-executar se o ID mudar

  // Adiciona um estado de carregamento inicial
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Carregando detalhes do ticket...</p>
        {/* Pode adicionar um spinner aqui */}
      </div>
    );
  }

  // Se não está carregando e o ticket não foi encontrado (após a busca no useEffect)
  if (!ticket) {
     // O notFound() já deve ter sido chamado no useEffect se o ID era inválido ou não foi encontrado.
     // Pode retornar null ou um placeholder se preferir, mas notFound é mais semântico.
    return null; 
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