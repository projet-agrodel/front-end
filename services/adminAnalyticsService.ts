// Definição da estrutura de dados esperada para SalesByCategory
export interface SalesByCategoryData {
  categoryName: string;
  totalSales: number;
  transactionCount: number;
}

// Definição da estrutura de dados para Total Sales
export interface TotalSalesData {
  total_sales: number;
  previous_period_sales: number;
  trend_percentage: number;
  trend_direction: 'up' | 'down' | 'neutral';
  currency: string;
  period: {
    start_date: string;
    end_date: string;
  };
  daily_sales_chart: number[];
  formatted_total: string;
  last_updated: string;
}

// Definição da estrutura de dados para Total Orders
export interface TotalOrdersData {
  total_orders: number;
  previous_period_orders: number;
  trend_percentage: number;
  trend_direction: 'up' | 'down' | 'neutral';
  period: {
    start_date: string;
    end_date: string;
  };
  weekday_orders_chart: Array<{
    day: string;
    orders: number;
  }>;
  status_breakdown: {
    completed: number;
    pending: number;
    cancelled: number;
  };
  average_orders_per_day: number;
  last_updated: string;
}

export interface NewCustomersData {
  monthly_new_customers_chart: Array<{
    mes: string;
    novosClientes: number;
  }>;
  recent_customers: Array<{
    id: string;
    nome: string;
    dataRegistro: string;
    canal: string;
  }>;
  summary_metrics: {
    total_new_customers_period: number;
    growth_percentage_vs_previous_month: number;
    estimated_cpa_brl: number;
  };
  last_updated: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getSalesByCategory(token: string): Promise<SalesByCategoryData[]> {
  const response = await fetch(`${API_URL}/admin/analytics/sales-by-category`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    // Tenta pegar uma mensagem de erro do corpo da resposta, se houver
    let errorMessage = `Erro HTTP: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData && errorData.msg) { // Flask-JWT-Extended usa 'msg' às vezes
        errorMessage = errorData.msg;
      }
    } catch (e) {
      // Se não conseguir parsear o JSON, mantém a mensagem de erro HTTP
      console.error("Falha ao parsear erro JSON:", e);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Função para buscar os dados de vendas totais
export async function getTotalSales(token: string, startDate?: string, endDate?: string): Promise<TotalSalesData> {
  let url = `${API_URL}/admin/analytics/total-sales`;
  
  // Adicionar parâmetros de data se fornecidos
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    let errorMessage = `Erro HTTP: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData && errorData.msg) {
        errorMessage = errorData.msg;
      }
    } catch (e) {
      console.error("Falha ao parsear erro JSON:", e);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Função para buscar os dados de pedidos totais
export async function getTotalOrders(token: string, startDate?: string, endDate?: string): Promise<TotalOrdersData> {
  let url = `${API_URL}/admin/analytics/total-orders`;
  
  // Adicionar parâmetros de data se fornecidos
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    let errorMessage = `Erro HTTP: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData && errorData.msg) {
        errorMessage = errorData.msg;
      }
    } catch (e) {
      console.error("Falha ao parsear erro JSON:", e);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Função para buscar os dados de novos clientes
export async function getNewCustomers(token: string, startDate?: string, endDate?: string): Promise<NewCustomersData> {
  let url = `${API_URL}/admin/analytics/new-customers`;
  
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    let errorMessage = `Erro HTTP: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData && errorData.msg) {
        errorMessage = errorData.msg;
      }
    } catch (e) {
      console.error("Falha ao parsear erro JSON:", e);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}