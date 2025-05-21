'use client'; // Diretiva movida para o topo do arquivo

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, ShoppingCart, Package, Users, Tag, Settings, LogOut, Bell, UserCircle,
  MessageSquare
} from 'lucide-react'; // Importar ícones reais. BarChart2 removido.
import AdvancedAnalyticsButton from './_components/AdvancedAnalyticsButton'; // Importar o botão

// Hook para obter o pathname (necessário para link ativo)
import { usePathname } from 'next/navigation';

// Componente Sidebar Expansível
function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar expansão

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Produtos', href: '/admin/products', icon: Package },
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Clientes', href: '/admin/customers', icon: Users },
    { name: 'Tickets', href: '/admin/tickets', icon: MessageSquare },
    { name: 'Categorias', href: '/admin/categories', icon: Tag },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ];

  return (
      <div className="flex h-full w-20">
        <aside 
          className={`z-50 fixed min-h-127 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4 transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'w-64 items-start' : 'w-20 items-center'}`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
        {/* Logo ou Ícone Principal (ajustar padding se expandido) */}
        <div className={`h-12 px-4 flex items-center mb-6 ${isExpanded ? '' : 'w-full'}`}>
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
            A
          </div>
          {isExpanded && <span className="ml-3 font-semibold text-lg text-gray-800">Agrodel</span>}
        </div>

        {/* Navegação Principal */}
        <nav className="flex-grow flex flex-col space-y-2 w-full px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isExpanded ? '' : item.name} // Mostrar tooltip apenas quando colapsado
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-150 ease-in-out ${isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                  }`}
              >
                <Icon size={24} className="flex-shrink-0" />
                {isExpanded && <span className="ml-4 text-sm font-medium whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Ícone/Botão de Sair na Base */}
        <div className="mt-auto w-full px-2 pb-2">
          <button
            title="Sair"
            className={`flex items-center px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-150 ease-in-out w-full`}
          >
            <LogOut size={24} className="flex-shrink-0" />
            {isExpanded && <span className="ml-4 text-sm font-medium whitespace-nowrap">Sair</span>}
          </button>
        </div>
      </aside>
    </div>
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
        <AdvancedAnalyticsButton />
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
    <div className="flex bg-gray-100 min-h-full">
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