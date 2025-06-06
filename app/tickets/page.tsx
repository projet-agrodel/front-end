'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent, CardHeader } from '@/app/_components/ui/card';
import { Badge } from '@/app/_components/ui/badge';
import { PlusIcon, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ticket } from '@/services/interfaces/interfaces';
import { useSession } from 'next-auth/react';

const statusColors = {
  Aberto: 'bg-green-100 text-green-800',
  'Em Andamento': 'bg-purple-100 text-purple-800',
  Resolvido: 'bg-teal-100 text-teal-800',
  Fechado: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  Baixa: 'bg-blue-100 text-blue-800',
  Média: 'bg-yellow-100 text-yellow-800',
  Alta: 'bg-orange-100 text-orange-800',
  Urgente: 'bg-red-100 text-red-800',
};

export default function TicketsPage() {
  const { data: session } =  useSession()
  const router = useRouter();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['userTickets'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/user/${session?.user.id}`);
      if (!response.ok) throw new Error('Erro ao carregar tickets');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Meus Tickets</h1>
        </div>
        <Button
          onClick={() => router.push('/tickets/create')}
          className="flex items-center gap-2 bg-green-600"
        >
          <PlusIcon className="h-4 w-4" />
          Novo Ticket
        </Button>
      </div>

      <div className="grid gap-4">
        {tickets?.length > 0 ? (
          tickets.map((ticket: Ticket) => (
            <Card
              key={ticket.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/tickets/${ticket.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{ticket.title}</h3>
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
                <p className="text-gray-700 line-clamp-2">{ticket.description}</p>
                {ticket.messages && ticket.messages.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {ticket.messages.length} {ticket.messages.length === 1 ? 'mensagem' : 'mensagens'}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum ticket encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Crie seu primeiro ticket para começar
            </p>
            <Button
              onClick={() => router.push('/tickets/create')}
              className="mt-4"
            >
              Criar Ticket
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
} 