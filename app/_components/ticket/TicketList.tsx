import React, { useState } from 'react';
import { Input } from '@/app/_components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/_components/ui/select';
import { Label } from '@/app/_components/ui/label';
import { TicketCard } from './TicketCard';
import { Ticket } from '@/services/interfaces/interfaces';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
  onStatusChange?: (ticketId: number, newStatus: 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado') => void;
}

export function TicketList({ tickets, onTicketClick, onStatusChange }: TicketListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  const filteredTickets = tickets.filter((ticket) => {
    // Filtro por pesquisa (título e descrição)
    const matchesSearch = 
      !searchTerm || 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    // Filtro por status
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    
    // Filtro por prioridade
    const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Pesquisar tickets</Label>
          <Input
            id="search"
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Label htmlFor="status">Status</Label>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="Aberto">Aberto</SelectItem>
              <SelectItem value="Em Andamento">Em Andamento</SelectItem>
              <SelectItem value="Resolvido">Resolvido</SelectItem>
              <SelectItem value="Fechado">Fechado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-48">
          <Label htmlFor="priority">Prioridade</Label>
          <Select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <SelectTrigger id="priority" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              <SelectItem value="Baixa">Baixa</SelectItem>
              <SelectItem value="Média">Média</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
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
            <p className="text-gray-500">Nenhum ticket encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
} 