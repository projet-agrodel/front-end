'use client';

import React, { useState } from 'react';
import {
    Users, Search, AlertTriangle, Eye, User as UserIcon, Mail, Phone, Calendar, Filter, Loader2, RotateCcw, Lock, Unlock
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminUsers, updateUserStatus } from '../../../services/userService';
import { User } from '../../../services/interfaces/interfaces';
import Link from 'next/link';
import { getAuthTokenForAdmin } from '@/utils/authAdmin';
import { toast, Toaster } from 'sonner';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    userName: string;
    action: 'bloquear' | 'desbloquear' | null;
}

// Componente do Modal de Confirmação
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading, userName, action }: ModalProps) => {
    if (!isOpen) return null;

    const actionText = action === 'bloquear' ? 'bloquear' : 'desbloquear';
    const ActionIcon = action === 'bloquear' ? Lock : Unlock;
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${action === 'bloquear' ? 'bg-red-100' : 'bg-green-100'}`}>
                        <ActionIcon size={32} className={action === 'bloquear' ? 'text-red-600' : 'text-green-600'} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Confirmar {actionText.charAt(0).toUpperCase() + actionText.slice(1)}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Você tem certeza que deseja {actionText} o cliente <strong>{userName}</strong>?
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-6 py-2.5 rounded-lg text-white transition-colors disabled:opacity-50 flex items-center ${
                                action === 'bloquear' 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {isLoading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}
                            Sim, {actionText}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

interface ModalState {
    isOpen: boolean;
    user: User | null;
    action: 'bloquear' | 'desbloquear' | null;
}

export default function AdminCustomersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<'admin' | 'user' | ''>('');
    const [modalState, setModalState] = useState<ModalState>({ isOpen: false, user: null, action: null });
    
    const queryClient = useQueryClient();

    // Debounce para o termo de busca
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Query para buscar os usuários
    const { data: users, isLoading, error } = useQuery<User[]>({
        queryKey: ['users', debouncedSearchTerm, selectedType],
        queryFn: () => getAdminUsers({
            query: debouncedSearchTerm,
            type: selectedType,
        }),
    });

    const mutation = useMutation({
        mutationFn: async ({ userId, status }: { userId: string, status: 'ativo' | 'bloqueado' }) => {
            const token = await getAuthTokenForAdmin();
            if (!token) throw new Error("Token de administrador não encontrado.");
            return updateUserStatus(userId, status, token);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(data.message || 'Status do usuário atualizado com sucesso!');
            closeModal();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Ocorreu um erro ao atualizar o status.');
        }
    });

    const openModal = (user: User, action: 'bloquear' | 'desbloquear') => {
        setModalState({ isOpen: true, user, action });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, user: null, action: null });
    };

    const handleConfirmAction = () => {
        const { user, action } = modalState;
        if (user && action) {
            const newStatus = action === 'bloquear' ? 'bloqueado' : 'ativo';
            mutation.mutate({ userId: String(user.id), status: newStatus });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (e) {
            console.error("Erro ao formatar data:", dateString, e);
            return 'Data inválida';
        }
    };
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(event.target.value as 'admin' | 'user' | '');
    };

    if (isLoading && !users) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-green-600" />
                <p className="ml-4 text-lg text-gray-600">Carregando clientes...</p>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <Toaster richColors position="top-right" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="container mx-auto p-4 md:p-6 lg:p-8"
            >
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-green-600 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Clientes</h1>
                        </div>
                    </div>
                </header>

                <div className="mb-6 bg-white p-5 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="relative">
                            <label htmlFor="search-users" className="sr-only">Pesquisar Clientes</label>
                            <input
                                id="search-users"
                                type="text"
                                placeholder="Pesquisar por Nome, Email, Telefone..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                disabled={isLoading}
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow shadow-sm hover:shadow-md text-sm disabled:bg-gray-100"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <label htmlFor="type-filter" className="sr-only">Filtrar por Tipo</label>
                            <select
                                id="type-filter"
                                value={selectedType}
                                onChange={handleTypeChange}
                                disabled={isLoading}
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow shadow-sm hover:shadow-md text-sm appearance-none bg-white disabled:bg-gray-100"
                            >
                                <option value="">Todos os Tipos</option>
                                <option value="admin">Administradores</option>
                                <option value="user">Clientes</option>
                            </select>
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                
                {isLoading && (
                    <div className="flex justify-center items-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                        <p className="ml-2 text-gray-500">Atualizando lista de clientes...</p>
                    </div>
                )}

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-md"
                    >
                        <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                            <div>
                                <p className="font-semibold">Erro ao Carregar Clientes</p>
                                <p className="text-sm">{error instanceof Error ? error.message : "Erro desconhecido"}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {!isLoading && !error && (!users || users.length === 0) && (
                    <div className="text-center py-10 px-6 bg-white shadow-xl rounded-lg">
                        <Users size={56} className="mx-auto text-gray-400 mb-5" />
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                            {debouncedSearchTerm || selectedType ? "Nenhum cliente encontrado" : "Nenhum cliente registrado"}
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            {debouncedSearchTerm || selectedType 
                                ? "Sua busca ou filtro não retornou resultados. Tente refinar seus termos ou limpar os filtros."
                                : "Parece que ainda não há clientes registrados no sistema."}
                        </p>
                        {(debouncedSearchTerm || selectedType) && (
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedType(''); }}
                                className="flex items-center mx-auto bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow hover:shadow-md transition-all duration-150 ease-in-out disabled:opacity-50"
                                disabled={isLoading}
                            >
                                <RotateCcw size={18} className="mr-2" />
                                Limpar Busca/Filtros
                            </button>
                        )}
                    </div>
                )}

                {users && users.length > 0 && (
                    <motion.div 
                        className="bg-white shadow-xl rounded-lg overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contato</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cadastro</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user: User) => (
                                        <motion.tr 
                                            key={user.id} 
                                            className="hover:bg-gray-50 transition-colors duration-150 even:bg-white odd:bg-gray-50/50"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full mr-3" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                            <UserIcon className="h-6 w-6 text-gray-500" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                                                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                                        <Phone className="h-4 w-4 mr-2" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">
                                                 <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.status === 'ativo' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.status === 'ativo' ? 'Ativo' : 'Bloqueado'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.type === 'admin' 
                                                        ? 'bg-purple-100 text-purple-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.type === 'admin' ? 'Administrador' : 'Cliente'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    {formatDate(user.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 align-top text-center">
                                                <Link href={`/admin/customers/${user.id}`}>
                                                    <motion.button 
                                                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full transition-all duration-150 disabled:opacity-50"
                                                        title="Ver Detalhes"
                                                        whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}
                                                        disabled={isLoading || mutation.isPending}
                                                    >
                                                        <Eye size={18} />
                                                    </motion.button>
                                                </Link>
                                                {user.status === 'ativo' ? (
                                                     <motion.button 
                                                        onClick={() => openModal(user, 'bloquear')}
                                                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-all duration-150 disabled:opacity-50"
                                                        title="Bloquear Cliente"
                                                        whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}
                                                        disabled={isLoading || mutation.isPending}
                                                    >
                                                        <Lock size={18} />
                                                    </motion.button>
                                                ) : (
                                                     <motion.button 
                                                        onClick={() => openModal(user, 'desbloquear')}
                                                        className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-full transition-all duration-150 disabled:opacity-50"
                                                        title="Desbloquear Cliente"
                                                        whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}
                                                        disabled={isLoading || mutation.isPending}
                                                    >
                                                        <Unlock size={18} />
                                                    </motion.button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </motion.div>
            <ConfirmationModal 
                isOpen={modalState.isOpen}
                onClose={closeModal}
                onConfirm={handleConfirmAction}
                isLoading={mutation.isPending}
                userName={modalState.user?.name || ''}
                action={modalState.action}
            />
        </AnimatePresence>
    );
} 