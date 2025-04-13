import React, { useState } from 'react';
import { Button } from '@/app/_components/ui/button';
import { Textarea } from '@/app/_components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/_components/ui/card';
import { Badge } from '@/app/_components/ui/badge';
import { Ticket, TicketMessage } from '@/services/interfaces/interfaces';

const priorityColors = {
  Baixa: 'bg-blue-100 text-blue-800',
  Média: 'bg-yellow-100 text-yellow-800',
  Alta: 'bg-orange-100 text-orange-800',
  Urgente: 'bg-red-100 text-red-800',
};

const statusColors = {
  Aberto: 'bg-green-100 text-green-800',
  'Em Andamento': 'bg-purple-100 text-purple-800',
  Resolvido: 'bg-teal-100 text-teal-800',
  Fechado: 'bg-gray-100 text-gray-800',
};

interface TicketDetailProps {
  ticket: Ticket;
  messages: TicketMessage[];
  onSendMessage: (ticketId: number, message: string) => void;
  onStatusChange?: (ticketId: number, newStatus: 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado') => void;
  isLoading?: boolean;
}

export function TicketDetail({ 
  ticket, 
  messages, 
  onSendMessage, 
  onStatusChange,
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

  const priorityClass = priorityColors[ticket.priority || 'Média'];
  const statusClass = statusColors[ticket.status || 'Aberto'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>{ticket.title}</CardTitle>
            <div className="flex gap-2">
              <Badge className={priorityClass}>{ticket.priority || 'Média'}</Badge>
              <Badge className={statusClass}>{ticket.status || 'Aberto'}</Badge>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Aberto {ticket.created_at}
          </p>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{ticket.description}</p>
        </CardContent>
        {onStatusChange && (
          <CardFooter className="flex gap-2 justify-end border-t pt-4">
            {ticket.status !== 'Aberto' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onStatusChange(ticket.id, 'Aberto')}
              >
                Reabrir
              </Button>
            )}
            {ticket.status !== 'Em Andamento' && ticket.status !== 'Resolvido' && ticket.status !== 'Fechado' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onStatusChange(ticket.id, 'Em Andamento')}
              >
                Em Andamento
              </Button>
            )}
            {ticket.status !== 'Resolvido' && ticket.status !== 'Fechado' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onStatusChange(ticket.id, 'Resolvido')}
              >
                Resolver
              </Button>
            )}
            {ticket.status !== 'Fechado' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onStatusChange(ticket.id, 'Fechado')}
              >
                Fechar
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Histórico de Mensagens</h3>
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">{msg.user_id ? `Usuário #${msg.user_id}` : 'Sistema'}</p>
                  <p className="text-sm text-gray-500">
                    {msg.created_at}
                  </p>
                </div>
                <p className="whitespace-pre-line">{msg.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-gray-500">Nenhuma mensagem neste ticket</p>
            </div>
          )}
        </div>

        {ticket.status !== 'Fechado' && (
          <form onSubmit={handleSubmit} className="mt-6">
            <Textarea
              placeholder="Digite sua mensagem aqui..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
              className="mb-2"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || !newMessage.trim()}>
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Enviando...
                  </>
                ) : (
                  'Enviar Mensagem'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 