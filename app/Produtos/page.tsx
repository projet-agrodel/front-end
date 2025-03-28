import React from 'react';
import ListarProdutos from './ListarProdutos';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Produtos - Agrodel',
  description: 'Explore nosso catálogo de produtos agrícolas de alta qualidade',
};

export default function ProdutosRedirectPage() {
  redirect('/Produtos');
}
