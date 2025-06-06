import { Produto } from "./interfaces/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interface alinhada com o backend

const getHeaders = (token: string) => {
  if (!token) {
    throw new Error("Token de autenticação não fornecido."); 
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export interface GetAdminProductsParams {
  query?: string;
  min_price?: number;
  max_price?: number;
  status?: 'Ativo' | 'Inativo' | null;
  // Adicionar outros possíveis parâmetros de paginação/filtro aqui no futuro
  // page?: number;
  // limit?: number;
}

export async function getAdminProducts(token: string, params: GetAdminProductsParams = {}): Promise<Produto[]> {
  try {
    // Construir a URL com os parâmetros
    const url = new URL(`${API_URL}/admin/products`);

    if (params.query) url.searchParams.append('query', params.query);
    if (params.min_price !== undefined) url.searchParams.append('min_price', params.min_price.toString());
    if (params.max_price !== undefined) url.searchParams.append('max_price', params.max_price.toString());

    if (params.status) url.searchParams.append('status_filter', params.status);

    console.log('Fetching products with URL:', url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'Falha ao buscar produtos administrativamente');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
}

export const getAdminProductById = async (id: string, token: string): Promise<Produto> => {

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao buscar o produto');
  }
  const product = await response.json();
  if (product.status !== 'Ativo') {

      console.warn("Admin acessou produto inativo pela rota pública de produto.");
  }
  return product;
};

export type CreateAdminProductPayload = Omit<Produto, 'id' | 'category' | 'created_at' | 'updated_at'> & { 
    category_id?: number | null;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    status: string; 
    isPromotion: boolean;     
    originalPrice: number;
};

export const createAdminProduct = async (productData: CreateAdminProductPayload, token: string): Promise<Produto> => {
  const response = await fetch(`${API_URL}/admin/products`, { 
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao criar produto');
  }
  return response.json();
};

export type UpdateAdminProductPayload = Partial<CreateAdminProductPayload>;

export const updateAdminProduct = async (id: string, productData: UpdateAdminProductPayload, token: string): Promise<Produto> => {
  const response = await fetch(`${API_URL}/admin/products/${id}`, { 
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao atualizar produto');
  }
  return response.json();
};

export const deleteAdminProduct = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/products/${id}`, { // Adicionando o prefixo /admin
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao deletar produto');
  }
};

export const updateAdminProductStock = async (id: string, quantity: number, token: string): Promise<Produto> => {
  const response = await fetch(`${API_URL}/admin/products/${id}/stock`, { 
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao atualizar estoque do produto');
  }
  return response.json();
};