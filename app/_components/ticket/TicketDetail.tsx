"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/_components/ui/select";
import { Ticket, TicketMessage } from "@/services/interfaces/interfaces";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TicketStatus, TicketPriority } from "@/services/types/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { cn } from "@/app/lib/utils";

interface TicketDetailProps {
  ticket: Ticket;
  messages: TicketMessage[];
  onSendMessage: (ticketId: number, message: string) => void;
  onStatusChange: (ticketId: number, newStatus: TicketStatus) => void;
  onPriorityChange: (ticketId: number, newPriority: TicketPriority) => void;
  isLoading: boolean;
  isPageAdmin?: boolean;
}

const statusOptions = [
  { value: "Aberto", label: "Aberto" },
  { value: "Em Andamento", label: "Em Andamento" },
  { value: "Resolvido", label: "Resolvido" },
  { value: "Fechado", label: "Fechado" },
];

const priorityOptions = [
  { value: "Baixa", label: "Baixa" },
  { value: "Média", label: "Média" },
  { value: "Alta", label: "Alta" },
  { value: "Urgente", label: "Urgente" },
];

export function TicketDetail({
  ticket,
  messages,
  isPageAdmin = false,
  onSendMessage,
  onStatusChange,
  onPriorityChange,
  isLoading,
}: TicketDetailProps) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(
    ticket.status
  );
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority>(
    ticket.priority
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(ticket.id, newMessage);
      setNewMessage("");
    }
  };

  const ticketClosed = ["Fechado", "Resolvido"].includes(ticket.status);

  return (
    <div className="space-y-6">
      {isPageAdmin && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gerenciar Ticket</CardTitle>
              <div className="flex gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Select
                    value={selectedStatus}
                    onValueChange={(value) =>
                      setSelectedStatus(value as TicketStatus)
                    }
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
                  <label className="text-sm font-medium text-gray-700">
                    Prioridade
                  </label>
                  <Select
                    value={selectedPriority}
                    onValueChange={(value) =>
                      setSelectedPriority(value as TicketPriority)
                    }
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
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => {
                  onStatusChange(ticket.id, selectedStatus);
                  onPriorityChange(ticket.id, selectedPriority);
                }}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? "Aplicando..." : "Aplicar Alterações"}
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

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
                  message.user?.type === "admin"
                    ? "bg-blue-50 ml-8"
                    : "bg-gray-50 mr-8"
                )}
              >
                <Avatar>
                  <AvatarImage src={message.user?.avatar || ""} />
                  <AvatarFallback>
                    {message.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {message.user?.name || "Usuário"}
                        {message.user?.type === "admin" && (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-blue-100 text-blue-800 border-blue-200"
                          >
                            Admin
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {message.message}
                  </p>
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
              disabled={isLoading || ticketClosed}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !newMessage.trim() || ticketClosed}
            >
              {isLoading ? "Enviando..." : "Enviar Mensagem"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
