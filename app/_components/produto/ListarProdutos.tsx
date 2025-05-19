'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CardProduto from './CardProduto';
import BuscarProdutos from './BuscarProdutos';
import FiltroPanel from './FiltroPanel';
import { Produto, Categoria } from '@/services/interfaces/interfaces';

// Definir a URL da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Schema de validação para os filtros
const filterSchema = z.object({
  categoryId: z.number().nullable(),
  minPrice: z.number().min(0),
  maxPrice: z.number().min(0),
  sortOrder: z.string().nullable(),
  searchTerm: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

// Funções de filtragem e ordenação
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

const sortProducts = (produtos: Produto[], sortOrder: string | null): Produto[] => {
  const sorted = [...produtos];
  if (sortOrder === 'price_asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price_desc') {
    sorted.sort((a, b) => b.price - a.price);
  }
  return sorted;
};

// Função para buscar produtos
const fetchProducts = async (): Promise<Produto[]> => {
  const response = await fetch(`${API_URL}/admin/products`);
  if (!response.ok) {
    throw new Error('Erro ao buscar produtos');
  }
  const data = await response.json();
  return data.map((p: Produto) => ({
    ...p,
    img: p.img || '/img/produtos/placeholder.png'
  }));
};

// Função para buscar categorias
const fetchCategories = async (): Promise<Categoria[]> => {
  const response = await fetch(`${API_URL}/api/categories`);
  if (!response.ok) {
    throw new Error('Erro ao buscar categorias');
  }
  return response.json();
};

const ListarProdutos = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Estados locais
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // React Query para buscar dados
  const { data: produtos, isLoading: isLoadingProdutos, error: produtosError } = useQuery({
    queryKey: ['produtos'],
    queryFn: fetchProducts
  });

  const { data: categorias, isLoading: isLoadingCategorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: fetchCategories
  });

  // React Hook Form
  const { register, handleSubmit, watch, setValue, reset } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      categoryId: searchParams.get('category') ? parseInt(searchParams.get('category')!, 10) : null,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : 0,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : 500,
      sortOrder: searchParams.get('sort'),
      searchTerm: searchParams.get('q') || '',
    }
  });

  // Observar mudanças nos filtros
  const filters = watch();

  // Efeito para sincronizar URL com o formulário
  useEffect(() => {
    const categoryId = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortOrder = searchParams.get('sort');
    const searchTerm = searchParams.get('q');

    reset({
      categoryId: categoryId ? parseInt(categoryId, 10) : null,
      minPrice: minPrice ? parseInt(minPrice, 10) : 0,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : 500,
      sortOrder: sortOrder,
      searchTerm: searchTerm || '',
    });
  }, [searchParams, reset]);

  // Aplicar filtros aos produtos
  const produtosFiltrados = produtos ? (() => {
    if (!isSearching) return produtos;
    
    let result = [...produtos];
    result = filterByCategory(result, filters.categoryId);
    result = searchProducts(result, filters.searchTerm || '');
    result = filterByPrice(result, filters.minPrice, filters.maxPrice);
    result = sortProducts(result, filters.sortOrder);
    return result;
  })() : [];

  // Handlers
  const handleSearch = () => {
    setIsSearching(true);
    const newParams = new URLSearchParams();
    
    if (filters.categoryId) newParams.set('category', filters.categoryId.toString());
    if (filters.minPrice > 0) newParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice < 500) newParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.sortOrder) newParams.set('sort', filters.sortOrder);
    if (filters.searchTerm) newParams.set('q', filters.searchTerm);

    const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
    setAnimationTrigger(prev => prev + 1);
  };

  const handleClearFilters = () => {
    setIsSearching(false);
    reset({
      categoryId: null,
      minPrice: 0,
      maxPrice: 500,
      sortOrder: null,
      searchTerm: '',
    });
    router.push(pathname, { scroll: false });
    setAnimationTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barra de busca e filtros */}
      <div className="mb-8 flex justify-center items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsFilterPanelOpen(true)}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            aria-label="Abrir filtros"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
          <FiltroPanel 
            isOpen={isFilterPanelOpen} 
            onClose={() => setIsFilterPanelOpen(false)}
            categories={categorias || []}
            selectedCategoryId={filters.categoryId}
            onCategoryChange={(id) => setValue('categoryId', id)}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            minPriceLimit={0}
            maxPriceLimit={500}
            onPriceChange={(value) => {
              if (Array.isArray(value)) {
                setValue('minPrice', value[0]);
                setValue('maxPrice', value[1]);
              }
            }}
            onClearFilters={handleClearFilters}
            currentSortOrder={filters.sortOrder}
            onSortChange={(order) => setValue('sortOrder', order)}
          />
        </div>

        <div className="flex-grow max-w-xl flex gap-2">
          <BuscarProdutos 
            className="flex-grow"
            value={filters.searchTerm || ""}
            onChange={(value) => setValue('searchTerm', value)}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Exibição dos Produtos */}
      {isLoadingProdutos || isLoadingCategorias ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : produtosError ? (
        <div className="text-center py-20">
          <p className="text-red-600 text-xl">Erro ao carregar produtos</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Tentar novamente
          </button>
        </div>
      ) : produtosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtosFiltrados.map((produto, index) => (
            <div 
              key={`${animationTrigger}-${produto.id}`}
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