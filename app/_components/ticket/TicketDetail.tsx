'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card';
import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import { Textarea } from '@/app/_components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/_components/ui/select';
import { Ticket, TicketMessage } from '@/services/interfaces/interfaces';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TicketStatus, TicketPriority } from '@/services/types/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/avatar';
import { cn } from '@/app/lib/utils';

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
          <div className="flex justify-between items-center">
            <CardTitle>Gerenciar Ticket</CardTitle>
            <div className="flex gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select
                  value={ticket.status}
                  onValueChange={(value) => onStatusChange(ticket.id, value as TicketStatus)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Prioridade</label>
                <Select
                  value={ticket.priority}
                  onValueChange={(value) => onPriorityChange(ticket.id, value as TicketPriority)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mensagens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 p-4 rounded-lg",
                  message.user?.type === 'admin' ? "bg-gray-50" : "bg-green-50"
                )}
              >
                <Avatar>
                  <AvatarImage src={message.user?.avatar || ""} />
                  <AvatarFallback>
                    {message.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{message.user?.name || 'Usuário'}</p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                    {message.user?.type === 'admin' && (
                      <Badge variant="outline">Admin</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="min-h-[100px]"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !newMessage.trim()}
            >
              {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 