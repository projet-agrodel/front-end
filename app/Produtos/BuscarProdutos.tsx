'use client';

import { useState } from 'react';

// Ícone de lupa para o campo de busca
const MagnifyingGlassIcon = ({ className = '' }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" 
    />
  </svg>
);

interface BuscarProdutosProps {
  onSearch: (termo: string) => void;
  className?: string;
}

const BuscarProdutos = ({ onSearch, className = '' }: BuscarProdutosProps) => {
  const [termoBusca, setTermoBusca] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(termoBusca);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute inset-y-0 left-0 pl-3 flex items-center"
          aria-label="Buscar"
        >
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </form>
  );
};

export default BuscarProdutos;