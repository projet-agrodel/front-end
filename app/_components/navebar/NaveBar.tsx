'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon, UserCircle2 } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const { totalItems } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    
    setIsLoggedIn(!!token);
    if (token && storedUserName) {
      setUserName(storedUserName);
    } else if (token && !storedUserName) {
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'userName') {
        const currentToken = localStorage.getItem('token');
        const currentUserName = localStorage.getItem('userName');
        setIsLoggedIn(!!currentToken);
        setUserName(currentUserName || '');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <nav className="bg-white shadow-md z-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center mt-4">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image 
                src="/images/agrodel_logo.png"
                alt="Logo Agrodel"
                width={100}
                height={50}
                className="h-20 w-auto object-contain transition-transform duration-300 ease-in-out hover:scale-110"
                priority
                unoptimized
              />
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
                href='/produtos'
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith('/produtos') 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-700 hover:bg-green-100'
                }`}
              >
                Produtos
              </Link>
            </div>
          </div>
          
          {/* Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="flex items-center text-gray-700 hover:text-green-600 transition-colors duration-200">
                  <UserCircle2 className="h-6 w-6 mr-2" />
                  <span className="text-sm font-medium">{userName || 'Meu Perfil'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-red-600"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/auth/login'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-green-100'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/auth/register'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-green-100'
                  }`}
                >
                  Registrar
                </Link>
              </>
            )}

            {/* Ícone do Carrinho */}
            <Link href="/carrinho" className="relative text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            {/* Ícone do Carrinho (Mobile) */}
            <Link href="/carrinho" className="relative text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 mr-2">
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Auth Links/Button */} 
             {isLoggedIn ? (
              <div className="flex items-center">
                <Link href="/profile" className="p-2 text-gray-700 hover:text-green-600">
                  <UserCircle2 className="h-6 w-6" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-red-600"
                >
                  Sair
                </button>
              </div>
             ) : (
                <Link
                  href="/auth/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-green-100"
                >
                  Login
                </Link>
             )} 
            {/* Menu móvel (placeholder) */}
            {/* <button className="ml-4 text-gray-700 hover:text-green-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 