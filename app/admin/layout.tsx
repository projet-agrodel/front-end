'use client'; // Diretiva movida para o topo do arquivo

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, ShoppingCart, Package, Users, Tag, Settings, LogOut,
  MessageSquare, BarChart2
} from 'lucide-react';

// Hook para obter o pathname (necessário para link ativo)
import { usePathname } from 'next/navigation';

// Componente Sidebar com Design Único 
function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (value: boolean) => void }) {
  const pathname = usePathname();

  // Organização das seções de navegação por categoria
  const navSections = [
    {
      title: 'Visão Geral',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Advanced Analytics', href: '/admin/advanced-analytics', icon: BarChart2 },
      ]
    },
    {
      title: 'Loja & Vendas', 
      items: [
        { name: 'Produtos', href: '/admin/products', icon: Package },
        { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Categorias', href: '/admin/categories', icon: Tag },
      ]
    },
    {
      title: 'Relacionamento',
      items: [
        { name: 'Clientes', href: '/admin/customers', icon: Users },
        { name: 'Tickets', href: '/admin/tickets', icon: MessageSquare },
      ]
    }
  ];

  return (
    <div className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'} border-r border-slate-700 z-50`}>
        
        {/* Header com Logo e Botão de Toggle */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Agrodel</h1>
                <p className="text-slate-400 text-xs">Painel Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-200 shadow-md"
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <svg className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navegação Principal */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navSections.map((section, sectionIndex) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={isCollapsed ? item.name : ''}
                      className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-200 relative ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg transform scale-105'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:scale-102'
                      }`}
                    >
                      {/* Indicador visual para item ativo */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                      )}
                      
                      <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                        <Icon size={20} className="flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="font-medium text-sm">{item.name}</span>
                        )}
                      </div>
                      
                      {/* Tooltip para modo colapsado */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-600">
                          {item.name}
                          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-slate-600"></div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
              {/* Separador visual entre seções */}
              {sectionIndex < navSections.length - 1 && !isCollapsed && (
                <div className="border-t border-slate-700 mt-4"></div>
              )}
            </div>
          ))}
        </div>

        {/* Footer com Configurações e Logout */}
        <div className="p-4 border-t border-slate-700">
          <div className="space-y-1">
            {/* Configurações */}
            <Link
              href="/admin/settings"
              title={isCollapsed ? 'Configurações' : ''}
              className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-200 relative ${
                pathname === '/admin/settings'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                <Settings size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium text-sm">Configurações</span>
                )}
              </div>
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-600">
                  Configurações
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-slate-600"></div>
                </div>
              )}
            </Link>
            
            {/* Logout */}
            <button
              title={isCollapsed ? 'Sair' : ''}
              className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-200 w-full text-slate-300 hover:bg-red-600 hover:text-white relative`}
            >
              <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                <LogOut size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium text-sm">Sair</span>
                )}
              </div>
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-600">
                  Sair
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-slate-600"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

// Layout Principal com Design Atualizado
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
} 