// Tipo base para timestamps
interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface User extends Timestamps {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  type: 'admin' | 'client';

  // Relacionamentos
  cartoes?: Cartao[];
  carrinho?: Carrinho;
  pedidos?: Pedido[];
  tickets?: Ticket[];
  ticket_messages?: TicketMessage[];
}

export interface Cartao extends Timestamps {
  id: number;
  user_id: number;
  card_number: Buffer;
  card_holder_name: string;
  card_expiration_date: Date;
  card_cvv: Buffer;

  // Relacionamento
  user?: User;
}

export interface Carrinho extends Timestamps {
  id: number;
  user_id: number;

  // Relacionamentos
  user?: User;
  itens?: CarrinhoItem[];
}

export interface Produto extends Timestamps {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  img?: string

  // Relacionamentos
  carrinhoItens?: CarrinhoItem[];
  pedidoItens?: PedidoItem[];
  category?: Categoria
}

export interface Categoria extends Timestamps {
  id: number;
  name: string;
}

export interface Pedido extends Timestamps {
  id: number;
  description: Buffer;
  amount: number;
  user_id: number;

  // Relacionamentos
  user?: User;
  pagamento?: Pagamento;
  itens?: PedidoItem[];
}

export interface Pagamento extends Timestamps {
  id: number;
  pedido_id: number;
  payment_method: 'Cartão' | 'PIX';
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
  amount: number;
  transaction_id: Buffer;

  // Relacionamento
  pedido?: Pedido;
}

export interface CarrinhoItem {
  carrinho_id: number;
  produto_id: number;
  quantity: number;

  // Relacionamentos
  carrinho?: Carrinho;
  produto?: Produto;
}

export interface PedidoItem {
  order_item_id: number;
  pedido_id: number;
  produto_id: number;
  quantity: number;

  // Relacionamentos
  pedido?: Pedido;
  produto?: Produto;
}

export interface Ticket extends Timestamps {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  status: 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';

  // Relacionamentos
  user?: User;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: number | null;
  message: string;
  created_at: string;

  // Relacionamentos
  ticket?: Ticket;
  user?: User;
}
