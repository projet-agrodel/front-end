'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react'; // Ou use react-icons
import Slider from 'rc-slider'; // Importa o Slider
import 'rc-slider/assets/index.css'; // Importa o CSS do Slider

// Atualizando a interface para receber as novas props
interface FiltroPanelProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  // Adicionar props para preço e disponibilidade depois
  minPrice: number;
  maxPrice: number;
  minPriceLimit: number;
  maxPriceLimit: number;
  onPriceChange: (value: number | number[]) => void;
  onClearFilters: () => void;
}

const FiltroPanel: React.FC<FiltroPanelProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  minPrice,
  maxPrice,
  minPriceLimit,
  maxPriceLimit,
  onPriceChange,
  onClearFilters
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }} // Ajuste leve na animação inicial
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: 'top left' }} // Definindo a origem (ajustar se necessário)
          className="absolute z-10 mt-1 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none top-full left-0" // Posicionamento
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose} // O botão X agora usa o onClose (que vem de handleApplyFilters)
              >
                <span className="sr-only">Fechar painel de filtros</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Conteúdo dos filtros */}
            <div className="space-y-6"> {/* Aumentei o espaçamento */}
              {/* Filtro de Categoria */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Categoria</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onCategoryChange(null)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${!selectedCategory ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Todas
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => onCategoryChange(cat)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro de Preço */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Faixa de Preço</h4>
                <div className="px-1"> {/* Pequeno padding para o slider não colar nas bordas */}
                  <Slider
                    range // Define como um slider de intervalo
                    min={minPriceLimit} // Limite mínimo geral
                    max={maxPriceLimit} // Limite máximo geral
                    value={[minPrice, maxPrice]} // Valores selecionados atualmente
                    onChange={onPriceChange} // Função chamada ao mover o slider
                    allowCross={false} // Impede que min ultrapasse max
                    trackStyle={[{ backgroundColor: '#10B981' }]} // Cor da faixa selecionada (Emerald 600)
                    handleStyle={[
                      { backgroundColor: '#10B981', borderColor: '#059669', opacity: 1 }, // Cor do handle esquerdo
                      { backgroundColor: '#10B981', borderColor: '#059669', opacity: 1 }  // Cor do handle direito
                    ]}
                    railStyle={{ backgroundColor: '#E5E7EB' }} // Cor da faixa não selecionada (Gray 200)
                  />
                </div>
                {/* Exibe os valores selecionados */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>R$ {minPrice.toFixed(2)}</span>
                  <span>R$ {maxPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Placeholder para Filtro de Disponibilidade */}
              {/* 
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Disponibilidade</h4>
                <p className="text-sm text-gray-500">Checkbox/Switch aqui...</p>
              </div> 
              */}
            </div>

            {/* Rodapé com botões */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-3"> 
              {/* Botão Limpar Filtros (estilo secundário) */}
              <button
                type="button"
                className="flex-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:text-sm"
                onClick={onClearFilters} // Chama a função passada
              >
                Limpar Filtros
              </button>
              {/* Botão Fechar Filtros (estilo primário) */}
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