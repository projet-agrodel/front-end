'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogTrigger, // O trigger estará no AnalyticsCard
} from '@/components/ui/dialog';
import SalesByCategoryChart from './SalesByCategoryChart';

interface SalesByCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SalesByCategoryModal: React.FC<SalesByCategoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Vendas por Categoria</DialogTitle>
          <DialogDescription>
            Análise detalhada das vendas distribuídas por categoria de produto.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-auto">
          <SalesByCategoryChart />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesByCategoryModal; 