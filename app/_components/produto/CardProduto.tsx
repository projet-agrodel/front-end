"use client";

import { useCart } from '@/contexts/CartContext';
import { Produto } from '@/services/interfaces/interfaces';
import Link from 'next/link';
import React from 'react';


interface CardProdutoProps {
  produto: Produto;
}

// Função para obter uma cor baseada na categoria do produto
const getCategoryColor = (categoria: string | undefined | null): string => {
  const colors: Record<string, string> = {
    'Fertilizantes': 'bg-purple-600',
    'Sementes': 'bg-yellow-500',
    'Ferramentas': 'bg-blue-500',
    'Defensivos': 'bg-red-500',
    'Substratos': 'bg-amber-600'
  };
  
  return colors[categoria || ""] || 'bg-gray-400';
};

const CardProduto = ({ produto }: CardProdutoProps) => {
  const categoryColor = getCategoryColor(produto?.category?.name);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(produto);
    console.log(`1 x ${produto.name} adicionado(s)`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] flex flex-col">
      <div className={`relative w-full h-48 flex items-center justify-center ${categoryColor}`}>
        <span className="text-white font-bold text-xl">{produto.category?.name}</span>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{produto.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{produto.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-green-600 font-bold text-2xl">
              R$ {produto.price.toFixed(2).replace('.', ',')}
            </span>
            
            <button
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-3xl text-xs font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ml-2"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={produto.stock <= 0}
            >
              {produto.stock > 0 ? 'Adicionar' : 'Sem Estoque'}
            </button>
          </div>
          
          <Link href={`/produtos/${produto.id}`} 
                className="text-green-600 hover:text-green-800 text-sm inline-block underline text-center w-full mt-2"
                onClick={(e) => e.stopPropagation()}
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardProduto;