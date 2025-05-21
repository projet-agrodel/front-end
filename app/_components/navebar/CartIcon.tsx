'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const CartIcon = () => {
  const { cartItems } = useCart();
  const [localTotal, setLocalTotal] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const prevTotalRef = useRef(0);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    setLocalTotal(newTotal);

    if (newTotal > prevTotalRef.current) {
      setAnimationClass('animate');

      const timeout = setTimeout(() => {
        setAnimationClass('');
      }, 500);
      
      return () => clearTimeout(timeout);
    }

    prevTotalRef.current = newTotal;
  }, [cartItems]);

  return (
    <Link 
      href="/carrinho" 
      className="relative text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
    >
      <style jsx>{`
        @keyframes pulseEffect {
          0% {
            transform: scale(1);
            color: rgb(75, 85, 99);
          }
          25% {
            transform: scale(1.2);
            color: rgb(22, 163, 74);
          }
          50% {
            transform: scale(1.1);
            color: rgb(22, 163, 74);
          }
          75% {
            transform: scale(1.15);
            color: rgb(22, 163, 74);
          }
          100% {
            transform: scale(1);
            color: rgb(75, 85, 99);
          }
        }
        
        @keyframes badgePulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
          }
          25% {
            transform: scale(1.2);
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.4);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 0 5px rgba(220, 38, 38, 0.2);
          }
          75% {
            transform: scale(1.15);
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.4);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
          }
        }
        
        .cart-icon.animate {
          animation: pulseEffect 1s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
        }
        
        .cart-badge.animate {
          animation: badgePulse 1s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
        }
      `}</style>
      
      <div className={`cart-icon ${animationClass} transition-transform`}>
        <ShoppingCartIcon className="h-6 w-6" />
      </div>

      {localTotal > 0 && (
        <span 
          className={`
            cart-badge ${animationClass}
            absolute -top-1 -right-1 block h-5 w-5 rounded-full
            ring-2 ring-white bg-red-500 text-white text-xs font-bold 
            flex items-center justify-center
            transition-transform
          `}
        >
          {localTotal}
        </span>
      )}
    </Link>
  );
};

export default CartIcon; 