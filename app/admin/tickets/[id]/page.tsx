'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TicketDetail } from '@/app/_components/ticket/TicketDetail';
import { Button } from '@/app/_components/ui/button';
import { ArrowLeftIcon } from '@/app/_components/icons/arrow-left';
import { TicketStatus, TicketPriority } from '@/services/types/types';
import { toast } from 'sonner';

export default function AdminTicketPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const ticketId = Number(params.id);

  // Buscar dados do ticket
  const { data: ticket, isLoading: isLoadingTicket } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const response = await fetch(`/api/tickets/${ticketId}`);
      if (!response.ok) throw new Error('Erro ao carregar ticket');
      return response.json();
    },
  });

  // Buscar mensagens do ticket
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['ticketMessages', ticketId],
    queryFn: async () => {
      const response = await fetch(`/api/tickets/${ticketId}/messages`);
      if (!response.ok) throw new Error('Erro ao carregar mensagens');
      return response.json();
    },
  });

  // Mutation para atualizar status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ status }: { status: TicketStatus }) => {
      const response = await fetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Erro ao atualizar status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      toast('Status atualizado', {
        description: 'O status do ticket foi atualizado com sucesso.'
      });
    },
    onError: () => {
      toast('Erro', {
        description: 'Não foi possível atualizar o status do ticket.',
      });
    },
  });

  // Mutation para atualizar prioridade
  const updatePriorityMutation = useMutation({
    mutationFn: async ({ priority }: { priority: TicketPriority }) => {
      const response = await fetch(`/api/tickets/${ticketId}/priority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority }),
      });
      if (!response.ok) throw new Error('Erro ao atualizar prioridade');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      toast('Prioridade atualizada', {
        description: 'A prioridade do ticket foi atualizada com sucesso.',
      });
    },
    onError: () => {
      toast('Erro', {
        description: 'Não foi possível atualizar a prioridade do ticket.',
      });
    },
  });

  // Mutation para enviar mensagem
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error('Erro ao enviar mensagem');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticketMessages', ticketId] });
      toast('Mensagem enviada', {
        description: 'Sua mensagem foi enviada com sucesso.',
      });
    },
    onError: () => {
      toast('Erro', {
        description: 'Não foi possível enviar a mensagem.',
      });
    },
  });

  const handleStatusChange = (ticketId: number, newStatus: TicketStatus) => {
    updateStatusMutation.mutate({ status: newStatus });
  };

  const handlePriorityChange = (ticketId: number, newPriority: TicketPriority) => {
    updatePriorityMutation.mutate({ priority: newPriority });
  };

  const handleSendMessage = (ticketId: number, message: string) => {
    sendMessageMutation.mutate(message);
  };

  if (isLoadingTicket || isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Ticket não encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/tickets')}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar para lista de tickets
        </Button>
      </div>

      <TicketDetail
        ticket={ticket}
        messages={messages || []}
        onSendMessage={handleSendMessage}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        isLoading={
          updateStatusMutation.isPending ||
          updatePriorityMutation.isPending ||
          sendMessageMutation.isPending
        }
      />
    </div>
  );
} 