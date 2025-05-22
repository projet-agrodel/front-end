'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent, CardHeader } from '@/app/_components/ui/card';
import { Textarea } from '@/app/_components/ui/textarea';
import { Badge } from '@/app/_components/ui/badge';
import { ArrowLeftIcon } from '@/app/_components/icons/arrow-left';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ticket, TicketMessage } from '@/services/interfaces/interfaces';
import { toast } from 'sonner';
import { TicketPriority, TicketStatus } from '@/services/types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/app/_components/ui/form';
import { useSession } from 'next-auth/react';

const statusColors: Record<TicketStatus, string> = {
  Aberto: 'bg-green-100 text-green-800',
  'Em Andamento': 'bg-purple-100 text-purple-800',
  Resolvido: 'bg-teal-100 text-teal-800',
  Fechado: 'bg-gray-100 text-gray-800',
};

const priorityColors: Record<TicketPriority, string> = {
  Baixa: 'bg-blue-100 text-blue-800',
  Média: 'bg-yellow-100 text-yellow-800',
  Alta: 'bg-orange-100 text-orange-800',
  Urgente: 'bg-red-100 text-red-800',
};

const messageFormSchema = z.object({
  message: z.string().min(1, 'A mensagem não pode estar vazia'),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

export default function TicketPage() {
  const { data: session } = useSession()
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const ticketId = Number(params.id);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: '',
    },
  });

  const { data: ticket, isLoading: isLoadingTicket } = useQuery<Ticket>({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`);
      if (!response.ok) throw new Error('Erro ao carregar ticket');
      return response.json();
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageFormValues) => {
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: session?.user.id, ...data }),
      });
      if (!response.ok) throw new Error('Erro ao enviar mensagem');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticketMessages', ticketId] });
      form.reset();
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

  const onSubmit = (data: MessageFormValues) => {
    sendMessageMutation.mutate(data);
  };

  if (isLoadingTicket) {
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
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => router.push('/tickets')}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar para tickets
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                <p className="text-sm text-gray-500">
                  Criado {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge className={priorityColors[ticket.priority]}>
                  {ticket.priority}
                </Badge>
                <Badge className={statusColors[ticket.status]}>
                  {ticket.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Mensagens</h2>
          <div className="space-y-4">
            {ticket.messages?.map((message: TicketMessage) => (
              <Card key={message.id}>
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{message.user?.name || 'Usuário'}</p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{message.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Digite sua mensagem..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={sendMessageMutation.isPending || !form.watch('message').trim()}
                >
                  {sendMessageMutation.isPending ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
} 