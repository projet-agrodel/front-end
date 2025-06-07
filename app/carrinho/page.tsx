"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { CarrinhoItem } from "@/services/interfaces/interfaces"; // Importa a interface
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Schema de validação para o formulário de pagamento
const paymentFormSchema = z.object({
  payment_method: z.enum(["Cartão"], {
    required_error: "Por favor, selecione um método de pagamento",
  }),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

const CartManager: React.FC<{
  children: (props: {
    itemsWithLocalQuantity: (CarrinhoItem & { localQuantity: number })[];
    totalItems: number;
    totalPrice: number;
    updateLocalQuantity: (productId: number, quantity: number) => void;
  }) => React.ReactNode;
  cartItems: CarrinhoItem[];
}> = ({ children, cartItems }) => {
  const [localQuantities, setLocalQuantities] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    const newLocalQuantities: Record<number, number> = {};
    cartItems.forEach((item) => {
      newLocalQuantities[item.produto_id] =
        localQuantities[item.produto_id] !== undefined
          ? localQuantities[item.produto_id]
          : item.quantity;
    });
    setLocalQuantities(newLocalQuantities);
  }, [cartItems]);

  // Função para atualizar a quantidade local de um item
  const updateLocalQuantity = useCallback(
    (productId: number, quantity: number) => {
      setLocalQuantities((prev) => ({
        ...prev,
        [productId]: quantity,
      }));
    },
    []
  );

  // Calcular itens com quantidades locais
  const itemsWithLocalQuantity = useMemo(() => {
    return cartItems.map((item) => ({
      ...item,
      localQuantity:
        localQuantities[item.produto_id] !== undefined
          ? localQuantities[item.produto_id]
          : item.quantity,
    }));
  }, [cartItems, localQuantities]);

  const totalItems = useMemo(() => {
    return itemsWithLocalQuantity.reduce(
      (sum, item) => sum + item.localQuantity,
      0
    );
  }, [itemsWithLocalQuantity]);

  const totalPrice = useMemo(() => {
    return itemsWithLocalQuantity.reduce((sum, item) => {
      const productPrice = item.produto?.price || 0;
      return sum + productPrice * item.localQuantity;
    }, 0);
  }, [itemsWithLocalQuantity]);

  return (
    <>
      {children({
        itemsWithLocalQuantity,
        totalItems,
        totalPrice,
        updateLocalQuantity,
      })}
    </>
  );
};

const CartItemDisplay: React.FC<{
  item: CarrinhoItem & { localQuantity: number };
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  updateLocalQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => Promise<void>;
}> = ({ item, updateQuantity, updateLocalQuantity, removeFromCart }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingQuantityRef = useRef<number | null>(null);
  const isUpdatingRef = useRef(false);

  const handleRemoveItem = useCallback(
    async (productId: number) => {
      if (isRemoving) return;

      try {
        setIsRemoving(true);
        await removeFromCart(productId);
      } finally {
        setIsRemoving(false);
      }
    },
    [removeFromCart, isRemoving]
  );

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      // Validação básica
      if (newQuantity <= 0) newQuantity = 1;

      // Limite de estoque
      const estoqueDisponivel = item.produto?.stock || 0;
      if (newQuantity > estoqueDisponivel) {
        newQuantity = estoqueDisponivel;
      }

      if (newQuantity === item.localQuantity) return;

      updateLocalQuantity(item.produto_id, newQuantity);

      pendingQuantityRef.current = newQuantity;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const finalQuantity = pendingQuantityRef.current;
        pendingQuantityRef.current = null;

        if (finalQuantity === null || isUpdatingRef.current) return;

        isUpdatingRef.current = true;

        // Enviar para o backend
        updateQuantity(item.produto_id, finalQuantity).finally(() => {
          isUpdatingRef.current = false;
        });
      }, 500);
    },
    [
      item.produto,
      item.produto_id,
      item.localQuantity,
      updateQuantity,
      updateLocalQuantity,
    ]
  );

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4">
      <div className="flex items-center space-x-4">
        {/* Placeholder para imagem do produto */}
        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
          Img
        </div>
        <div>
          {/* Acessa os dados através de item.produto usando os nomes corretos */}
          <h3 className="text-lg font-semibold text-gray-800">
            {item.produto?.name || "Nome Indisponível"}
          </h3>
          {/* Acessa o nome da categoria corretamente */}
          <p className="text-sm text-gray-500">
            {item.produto?.category?.name || "Categoria Indisponível"}
          </p>
          <p className="text-green-600 font-semibold">
            {/* Usa item.produto.price */}
            R${" "}
            {item.produto?.price?.toFixed(2).replace(".", ",") ||
              "Preço Indisponível"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-300 rounded">
          <button
            onClick={() => handleQuantityChange(item.localQuantity - 1)}
            className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-l transition-colors duration-200"
            aria-label="Diminuir quantidade"
            disabled={item.localQuantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-1 border-l border-r border-gray-300 font-medium text-gray-800">
            {item.localQuantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.localQuantity + 1)}
            className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-r transition-colors duration-200"
            aria-label="Aumentar quantidade"
            disabled={item.localQuantity >= (item.produto?.stock || 0)}
          >
            +
          </button>
        </div>
        <p className="font-semibold w-24 text-right">
          {/* Calcula subtotal usando item.produto.price e localQuantity */}
          R${" "}
          {((item.produto?.price || 0) * item.localQuantity)
            .toFixed(2)
            .replace(".", ",")}
        </p>
        <button
          onClick={() => handleRemoveItem(item.produto_id)}
          className={`${
            isRemoving ? "opacity-50" : "text-red-500 hover:text-red-700"
          } transition-colors duration-200`}
          aria-label="Remover item"
          disabled={isRemoving}
        >
          {isRemoving ? "Removendo..." : "Remover"}
        </button>
      </div>
    </div>
  );
};

