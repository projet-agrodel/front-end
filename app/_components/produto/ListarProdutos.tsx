'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import CardProduto from './CardProduto';
import BuscarProdutos from './BuscarProdutos';
import FiltroPanel from './FiltroPanel';
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

// Adicionar filtro de preço
const filterByPrice = (produtos: Produto[], min: number | null, max: number | null): Produto[] => {
  let result = produtos;
  if (min !== null) {
    result = result.filter(p => p.price >= min);
  }
  if (max !== null) {
    result = result.filter(p => p.price <= max);
  }
  return result;
};

// Adicionar lógica de ordenação
const sortProducts = (produtos: Produto[], sortOrder: string | null): Produto[] => {
  const sorted = [...produtos]; // Cria cópia para não mutar o original
  if (sortOrder === 'price_asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price_desc') {
    sorted.sort((a, b) => b.price - a.price);
  } 
  // else: Nenhuma ordenação específica (mantém a ordem atual ou padrão da API)
  return sorted;
};

const getFilteredProducts = (
  produtos: Produto[], 
  termo: string | null, 
  categoryName: string | null,
  minPrice: number | null,
  maxPrice: number | null,
  sortOrder: string | null // Novo parâmetro
): Produto[] => {
  let result = [...produtos];
  
  if (categoryName) {
    result = filterByCategory(result, categoryName);
  }
  
  if (termo && termo.trim()) {
    result = searchProducts(result, termo);
  }

  // Aplicar filtro de preço
  result = filterByPrice(result, minPrice, maxPrice);

  // Aplicar ordenação
  result = sortProducts(result, sortOrder);
  
  return result;
};

// Definir limites de preço baseado nos mocks (ou API no futuro)
const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 100; // Ajustar se necessário baseado nos dados

const ListarProdutos = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Obter parâmetros da URL
  const filterCategory = searchParams.get('category');
  const termoBusca = searchParams.get('q') || '';
  const urlMinPrice = searchParams.get('minPrice');
  const urlMaxPrice = searchParams.get('maxPrice');
  const urlSortOrder = searchParams.get('sort'); // Ler parâmetro de ordenação

  // Estados para preço, inicializados com valores da URL ou padrão
  const [minPrice, setMinPrice] = useState<number>(urlMinPrice ? parseInt(urlMinPrice, 10) : MIN_PRICE_LIMIT);
  const [maxPrice, setMaxPrice] = useState<number>(urlMaxPrice ? parseInt(urlMaxPrice, 10) : MAX_PRICE_LIMIT);

  // Estado para ordenação (inicializado pela URL)
  const [sortOrder, setSortOrder] = useState<string | null>(urlSortOrder);

  // Função para atualizar os parâmetros de preço na URL
  const updatePriceParams = (newMin: number, newMax: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('minPrice', newMin.toString());
    newParams.set('maxPrice', newMax.toString());

    // Atualiza os estados locais imediatamente para o slider refletir
    setMinPrice(newMin);
    setMaxPrice(newMax);

    // Navega para a nova URL (debounce pode ser útil aqui no futuro)
    const newUrl = `${pathname}?${newParams.toString()}`;
    router.push(newUrl, { scroll: false });
  };

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
    router.push(newUrl, { scroll: false });
  };

  // Função para atualizar o parâmetro de ordenação na URL
  const updateSortParam = (newSortOrder: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newSortOrder) {
      newParams.set('sort', newSortOrder);
    } else {
      newParams.delete('sort');
    }
    // Atualiza estado local
    setSortOrder(newSortOrder);
    // Navega
    const newUrl = `${pathname}?${newParams.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  useEffect(() => {
    // Atualiza estados locais se URL mudar externamente
    setMinPrice(urlMinPrice ? parseInt(urlMinPrice, 10) : MIN_PRICE_LIMIT);
    setMaxPrice(urlMaxPrice ? parseInt(urlMaxPrice, 10) : MAX_PRICE_LIMIT);
    // Atualiza estado de ordenação pela URL
    setSortOrder(urlSortOrder);

    const fetchProdutos = () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          const produtosFiltrados = getFilteredProducts(
            produtosMock,
            termoBusca,
            filterCategory,
            urlMinPrice ? parseInt(urlMinPrice, 10) : null,
            urlMaxPrice ? parseInt(urlMaxPrice, 10) : null,
            urlSortOrder // Passar ordenação para a função de filtro/ordenação
          );
          
          setProdutos(produtosFiltrados);
          setIsLoading(false);
        }, 300);
      } catch (err) {
        setIsLoading(false);
        setError('Erro ao carregar produtos');
        console.error('Erro ao buscar produtos:', err);
      }
    };

    fetchProdutos();
  }, [termoBusca, filterCategory, urlMinPrice, urlMaxPrice, urlSortOrder]);

  // Categorias únicas para o filtro
  const categories = Array.from(new Set(produtosMock.map(p => p.category?.name))).filter(Boolean) as string[];

  // Handler para filtro de categoria
  const handleCategoryChange = (category: string | null) => {
    updateCategoryParam(category);
  };

  // Handler para mudança de preço vindo do slider
  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      const [newMin, newMax] = value;
      // Atualiza a URL (e os estados locais dentro de updatePriceParams)
      updatePriceParams(newMin, newMax);
    }
  };

  // Handler para mudança de ordenação
  const handleSortChange = (newSortOrder: string | null) => {
    updateSortParam(newSortOrder);
  };

  // Função para alternar a visibilidade do painel
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(prev => !prev);
  };

  // Handler para o botão "Aplicar Filtros" / Fechar
  const handleApplyFilters = () => {
    setIsFilterPanelOpen(false);
  };

  // Atualiza handleClearFilters para incluir 'sort'
  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('category');
    newParams.delete('minPrice');
    newParams.delete('maxPrice');
    newParams.delete('sort'); // Limpa a ordenação também
    
    const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
    setIsFilterPanelOpen(false); 
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barra de busca, filtro e ordenação */}
      <div className="mb-8 flex justify-center items-center gap-4">
        {/* Botão e Painel de Filtro */}
        <div className="relative">
          <button
            onClick={toggleFilterPanel}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            aria-label="Abrir filtros"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
          <FiltroPanel 
            isOpen={isFilterPanelOpen} 
            onClose={handleApplyFilters}
            categories={categories}
            selectedCategory={filterCategory}
            onCategoryChange={handleCategoryChange}
            minPrice={minPrice} 
            maxPrice={maxPrice}
            minPriceLimit={MIN_PRICE_LIMIT}
            maxPriceLimit={MAX_PRICE_LIMIT}
            onPriceChange={handlePriceChange}
            onClearFilters={handleClearFilters}
            currentSortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Barra de Busca */}
        <BuscarProdutos className="flex-grow max-w-xl" />
      </div>
      
      {/* Exibição dos Produtos */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-600 text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Tentar novamente
          </button>
        </div>
      ) : produtos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.map((produto, index) => (
            <div 
              key={produto.id} 
              className={`animate-fade-in-up opacity-0 delay-${Math.min(index, 15)}`} 
              style={{ animationFillMode: 'forwards' }}
            >
              <CardProduto produto={produto} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">Nenhum produto encontrado</p>
          <p className="text-gray-500 mt-2">Tente usar outros termos de busca ou filtros.</p>
        </div>
      )}
    </div>
  );
};

export default ListarProdutos;