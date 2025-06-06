'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Produto } from '@/services/interfaces/interfaces';
import { ArrowLeftIcon, AlertTriangle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/services/productService';

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

export default function DetalhesProduto() {
  const params = useParams();
  const router = useRouter();
  const useCartContext = useCart();
  const [quantidade, setQuantidade] = useState(1);
  const [adicionadoAoCarrinho, setAdicionadoAoCarrinho] = useState(false);
  
  const { data: produto, isLoading, error } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => getProductById(params.id as string),
  });
  
  const handleAdicionarAoCarrinho = () => {
    if (!produto) return;
    
    useCartContext.addToCart(produto, quantidade);
    
    setAdicionadoAoCarrinho(true);
    setTimeout(() => {
      setAdicionadoAoCarrinho(false);
    }, 3000);
  };
  
  const decrementarQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };
  
  const incrementarQuantidade = () => {
    const novaQuantidade = quantidade + 1;
    // Verificar se a nova quantidade não ultrapassa o estoque
    if (produto && novaQuantidade <= produto.stock) {
      setQuantidade(novaQuantidade);
    }
  };
  
  // Estilo do botão de categoria
  const categoryColor = produto?.category?.name ? getCategoryColor(produto.category.name) : 'bg-gray-400';
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Erro ao carregar produto</h2>
          <p className="text-gray-600 mb-6">{error instanceof Error ? error.message : 'Ocorreu um erro ao carregar o produto.'}</p>
          <Link href="/produtos" className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md">
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }
  
  if (!produto) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h2>
          <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
          <Link href="/produtos" className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md">
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }

  // Verificar se o produto está indisponível
  if (produto.stock <= 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-green-700"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            <span>Voltar</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className={`${categoryColor} p-8 flex items-center justify-center min-h-[300px]`}>
              {produto.imageUrl ? (
                <div className="relative w-full h-[300px]">
                  <Image
                    src={produto.imageUrl}
                    alt={produto.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="text-white text-2xl font-bold">Sem imagem</div>
              )}
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{produto.name}</h1>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${categoryColor}`}>
                    {produto.category?.name}
                  </span>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Produto Indisponível</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>Este produto está temporariamente fora de estoque.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Descrição</h2>
                <p className="text-gray-600">{produto.description}</p>
              </div>

              <div className="flex justify-center">
                <Link 
                  href="/produtos" 
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-200"
                >
                  Ver outros produtos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Navegação de volta */}
      <div className="mb-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-600 hover:text-green-700"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          <span>Voltar</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Imagem do produto */}
          <div className={`${categoryColor} p-8 flex items-center justify-center min-h-[300px]`}>
            {produto.imageUrl ? (
              <div className="relative w-full h-[300px]">
                <Image
                  src={produto.imageUrl}
                  alt={produto.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="text-white text-2xl font-bold">Sem imagem</div>
            )}
          </div>
          
          {/* Informações do produto */}
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{produto.name}</h1>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${categoryColor}`}>
                  {produto.category?.name}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  {produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                {produto.isPromotion && produto.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {produto.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {produto.stock} unidades disponíveis
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Descrição</h2>
              <p className="text-gray-600">{produto.description}</p>
            </div>
            
            {/* Controles de quantidade e botão de adicionar ao carrinho */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={decrementarQuantidade}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  disabled={quantidade <= 1}
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantidade}</span>
                <button
                  onClick={incrementarQuantidade}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  disabled={quantidade >= produto.stock}
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAdicionarAoCarrinho}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                  adicionadoAoCarrinho
                    ? 'bg-green-600 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                disabled={adicionadoAoCarrinho}
              >
                {adicionadoAoCarrinho ? 'Adicionado ao carrinho!' : 'Adicionar ao carrinho'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 