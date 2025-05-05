'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import CardProduto from './CardProduto';
import BuscarProdutos from './BuscarProdutos';
import FiltroPanel from './FiltroPanel';
import { Produto, Categoria } from '@/services/interfaces/interfaces';

// Definir a URL da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Remover produtosMock
/*
const produtosMock: Produto[] = [...];
*/

// Reativar e ajustar filterByCategory para usar o ID
const filterByCategory = (produtos: Produto[], categoryId: number | null): Produto[] => {
  if (categoryId === null) return produtos;
  return produtos.filter(p => p.category?.id === categoryId);
};

const searchProducts = (produtos: Produto[], termo: string): Produto[] => {
  if (!termo.trim()) return produtos;
  const termLower = termo.toLowerCase();
  return produtos.filter(p => 
    p.name.toLowerCase().includes(termLower) || 
    p.description.toLowerCase().includes(termLower)
  );
};

// Adicionar filtro de preço - MANTIDO
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

// Adicionar lógica de ordenação - MANTIDO
const sortProducts = (produtos: Produto[], sortOrder: string | null): Produto[] => {
  const sorted = [...produtos]; // Cria cópia para não mutar o original
  if (sortOrder === 'price_asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price_desc') {
    sorted.sort((a, b) => b.price - a.price);
  } 
  // else: Nenhuma ordenação específica
  return sorted;
};

// Ajustar getFilteredProducts para usar categoryId
const getFilteredProducts = (
  produtos: Produto[],
  termo: string | null,
  categoryId: number | null, // Mudar para categoryId
  minPrice: number | null,
  maxPrice: number | null,
  sortOrder: string | null
): Produto[] => {
  let result = [...produtos];

  // Aplicar filtro de categoria
  result = filterByCategory(result, categoryId);

  if (termo && termo.trim()) {
    result = searchProducts(result, termo);
  }
  result = filterByPrice(result, minPrice, maxPrice);
  result = sortProducts(result, sortOrder);

  return result;
};

// Definir limites de preço baseado nos mocks (ou API no futuro)
// TODO: Calcular dinamicamente a partir dos dados da API se necessário
const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 100; // Ajustar se necessário baseado nos dados

