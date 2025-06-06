import { User } from './interfaces/interfaces';

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

    return fetchApi(`users?${queryParams.toString()}`, { method: 'GET' });
};

export const getAdminUserById = async (userId: string): Promise<User> => {
    return fetchApi(`users/${userId}`, { method: 'GET' });
}; 