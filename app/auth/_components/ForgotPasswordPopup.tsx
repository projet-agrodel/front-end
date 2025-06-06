'use client';

import React, { useState } from 'react';

interface ForgotPasswordPopupProps {
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ForgotPasswordPopup: React.FC<ForgotPasswordPopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocorreu um erro. Tente novamente.');
      }

      setMessage(data.message || 'Link de redefinição enviado com sucesso!');
      setIsSuccess(true);
      setEmail(''); // Limpar campo de email após sucesso
      // Opcional: fechar o popup após um tempo ou deixar o usuário fechar
      // setTimeout(() => onClose(), 5000); 

    } catch (error) {
        const err = error as Error;
        setMessage(err.message || 'Falha ao enviar o link de redefinição.');
        setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md relative">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-gray-100 rounded-full p-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Redefinir Senha</h2>
          <p className="text-gray-600">
            Digite seu email para enviarmos um link de redefinição.
          </p>
        </div>

        {message && (
          <div className={`p-3 rounded-md mb-4 text-sm ${isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {!isSuccess && (
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="email-forgot" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço de Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                </div>
                <input
                    type="email"
                    id="email-forgot"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                    placeholder="seu@email.com"
                />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
            >
                {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
            </button>
            </form>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Lembrou sua senha?{' '}
            <button
              onClick={onClose}
              className="font-medium text-green-600 hover:text-green-500 hover:underline"
            >
              Voltar para o Login
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPopup; 