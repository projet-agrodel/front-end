'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const ChangePasswordTab: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Função para validar a nova senha
  const validateNewPassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'A nova senha deve ter pelo menos 8 caracteres.' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'A nova senha deve conter pelo menos uma letra maiúscula.' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'A nova senha deve conter pelo menos um número.' };
    }
    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    setIsLoading(true);

    if (newPassword !== confirmNewPassword) {
      setMessage('A nova senha e a confirmação não coincidem.');
      setIsLoading(false);
      return;
    }

    // Validar a nova senha antes de prosseguir
    const passwordValidation = validateNewPassword(newPassword);
    if (!passwordValidation.isValid) {
      setMessage(passwordValidation.message || 'A nova senha não atende aos critérios de segurança.');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Você não está autenticado. Faça login novamente.');
        setIsLoading(false);
        // Idealmente, redirecionar para login ou mostrar um erro mais proeminente
        return;
      }

      const response = await fetch(`${API_URL}/user/change-password`, { // Endpoint a ser criado no backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao alterar a senha.');
      }

      setMessage(data.message || 'Senha alterada com sucesso!');
      setIsSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      const err = error as Error;
      setMessage(err.message || 'Ocorreu um erro ao tentar alterar sua senha.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Alterar Senha</h3>
      
      {message && (
        <div className={`p-3 rounded-md mb-4 text-sm ${isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Senha Atual */}
        <div className="relative">
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha Atual
          </label>
          <Lock className="absolute top-9 left-3 h-5 w-5 text-gray-400" />
          <input
            id="current-password"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            required
            className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Sua senha atual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute top-9 right-0 pr-3 flex items-center"
            aria-label={showCurrentPassword ? "Esconder senha" : "Mostrar senha"}
          >
            {showCurrentPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
          </button>
        </div>

        {/* Nova Senha */}
        <div className="relative">
          <label htmlFor="new-password-change" className="block text-sm font-medium text-gray-700 mb-1">
            Nova Senha
          </label>
          <Lock className="absolute top-9 left-3 h-5 w-5 text-gray-400" />
          <input
            id="new-password-change"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            required
            className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Sua nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute top-9 right-0 pr-3 flex items-center"
            aria-label={showNewPassword ? "Esconder senha" : "Mostrar senha"}
          >
            {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
          </button>
        </div>

        {/* Confirmar Nova Senha */}
        <div className="relative">
          <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Nova Senha
          </label>
          <Lock className="absolute top-9 left-3 h-5 w-5 text-gray-400" />
          <input
            id="confirm-new-password"
            name="confirmNewPassword"
            type={showConfirmNewPassword ? "text" : "password"}
            required
            className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Confirme sua nova senha"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="button"
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            className="absolute top-9 right-0 pr-3 flex items-center"
            aria-label={showConfirmNewPassword ? "Esconder senha" : "Mostrar senha"}
          >
            {showConfirmNewPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
          </button>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>
        </div>
      </form>
    </div>
  );
}; 