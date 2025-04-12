// Serviço de busca para filtragem e pesquisa de produtos
import Fuse from 'fuse.js';
import { Produto } from '../CardProduto';

const fuseOptions = {
  keys: ['nome'],
  threshold: 0.4
};


export const filterByCategory = (
  produtos: Produto[], 
  categoria: string | null
): Produto[] => {
  if (!categoria) {
    return produtos;
  }
  return produtos.filter(p => p.categoria === categoria);
};


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

export const getFilteredProducts = (
  produtos: Produto[], 
  termo: string | null, 
  categoria: string | null
): Produto[] => {
  // Primeiro filtra por categoria
  const categoryFiltered = filterByCategory(produtos, categoria);
  
  if (termo && termo.trim()) {
    return searchProducts(categoryFiltered, termo);
  }
  
  return categoryFiltered;
};
