"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TicketDetail } from "@/app/_components/ticket/TicketDetail";
import { Button } from "@/app/_components/ui/button";
import { ArrowLeftIcon } from "@/app/_components/icons/arrow-left";
import { TicketStatus, TicketPriority } from "@/services/types/types";
import { toast } from "sonner";
import { Ticket, User } from "@/services/interfaces/interfaces";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { cn } from "@/app/lib/utils";
import { useSession } from "next-auth/react";

const statusColors = {
  Aberto: "bg-green-100 text-green-800",
  "Em Andamento": "bg-blue-100 text-blue-800",
  Resolvido: "bg-purple-100 text-purple-800",
  Fechado: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  Baixa: "bg-blue-100 text-blue-800",
  Média: "bg-yellow-100 text-yellow-800",
  Alta: "bg-orange-100 text-orange-800",
  Urgente: "bg-red-100 text-red-800",
};

export default function AdminTicketPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const ticketId = Number(params.id);

  // Buscar dados do ticket
  const { data: ticket, isLoading: isLoadingTicket } = useQuery<Ticket>({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`
      );
      if (!response.ok) throw new Error("Erro ao carregar ticket");
      return response.json();
    },
  });

  // Buscar dados dos usuários
  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) throw new Error("Erro ao carregar usuários");
      return response.json();
    },
  });

  // Mutation para atualizar prioridade
  const updateStatusticket = useMutation({
    mutationFn: async ({
      priority,
      status,
    }: {
      priority?: TicketPriority;
      status?: TicketStatus;
    }) => {
      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}/update-status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priority, status }),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar prioridade");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      toast.success("Atualização feita com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar prioridade");
    },
  });

  // Mutation para enviar mensagem
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message, user_id: session?.user.id }),
        }
      );
      if (!response.ok) throw new Error("Erro ao enviar mensagem");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      toast.success("Mensagem enviada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao enviar mensagem");
    },
  });

  const handleStatusChange = (ticketId: number, newStatus: TicketStatus) => {
    updateStatusticket.mutate({ status: newStatus });
  };

  const handlePriorityChange = (
    ticketId: number,
    newPriority: TicketPriority
  ) => {
    updateStatusticket.mutate({ priority: newPriority });
  };

  const handleSendMessage = (ticketId: number, message: string) => {
    sendMessageMutation.mutate(message);
  };

  // Preparar mensagens com informações dos usuários
  const messagesWithUsers = ticket?.messages?.map((message) => {
    const user = users?.find((u) => u.id === message.user_id);
    return {
      ...message,
      user: user || message.user,
    };
  });

  if (isLoadingTicket) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto py-6">
        <Card className="text-center p-6">
          <CardTitle className="text-gray-500">Ticket não encontrado</CardTitle>
        </Card>
      </div>
    );
  }

  const ticketWithUpdatedMessages = {
    ...ticket,
    messages: messagesWithUsers,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/tickets")}
          className="flex items-center gap-2 hover:bg-gray-100 hover:underline hover:cursor-pointer"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar para lista de tickets
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">
              {ticket.title}
            </CardTitle>
            <p className="text-gray-500 text-sm">
              Criado em{" "}
              {new Date(ticket.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge
              className={cn(
                "px-2 py-1",
                priorityColors[ticket.priority || "Média"]
              )}
            >
              {ticket.priority}
            </Badge>
            <Badge
              className={cn(
                "px-2 py-1",
                statusColors[ticket.status || "Aberto"]
              )}
            >
              {ticket.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </CardContent>
      </Card>

      <TicketDetail
        ticket={ticketWithUpdatedMessages}
        messages={ticketWithUpdatedMessages.messages || []}
        onSendMessage={handleSendMessage}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        isLoading={
          updateStatusticket.isPending ||
          updateStatusticket.isPending ||
          sendMessageMutation.isPending
        }
      />
    </div>
  );
}
