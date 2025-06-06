import { getSession } from 'next-auth/react'; // Para pegar o token se necessário
import { Categoria } from './interfaces/interfaces';

const API_URL = process.env.NEXT_PUBLIC_API_URL;


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

export const getCategories = async (searchTerm: string = ''): Promise<Categoria[]> => {
  const headers = await getAuthHeaders();
  let url = `${API_URL}/categories`;
  if (searchTerm) {
    url += `?&search=${encodeURIComponent(searchTerm)}`;
  }
  
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao buscar categorias.' }));
    throw new Error(errorData.message || `Erro ${response.status} ao buscar categorias.`);
  }
  
  const data = await response.json();

  return data.categories
};

export const createCategory = async (categoryData: { name: string; description?: string }): Promise<{ message: string, category: Categoria }> => {
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
  
  const data = await response.json();

  return data.category
};

export const updateCategory = async (categoryId: string, categoryData: { name?: string; description?: string }): Promise<{ message: string, category: Categoria }> => {
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

  const data = await response.json();

  return data.category
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
  
  const data = await response.json();

  return data.category
}; 