// Serviço de busca para filtragem e pesquisa de produtos
import Fuse from 'fuse.js';
import { Produto } from '../CardProduto';

// Configuração do Fuse.js
const fuseOptions = {
  keys: ['nome'],
  threshold: 0.4, // (0 = correspondência exata, 1 = corresponder a tudo)
};

/**
 * Filtra produtos por categoria
 * @param produtos - Lista de produtos para filtrar
 * @param categoria - Categoria para filtrar (ou null para todos)
 * @returns Produtos filtrados
 */
export const filterByCategory = (
  produtos: Produto[], 
  categoria: string | null
): Produto[] => {
  if (!categoria) {
    return produtos;
  }
  return produtos.filter(p => p.categoria === categoria);
};

/**
 * Pesquisa produtos por nome usando busca fuzzy
 * @param produtos - Lista de produtos para pesquisar
 * @param termo - Termo de busca
 * @returns Produtos pesquisados
 */
export const searchProducts = (
  produtos: Produto[], 
  termo: string
): Produto[] => {
  if (!termo || !termo.trim()) {
    return produtos;
  }
  
  const fuse = new Fuse(produtos, fuseOptions);
  const results = fuse.search(termo.trim());
  return results.map(result => result.item);
};

/**
 * Aplica filtragem e pesquisa
 * @param produtos - Lista original de produtos
 * @param termo - Termo de busca
 * @param categoria - Filtro de categoria
 * @returns Produtos filtrados e pesquisados
 */
export const getFilteredProducts = (
  produtos: Produto[], 
  termo: string | null, 
  categoria: string | null
): Produto[] => {
  // Primeiro filtra por categoria
  const categoryFiltered = filterByCategory(produtos, categoria);
  
  // Depois aplica a busca se houver um termo de pesquisa
  if (termo && termo.trim()) {
    return searchProducts(categoryFiltered, termo);
  }
  
  return categoryFiltered;
};