const CarrinhoPage = () => {
  const { data: session } = useSession();
  const { cartItems, updateQuantity, removeFromCart, clearCart, isLoading } =
    useCart();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  });

  useEffect(() => {
    if (!isLoading && showLoadingIndicator) {
      setShowLoadingIndicator(false);
    }
  }, [isLoading, showLoadingIndicator]);

  const onSubmit = async () => {
    try {
      setIsProcessing(true);

      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: session?.user.id,
            items: cartItems,
          }),
        }
      );

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.message);
      }

      const { order } = await orderResponse.json();
      
      await clearCart();

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ 'status': 'Concluido' }),
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // const paymentResponse = await fetch(
      //     `${process.env.NEXT_PUBLIC_API_URL}/api/payments`,
      //     {
      //       method: "POST",
      //       headers: {
      //         'Authorization': `Bearer ${session?.accessToken}`,
      //         "Content-Type": "application/json",
      //       },
  
      //       body: JSON.stringify({
      //         order_id: order.id,
      //         amount: order.amount,
      //         payment_method: data.payment_method,
      //         items: cartItems,
      //       }),
      //     }
      //   );

      // const payment = await paymentResponse.json()
  
      // window.open(payment.api.init_point, "_blank");
      
      // 5. Redirecionar para a página do pedido
      router.push(`/pedidos/${order.id}`); 
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert(
        "Ocorreu um erro ao processar o pagamento. Por favor, tente novamente." + (error as Error).message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Seu Carrinho</h1>

      {/* Mostrar indicador de carregamento apenas na primeira vez */}
      {showLoadingIndicator && isLoading && (
        <div className="text-center py-4 bg-white rounded-lg shadow mb-4">
          <p className="text-lg text-gray-600">Carregando carrinho...</p>
        </div>
      )}

      {/* Mostrar mensagem de carrinho vazio quando apropriado */}
      {cartItems.length === 0 && !isLoading ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600 mb-4">Seu carrinho está vazio.</p>
          <Link href="/produtos">
            <span className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition-colors duration-200 inline-block">
              Continuar Comprando
            </span>
          </Link>
        </div>
      ) : null}

      {/* Mostrar conteúdo do carrinho se existirem itens */}
      {cartItems.length > 0 && (
        <CartManager cartItems={cartItems}>
          {({
            itemsWithLocalQuantity,
            totalItems,
            totalPrice,
            updateLocalQuantity,
          }) => (
            <div className="bg-white rounded-lg shadow p-6">
              {/* Cabeçalho da tabela de itens */}
              <div className="hidden md:flex items-center justify-between border-b border-gray-300 pb-3 mb-4 font-semibold text-gray-600 text-sm">
                <span className="w-1/2">Produto</span>
                <span className="w-1/4 text-center">Quantidade</span>
                <span className="w-1/4 text-right">Subtotal</span>
                <span className="w-16 text-right"></span>{" "}
                {/* Espaço para botão remover */}
              </div>

              {/* Lista de itens */}
              {itemsWithLocalQuantity.map((item) => (
                <CartItemDisplay
                  key={item.produto_id}
                  item={item}
                  updateQuantity={updateQuantity}
                  updateLocalQuantity={updateLocalQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}

              {/* Resumo do carrinho */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <button
                    onClick={clearCart}
                    className="text-gray-500 hover:text-red-600 font-medium mb-4 md:mb-0 transition-colors duration-200"
                    disabled={isLoading || isProcessing}
                  >
                    Limpar Carrinho
                  </button>
                  <div className="text-right">
                    <p className="text-lg text-gray-700 mb-1">
                      Total de Itens:{" "}
                      <span className="font-semibold">{totalItems}</span>
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      Total:{" "}
                      <span className="text-green-600">
                        R$ {totalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pagamento
                    </label>
                    <select
                      {...register("payment_method")}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                      disabled={isProcessing}
                    >
                      <option value="">Selecione um método de pagamento</option>
                      <option value="Cartão">Cartão de Crédito</option>
                    </select>
                    {errors.payment_method && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.payment_method.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded transition-colors duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing
                      ? "Processando pagamento..."
                      : "Finalizar Compra"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </CartManager>
      )}
    </div>
  );
};

export default CarrinhoPage;
