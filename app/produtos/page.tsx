import React from 'react';
import ListarProdutos from '../_components/produto/ListarProdutos';

export const metadata = {
  title: 'Produtos - Agrodel',
  description: 'Explore nosso catálogo de produtos agrícolas de alta qualidade',
};

export default function ProdutosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Produtos Agrícolas</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore nossa seleção de produtos agrícolas de alta qualidade para o seu negócio ou propriedade rural.
          Temos as melhores opções em fertilizantes, sementes, ferramentas e muito mais.
        </p>
      </div>
      
      <ListarProdutos />
    </div>
  );
}
