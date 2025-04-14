import React, { useState } from 'react';
import { Input } from '@/app/_components/ui/input';
import { TicketCard } from './TicketCard';
import { Ticket } from '@/services/interfaces/interfaces';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
  onStatusChange?: (ticketId: number, newStatus: 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado') => void;
}

export function TicketList({ tickets, onTicketClick, onStatusChange }: TicketListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      !searchTerm ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            id="search"
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => onTicketClick && onTicketClick(ticket)}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-gray-500">Nenhum ticket encontrado com os filtros atuais</p>
          </div>
        )}
      </div>
    </div>
  );
} 