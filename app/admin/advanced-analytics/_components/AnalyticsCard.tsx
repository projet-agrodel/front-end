'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
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
}

export default function AnalyticsCard({
  title,
  icon,
  summaryContent,
  modalContent,
  modalDescription,
  colSpan = '',
}: AnalyticsCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${colSpan} cursor-pointer hover:shadow-md transition-all duration-300`}
        whileHover={{
          scale: 1.01,
        }}
        onClick={() => setIsOpen(true)}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {icon && <div className="text-primary">{icon}</div>}
            <h2 className="text-md font-semibold text-gray-800">{title}</h2>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
        <div className="text-sm text-gray-500">
          {summaryContent}
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {modalDescription && <DialogDescription>{modalDescription}</DialogDescription>}
          </DialogHeader>
          <div className="flex-grow overflow-auto py-2">
            {modalContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 