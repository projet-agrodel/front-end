'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, User, Settings, Shield } from 'lucide-react';
import CartIcon from './CartIcon';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sessionStatus, setSessionStatus] = useState<'valid' | 'invalid'>('valid');

  useEffect(() => {
    // Verificar se a sessão é válida quando o componente monta
    const checkSession = async () => {
      if (session?.accessToken) {
        try {
          const response = await fetch(`${API_URL}/api/user/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`,
            },
          });
          
          if (response.status === 401 || response.status === 403) {
            // Sessão inválida, atualizar o estado
            setSessionStatus('invalid');
          } else {
            setSessionStatus('valid');
          }
        } catch (error) {
          console.error('Erro ao verificar sessão:', error);
          setSessionStatus('invalid');
        }
      }
    };

    if (status === 'authenticated') {
      checkSession();
    } else if (status === 'unauthenticated') {
      setSessionStatus('valid'); // Resetar o status quando deslogado
    }
    
    // Verificar se há uma flag de sessão inválida no sessionStorage
    const sessionInvalid = window.sessionStorage.getItem('session_invalid');
    if (sessionInvalid === 'true') {
      setSessionStatus('invalid');
      window.sessionStorage.removeItem('session_invalid');
    }

    // Adicionar listener para o evento de sessão inválida
    const handleSessionInvalid = () => {
      setSessionStatus('invalid');
    };
    
    window.addEventListener('session_invalid', handleSessionInvalid);
    
    return () => {
      window.removeEventListener('session_invalid', handleSessionInvalid);
    };
  }, [session, status]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setSessionStatus('valid');
    router.push('/auth/login');
  };

  // Mostrar interface de usuário não autenticado se a sessão for inválida
  const showAuthenticatedUI = status === 'authenticated' && sessionStatus === 'valid';
  const isAdminUser = session?.user?.role === 'admin'

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

              {showAuthenticatedUI && isAdminUser && (
                <Link 
                  href='/admin'
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname == '/admin' 
                      ? 'bg-green-500 text-white' 
                      : 'text-gray-700 hover:bg-green-100'
                  }`}
                >
                  Admin
                </Link>
              )}

              
              {showAuthenticatedUI && (
                <Link 
                  href={`${isAdminUser ? '/admin/tickets': '/tickets'}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith('/admin/tickets') 
                      ? 'bg-green-500 text-white' 
                      : 'text-gray-700 hover:bg-green-100'
                  }`}
                >
                  Tickets
                </Link>
              )}  
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <CartIcon />

            {showAuthenticatedUI ? (
              <DropdownMenu >
                <DropdownMenuTrigger className='z-[9999]' asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                      <AvatarFallback>{session.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-[9999999]" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  {session.user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Painel Admin</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/profile/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 