import { Produto } from "./interfaces/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface GetProductsParams {
  query?: string;
  min_price?: number;
  max_price?: number;
  category_id?: number;
}

export async function getProducts(params: GetProductsParams = {}): Promise<Produto[]> {
  try {
    const url = new URL(`${API_URL}/api/products`);

    if (params.query) url.searchParams.append('query', params.query);
    if (params.min_price !== undefined) url.searchParams.append('min_price', params.min_price.toString());
    if (params.max_price !== undefined) url.searchParams.append('max_price', params.max_price.toString());
    if (params.category_id) url.searchParams.append('category_id', params.category_id.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'Falha ao buscar produtos');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Produto> {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'Falha ao buscar o produto');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    throw error;
  }
} 