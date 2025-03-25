'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import CardProduto, { Produto } from './CardProduto';
import BuscarProdutos from './BuscarProdutos';

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
  }
];

interface ListarProdutosProps {
  children?: React.ReactNode;
}

const ListarProdutos = ({ children }: ListarProdutosProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obter parâmetros da URL
  const filtroCategoria = searchParams.get('categoria');
  const termoBusca = searchParams.get('q') || '';
  
  // Função para atualizar a URL com os parâmetros de busca
  const updateUrlParams = (params: { q?: string; categoria?: string | null }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    // Atualizar parâmetro de busca
    if (params.q !== undefined) {
      if (params.q) {
        newParams.set('q', params.q);
      } else {
        newParams.delete('q');
      }
    }
    
    // Atualizar parâmetro de categoria
    if (params.categoria !== undefined) {
      if (params.categoria) {
        newParams.set('categoria', params.categoria);
      } else {
        newParams.delete('categoria');
      }
    }
    
    // Construir a nova URL
    const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
    router.push(newUrl);
  };

  useEffect(() => {
    // Simulating API fetch with mock data
    const fetchProdutos = () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay
        setTimeout(() => {
          let produtosFiltrados = produtosMock;
          
          // Filtrar por categoria se selecionada
          if (filtroCategoria) {
            produtosFiltrados = produtosFiltrados.filter(p => p.categoria === filtroCategoria);
          }
          
          // Filtrar por termo de busca se existir
          if (termoBusca.trim()) {
            const termo = termoBusca.toLowerCase();
            produtosFiltrados = produtosFiltrados.filter(p => 
              p.nome.toLowerCase().includes(termo) || 
              p.descricao.toLowerCase().includes(termo)
            );
          }
            
          setProdutos(produtosFiltrados);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Falha ao carregar produtos. Tente novamente mais tarde.');
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, [filtroCategoria, termoBusca]);

  // Get unique categories from products
  const categorias = [...new Set(produtosMock.map(p => p.categoria))];

  // Handler para busca
  const handleSearch = (termo: string) => {
    updateUrlParams({ q: termo });
  };
  
  // Handler para filtro de categoria
  const handleCategoriaChange = (categoria: string | null) => {
    updateUrlParams({ categoria });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Nossos Produtos
        </h1>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <BuscarProdutos 
            onSearch={handleSearch} 
            initialValue={termoBusca}
            className="w-full md:w-64" 
          />
          
          <div className="flex items-center mt-4 md:mt-0">
            <label htmlFor="categoria" className="text-gray-700 mr-2 whitespace-nowrap">Filtrar por:</label>
            <select
              id="categoria"
              className="border border-gray-300 rounded-md py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filtroCategoria || ''}
              onChange={(e) => handleCategoriaChange(e.target.value || null)}
            >
              <option value="">Todas as Categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : (
        <>
          {produtos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {termoBusca
                  ? 'Nenhum produto encontrado para esta busca.'
                  : 'Nenhum produto encontrado para esta categoria.'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {produtos.length} {produtos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {produtos.map((produto) => (
                  <CardProduto key={produto.id} produto={produto} />
                ))}
              </div>
            </>
          )}
        </>
      )}
      
      {children}
    </div>
  );
};

export default ListarProdutos;