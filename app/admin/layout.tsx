'use client'; // Diretiva movida para o topo do arquivo

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, ShoppingCart, Package, Users, Tag, Settings, LogOut, Search, Bell, UserCircle
} from 'lucide-react'; // Importar ícones reais

// Hook para obter o pathname (necessário para link ativo)
import { usePathname } from 'next/navigation';

// Componente Sidebar Minimalista
function Sidebar() {
  const pathname = usePathname(); // Obter o path atual

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Produtos', href: '/admin/products', icon: Package },
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Clientes', href: '/admin/customers', icon: Users },
    { name: 'Categorias', href: '/admin/categories', icon: Tag },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      {/* Logo ou Ícone Principal */}
      <div className="h-12 flex items-center justify-center mb-6">
        {/* Substitua pelo seu logo/ícone real */}
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-grow flex flex-col items-center space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name} // Tooltip com o nome
              className={`p-3 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              <Icon size={24} />
            </Link>
          );
        })}
      </nav>

      {/* Ícone de Sair na Base */}
      <div className="mt-auto">
        <button
          title="Sair"
          className="p-3 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
        >
          <LogOut size={24} />
        </button>
      </div>
    </aside>
  );
}

// Componente Header (mantido similar, talvez ajustar padding)
function Header() {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 border-b border-gray-200">
      <div>
        {/* Pode ser dinâmico baseado na rota */}
        <h1 className="text-lg font-semibold text-gray-900">Visão Geral</h1>
      </div>
      <div className="flex items-center space-x-5">
        <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell size={22} />
          {/* Badge de notificação (opcional) */}
          <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <UserCircle size={28} />
        </button>
      </div>
    </header>
  );
}

// Layout Principal Atualizado
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   // 'use client' foi movido para o topo do arquivo

  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {/* Ajustado bg e padding */}
        <main className="bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 