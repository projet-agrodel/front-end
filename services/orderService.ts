// Definindo as interfaces diretamente aqui para simplicidade inicial
// Em um projeto maior, poderiam estar em um arquivo types.ts dedicado

import { Pedido } from "./interfaces/interfaces";


export interface CustomerInfo {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

export type OrderStatus = "Em Processamento" | "Não autorizado" | "Concluido";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper para construir URL e headers
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    // const token = localStorage.getItem('adminToken'); // Exemplo se o token fosse necessário
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        // ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Erro na API: ${response.status}`);
    }
    return response.json();
};

export const getAdminOrders = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: OrderStatus | '';
} = {}): Promise<Pedido[]> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    return fetchApi(`/api/orders/all?${queryParams.toString()}`, { method: 'GET' });
};

export const getAdminOrderById = async (orderId: string): Promise<Pedido[]> => {
    return fetchApi(`/api/orders/${orderId}`, { method: 'GET' });
};

export const updateAdminOrderStatus = async (orderId: string, status: OrderStatus): Promise<Pedido> => {
    return fetchApi(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}; 