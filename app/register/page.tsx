'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import PasswordCriteriaPopup from '../_components/register/PasswordCriteriaPopup';
import { User, Mail, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    uppercase: false,
    number: false,
  });
  const [allCriteriaMet, setAllCriteriaMet] = useState(false);

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const uppercase = /[A-Z]/.test(pass);
    const number = /[0-9]/.test(pass);
    setPasswordCriteria({ minLength, uppercase, number });
    return minLength && uppercase && number;
  };

  useEffect(() => {
    setAllCriteriaMet(validatePassword(password));
  }, [password]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!allCriteriaMet) {
        setError('A senha não atende a todos os critérios.');
        return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!name || !email) {
        setError('Nome e email são obrigatórios.');
        return;
    }
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const existingUser = JSON.parse(storedUser);
        if (existingUser.email === email) {
            setError('Este email já está registrado. Tente fazer login.');
            return;
        }
    }

    const newUser = { name, email, password };
    localStorage.setItem('user', JSON.stringify(newUser));

    console.log('Registration successful for:', email);
    setSuccess('Registro realizado com sucesso! Redirecionando para login...');

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            Crie sua conta
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-2 text-center text-sm text-gray-600"
          >
            Registre-se para começar a comprar
          </motion.p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-md"
            >
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-green-500 text-sm bg-green-50 p-3 rounded-md"
            >
              <Check className="h-5 w-5" />
              <p>{success}</p>
            </motion.div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="name" className="sr-only">
                Nome Completo
              </label>
              <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
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
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
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
              <AnimatePresence>
                {isPasswordFocused && <PasswordCriteriaPopup criteria={passwordCriteria} />}
              </AnimatePresence>
            </div>
            
            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">
                Confirmar Senha
              </label>
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
                Já tem uma conta? Faça login
              </Link>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!allCriteriaMet || !!success || password !== confirmPassword}
            >
              Registrar
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage; 