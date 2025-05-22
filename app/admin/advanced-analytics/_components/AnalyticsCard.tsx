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

// Exportar a interface AnalyticsCardProps
export interface AnalyticsCardProps {
  title: string;
  icon?: React.ReactNode;
  summaryContent: React.ReactNode;
  modalContent: React.ReactNode;
  modalDescription?: string;
  colSpan?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  index?: number;
}

export default function AnalyticsCard({
  title,
  icon,
  summaryContent,
  modalContent,
  modalDescription,
  colSpan = '',
  variant = 'default',
  index = 0,
}: AnalyticsCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const baseCardStyle = "p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer";

  const variantStyles = {
    default: {
      card: "bg-white text-gray-800",
      icon: "text-indigo-600",
      title: "text-gray-700",
      summary: "text-gray-800"
    },
    primary: {
      card: "bg-gradient-to-br from-indigo-600 to-blue-500 text-white",
      icon: "text-white/90",
      title: "text-white/80",
      summary: "text-white"
    },
    secondary: {
      card: "bg-gradient-to-br from-purple-600 to-violet-500 text-white",
      icon: "text-white/90",
      title: "text-white/80",
      summary: "text-white"
    },
    success: {
      card: "bg-gradient-to-br from-green-600 to-emerald-500 text-white",
      icon: "text-white/90",
      title: "text-white/80",
      summary: "text-white"
    },
    danger: {
      card: "bg-gradient-to-br from-red-600 to-rose-500 text-white",
      icon: "text-white/90",
      title: "text-white/80",
      summary: "text-white"
    },
    warning: {
        card: "bg-gradient-to-br from-amber-500 to-yellow-400 text-gray-900",
        icon: "text-gray-800/90",
        title: "text-gray-800/80",
        summary: "text-gray-900"
      }
  };

  const currentStyle = variantStyles[variant] || variantStyles.default;

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={`${baseCardStyle} ${currentStyle.card} ${colSpan}`}
        whileHover={{
          scale: 1.03,
          boxShadow: "0px 10px 20px rgba(0,0,0,0.15)"
        }}
        onClick={() => setIsOpen(true)}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex justify-between items-start mb-3">
          <div className={`text-sm font-medium ${currentStyle.title}`}>
            {title}
          </div>
          {icon && <div className={`${currentStyle.icon}`}>{icon}</div>}
        </div>
        
        <div className={`${currentStyle.summary}`}>
          {summaryContent}
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] 2xl:max-w-[50vw] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-800">{title}</DialogTitle>
                {modalDescription && <DialogDescription className="text-sm text-gray-500 mt-1">{modalDescription}</DialogDescription>}
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {modalContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 