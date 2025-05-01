'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ArrowDownUp, ArrowUpNarrowWide, ArrowDownWideNarrow } from 'lucide-react';

interface OrdenarProdutosProps {
  currentSortOrder: string | null;
  onSortChange: (sortOrder: string | null) => void;
}

const sortOptions = [
  { value: null, label: 'Padrão', icon: ArrowDownUp },
  { value: 'price_asc', label: 'Preço: Menor para Maior', icon: ArrowUpNarrowWide },
  { value: 'price_desc', label: 'Preço: Maior para Menor', icon: ArrowDownWideNarrow },
];

const OrdenarProdutos: React.FC<OrdenarProdutosProps> = ({ currentSortOrder, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = sortOptions.find(opt => opt.value === currentSortOrder) || sortOptions[0];

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (sortValue: string | null) => {
    onSortChange(sortValue);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botão que abre o Dropdown */}
      <button
        type="button"
        className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <selectedOption.icon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
        Ordenar
        <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.1 }}
            style={{ transformOrigin: 'top right' }} // Ajuste a origem conforme posicionamento
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {sortOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleSelect(option.value)}
                  className={`${currentSortOrder === option.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                  role="menuitem"
                >
                  <option.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  {option.label}
                  {currentSortOrder === option.value && (
                    <Check className="ml-auto h-5 w-5 text-emerald-600" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdenarProdutos;
