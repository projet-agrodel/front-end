import { User } from './interfaces/interfaces';
import { getAuthTokenForAdmin } from "@/utils/authAdmin";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    return response.json();
};

export const getAdminUsers = async (params: {
    query?: string;
    type?: 'admin' | 'user' | '';
} = {}): Promise<User[]> => {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append('query', params.query);
    if (params.type) queryParams.append('type', params.type);

    const token = await getAuthTokenForAdmin();
    return fetchApi(`users?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
};

export const getAdminUserById = async (userId: string): Promise<User> => {
    return fetchApi(`users/${userId}`, { method: 'GET' });
};

export const updateUserStatus = async (userId: string, status: 'ativo' | 'bloqueado', token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar o status do usuário.');
    }

    return response.json();
};

export const getProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Falha ao buscar perfil do usuário');
  }
  return response.json();
};

export const updateNotificationSettings = async (
  token: string,
  settings: {
    notify_new_order?: boolean;
    notify_stock_alert?: boolean;
  }
) => {
  const response = await fetch(`${API_BASE_URL}/api/user/notification-settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorData.message || 'Falha ao atualizar as configurações de notificação');
  }

  return response.json();
}; 