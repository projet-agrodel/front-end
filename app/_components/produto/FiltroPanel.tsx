'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowDownUp, ArrowUpNarrowWide, ArrowDownWideNarrow } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Categoria } from '@/services/interfaces/interfaces';

interface FiltroPanelProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Categoria[];
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  minPrice: number;
  maxPrice: number;
  minPriceLimit: number;
  maxPriceLimit: number;
  onPriceChange: (value: number | number[]) => void;
  onClearFilters: () => void;
  currentSortOrder: string | null;
  onSortChange: (sortOrder: string | null) => void;
}

const sortOptions = [
  { value: null, label: 'Padrão', icon: ArrowDownUp },
  { value: 'price_asc', label: 'Preço: Menor para Maior', icon: ArrowUpNarrowWide },
  { value: 'price_desc', label: 'Preço: Maior para Menor', icon: ArrowDownWideNarrow },
];

const FiltroPanel: React.FC<FiltroPanelProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategoryId,
  onCategoryChange,
  minPrice,
  maxPrice,
  minPriceLimit,
  maxPriceLimit,
  onPriceChange,
  onClearFilters,
  currentSortOrder,
  onSortChange
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: 'top left' }}
          className="absolute z-10 mt-1 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none top-full left-0"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <span className="sr-only">Fechar painel de filtros</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Categoria</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onCategoryChange(null)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategoryId === null ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Todas
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => onCategoryChange(cat.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategoryId === cat.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Faixa de Preço</h4>
                <div className="px-1">
                  <Slider
                    range
                    min={minPriceLimit}
                    max={maxPriceLimit}
                    value={[minPrice, maxPrice]}
                    onChange={onPriceChange}
                    allowCross={false}
                    trackStyle={[{ backgroundColor: '#10B981' }]}
                    handleStyle={[
                      { backgroundColor: '#10B981', borderColor: '#059669', opacity: 1 },
                      { backgroundColor: '#10B981', borderColor: '#059669', opacity: 1 }
                    ]}
                    railStyle={{ backgroundColor: '#E5E7EB' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>R$ {minPrice.toFixed(2)}</span>
                  <span>R$ {maxPrice.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ordenar por</h4>
                <div className="flex flex-col gap-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => onSortChange(option.value)}
                      className={`group flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${currentSortOrder === option.value ? 'bg-emerald-100 text-emerald-900' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                    >
                      <option.icon className="mr-3 h-5 w-5 text-gray-500" aria-hidden="true" />
                      <span>{option.label}</span>
                      {currentSortOrder === option.value && (
                        <Check className="ml-auto h-5 w-5 text-emerald-600" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-3">
              <button
                type="button"
                className="flex-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:text-sm"
                onClick={onClearFilters}
              >
                Limpar Filtros
              </button>
              <button
                type="button"
                className="flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:text-sm"
                onClick={onClose}
              >
                Fechar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FiltroPanel; 