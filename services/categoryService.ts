import { getSession } from 'next-auth/react'; // Para pegar o token se necessário

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Category {
  id: string; // No frontend, pode ser string ou number dependendo da API
  name: string;
  description: string;
  productCount?: number; // productCount será tratado pelo backend
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedCategoriesResponse {
  categories: Category[];
  total: number;
  pages: number;
  current_page: number;
  per_page: number;
}

// Helper para obter o token de autenticação
async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await getSession();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }
  // Se a autenticação for obrigatória para todas as rotas de categoria, 
  // você pode querer lançar um erro aqui se !session?.accessToken
  return headers;
}

export const getCategories = async (page: number = 1, perPage: number = 10, searchTerm: string = ''): Promise<PaginatedCategoriesResponse> => {
  const headers = await getAuthHeaders();
  let url = `${API_URL}/categories?page=${page}&per_page=${perPage}`;
  if (searchTerm) {
    url += `&search=${encodeURIComponent(searchTerm)}`;
  }
  
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao buscar categorias.' }));
    throw new Error(errorData.message || `Erro ${response.status} ao buscar categorias.`);
  }
  return response.json();
};

export const createCategory = async (categoryData: { name: string; description?: string }): Promise<{ message: string, category: Category }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers,
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao criar categoria.' }));
    throw new Error(errorData.message || `Erro ${response.status} ao criar categoria.`);
  }
  return response.json();
};

export const updateCategory = async (categoryId: string, categoryData: { name?: string; description?: string }): Promise<{ message: string, category: Category }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao atualizar categoria.' }));
    throw new Error(errorData.message || `Erro ${response.status} ao atualizar categoria.`);
  }
  return response.json();
};

export const deleteCategory = async (categoryId: string): Promise<{ message: string }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao excluir categoria.' }));
    throw new Error(errorData.message || `Erro ${response.status} ao excluir categoria.`);
  }
  return response.json();
}; 