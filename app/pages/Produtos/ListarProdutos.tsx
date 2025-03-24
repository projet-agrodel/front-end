'use client';

import { useState, useEffect } from 'react';
import CardProduto, { Produto } from './CardProduto';
import styles from './ListarProdutos.module.css';

// Dados fictícios (Deverá ser substituído por chamadas de API depois).
const produtosMock: Produto[] = [
  {
    id: 1,
    nome: 'Fertilizante Orgânico',
    preco: 45.99,
    descricao: 'Fertilizante orgânico de alta qualidade para todos os tipos de plantas.',
    imagem: '/images/fertilizante.jpg',
    categoria: 'Fertilizantes',
    estoque: 50
  },
  {
    id: 2,
    nome: 'Semente de Alface',
    preco: 12.50,
    descricao: 'Sementes de alface crespa de alta germinação, pacote com 100 unidades.',
    imagem: '/images/semente-alface.jpg',
    categoria: 'Sementes',
    estoque: 120
  },
  {
    id: 3,
    nome: 'Regador Manual 5L',
    preco: 29.90,
    descricao: 'Regador manual com capacidade para 5 litros, ideal para jardins e hortas.',
    imagem: '/images/regador.jpg',
    categoria: 'Ferramentas',
    estoque: 35
  },
  {
    id: 4,
    nome: 'Herbicida Natural',
    preco: 38.75,
    descricao: 'Herbicida natural à base de extratos vegetais, não agride o meio ambiente.',
    imagem: '/images/herbicida.jpg',
    categoria: 'Defensivos',
    estoque: 45
  },
  {
    id: 5,
    nome: 'Substrato para Plantas',
    preco: 18.99,
    descricao: 'Substrato de alta qualidade para vasos e jardins, embalagem de 5kg.',
    imagem: '/images/substrato.jpg',
    categoria: 'Substratos',
    estoque: 80
  },
  {
    id: 6,
    nome: 'Kit Ferramentas de Jardim',
    preco: 89.90,
    descricao: 'Kit completo com 5 ferramentas essenciais para jardinagem.',
    imagem: '/images/kit-ferramentas.jpg',
    categoria: 'Ferramentas',
    estoque: 25
  }
];

interface ListarProdutosProps {
  children?: React.ReactNode;
}

const ListarProdutos = ({ children }: ListarProdutosProps) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);

  useEffect(() => {
    // Simulating API fetch with mock data
    const fetchProdutos = () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay
        setTimeout(() => {
          const produtosFiltrados = filtroCategoria 
            ? produtosMock.filter(p => p.categoria === filtroCategoria)
            : produtosMock;
            
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
  }, [filtroCategoria]);

  // Get unique categories from products
  const categorias = [...new Set(produtosMock.map(p => p.categoria))];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Nossos Produtos
        </h1>
        
        <div className={styles.filterContainer}>
          <label htmlFor="categoria" className={styles.filterLabel}>Filtrar por:</label>
          <select
            id="categoria"
            className={styles.filterSelect}
            value={filtroCategoria || ''}
            onChange={(e) => setFiltroCategoria(e.target.value || null)}
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

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          {error}
        </div>
      ) : (
        <>
          {produtos.length === 0 ? (
            <div className={styles.emptyContainer}>
              <p className={styles.emptyText}>Nenhum produto encontrado para esta categoria.</p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {produtos.map((produto) => (
                <CardProduto key={produto.id} produto={produto} />
              ))}
            </div>
          )}
        </>
      )}
      
      {children}
    </div>
  );
};

export default ListarProdutos;