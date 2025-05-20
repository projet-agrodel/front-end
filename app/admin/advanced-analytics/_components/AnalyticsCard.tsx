'use client';

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsCardProps {
  title: string;
  children: React.ReactNode;
  colSpan?: string; // Para controlar a largura na grade, ex: "md:col-span-2"
  // Poderíamos adicionar mais props aqui, como filtros específicos do card, etc.
}

export default function AnalyticsCard({ title, children, colSpan = '' }: AnalyticsCardProps) {
  return (
    <motion.div 
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${colSpan}`}
      whileHover={{
        scale: 1.01,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {/* Ícone de opções (placeholder para futuras ações como exportar, etc.) */}
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div>
        {children}
      </div>
    </motion.div>
  );
} 