'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import CardProduto, { Produto } from './CardProduto';
import BuscarProdutos from './BuscarProdutos';
import { getFilteredProducts } from './services/searchService';

// Dados fictícios (Deverá ser substituído por chamadas de API depois).
const produtosMock: Produto[] = [
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
    id: 2,
    nome: 'Semente de Alface',
    preco: 12.50,
    descricao: 'Sementes de alface crespa de alta germinação, pacote com 100 unidades.',
    imagem: '',
    categoria: 'Sementes',
    estoque: 120
  },
  {
    id: 3,
    nome: 'Regador Manual 5L',
    preco: 29.90,
    descricao: 'Regador manual com capacidade para 5 litros, ideal para jardins e hortas.',
    imagem: '',
    categoria: 'Ferramentas',
    estoque: 35
  },
  {
    id: 4,
    nome: 'Herbicida Natural',
    preco: 38.75,
    descricao: 'Herbicida natural à base de extratos vegetais, não agride o meio ambiente.',
    imagem: '',
    categoria: 'Defensivos',
    estoque: 45
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
    id: 7,
    nome: 'Fertilizante NPK 10-10-10',
    preco: 52.80,
    descricao: 'Fertilizante mineral balanceado para desenvolvimento completo das plantas.',
    imagem: '',
    categoria: 'Fertilizantes',
    estoque: 65
  },
  {
    id: 8,
    nome: 'Sementes de Tomate Cereja',
    preco: 15.99,
    descricao: 'Sementes selecionadas de tomate cereja, alta produtividade.',
    imagem: '',
    categoria: 'Sementes',
    estoque: 90
  },
  {
    id: 9,
    nome: 'Pulverizador 2L',
    preco: 35.50,
    descricao: 'Pulverizador manual com capacidade de 2 litros para aplicação de defensivos.',
    imagem: '',
    categoria: 'Ferramentas',
    estoque: 40
  },
  {
    id: 10,
    nome: 'Inseticida Biológico',
    preco: 42.99,
    descricao: 'Inseticida à base de Bacillus thuringiensis, controle biológico de pragas.',
    imagem: '',
    categoria: 'Defensivos',
    estoque: 30
  },
  {
    id: 11,
    nome: 'Substrato para Cactos',
    preco: 22.50,
    descricao: 'Substrato especial para cactos e suculentas, drenagem ideal.',
    imagem: '',
    categoria: 'Substratos',
    estoque: 55
  },
  {
    id: 12,
    nome: 'Pá de Jardinagem',
    preco: 18.75,
    descricao: 'Pá de jardinagem com cabo ergonômico, ideal para transplantes.',
    imagem: '',
    categoria: 'Ferramentas',
    estoque: 60
  }
];

const ListarProdutos = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obter parâmetros da URL
  const filtroCategoria = searchParams.get('categoria');
  const termoBusca = searchParams.get('q') || '';
  
  // Função para atualizar apenas o parâmetro de categoria na URL
  const updateCategoryParam = (categoria: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (categoria) {
      newParams.set('categoria', categoria);
    } else {
      newParams.delete('categoria');
    }
    
    // Construir a nova URL
    const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
    router.push(newUrl);
  };

  useEffect(() => {
    const fetchProdutos = () => {
      try {
        setIsLoading(true);
        // Simula API delay
        setTimeout(() => {
          // Usar o serviço de busca para obter produtos filtrados
          const produtosFiltrados = getFilteredProducts(
            produtosMock,
            termoBusca,
            filtroCategoria
          );
          
          setProdutos(produtosFiltrados);
          setIsLoading(false);
        }, 500); // Delay simulado
      } catch (err) {
        setIsLoading(false);
        setError('Erro ao carregar produtos');
        console.error('Erro ao buscar produtos:', err);
      }
    };

    fetchProdutos();
  }, [termoBusca, filtroCategoria]);

  // Categorias únicas para o filtro
  const categorias = Array.from(new Set(produtosMock.map(p => p.categoria)));

  // Handler para filtro de categoria
  const handleCategoryChange = (categoria: string | null) => {
    updateCategoryParam(categoria);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barra de busca */}
      <div className="mb-8">
        <BuscarProdutos className="max-w-3xl mx-auto" />
      </div>
      
      {/* Filtros */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !filtroCategoria ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Todos
        </button>
        
        {categorias.map((categoria) => (
          <button
            key={categoria}
            onClick={() => handleCategoryChange(categoria)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filtroCategoria === categoria ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {categoria}
          </button>
        ))}
      </div>
      
      {/* Listagem de produtos */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-xl">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Tentar novamente
            </button>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Nenhum produto encontrado</p>
            <p className="text-gray-500 mt-2">Tente usar outros termos de busca ou filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtos.map((produto, index) => (
              <div 
                key={produto.id}
                className={`opacity-0 animate-fade-in-up delay-${Math.min(index, 15)}`}
              >
                <CardProduto produto={produto} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListarProdutos;