'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Produto } from '@/services/interfaces/interfaces';

// Produtos em destaque simulados (pode ser substituído por API futura)
const produtosDestaqueMock: Produto[] = [
  {
    id: 1,
    name: 'Fertilizante Orgânico',
    price: 45.99,
    description: 'Fertilizante orgânico de alta qualidade para todos os tipos de plantas.',
    img: '',
    category: { name: 'Fertilizantes', id: 1, created_at: '', updated_at: '' },
    stock: 50,
    created_at: '',
    updated_at: ''
  },
  {
    id: 5,
    name: 'Substrato para Plantas',
    price: 18.99,
    description: 'Substrato de alta qualidade para vasos e jardins, embalagem de 5kg.',
    img: '',
    category: { name: 'Substratos', id: 1, created_at: '', updated_at: '' },
    stock: 80,
    created_at: '',
    updated_at: ''
  },
  {
    id: 6,
    name: 'Kit Ferramentas de Jardim',
    price: 89.90,
    description: 'Kit completo com 5 ferramentas essenciais para jardinagem.',
    img: '',
    category: { name: 'Ferramentas', id: 1, created_at: '', updated_at: '' },
    stock: 25,
    created_at: '',
    updated_at: ''
  },
  {
    id: 8,
    name: 'Sementes de Tomate Cereja',
    price: 15.99,
    description: 'Sementes selecionadas de tomate cereja, alta produtividade.',
    img: '',
    category: { name: 'Sementes', id: 1, created_at: '', updated_at: '' },
    stock: 90,
    created_at: '',
    updated_at: ''
  }
];

const ProdutosDestaque = () => {
  const [produtosDestaque, setProdutosDestaque] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento de API
    const fetchProdutosDestaque = () => {
      setIsLoading(true);
      // Simular atraso da API
      setTimeout(() => {
        setProdutosDestaque(produtosDestaqueMock);
        setIsLoading(false);
      }, 500);
    };

    fetchProdutosDestaque();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
            <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {produtosDestaque.map((produto) => (
        <Link href={`/produtos/${produto.id}`} key={produto.id}>
          <div className="bg-white p-4 rounded-lg shadow-md transition-all hover:shadow-lg">
            <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
              {produto.img ? (
                <img 
                  src={produto.img} 
                  alt={produto.name} 
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-400">img indisponível</span>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">{produto.name}</h3>
            <p className="text-green-600 font-bold mb-2">R$ {produto.price.toFixed(2)}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{produto.category?.name}</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Destaque
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProdutosDestaque; 