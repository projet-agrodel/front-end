"use client";

import { CarrinhoItem, Produto } from '@/services/interfaces/interfaces';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Interface para o valor do contexto do carrinho
interface CartContextType {
  cartItems: CarrinhoItem[];
  addToCart: (product: Produto, quantityToAdd?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
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

// Componente Provedor
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CarrinhoItem[]>([]);
  const [carrinhoId, setCarrinhoId] = useState<number>(1); // Simular um ID de carrinho

  // Carregar carrinho do localStorage ao iniciar (opcional, para persistência)
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Salvar carrinho no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Produto, quantityToAdd: number = 1) => {
    // Garante que a quantidade seja pelo menos 1
    const validQuantity = Math.max(1, quantityToAdd);

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.produto_id === product.id);

      if (existingItemIndex > -1) {
        // Se o item já existe, atualiza a quantidade somando a nova quantidade
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + validQuantity
        };
        return updatedItems;
      } else {
        // Se é um novo item, adiciona ao carrinho com a quantidade especificada
        const newItem: CarrinhoItem = {
          produto_id: product.id,
          carrinho_id: carrinhoId, // Usar ID real do carrinho se integrado com back-end
          quantity: validQuantity,
          produto: product
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.produto_id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.produto_id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0) // Remove itens com quantidade 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 