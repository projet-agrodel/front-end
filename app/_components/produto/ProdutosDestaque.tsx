'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Produto } from './CardProduto';

// Produtos em destaque simulados (pode ser substituído por API futura)
const produtosDestaqueMock: Produto[] = [
  {
    id: 1,
    nome: 'Fertilizante Orgânico',
    preco: 45.99,
    descricao: 'Fertilizante orgânico de alta qualidade para todos os tipos de plantas.',
    imagem: '',
    categoria: 'Fertilizantes',
    estoque: 50
  },
  {
    id: 5,
    nome: 'Substrato para Plantas',
    preco: 18.99,
    descricao: 'Substrato de alta qualidade para vasos e jardins, embalagem de 5kg.',
    imagem: '',
    categoria: 'Substratos',
    estoque: 80
  },
  {
    id: 6,
    nome: 'Kit Ferramentas de Jardim',
    preco: 89.90,
    descricao: 'Kit completo com 5 ferramentas essenciais para jardinagem.',
    imagem: '',
    categoria: 'Ferramentas',
    estoque: 25
  },
  {
    id: 8,
    nome: 'Sementes de Tomate Cereja',
    preco: 15.99,
    descricao: 'Sementes selecionadas de tomate cereja, alta produtividade.',
    imagem: '',
    categoria: 'Sementes',
    estoque: 90
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
        <Link href={`/Produtos?id=${produto.id}`} key={produto.id}>
          <div className="bg-white p-4 rounded-lg shadow-md transition-all hover:shadow-lg">
            <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
              {produto.imagem ? (
                <img 
                  src={produto.imagem} 
                  alt={produto.nome} 
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-400">Imagem indisponível</span>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">{produto.nome}</h3>
            <p className="text-green-600 font-bold mb-2">R$ {produto.preco.toFixed(2)}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{produto.categoria}</span>
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