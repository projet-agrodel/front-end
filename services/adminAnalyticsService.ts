// Definição da estrutura de dados esperada para SalesByCategory
export interface SalesByCategoryData {
  categoryName: string;
  totalSales: number;
  transactionCount: number;
}

// Função para buscar os dados de vendas por categoria
export async function getSalesByCategory(token: string): Promise<SalesByCategoryData[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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

// Definição da estrutura de dados esperada para RecentActivity
export interface ActivityDetail {
  cliente?: string;
  valor?: number;
  [key: string]: any; // Permite outros detalhes dinâmicos
}

export interface RecentActivityData {
  id: string;
  tipo: string;
  descricao: string;
  timestamp: string; // Espera-se uma string no formato ISO (ex: "2023-10-27T10:30:00.000Z")
  detalhes: ActivityDetail | null;
}

// Função para buscar os dados de atividades recentes
export async function getRecentActivities(token: string): Promise<RecentActivityData[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const response = await fetch(`${API_URL}/admin/analytics/recent-activities`, {
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

// --- Detalhes da Taxa de Conversão ---
// Interfaces já definidas em TaxaConversaoDetalhes.tsx, mas podemos redefini-las aqui para o serviço
// ou importá-las se forem movidas para um arquivo de tipos compartilhado.
// Por simplicidade, vou redefinir as estruturas principais que o endpoint retorna.

export interface FunnelStageData {
  stage: string;
  value: number;
  color: string;
}

export interface OptimizationData {
  id: number;
  texto: string;
  tipo: 'sucesso' | 'alerta' | 'info';
  iconName: string;
}

export interface TaxaConversaoDetailsData {
  funnelData: FunnelStageData[];
  optimizations: OptimizationData[];
}

export async function getTaxaConversaoDetails(token: string): Promise<TaxaConversaoDetailsData> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const response = await fetch(`${API_URL}/admin/analytics/taxa-conversao/details`, {
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
      console.error("Falha ao parsear erro JSON do taxa-conversao/details:", e);
    }
    throw new Error(errorMessage);
  }

  return response.json();
} 