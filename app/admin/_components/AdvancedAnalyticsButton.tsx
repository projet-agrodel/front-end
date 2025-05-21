'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BarChart2 as BarChartIcon, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvancedAnalyticsButton() {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const showPopover = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsPopoverVisible(true);
    }, 700); // Atraso de 700ms
  };

  const hidePopover = (event?: React.MouseEvent<Element, MouseEvent>) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Verifica se o mouse está sobre o popover ou o botão antes de fechar
    if (event && popoverRef.current?.contains(event.relatedTarget as Node)) return;
    if (event && buttonRef.current?.contains(event.relatedTarget as Node)) return;
    
    setIsPopoverVisible(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const popoverVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } },
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={showPopover}
      onMouseLeave={hidePopover}
    >
      <Link href="/admin/advanced-analytics" passHref ref={buttonRef} className="text-gray-500 hover:text-gray-700">
        <BarChartIcon size={22} />
      </Link>

      <AnimatePresence>
        {isPopoverVisible && (
          <motion.div
            ref={popoverRef}
            variants={popoverVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full right-0 mt-2 w-72 z-20" // Ajustado para w-72 e right-0 para alinhar melhor no header
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              setIsPopoverVisible(true); 
            }}
            onMouseLeave={hidePopover}
          >
            <Link href="/admin/advanced-analytics" passHref className="block">
              <div className="bg-gray-800 text-white p-4 rounded-lg shadow-xl text-sm">
                <div className="flex items-start space-x-2">
                  <HelpCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <p>Explore relatórios detalhados e insights de desempenho para otimizar sua estratégia.</p>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 