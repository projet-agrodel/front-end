'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="font-bold text-xl text-green-600">Agrodel</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/' 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-700 hover:bg-green-100'
                }`}
              >
                Início
              </Link>
              
              <Link 
                href="/Produtos" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith('/Produtos') 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-700 hover:bg-green-100'
                }`}
              >
                Produtos
              </Link>
            </div>
          </div>
          
          <div className="md:hidden">
            {/* Menu móvel seria implementado aqui */}
            <button className="text-gray-700 hover:text-green-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 