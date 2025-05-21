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

export type Tab = {
  id: string;
  label: string;
  component: React.ReactNode;
}; 