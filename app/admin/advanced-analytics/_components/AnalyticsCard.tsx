'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface AnalyticsCardProps {
  title: string;
  icon?: React.ReactNode;
  summaryContent: React.ReactNode;
  modalContent: React.ReactNode;
  modalDescription?: string;
  colSpan?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger';
}

export default function AnalyticsCard({
  title,
  icon,
  summaryContent,
  modalContent,
  modalDescription,
  colSpan = '',
  variant = 'default',
}: AnalyticsCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Definição de classes de cor com base na variante
  const variantClasses = {
    default: 'bg-white text-gray-800',
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-purple-500 text-white',
    success: 'bg-green-500 text-white',
    danger: 'bg-red-500 text-white',
  };

  const variantIconClasses = {
    default: 'text-primary',
    primary: 'text-white/90',
    secondary: 'text-white/90',
    success: 'text-white/90',
    danger: 'text-white/90',
  };

  const variantTitleClasses = {
    default: 'text-gray-700',
    primary: 'text-white/80',
    secondary: 'text-white/80',
    success: 'text-white/80',
    danger: 'text-white/80',
  };

  return (
    <>
      <motion.div
        className={`p-5 rounded-xl shadow-sm ${variantClasses[variant]} ${colSpan} cursor-pointer hover:shadow-md transition-all duration-300`}
        whileHover={{
          scale: 1.01,
        }}
        onClick={() => setIsOpen(true)}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="flex justify-between items-start mb-3">
          <div className={`text-sm font-medium ${variantTitleClasses[variant]}`}>
            {title}
          </div>
          {icon && <div className={`${variantIconClasses[variant]}`}>{icon}</div>}
        </div>
        
        <div className={variant === 'default' ? 'text-gray-800' : 'text-white'}>
          {summaryContent}
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-xl">{title}</DialogTitle>
                {modalDescription && <DialogDescription>{modalDescription}</DialogDescription>}
              </div>
              
              <div className="flex gap-2 items-center">
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
                  <span>Este mês</span>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-grow overflow-auto py-4">
            {modalContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 