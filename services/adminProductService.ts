const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Interface alinhada com o backend
export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: { id: number; name: string } | null;
  imageUrl?: string; 
  status: 'Ativo' | 'Inativo'; 
  isPromotion: boolean; 
  originalPrice?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

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

export async function getAdminProducts(token: string, params: GetAdminProductsParams = {}): Promise<AdminProduct[]> {
  try {
    // Construir a URL com os parâmetros - usando /admin/products/list em vez de /admin/products
    const url = new URL(`${API_URL}/admin/products/list`);
    
    // Adicionar parâmetros à URL se existirem
    if (params.query) url.searchParams.append('query', params.query);
    if (params.min_price !== undefined) url.searchParams.append('min_price', params.min_price.toString());
    if (params.max_price !== undefined) url.searchParams.append('max_price', params.max_price.toString());
    
    // Se status for undefined ou null, não adicione o parâmetro
    // Isso permitirá que o backend retorne TODOS os produtos
    if (params.status) url.searchParams.append('status_filter', params.status);
    
    // Debug para verificar a URL final
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

export const getAdminProductById = async (id: string, token: string): Promise<AdminProduct> => {

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

export type CreateAdminProductPayload = Omit<AdminProduct, 'id' | 'category' | 'createdAt' | 'updatedAt'> & { 
    category_id?: number | null;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    status: 'Ativo' | 'Inativo'; 
    isPromotion: boolean;     
    originalPrice?: number | null;
};

export const createAdminProduct = async (productData: CreateAdminProductPayload, token: string): Promise<AdminProduct> => {
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

export const updateAdminProduct = async (id: string, productData: UpdateAdminProductPayload, token: string): Promise<AdminProduct> => {
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

export const updateAdminProductStock = async (id: string, quantity: number, token: string): Promise<AdminProduct> => {
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

// Nota: A função getAuthToken() é uma suposição.
// Você precisará implementar ou ajustar a forma como o token JWT é obtido e gerenciado no seu app.
// Exemplo: pode vir de um AuthContext, localStorage, ou cookies.
//
// function getAuthToken(): string | null {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem('jwtToken');
//   }
//   return null;
// } 