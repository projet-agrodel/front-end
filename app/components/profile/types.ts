export type Card = {
  id: number;
  number: string;
  expiry: string;
};

export type Comment = {
  id: number;
  productName: string;
  text: string;
  rating: number;
  date: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'admin' | 'client';
  cards: Card[];
  comments: Comment[];
  avatar?: string;
};

export type Tab = {
  id: string;
  label: string;
  component: React.ReactNode;
}; 