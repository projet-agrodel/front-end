"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Pedido } from "@/services/interfaces/interfaces";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Badge } from "@/app/_components/ui/badge";
import {
  Search,
  Package2,
  CreditCard,
  Clock,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

const statusColors = {
  Concluido: "bg-green-100 text-green-800",
  "Em Processamento": "bg-yellow-100 text-yellow-800",
  "Não autorizado": "bg-red-100 text-red-800",
};

const paymentStatusColors = {
  Aprovado: "bg-green-100 text-green-800",
  Pendente: "bg-yellow-100 text-yellow-800",
  Rejeitado: "bg-red-100 text-red-800",
};

export default function PedidosPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "Todos";

  const updateUrlParams = (params: { [key: string]: string }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    router.push(`/pedidos?${newSearchParams.toString()}`);
  };

  const { data: pedidos, isLoading } = useQuery<Pedido[]>({
    queryKey: ["pedidos", session?.user?.id, search, status],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders?user_id=${session?.user?.id}&search=${search}&status=${status}`
      );
      if (!response.ok) throw new Error("Erro ao carregar pedidos");
      return response.json();
    },
    enabled: !!session?.user?.id,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Meus Pedidos</h1>
        <p className="text-gray-600">
          Acompanhe o status e detalhes dos seus pedidos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            placeholder="Buscar por número do pedido..."
            className="pl-10"
            value={search}
            onChange={(e) => updateUrlParams({ search: e.target.value })}
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => updateUrlParams({ status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os status</SelectItem>
            <SelectItem value="Em Processamento">Em Processamento</SelectItem>
            <SelectItem value="Concluido">Concluído</SelectItem>
            <SelectItem value="Não autorizado">Não autorizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))
        ) : pedidos?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum pedido encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Não encontramos nenhum pedido com os filtros selecionados.
              </p>
            </CardContent>
          </Card>
        ) : (
          pedidos?.map((pedido) => (
            <Link href={`/pedidos/${pedido.id}`} key={`${session?.user.id}-${pedido.id}`}>
              <Card
                className="hover:shadow-lg transition-all duration-300 border-l-4 mb-4"
                style={{
                  borderLeftColor:
                    pedido.status === "Concluido"
                      ? "#22c55e"
                      : pedido.status === "Não autorizado"
                      ? "#ef4444"
                      : "#eab308",
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        Pedido #{pedido.id}
                      </CardTitle>
                      <Badge className={statusColors[pedido.status]}>
                        {pedido.status}
                      </Badge>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Data do Pedido</p>
                        <p className="text-sm text-gray-500">
                          {format(
                            new Date(pedido.created_at),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Pagamento</p>
                        <div className="flex items-center gap-2">
                          {pedido?.payments?.map((payament) => {
                            return (
                              <>
                                <span className="text-sm text-gray-500">
                                  {payament.payment_method}
                                </span>
                                <Badge
                                  className={
                                    paymentStatusColors[
                                      payament.status || "Pendente"
                                    ]
                                  }
                                >
                                  {payament.status}
                                </Badge>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Itens</p>
                        <p className="text-sm text-gray-500">
                          {pedido.items?.length || 0}{" "}
                          {pedido.items?.length === 1 ? "item" : "itens"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {pedido.items && pedido.items.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {pedido.items.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-600">
                            {item.quantity}x {item.product_name}
                          </span>
                          <span className="font-medium">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {pedido.items.length > 2 && (
                        <p className="text-sm text-gray-500 italic">
                          E mais {pedido.items.length - 2} itens...
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="border-t pt-4 bg-gray-50 rounded-b-lg">
                  <div className="w-full flex justify-between items-center font-medium">
                    <span className="text-gray-600">
                      Total do Pedido
                    </span>
                    <span className="text-gray-900">
                      R${" "}
                      {pedido.items?.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      ).toFixed(2)}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