const ListarProdutos = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Estados:
  const [todosOsProdutos, setTodosOsProdutos] = useState<Produto[]>([]); // Lista completa da API
  const [produtosExibidos, setProdutosExibidos] = useState<Produto[]>([]); // Lista filtrada/ordenada para exibição
  const [categorias, setCategorias] = useState<Categoria[]>([]); // Estado para categorias
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  // Adicionar estado para forçar reanimação
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Obter parâmetros da URL
  const urlCategoryId = searchParams.get('category');
  const termoBusca = searchParams.get('q') || '';
  const urlMinPrice = searchParams.get('minPrice');
  const urlMaxPrice = searchParams.get('maxPrice');
  const urlSortOrder = searchParams.get('sort');

  // Estados para filtros (inicializados com valores da URL ou padrão)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    urlCategoryId ? parseInt(urlCategoryId, 10) : null
  );
  const [minPrice, setMinPrice] = useState<number>(urlMinPrice ? parseInt(urlMinPrice, 10) : MIN_PRICE_LIMIT);
  const [maxPrice, setMaxPrice] = useState<number>(urlMaxPrice ? parseInt(urlMaxPrice, 10) : MAX_PRICE_LIMIT);
  const [sortOrder, setSortOrder] = useState<string | null>(urlSortOrder);

  // Funções para atualizar URL (mantidas como estavam)
  const updatePriceParams = (newMin: number, newMax: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('minPrice', newMin.toString());
    newParams.set('maxPrice', newMax.toString());
    setMinPrice(newMin);
    setMaxPrice(newMax);
    const newUrl = `${pathname}?${newParams.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  // Modificar updateCategoryParam para usar ID
  const updateCategoryParam = (categoryId: number | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (categoryId !== null) {
      newParams.set('category', categoryId.toString());
    } else {
      newParams.delete('category');
    }
    setSelectedCategoryId(categoryId); // Atualizar estado local
    const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  const updateSortParam = (newSortOrder: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newSortOrder) {
      newParams.set('sort', newSortOrder);
    } else {
      newParams.delete('sort');
    }
    setSortOrder(newSortOrder);
    const newUrl = `${pathname}?${newParams.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  // useEffect para buscar dados da API (produtos E categorias)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Buscar produtos e categorias em paralelo
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/categories`)
        ]);

        if (!productsResponse.ok) {
          throw new Error(`Erro ao buscar produtos: ${productsResponse.status}`);
        }
        if (!categoriesResponse.ok) {
          throw new Error(`Erro ao buscar categorias: ${categoriesResponse.status}`);
        }

        const productsData: Produto[] = await productsResponse.json();
        const categoriesData: Categoria[] = await categoriesResponse.json();

        // Adicionar imagem placeholder aos produtos
        const productsWithImages = productsData.map(p => ({
          ...p,
          img: p.img || '/img/produtos/placeholder.png'
        }));

        setTodosOsProdutos(productsWithImages);
        setCategorias(categoriesData);

      } catch (err) {
        console.error('Erro ao buscar dados da API:', err);
        setError('Falha ao carregar dados. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect para aplicar filtros/ordenação
  useEffect(() => {
    if (todosOsProdutos.length > 0) {
      const categoryIdFromUrl = urlCategoryId ? parseInt(urlCategoryId, 10) : null;
      const minPriceFromUrl = urlMinPrice ? parseInt(urlMinPrice, 10) : null;
      const maxPriceFromUrl = urlMaxPrice ? parseInt(urlMaxPrice, 10) : null;
      
      const produtosFiltrados = getFilteredProducts(
        todosOsProdutos,
        termoBusca,
        categoryIdFromUrl, // Passar ID da categoria
        minPriceFromUrl,
        maxPriceFromUrl,
        urlSortOrder
      );
      setProdutosExibidos(produtosFiltrados);
      // Incrementar o trigger para forçar reanimação na próxima renderização
      setAnimationTrigger(prev => prev + 1); 
    }
     // Atualizar dependências
  }, [todosOsProdutos, termoBusca, urlCategoryId, urlMinPrice, urlMaxPrice, urlSortOrder]);

  // Remover extração de categorias do mock
  // const categories: string[] = [];

  // Handlers (mantidos como estavam, pois atualizam a URL que dispara o useEffect de filtragem)
  const handleCategoryChange = (categoryId: number | null) => {
    updateCategoryParam(categoryId);
  };
  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      const [newMin, newMax] = value;
      updatePriceParams(newMin, newMax);
    }
  };
  const handleSortChange = (newSortOrder: string | null) => {
    updateSortParam(newSortOrder);
  };
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(prev => !prev);
  };
  const handleApplyFilters = () => {
    setIsFilterPanelOpen(false);
  };
  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('category');
    newParams.delete('minPrice');
    newParams.delete('maxPrice');
    newParams.delete('sort');
    const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
    setSelectedCategoryId(null); // Limpar estado local
    router.push(newUrl, { scroll: false });
    setIsFilterPanelOpen(false); 
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barra de busca, filtro e ordenação (mantida) */}
      <div className="mb-8 flex justify-center items-center gap-4">
        {/* Botão e Painel de Filtro (mantido) */}
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
            categories={categorias} // Passa categorias da API
            selectedCategoryId={selectedCategoryId} // Passa ID selecionado
            onCategoryChange={handleCategoryChange} // Handler usa ID
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

        {/* Barra de Busca (mantida) */}
        <BuscarProdutos className="flex-grow max-w-xl" />
      </div>
      
      {/* Exibição dos Produtos (lógica mantida, usa produtosExibidos) */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-600 text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()} // Ou chamar a função de fetch novamente
            className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Tentar novamente
          </button>
        </div>
      ) : produtosExibidos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtosExibidos.map((produto, index) => {
            // Remover cálculo de cor aqui
            // const bgColor = produto.category ? categoryColors[produto.category.name] || categoryColors.default : categoryColors.default;
            return (
              <div 
                key={`${animationTrigger}-${produto.id}`} 
                className={`animate-fade-in-up opacity-0 delay-${Math.min(index, 15)}`} 
                style={{ animationFillMode: 'forwards' }}
              >
                {/* Remover prop categoryColor - CardProduto determina internamente */}
                <CardProduto produto={{...produto, img: produto.img || '/img/produtos/placeholder.png'}} /> 
              </div>
            );
          })}
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