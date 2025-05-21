"use client";

import { CarrinhoItem, Produto } from '@/services/interfaces/interfaces';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface CartContextType {
  cartItems: CarrinhoItem[];
  addToCart: (product: Produto, quantityToAdd?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  loadCart: () => Promise<void>;
  checkProductAvailability: (productId: number, quantityRequested: number) => Promise<{ available: boolean; currentStock: number }>;
}

// Criação do Contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook customizado para usar o contexto
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Props do Provider
interface CartProviderProps {
  children: ReactNode;
}

const handleAuthError = (error: unknown, status?: number) => {
  if (
    status === 401 || 
    status === 403 || 
    (error instanceof Error && (error.message.includes('401') || error.message.includes('403')))
  ) {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('session_invalid', 'true');
      const sessionInvalidEvent = new CustomEvent('session_invalid');
      window.dispatchEvent(sessionInvalidEvent);
    }
  }
};

// Componente Provedor
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CarrinhoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkProductAvailability = useCallback(async (productId: number, quantityRequested: number): Promise<{ available: boolean; currentStock: number }> => {
    if (quantityRequested <= 0) {
      return { available: true, currentStock: 0 };
    }

    try {
      const response = await fetch(`${API_URL}/api/products/${productId}/availability?quantity=${quantityRequested}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.accessToken ? { 'Authorization': `Bearer ${session.accessToken}` } : {})
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao verificar disponibilidade: ${response.status}`);
      }

      const availability = await response.json();
      
      // Usar diretamente o formato de resposta do novo endpoint
      return { 
        available: availability.available,
        currentStock: availability.stock
      };
    } catch (err) {
      console.error("Erro ao verificar disponibilidade:", err);
      // Em caso de erro, assumimos que o produto não está disponível para segurança
      return { available: false, currentStock: 0 };
    }
  }, [session]);

  // Função para buscar o carrinho da API
  const fetchApiCart = useCallback(async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    setError(null);
    try {
      console.log("Buscando carrinho da API...");
      
      // Chamada real à API
      const response = await fetch(`${API_URL}/api/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleAuthError(null, response.status);
        }
        throw new Error(`Erro ao buscar carrinho: ${response.status}`);
      }
      
      const cartData = await response.json();
      console.log("Carrinho recebido da API:", cartData);
      
      // Processando a resposta para garantir compatibilidade
      setCartItems(cartData);
      
    } catch (err) {
      console.error("Erro ao buscar carrinho:", err);
      handleAuthError(err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar carrinho.');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Função para carregar/recarregar o carrinho 
  const loadCart = useCallback(async () => {
    if (status === 'authenticated') {
      await fetchApiCart();
    } else if (status === 'unauthenticated') {
      console.log("Carregando carrinho do localStorage para usuário não autenticado...");
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
  }, [status, fetchApiCart]);

  // Função para sincronizar o carrinho local com o backend após login
  const syncLocalCartWithBackend = useCallback(async () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart && session?.accessToken) {
      try {
        const localCartItems = JSON.parse(storedCart) as CarrinhoItem[];
        if (localCartItems.length === 0) return;

        console.log("Sincronizando carrinho local com o backend após login...");
        
        // Opção 1: Substituir o carrinho do backend pelo carrinho local
        const response = await fetch(`${API_URL}/api/cart/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`
          },
          body: JSON.stringify({ 
            items: localCartItems.map(item => ({ 
              produto_id: item.produto_id, 
              quantity: item.quantity 
            }))
          })
        });

        if (!response.ok) {
          throw new Error('Falha ao sincronizar carrinho local com o backend');
        }

        // Limpar o carrinho do localStorage após a sincronização
        localStorage.removeItem('cart');
        
        // Buscar o carrinho atualizado do backend
        await fetchApiCart();
        
      } catch (err) {
        console.error("Erro ao sincronizar carrinho:", err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao sincronizar carrinho.');
      }
    }
  }, [fetchApiCart, session]);

  // Carregar carrinho inicial dependendo do status da sessão
  useEffect(() => {
    loadCart();
    
    // Se o usuário acabou de fazer login e tinha um carrinho local, tenta sincronizá-lo
    if (status === 'authenticated') {
      syncLocalCartWithBackend();
    }
  }, [loadCart, status, syncLocalCartWithBackend]);

  // Salvar carrinho no localStorage (apenas se não estiver autenticado)
  useEffect(() => {
    if (status !== 'authenticated') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      console.log("Carrinho salvo no localStorage (usuário não autenticado)");
    }
  }, [cartItems, status]);

  // Adicionar ao carrinho
  const addToCart = async (product: Produto, quantityToAdd: number = 1) => {
    setIsLoading(true);
    setError(null);
    const validQuantity = Math.max(1, quantityToAdd);

    try {
      // Verificar a disponibilidade atual do produto no servidor antes de adicionar
      const availability = await checkProductAvailability(product.id, validQuantity);
      
      if (!availability.available) {
        const currentItemInCart = cartItems.find(item => item.produto_id === product.id);
        const inCartMsg = currentItemInCart ? ` (${currentItemInCart.quantity} já no carrinho)` : '';
        setError(`Estoque insuficiente para ${product.name}. Disponível: ${availability.currentStock}${inCartMsg}. Solicitado: ${validQuantity}`);
        setIsLoading(false);
        return;
      }
      
      // Atualizar o objeto do produto com o estoque atual do servidor
      const updatedProduct = { ...product, stock: availability.currentStock };

      // Encontrar o produto no carrinho atual (se existir)
      const existingItemIndex = cartItems.findIndex(item => item.produto_id === product.id);

      // Atualização otimista local imediata
      if (existingItemIndex > -1) {
        // Produto já existe no carrinho, atualizar quantidade
        const newQuantity = cartItems[existingItemIndex].quantity + validQuantity;
        // Verificar se a nova quantidade não ultrapassa o estoque
        const finalQuantity = Math.min(newQuantity, availability.currentStock);
        
        setCartItems(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: finalQuantity,
            produto: updatedProduct
          };
          return updatedItems;
        });
      } else {
        // Produto não existe no carrinho, adicionar novo item
        setCartItems(prevItems => [
          ...prevItems,
          {
            produto_id: product.id,
            carrinho_id: 0, // será atualizado quando vier a resposta da API
            quantity: validQuantity,
            produto: updatedProduct
          }
        ]);
      }

      if (status === 'authenticated' && session?.accessToken) {
        try {
          console.log(`API: Adicionando ao carrinho - ID do produto: ${product.id}, Qtd: ${validQuantity}`);
          
          // Chamada à API para adicionar ao carrinho
          const response = await fetch(`${API_URL}/api/cart/item`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({
              produto_id: product.id,
              quantity: validQuantity
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Falha ao adicionar ao carrinho' }));
            // Tratar casos específicos, como estoque insuficiente reportado pelo backend
            if (response.status === 409) {
              throw new Error(errorData.message || `Estoque insuficiente para ${product.name} conforme a API`);
            }
            throw new Error(errorData.message || `Erro HTTP ${response.status} ao adicionar ao carrinho`);
          }

          await fetchApiCart();
          
        } catch (err) {
          console.error("Erro ao adicionar ao carrinho:", err);
          setError(err instanceof Error ? err.message : 'Erro ao adicionar ao carrinho.');

          await fetchApiCart();
        }
      } else {

      }
    } catch (err) {
      console.error("Erro na verificação de disponibilidade:", err);
      setError(err instanceof Error ? err.message : 'Erro ao verificar disponibilidade do produto.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number): Promise<void> => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    try {
      const availability = await checkProductAvailability(productId, quantity);
      
      if (!availability.available) {
        setError(`Estoque insuficiente. Disponível: ${availability.currentStock}. Solicitado: ${quantity}`);
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.produto_id === productId ? { 
              ...item, 
              quantity: Math.min(quantity, availability.currentStock),
              produto: item.produto ? {...item.produto, stock: availability.currentStock} : undefined
            } : item
          )
        );
        return;
      }

      const targetItem = cartItems.find(item => item.produto_id === productId);
      
      if (!targetItem) {
        setError("Produto não encontrado no carrinho.");
        return;
      }
      
      const updatedProduct = targetItem.produto ? { ...targetItem.produto, stock: availability.currentStock } : undefined;

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.produto_id === productId ? { 
            ...item, 
            quantity, 
            produto: updatedProduct
          } : item
        )
      );

      if (status === 'authenticated' && session?.accessToken) {
        try {          
          // Chamada à API para atualizar a quantidade
          const response = await fetch(`${API_URL}/api/cart/item/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({ quantity })
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Falha ao atualizar quantidade' }));
            
            if (response.status === 409) { 
              throw new Error(errorData.message || `Estoque insuficiente conforme a API`);
            }
            throw new Error(errorData.message || `Erro HTTP ${response.status} ao atualizar quantidade`);
          }
          
          // Atualizar com a resposta da API (caso haja alguma diferença)
          const updatedItem = await response.json();
          
          setCartItems(prevItems => 
            prevItems.map(item => 
              item.produto_id === productId ? updatedItem : item
            )
          );
          
        } catch (err) {
          console.error("Erro ao atualizar quantidade:", err);
          setError(err instanceof Error ? err.message : 'Erro ao atualizar quantidade.');
          // Resincronizar em caso de erro
          await fetchApiCart();
        }
      } else {
        // Para usuários não logados, já fizemos a atualização otimista acima
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }
    } catch (err) {
      console.error("Erro na verificação de disponibilidade:", err);
      setError(err instanceof Error ? err.message : 'Erro ao verificar disponibilidade do produto.');
    }
  };

  // Remover do carrinho
  const removeFromCart = async (productId: number) => {
    setIsLoading(true);
    setError(null);
    if (status === 'authenticated' && session?.accessToken) {
      try {
        console.log(`API: Removendo do carrinho - ID do produto: ${productId}`);
        
        // Chamada à API para remover o item do carrinho
        const response = await fetch(`${API_URL}/api/cart/item/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Falha ao remover do carrinho' }));
          throw new Error(errorData.message || `Erro HTTP ${response.status} ao remover do carrinho`);
        }
        
        // Atualização otimista (remover do estado local imediatamente)
        setCartItems(prevItems => prevItems.filter(item => item.produto_id !== productId));
        
        // Opcionalmente, também buscar o carrinho atualizado do backend
        await fetchApiCart();
        
      } catch (err) {
        console.error("Erro ao remover do carrinho:", err);
        setError(err instanceof Error ? err.message : 'Erro ao remover do carrinho.');
        // Resincronizar em caso de erro
        await fetchApiCart();
      }
    } else {
      // Lógica para usuários não logados (localStorage)
      setCartItems(prevItems => prevItems.filter(item => item.produto_id !== productId));
    }
    setIsLoading(false);
  };

  // Limpar carrinho
  const clearCart = async () => {
    setIsLoading(true);
    setError(null);
    if (status === 'authenticated' && session?.accessToken) {
      try {
        console.log("API: Limpando carrinho");
        
        // Chamada à API para limpar o carrinho
        const response = await fetch(`${API_URL}/api/cart`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Falha ao limpar carrinho' }));
          throw new Error(errorData.message || `Erro HTTP ${response.status} ao limpar carrinho`);
        }
        
        // Limpar o estado local
        setCartItems([]);
        
      } catch (err) {
        console.error("Erro ao limpar carrinho:", err);
        setError(err instanceof Error ? err.message : 'Erro ao limpar carrinho.');
        // Resincronizar em caso de erro
        await fetchApiCart();
      }
    } else {
      // Lógica para usuários não logados (localStorage)
      setCartItems([]);
    }
    setIsLoading(false);
  };

  // Calcular totais
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const productPrice = item.produto?.price || 0;
    return sum + productPrice * item.quantity;
  }, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isLoading,
    error,
    loadCart,
    checkProductAvailability,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 