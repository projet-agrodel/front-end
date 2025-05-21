const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Interface alinhada com o backend
export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: { id: number; name: string } | null;
  // Novos campos adicionados formalmente
  imageUrl?: string; 
  status: 'Ativo' | 'Inativo'; // Backend agora define status, então não é mais opcional aqui se sempre vier
  isPromotion: boolean; // Backend agora define isPromotion, então não é mais opcional
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

// Tipo para os parâmetros de getAdminProducts
export interface GetAdminProductsParams {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  status?: 'Ativo' | 'Inativo' | ''; // String vazia para "todos" ou não filtrar por status explicitamente do lado do admin
  // Adicionar outros possíveis parâmetros de paginação/filtro aqui no futuro
  // page?: number;
  // limit?: number;
}

export const getAdminProducts = async (token: string, params?: GetAdminProductsParams): Promise<AdminProduct[]> => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
        // Garantir que o valor não é undefined, null e, se string, não é vazia após trim
        if (value !== undefined && value !== null && (typeof value !== 'string' || String(value).trim() !== '')) {
            queryParams.append(key, String(value));
        }
    });
  }
  const requestUrl = `${API_URL}/admin/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: getHeaders(token),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao buscar produtos administrativamente');
  }
  return response.json();
};

// Esta função pode ser desnecessária se a lista /admin/products já traz todos os detalhes
// ou se o admin não precisar de uma visão detalhada de produto inativo fora da lista.
// Se mantida, precisaria de uma rota backend GET /admin/products/:id
export const getAdminProductById = async (id: string, token: string): Promise<AdminProduct> => {
  // Temporariamente apontando para a rota pública, que só retornará ativos.
  // Idealmente, esta seria uma rota admin específica se necessário.
  const response = await fetch(`${API_URL}/products/${id}`, { // ATENÇÃO: Rota pública, não /admin/products/:id
    method: 'GET',
    headers: getHeaders(token), // Admin pode ver um produto ativo com seu token
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao buscar o produto');
  }
  const product = await response.json();
  // Adicionalmente, o admin pode querer ver, mas a rota pública só dá ativos
  if (product.status !== 'Ativo') {
      // Isso não deveria acontecer se a rota pública só retorna ativos.
      // Mas se por algum motivo um produto inativo vazar por esta rota para um admin logado:
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
    // Adicionando os novos campos
    imageUrl?: string;
    status: 'Ativo' | 'Inativo'; // Status é obrigatório na criação via admin
    isPromotion: boolean;     // isPromotion é obrigatório na criação via admin
    originalPrice?: number | null;
};

export const createAdminProduct = async (productData: CreateAdminProductPayload, token: string): Promise<AdminProduct> => {
  const response = await fetch(`${API_URL}/products`, { // CORRIGIDO: Endpoint para POST /products
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

// Update pode ter todos os campos como opcionais
export type UpdateAdminProductPayload = Partial<CreateAdminProductPayload>;

export const updateAdminProduct = async (id: string, productData: UpdateAdminProductPayload, token: string): Promise<AdminProduct> => {
  const response = await fetch(`${API_URL}/products/${id}`, { // CORRIGIDO: Endpoint para PUT /products/:id
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
  const response = await fetch(`${API_URL}/products/${id}`, { // CORRIGIDO: Endpoint para DELETE /products/:id
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao deletar produto');
  }
};

export const updateAdminProductStock = async (id: string, quantity: number, token: string): Promise<AdminProduct> => {
    const response = await fetch(`${API_URL}/products/${id}/stock`, { // CORRIGIDO: Endpoint para PATCH /products/:id/stock
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify({ quantity }), // O backend espera { "quantity": valor }
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