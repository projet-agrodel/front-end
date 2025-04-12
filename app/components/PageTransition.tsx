'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();

  const variants = {
    initial: {
      opacity: 0,
      y: 20, 
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20, 
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} 
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className="flex-grow flex flex-col" 
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition; 