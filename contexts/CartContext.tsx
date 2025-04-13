"use client";

import { CarrinhoItem, Produto } from '@/services/interfaces/interfaces';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Interface para o valor do contexto do carrinho
interface CartContextType {
  cartItems: CarrinhoItem[];
  addToCart: (product: Produto) => void;
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

  const addToCart = (product: Produto) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.produto_id === product.id);
      if (existingItem) {
        // Se o item já existe, aumenta a quantidade
        return prevItems.map(item =>
          item.produto_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Se é um novo item, adiciona ao carrinho com quantidade 1
        return [...prevItems, { 
          produto_id: product.id, 
          carrinho_id: carrinhoId, 
          quantity: 1, 
          produto: product 
        }];
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