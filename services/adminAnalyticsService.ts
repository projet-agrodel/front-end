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