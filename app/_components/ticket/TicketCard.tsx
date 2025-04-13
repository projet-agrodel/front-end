import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/app/_components/ui/card';
import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import { Ticket } from '@/services/interfaces/interfaces';

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

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
  onStatusChange?: (ticketId: number, newStatus: 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado') => void;
}

export function TicketCard({ ticket, onClick, onStatusChange }: TicketCardProps) {
  const priorityClass = priorityColors[ticket.priority || 'Média'];
  const statusClass = statusColors[ticket.status || 'Aberto'];
  
  const timeAgo = ticket.created_at 

  return (
    <Card className="w-full hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{ticket.title}</h3>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={priorityClass}>{ticket.priority || 'Média'}</Badge>
          <Badge className={statusClass}>{ticket.status || 'Aberto'}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-gray-700 line-clamp-2">{ticket.description}</p>
      </CardContent>
      {onStatusChange && (
        <CardFooter className="pt-0 flex gap-2 justify-end">
          {ticket.status !== 'Aberto' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => { 
                e.stopPropagation();
                onStatusChange(ticket.id, 'Aberto');
              }}
            >
              Reabrir
            </Button>
          )}
          {ticket.status !== 'Em Andamento' && ticket.status !== 'Resolvido' && ticket.status !== 'Fechado' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => { 
                e.stopPropagation();
                onStatusChange(ticket.id, 'Em Andamento');
              }}
            >
              Em Andamento
            </Button>
          )}
          {ticket.status !== 'Resolvido' && ticket.status !== 'Fechado' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => { 
                e.stopPropagation();
                onStatusChange(ticket.id, 'Resolvido');
              }}
            >
              Resolver
            </Button>
          )}
          {ticket.status !== 'Fechado' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => { 
                e.stopPropagation();
                onStatusChange(ticket.id, 'Fechado');
              }}
            >
              Fechar
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
} 