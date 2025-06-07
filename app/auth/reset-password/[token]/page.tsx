'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ResetPasswordPage = () => {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string | undefined;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('Token de redefinição inválido ou ausente.');
      // Opcional: redirecionar ou mostrar um estado de erro mais proeminente
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage('Token não encontrado. Não é possível redefinir a senha.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      setIsSuccess(false);
      return;
    }
    if (newPassword.length < 6) { // Exemplo de validação simples de senha
        setMessage('A nova senha deve ter pelo menos 6 caracteres.');
        setIsSuccess(false);
        return;
    }

    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_password: newPassword, confirm_password: confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao redefinir a senha.');
      }

      setMessage(data.message || 'Senha redefinida com sucesso! Você será redirecionado para o login.');
      setIsSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);

    } catch (error) {
      const err = error as Error;
      setMessage(err.message || 'Ocorreu um erro ao tentar redefinir sua senha.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !message) {
    return (
        <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <p className="text-red-500">Carregando token ou token inválido...</p>
        </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Redefinir sua Senha
          </h2>
        </div>

        {message && (
          <div className={`p-3 rounded-md text-sm ${isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {!isSuccess && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="new-password" className="sr-only">
                  Nova Senha
                </label>
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  id="new-password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Nova Senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showNewPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              <div className="relative">
                <label htmlFor="confirm-password" className="sr-only">
                  Confirmar Nova Senha
                </label>
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Confirmar Nova Senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !token}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>
            </div>
          </form>
        )}

        {isSuccess && (
             <div className="mt-6 text-center">
                <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-500">
                    Ir para Login
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage; 