'use client';

import React from 'react';

// Este template será aplicado a todas as rotas filhas
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-up w-full h-full">
      {children}
    </div>
  );
} 