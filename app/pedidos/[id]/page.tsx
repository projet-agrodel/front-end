"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pedido, PedidoItem, Pagamento } from "@/services/interfaces/interfaces";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";

// Schema de validação para atualização do pedido
const orderUpdateSchema = z.object({
  status: z.enum(["Em Processamento", "Não autorizado", "Concluido"]),
  description: z.string().optional(),
  shipping_tracking: z.string().optional(),
  payment_status: z.enum(["Aprovado", "Pendente", "Rejeitado"]),
});

type OrderUpdateFormData = z.infer<typeof orderUpdateSchema>;

const OrderStatusBadge: React.FC<{ status: Pedido["status"] }> = ({ status }) => {
  const statusConfig = {
    "Em Processamento": "bg-yellow-100 text-yellow-800",
    "Não autorizado": "bg-red-100 text-red-800",
    "Concluido": "bg-green-100 text-green-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]}`}>
      {status}
    </span>
  );
};

const PaymentStatusBadge: React.FC<{ status: Pagamento["status"] }> = ({ status }) => {
  const statusConfig = {
    "Aprovado": "bg-green-100 text-green-800",
    "Pendente": "bg-yellow-100 text-yellow-800",
    "Rejeitado": "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]}`}>
      {status}
    </span>
  );
};

const PedidoPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderUpdateFormData>({
    resolver: zodResolver(orderUpdateSchema),
  });

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${params.id}`);
        if (!response.ok) throw new Error("Falha ao carregar o pedido");
        const data = await response.json();
        setPedido(data);
        reset({
          status: data.status,
          description: data.description || "",
          payment_status: data.payments?.[0]?.status || "Pendente",
        });
      } catch (error) {
        console.error("Erro ao carregar pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPedido();
    }
  }, [params.id, reset]);

  const onSubmit = async (data: OrderUpdateFormData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Falha ao atualizar o pedido");
      
      const updatedOrder = await response.json();
      setPedido(updatedOrder);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      alert("Ocorreu um erro ao atualizar o pedido. Por favor, tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Pedido não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cabeçalho do Pedido */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pedido #{pedido.id}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Realizado em{" "}
                {format(new Date(pedido.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
            <div className="flex space-x-4 items-center">
              <OrderStatusBadge status={pedido.status} />
              {session?.user.role === "admin" && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isEditing ? "Cancelar Edição" : "Editar Pedido"}
                </button>
              )}
            </div>
          </div>

          {isEditing && session?.user.role === "admin" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status do Pedido
                  </label>
                  <select
                    {...register("status")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Em Processamento">Em Processamento</option>
                    <option value="Não autorizado">Não autorizado</option>
                    <option value="Concluido">Concluído</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status do Pagamento
                  </label>
                  <select
                    {...register("payment_status")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Rejeitado">Rejeitado</option>
                  </select>
                  {errors.payment_status && (
                    <p className="text-red-600 text-sm mt-1">{errors.payment_status.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  {...register("description")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Rastreio
                </label>
                <input
                  type="text"
                  {...register("shipping_tracking")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Detalhes do Pedido */}
        <div className="p-6">
          {/* Itens do Pedido */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Itens do Pedido
            </h2>
            <div className="space-y-4">
              {pedido.items?.map((item: PedidoItem) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo do Pagamento */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo do Pagamento
            </h2>
            <div className="space-y-2">
              {pedido.payments?.map((payment) => (
                <div key={payment.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {payment.payment_method} - <PaymentStatusBadge status={payment.status} />
                  </span>
                  <span className="font-medium text-gray-900">
                    R$ {payment.amount.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-green-600">
                    R$ {pedido.amount.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoPage; 