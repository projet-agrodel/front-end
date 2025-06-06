'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAdminUserById } from '../../../../services/userService';
import { User } from '../../../../services/interfaces/interfaces';
import { 
    User as UserIcon, Mail, Phone, Calendar, MapPin, Package, 
    AlertTriangle, Loader2, ArrowLeft, Edit, Trash2, 
    CreditCard, ShoppingBag, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

export default function CustomerDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const { data: user, isLoading, error } = useQuery<User>({
        queryKey: ['user', params.id],
        queryFn: () => getAdminUserById(params.id as string)
    });

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

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-green-600" />
                <p className="ml-4 text-lg text-gray-600">Carregando detalhes do cliente...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-md"
                >
                    <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                        <div>
                            <p className="font-semibold">Erro ao Carregar Cliente</p>
                            <p className="text-sm">{error instanceof Error ? error.message : "Erro desconhecido"}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-md"
                >
                    <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                        <div>
                            <p className="font-semibold">Cliente Não Encontrado</p>
                            <p className="text-sm">O cliente solicitado não foi encontrado no sistema.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="container mx-auto p-4 md:p-6 lg:p-8"
            >
                <div className="mb-6">
                    <Link href="/admin/customers">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Voltar para Lista de Clientes
                        </motion.button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informações do Cliente */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full mr-4" />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                            <UserIcon className="h-8 w-8 text-gray-500" />
                                        </div>
                                    )}
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                        <p className="text-gray-600">ID: {user.id}</p>
                                    </div>
                                </div>                             
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="h-5 w-5 mr-3" />
                                        <span>{user.email}</span>
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center text-gray-600">
                                            <Phone className="h-5 w-5 mr-3" />
                                            <span>{user.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-5 w-5 mr-3" />
                                        <span>Cadastrado em {formatDate(user.created_at)}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <UserIcon className="h-5 w-5 mr-3" />
                                        <span className="capitalize">{user.type === 'admin' ? 'Administrador' : 'Cliente'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pedidos Recentes */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pedidos Recentes</h2>
                            <div className="space-y-4">
                                {/* Aqui você pode adicionar a lista de pedidos recentes */}
                                <p className="text-gray-500 text-center py-4">Nenhum pedido encontrado</p>
                            </div>
                        </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estatísticas</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <ShoppingBag className="h-5 w-5 text-green-600 mr-3" />
                                        <span className="text-gray-600">Total de Pedidos</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">0</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                                        <span className="text-gray-600">Valor Total</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">R$ 0,00</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                                        <span className="text-gray-600">Pedidos Pendentes</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">0</span>
                                </div>
                            </div>
                        </div>

                        {/* Status do Cliente */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status do Cliente</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                                        <span className="text-gray-600">Pedidos Concluídos</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">0</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <XCircle className="h-5 w-5 text-red-600 mr-3" />
                                        <span className="text-gray-600">Pedidos Cancelados</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
} 