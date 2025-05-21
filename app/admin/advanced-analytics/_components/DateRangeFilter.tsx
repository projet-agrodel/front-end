'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
// Poderíamos usar uma lib como react-datepicker ou shadcn/ui DatePicker aqui no futuro

const predefinedRanges = [
  { label: 'Últimos 7 dias', value: '7d' },
  { label: 'Últimos 30 dias', value: '30d' },
  { label: 'Este Mês', value: 'month' },
  { label: 'Mês Passado', value: 'last_month' },
  { label: 'Este Ano', value: 'year' },
  { label: 'Personalizado', value: 'custom' },
];

export default function DateRangeFilter() {
  const [selectedRange, setSelectedRange] = useState('30d');
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  // const [startDate, setStartDate] = useState<Date | null>(null);
  // const [endDate, setEndDate] = useState<Date | null>(null);

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
    if (value === 'custom') {
      setIsCustomRangeOpen(true);
    } else {
      setIsCustomRangeOpen(false);
      // Aqui você chamaria a função para atualizar os dados do dashboard com o novo range
      console.log(`Filtro de período alterado para: ${value}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <div className="relative">
        <select 
          value={selectedRange}
          onChange={(e) => handleRangeChange(e.target.value)}
          className="appearance-none w-full sm:w-auto bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
        >
          {predefinedRanges.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown size={18} />
        </div>
      </div>

      {selectedRange === 'custom' && isCustomRangeOpen && (
        <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 p-4 sm:p-0 border sm:border-none rounded-md sm:rounded-none bg-white sm:bg-transparent">
          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="text-sm text-gray-600">De:</label>
            <input type="date" id="startDate" className="border border-gray-300 rounded-md p-1.5 text-sm focus:ring-1 focus:ring-green-500" />
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <label htmlFor="endDate" className="text-sm text-gray-600">Até:</label>
            <input type="date" id="endDate" className="border border-gray-300 rounded-md p-1.5 text-sm focus:ring-1 focus:ring-green-500" />
          </div>
          <button 
            className="mt-2 sm:mt-0 sm:ml-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500"
            onClick={() => console.log('Aplicar range personalizado')}
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
} 