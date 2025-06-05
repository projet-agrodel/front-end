// Definindo as interfaces diretamente aqui para simplicidade inicial
// Em um projeto maior, poderiam estar em um arquivo types.ts dedicado

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl?: string;
}

export interface CustomerInfo {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

export type OrderStatus = 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';

export interface Order {
    id: string;
    orderNumber: string;
    customer: CustomerInfo;
    orderDate: string; // ISO string
    totalAmount: number;
    status: OrderStatus;
    itemCount: number;
    items?: OrderItem[];
    shippingAddress?: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
    };
    paymentMethod?: string;
    trackingNumber?: string;
}

export interface PaginatedOrdersResponse {
    orders: Order[];
    page: number;
    per_page: number;
    total_orders: number;
    total_pages: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/admin';

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
} = {}): Promise<PaginatedOrdersResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    return fetchApi(`/orders?${queryParams.toString()}`, { method: 'GET' });
};

export const getAdminOrderById = async (orderId: string): Promise<Order> => {
    return fetchApi(`/orders/${orderId}`, { method: 'GET' });
};

export const updateAdminOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
    return fetchApi(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}; 