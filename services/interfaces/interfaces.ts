import { TicketPriority, TicketStatus } from "../types/types";

// Tipo base para timestamps
interface Timestamps {
  created_at: string;
  updated_at: string;
}

// Esta será a interface User canônica baseada no user.to_dict() do backend
export interface User extends Timestamps {
  id: number; // ID do banco de dados
  name: string;
  email: string;
  phone?: string | null; // Tornar opcional/nulável se puder ser nulo no DB/resposta
  type: "admin" | "user"; // Consistente com UserType do backend
  avatar?: string | null; // URL do avatar do usuário

  // Relacionamentos (opcionais, pois não vêm por padrão de user.to_dict())
  // Suas interfaces (Cartao, Carrinho, etc.) precisam ser consistentes.
  cartoes?: Cartao[];
  carrinho?: Carrinho;
  pedidos?: Pedido[];
  tickets?: Ticket[];
}

export interface Cartao extends Timestamps {
  id: number;
  user_id: number;
  card_number_last4?: string; // Exemplo: se a API retornar apenas os últimos 4 dígitos
  card_holder_name: string;
  card_expiration_date_str?: string; // Ex: "MM/YY"
  card_brand?: string; // Ex: Visa, Mastercard

  user?: User;
}

export interface Carrinho extends Timestamps {
  id: number;
  user_id: number;
  user?: User;
  itens?: CarrinhoItem[];
}

export interface Produto extends Timestamps {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  img?: string;

  // Relacionamentos
  carrinhoItens?: CarrinhoItem[];
  pedidoItens?: PedidoItem[];
  category?: Categoria;
}

export interface Categoria extends Timestamps {
  id: number;
  name: string;
}

export interface CarrinhoItem {
  carrinho_id: number;
  produto_id: number;
  quantity: number;
  carrinho?: Carrinho;
  produto?: Produto;
}

export interface Pedido extends Timestamps {
  id: number;
  description?: string | null;
  amount: number;
  status: "Em Processamento" | "Não autorizado" | "Concluido";
  user_id: number;

  user?: User;
  payments?: Pagamento[];
  items?: PedidoItem[];
}

export interface Pagamento extends Timestamps {
  id: number;
  pedido_id: number;
  payment_method: "Cartão" | "PIX";
  status: "Aprovado" | "Pendente" | "Rejeitado";
  amount: number;
  transaction_id?: string | null;
  pedido?: Pedido;
}

export interface PedidoItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string | null;
  price: number;
  quantity: number;
  order?: Pedido
}

export interface Ticket extends Timestamps {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  user?: User;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: number | null;
  message: string;
  created_at: string;
  user?: User;
  ticket?: Ticket;
}
