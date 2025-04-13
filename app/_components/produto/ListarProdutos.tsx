'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import CardProduto from './CardProduto';
import BuscarProdutos from './BuscarProdutos';
import { Produto } from '@/services/interfaces/interfaces';

// Dados fictícios (Deverá ser substituído por chamadas de API depois).
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

// Serviço de busca local - substitua por API no futuro
const filterByCategory = (produtos: Produto[], categoryName: string | null): Produto[] => {
  if (!categoryName) return produtos;
  return produtos.filter(p => p.category?.name === categoryName);
};

const searchProducts = (produtos: Produto[], termo: string): Produto[] => {
  if (!termo.trim()) return produtos;
  const termLower = termo.toLowerCase();
  return produtos.filter(p => 
    p.name.toLowerCase().includes(termLower) || 
    p.description.toLowerCase().includes(termLower)
  );
};

const getFilteredProducts = (
  produtos: Produto[], 
  termo: string | null, 
  categoryName: string | null
): Produto[] => {
  let result = [...produtos];
  
  if (categoryName) {
    result = filterByCategory(result, categoryName);
  }
  
  if (termo && termo.trim()) {
    result = searchProducts(result, termo);
  }
  
  return result;
};

const ListarProdutos = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obter parâmetros da URL
  const filterCategory = searchParams.get('category');
  const termoBusca = searchParams.get('q') || '';
  
  // Função para atualizar apenas o parâmetro de categoria na URL
  const updateCategoryParam = (category: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
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
            filterCategory
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
  }, [termoBusca, filterCategory]);

  // Categorias únicas para o filtro
  const categories = Array.from(new Set(produtosMock.map(p => p.category?.name))).filter(Boolean) as string[];

  // Handler para filtro de categoria
  const handleCategoryChange = (category: string | null) => {
    updateCategoryParam(category);
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
            !filterCategory ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Todos
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterCategory === category ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {category}
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
            {produtos.map((produto) => (
              <CardProduto key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListarProdutos;