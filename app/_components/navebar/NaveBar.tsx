'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem('isLoggedIn');
    const storedUserName = sessionStorage.getItem('userName');
    setIsLoggedIn(loggedInStatus === 'true');
    if (loggedInStatus === 'true' && storedUserName) {
      setUserName(storedUserName);
    }
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/'); 
    router.refresh();
  };

  return (
    <nav className="bg-white shadow-md">
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
                  pathname.startsWith('/Produtos') 
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
                <span className="text-gray-700 text-sm">Olá, {userName}!</span>
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
                  href="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/login'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-green-100'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/register'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-green-100'
                  }`}
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            {/* Mobile Auth Links/Button */} 
             {isLoggedIn ? (
               <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-red-600"
                >
                  Sair
                </button>
             ) : (
                <Link
                  href="/login"
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