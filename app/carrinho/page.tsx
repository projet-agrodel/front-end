"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { CarrinhoItem } from "@/services/interfaces/interfaces"; // Importa a interface
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema de validação do formulário
const checkoutSchema = z.object({
  payment_method: z.enum(["Cartão", "PIX"]),
  card_number: z.string().optional(),
  card_holder: z.string().optional(),
  card_expiry: z.string().optional(),
  card_cvv: z.string().optional(),
  shipping_address: z.string().min(1, "Endereço de entrega é obrigatório"),
  shipping_city: z.string().min(1, "Cidade é obrigatória"),
  shipping_state: z.string().min(1, "Estado é obrigatório"),
  shipping_zip: z.string().min(1, "CEP é obrigatório"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

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
  const router = useRouter();
  const { data: session } = useSession();
  const { cartItems, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [isLoadingOrder, setLoadingOrder] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const paymentMethod = watch("payment_method");

  const onSubmit = async (data: CheckoutFormData) => {
    setLoadingOrder(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session?.user.id,
          items: cartItems,
          payment_method: data.payment_method,
          shipping_details: {
            address: data.shipping_address,
            city: data.shipping_city,
            state: data.shipping_state,
            zip: data.shipping_zip,
          },
          card_details:
            data.payment_method === "Cartão"
              ? {
                  number: data.card_number,
                  holder: data.card_holder,
                  expiry: data.card_expiry,
                  cvv: data.card_cvv,
                }
              : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar o pedido");
      }

      const orderData = await response.json();
      await clearCart();
      router.push(`/pedido/${orderData.id}`);
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      alert("Ocorreu um erro ao finalizar a compra. Por favor, tente novamente.");
    } finally {
      setLoadingOrder(false);
    }
  };

  useEffect(() => {
    if (!isLoading && showLoadingIndicator) {
      setShowLoadingIndicator(false);
    }
  }, [isLoading, showLoadingIndicator]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Seu Carrinho</h1>

      {showLoadingIndicator && isLoading && (
        <div className="text-center py-4 bg-white rounded-lg shadow mb-4">
          <p className="text-lg text-gray-600">Carregando carrinho...</p>
        </div>
      )}

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

      {cartItems.length > 0 && (
        <CartManager cartItems={cartItems}>
          {({
            itemsWithLocalQuantity,
            totalItems,
            totalPrice,
            updateLocalQuantity,
          }) => (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="hidden md:flex items-center justify-between border-b border-gray-300 pb-3 mb-4 font-semibold text-gray-600 text-sm">
                <span className="w-1/2">Produto</span>
                <span className="w-1/4 text-center">Quantidade</span>
                <span className="w-1/4 text-right">Subtotal</span>
                <span className="w-16 text-right"></span>
              </div>

              {itemsWithLocalQuantity.map((item) => (
                <CartItemDisplay
                  key={item.produto_id}
                  item={item}
                  updateQuantity={updateQuantity}
                  updateLocalQuantity={updateLocalQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}

              <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <button
                  onClick={clearCart}
                  className="text-gray-500 hover:text-red-600 font-medium mb-4 md:mb-0 transition-colors duration-200"
                  disabled={isLoading}
                >
                  Limpar Carrinho
                </button>
                <div className="text-right">
                  <p className="text-lg text-gray-700 mb-1">
                    Total de Itens: <span className="font-semibold">{totalItems}</span>
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mb-4">
                    Total:{" "}
                    <span className="text-green-600">
                      R$ {totalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </p>
                  <button
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded transition-colors duration-200 shadow hover:shadow-md"
                    onClick={() => setShowCheckoutForm(true)}
                    disabled={isLoadingOrder}
                  >
                    Prosseguir para o Checkout
                  </button>
                </div>
              </div>

              {showCheckoutForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      Finalizar Compra
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Método de Pagamento
                        </label>
                        <select
                          {...register("payment_method")}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          <option value="PIX">PIX</option>
                          <option value="Cartão">Cartão de Crédito</option>
                        </select>
                      </div>

                      {paymentMethod === "Cartão" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Número do Cartão
                            </label>
                            <input
                              type="text"
                              {...register("card_number")}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nome no Cartão
                            </label>
                            <input
                              type="text"
                              {...register("card_holder")}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Validade
                              </label>
                              <input
                                type="text"
                                {...register("card_expiry")}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="MM/AA"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                {...register("card_cvv")}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="123"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Endereço de Entrega
                          </label>
                          <input
                            type="text"
                            {...register("shipping_address")}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                          {errors.shipping_address && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.shipping_address.message}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Cidade
                            </label>
                            <input
                              type="text"
                              {...register("shipping_city")}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                            {errors.shipping_city && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.shipping_city.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Estado
                            </label>
                            <input
                              type="text"
                              {...register("shipping_state")}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                            {errors.shipping_state && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.shipping_state.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CEP
                          </label>
                          <input
                            type="text"
                            {...register("shipping_zip")}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                          {errors.shipping_zip && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.shipping_zip.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowCheckoutForm(false)}
                          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={isLoadingOrder}
                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          {isLoadingOrder ? "Processando..." : "Finalizar Compra"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </CartManager>
      )}
    </div>
  );
};

export default CarrinhoPage;
