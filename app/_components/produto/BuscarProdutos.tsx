'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

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
  className?: string;
  onSearchChange?: (termo: string) => void;
}

const BuscarProdutos = ({ className = '', onSearchChange }: BuscarProdutosProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get the current search term from URL
  const initialTerm = searchParams.get('q') || '';
  const [termoBusca, setTermoBusca] = useState(initialTerm);
  
  // Update search term when URL changes
  useEffect(() => {
    const currentTerm = searchParams.get('q') || '';
    setTermoBusca(currentTerm);
  }, [searchParams]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParam(termoBusca);
    
    // Optional callback for components that need immediate notification
    if (onSearchChange) {
      onSearchChange(termoBusca);
    }
  };
  
  // Update URL with search parameter
  const updateSearchParam = (termo: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (termo.trim()) {
      newParams.set('q', termo.trim());
    } else {
      newParams.delete('q');
    }
    
    // Preserve existing category filter if present
    const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
    router.push(newUrl);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center space-x-2 ${className}`}>
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        </div>
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
      >
        Buscar
      </button>
    </form>
  );
};

export default BuscarProdutos;