'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/app/_components/ui/card';
import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import { Textarea } from '@/app/_components/ui/textarea';
import { Select } from '@/app/_components/ui/select';
import { Ticket, TicketMessage } from '@/services/interfaces/interfaces';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TicketStatus, TicketPriority } from '@/services/types/types';

interface TicketDetailProps {
  ticket: Ticket;
  messages: TicketMessage[];
  onSendMessage: (ticketId: number, message: string) => void;
  onStatusChange: (ticketId: number, newStatus: TicketStatus) => void;
  onPriorityChange: (ticketId: number, newPriority: TicketPriority) => void;
  isLoading: boolean;
}

const statusOptions = [
  { value: 'Aberto', label: 'Aberto' },
  { value: 'Em Andamento', label: 'Em Andamento' },
  { value: 'Resolvido', label: 'Resolvido' },
  { value: 'Fechado', label: 'Fechado' },
];

const priorityOptions = [
  { value: 'Baixa', label: 'Baixa' },
  { value: 'Média', label: 'Média' },
  { value: 'Alta', label: 'Alta' },
  { value: 'Urgente', label: 'Urgente' },
];

export function TicketDetail({
  ticket,
  messages,
  onSendMessage,
  onStatusChange,
  onPriorityChange,
  isLoading
}: TicketDetailProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(ticket.id, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{ticket.title}</h2>
              <p className="text-gray-500">
                Criado {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <Select
                  value={ticket.status}
                  onValueChange={(value: string) => onStatusChange(ticket.id, value as TicketStatus)}
                  disabled={isLoading}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                <Select
                  value={ticket.priority}
                  onValueChange={(value) => onPriorityChange(ticket.id, value as TicketPriority)}
                  disabled={isLoading}
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{ticket.description}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Mensagens</h3>
        <div className="space-y-4">
          {messages.map((message) => (
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
                <p className="mt-2">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()}>
            Enviar Mensagem
          </Button>
        </form>
      </div>
    </div>
  );
} 