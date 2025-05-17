'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import ForgotPasswordPopup from '../_components/ForgotPasswordPopup';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email ou senha inválidos.');
      }

      if (data.access_token) {
        console.log('Login successful for:', email);
        localStorage.setItem('token', data.access_token);
        router.push('/');
      } else {
        setError('Token de acesso não recebido.');
      }

    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro durante o login.';
      setError(errorMessage);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOpenForgotPasswordPopup = () => {
    setShowForgotPasswordPopup(true);
  };

  const handleCloseForgotPasswordPopup = () => {
    setShowForgotPasswordPopup(false);
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10"
      >
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-center text-3xl font-extrabold text-gray-900"
          >
            Faça login na sua conta
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-2 text-center text-sm text-gray-600"
          >
            Acesse para continuar comprando
          </motion.p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md"
            >
              {error}
            </motion.p>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/auth/register" className="font-medium text-green-600 hover:text-green-500">
                Não tem uma conta? Registre-se
              </Link>
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={handleOpenForgotPasswordPopup}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Esqueci minha senha
              </button>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              Entrar
            </motion.button>
          </div>
        </form>
      </motion.div>

      {showForgotPasswordPopup && (
        <ForgotPasswordPopup 
          onClose={handleCloseForgotPasswordPopup} 
        />
      )}
    </div>
  );
};

export default LoginPage; 