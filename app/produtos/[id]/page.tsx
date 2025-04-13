'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Produto } from '@/services/interfaces/interfaces';
import { ArrowLeftIcon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

// Dados fictícios (Deverá ser substituído por chamadas de API depois)
const produtosMock: Produto[] = [
  {
    id: 1,
    name: 'Fertilizante Orgânico',
    price: 45.99,
    description: 'Fertilizante orgânico de alta qualidade para todos os tipos de plantas.',
    img: '/img/produtos/fertilizante-organico.jpg',
    stock: 50,
    created_at: '',
    updated_at: '',
    category: { id: 1, name: 'Fertilizantes', created_at: '', updated_at: '' }
  },
  {
    id: 2,
    name: 'Semente de Alface',
    price: 12.50,
    description: 'Sementes de alface crespa de alta germinação, pacote com 100 unidades.',
    img: '/img/produtos/semente-alface.jpg',
    stock: 120,
    created_at: '',
    updated_at: '',
    category: { id: 2, name: 'Sementes', created_at: '', updated_at: '' }
  },
  {
    id: 3,
    name: 'Regador Manual 5L',
    price: 29.90,
    description: 'Regador manual com capacidade para 5 litros, ideal para jardins e hortas.',
    img: '/img/produtos/regador-manual.jpg',
    stock: 35,
    created_at: '',
    updated_at: '',
    category: { id: 3, name: 'Ferramentas', created_at: '', updated_at: '' }
  },
  {
    id: 4,
    name: 'Herbicida Natural',
    price: 38.75,
    description: 'Herbicida natural à base de extratos vegetais, não agride o meio ambiente.',
    img: '/img/produtos/herbicida-natural.jpg',
    stock: 45,
    created_at: '',
    updated_at: '',
    category: { id: 4, name: 'Defensivos', created_at: '', updated_at: '' }
  },
  {
    id: 5,
    name: 'Substrato para Plantas',
    price: 18.99,
    description: 'Substrato de alta qualidade para vasos e jardins, embalagem de 5kg.',
    img: '/img/produtos/substrato-plantas.jpg',
    stock: 80,
    created_at: '',
    updated_at: '',
    category: { id: 5, name: 'Substratos', created_at: '', updated_at: '' }
  },
  {
    id: 6,
    name: 'Kit Ferramentas de Jardim',
    price: 89.90,
    description: 'Kit completo com 5 ferramentas essenciais para jardinagem.',
    img: '/img/produtos/kit-ferramentas.jpg',
    stock: 25,
    created_at: '',
    updated_at: '',
    category: { id: 3, name: 'Ferramentas', created_at: '', updated_at: '' }
  },
  {
    id: 7,
    name: 'Fertilizante NPK 10-10-10',
    price: 52.80,
    description: 'Fertilizante mineral balanceado para desenvolvimento completo das plantas.',
    img: '/img/produtos/fertilizante-npk.jpg',
    stock: 65,
    created_at: '',
    updated_at: '',
    category: { id: 1, name: 'Fertilizantes', created_at: '', updated_at: '' }
  },
  {
    id: 8,
    name: 'Sementes de Tomate Cereja',
    price: 15.99,
    description: 'Sementes selecionadas de tomate cereja, alta produtividade.',
    img: '/img/produtos/semente-tomate.jpg',
    stock: 90,
    created_at: '',
    updated_at: '',
    category: { id: 2, name: 'Sementes', created_at: '', updated_at: '' }
  },
  {
    id: 9,
    name: 'Pulverizador 2L',
    price: 35.50,
    description: 'Pulverizador manual com capacidade de 2 litros para aplicação de defensivos.',
    img: '/img/produtos/pulverizador.jpg',
    stock: 40,
    created_at: '',
    updated_at: '',
    category: { id: 3, name: 'Ferramentas', created_at: '', updated_at: '' }
  },
  {
    id: 10,
    name: 'Inseticida Biológico',
    price: 42.99,
    description: 'Inseticida à base de Bacillus thuringiensis, controle biológico de pragas.',
    img: '/img/produtos/inseticida-biologico.jpg',
    stock: 30,
    created_at: '',
    updated_at: '',
    category: { id: 4, name: 'Defensivos', created_at: '', updated_at: '' }
  },
  {
    id: 11,
    name: 'Substrato para Cactos',
    price: 22.50,
    description: 'Substrato especial para cactos e suculentas, drenagem ideal.',
    img: '/img/produtos/substrato-cactos.jpg',
    stock: 55,
    created_at: '',
    updated_at: '',
    category: { id: 5, name: 'Substratos', created_at: '', updated_at: '' }
  },
  {
    id: 12,
    name: 'Pá de Jardinagem',
    price: 18.75,
    description: 'Pá de jardinagem com cabo ergonômico, ideal para transplantes.',
    img: '/img/produtos/pa-jardinagem.jpg',
    stock: 60,
    created_at: '',
    updated_at: '',
    category: { id: 3, name: 'Ferramentas', created_at: '', updated_at: '' }
  }
];

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
  const useCartContext = useCart()
  const [produto, setProduto] = useState<Produto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionadoAoCarrinho, setAdicionadoAoCarrinho] = useState(false);
  
  useEffect(() => {
    const produtoId = parseInt(params.id as string);
    
    // Buscar produto pelos dados mockados (substituir por API)
    const produtoEncontrado = produtosMock.find(p => p.id === produtoId);
    
    if (produtoEncontrado) {
      setProduto(produtoEncontrado);
    }
    
    setIsLoading(false);
  }, [params.id]);
  
  const handleAdicionarAoCarrinho = () => {
    if (!produto) return;
    
    useCartContext.addToCart(produto)
    
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
            {produto.img ? (
              <div className="relative w-full h-[300px]">
                <Image 
                  src={produto.img} 
                  alt={produto.name} 
                  fill 
                  style={{ objectFit: 'contain' }} 
                  className="p-4"
                />
              </div>
            ) : (
              <div className="text-white text-center">
                <span className="text-2xl font-bold mb-2">{produto.category?.name}</span>
                <p>{produto.name}</p>
              </div>
            )}
          </div>
          
          {/* Detalhes do produto */}
          <div className="p-8">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${categoryColor}`}>
                {produto.category?.name}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{produto.name}</h1>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-green-600">
                R$ {produto.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">{produto.description}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Disponibilidade: <span className="font-semibold text-gray-700">{produto.stock} em estoque</span>
              </p>
            </div>
            
            {/* Seletor de quantidade */}
            <div className="flex items-center mb-8">
              <label className="mr-4 text-gray-700">Quantidade:</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  onClick={decrementarQuantidade}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={quantidade <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 text-gray-800 border-x border-gray-300">{quantidade}</span>
                <button 
                  onClick={incrementarQuantidade}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={produto.stock ? quantidade >= produto.stock : false}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Botão de adicionar ao carrinho */}
            <button 
              onClick={handleAdicionarAoCarrinho}
              className={`w-full py-3 px-6 rounded-md font-medium transition-all ${
                adicionadoAoCarrinho 
                  ? 'bg-green-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {adicionadoAoCarrinho ? 'Adicionado ao carrinho! ✓' : 'Adicionar ao carrinho'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 