const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Interface alinhada com o backend (simplificada por agora)
export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: { id: number; name: string } | null;
  // Adicionar outros campos conforme o modelo do backend evolui (ex: imageUrl, createdAt, updatedAt)
  // Campos que estavam na interface do page.tsx mas não no modelo Product.py original:
  // imageUrl?: string; 
  // status?: 'Ativo' | 'Inativo'; // Pode ser derivado do stock ou um campo novo no backend
  // isPromotion?: boolean;
  // originalPrice?: number | null;
}

const getHeaders = (token: string) => { // Token é agora obrigatório
  if (!token) {
    // Idealmente, a UI não chamaria o serviço sem um token.
    // Lançar um erro aqui pode ser mais seguro para evitar chamadas não autenticadas.
    throw new Error("Token de autenticação não fornecido."); 
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getAdminProducts = async (token: string): Promise<AdminProduct[]> => {
  const response = await fetch(`${API_URL}/admin/products`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao buscar produtos administrativamente');
  }
  return response.json();
};

export const getAdminProductById = async (id: string, token: string): Promise<AdminProduct> => {
  const response = await fetch(`${API_URL}/admin/products/${id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao buscar o produto administrativamente');
  }
  return response.json();
};

// Para criação, não esperamos 'id' no payload, mas o backend retorna o produto com 'id'
export type CreateAdminProductPayload = Omit<AdminProduct, 'id' | 'category'> & { 
    category_id?: number | null;
    name: string; // Garantir que campos obrigatórios estejam no tipo
    description: string;
    price: number;
    stock: number;
};

export const createAdminProduct = async (productData: CreateAdminProductPayload, token: string): Promise<AdminProduct> => {
  const response = await fetch(`${API_URL}/admin/products`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao criar produto administrativamente');
  }
  return response.json();
};

export type UpdateAdminProductPayload = Partial<CreateAdminProductPayload>; // Pode ser Partial do payload de criação

export const updateAdminProduct = async (id: string, productData: UpdateAdminProductPayload, token: string): Promise<AdminProduct> => {
  const response = await fetch(`${API_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao atualizar produto administrativamente');
  }
  return response.json();
};

export const deleteAdminProduct = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Falha ao deletar produto administrativamente');
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
      throw new Error(errorData.message || 'Falha ao atualizar estoque do produto administrativamente');
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