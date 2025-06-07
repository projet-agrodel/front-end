'use client';

import React, { useState, useMemo } from 'react';
import {
    ShoppingCart, Search, AlertTriangle, Eye, Package, DollarSign, TrendingUp, Filter, Loader2, RotateCcw, CheckCircle, XCircle,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getAdminOrders,
    type OrderStatus,
} from '../../../services/orderService';
import { Pedido } from '../../../services/interfaces/interfaces';

const ITEMS_PER_PAGE = 10;

const statusOptions: OrderStatus[] = ['Em Processamento', 'Não autorizado', 'Concluido'];

const statusColors: Record<OrderStatus, string> = {
    'Em Processamento': 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    'Não autorizado': 'bg-red-100 text-red-800 ring-red-200',
    'Concluido': 'bg-green-100 text-green-800 ring-green-200',
};

const statusIcons: Record<OrderStatus, React.JSX.Element> = {
    'Em Processamento': <Loader2 size={14} className="mr-1.5 animate-spin" />,
    'Não autorizado': <XCircle size={14} className="mr-1.5" />,
    'Concluido': <CheckCircle size={14} className="mr-1.5" />,
};

export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
    const [currentPage, setCurrentPage] = useState(1);
    const queryClient = useQueryClient();

    // Debounce para o termo de busca
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Query para buscar os pedidos
    const { data, isLoading, error } = useQuery<Pedido[]>({
        queryKey: ['orders', currentPage, debouncedSearchTerm, selectedStatus],
        queryFn: () => getAdminOrders({
            page: currentPage,
            search: debouncedSearchTerm,
            status: selectedStatus as OrderStatus,
        })
    });

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
        setCurrentPage(1);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value as OrderStatus | '');
        setCurrentPage(1);
    };

    const handleViewDetails = (order: Pedido) => {
        console.log("Ver detalhes (futuramente com modal e getAdminOrderById):", order);
    };

    const SummaryCard = ({ title, value, icon, trend, isLoadingCard }: { title: string, value: string, icon: React.JSX.Element, trend?: string, isLoadingCard?: boolean }) => (
        <motion.div 
            className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between min-h-[120px]"
            whileHover={{ y: -5 }}
        >
            <div className="flex items-center text-gray-500 mb-3">
                {icon}
                <span className="text-sm font-medium ml-2">{title}</span>
            </div>
            {isLoadingCard ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4 mt-1"></div>
            ) : (
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            )}
            {trend && !isLoadingCard && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
        </motion.div>
    );

    const summaryData = useMemo(() => {
        if (!data) return {
            totalOrders: { value: '0', trend: "Total no sistema" },
            pendingOrders: { value: '0', trend: "" },
            totalRevenue: { value: formatCurrency(0), trend: "" },
            avgOrderValue: { value: formatCurrency(0), trend: "" },
        };

        const pendingOnPage = data.filter((o: Pedido) => o.status === 'Em Processamento').length;
        const revenueOnPage = data.filter((o: Pedido) => o.status === 'Concluido').reduce((sum: number, o: Pedido) => sum + o.amount, 0);
        const relevantOrdersForAvgOnPage = data.filter((o: Pedido) => o.status === 'Concluido');
        const avgValueOnPage = relevantOrdersForAvgOnPage.length > 0 ? revenueOnPage / relevantOrdersForAvgOnPage.length : 0;

        return {
            totalOrders: { value: String(data.length), trend: "Total no sistema" },
            pendingOrders: { value: String(pendingOnPage), trend: isLoading ? "" : `${pendingOnPage} nesta página` },
            totalRevenue: { value: formatCurrency(revenueOnPage), trend: isLoading ? "" : "Receita (pág. atual)" },
            avgOrderValue: { value: formatCurrency(isNaN(avgValueOnPage) ? 0 : avgValueOnPage), trend: isLoading ? "" : "Ticket Médio (pág. atual)" },
        };
    }, [data, isLoading]);

    const paginatedOrders = useMemo(() => {
        if (!data) return [];
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return data.slice(start, start + ITEMS_PER_PAGE);
    }, [data, currentPage]);

    if (isLoading && !data) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-green-600" />
                <p className="ml-4 text-lg text-gray-600">Carregando pedidos...</p>
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
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center">
                            <ShoppingCart className="h-8 w-8 text-green-600 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Pedidos</h1>
                        </div>
                    </div>
                </header>

                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }}
                >
                    <SummaryCard title="Total de Pedidos" value={summaryData.totalOrders.value} icon={<Package size={20} />} trend={summaryData.totalOrders.trend} isLoadingCard={isLoading} />
                    <SummaryCard title="Pendentes (na página)" value={summaryData.pendingOrders.value} icon={<Loader2 size={20} />} trend={summaryData.pendingOrders.trend} isLoadingCard={isLoading} />
                    <SummaryCard title="Receita (pág. atual)" value={summaryData.totalRevenue.value} icon={<DollarSign size={20} />} trend={summaryData.totalRevenue.trend} isLoadingCard={isLoading} />
                    <SummaryCard title="Ticket Médio (pág. atual)" value={summaryData.avgOrderValue.value} icon={<TrendingUp size={20} />} trend={summaryData.avgOrderValue.trend} isLoadingCard={isLoading} />
                </motion.div>

                <div className="mb-6 bg-white p-5 rounded-xl shadow-lg">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="relative">
                             <label htmlFor="search-orders" className="sr-only">Pesquisar Pedidos</label>
                            <input
                                id="search-orders"
                                type="text"
                                placeholder="Pesquisar por Nº Pedido, Cliente, Email, Valor..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                disabled={isLoading}
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow shadow-sm hover:shadow-md text-sm disabled:bg-gray-100"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <label htmlFor="status-filter" className="sr-only">Filtrar por Status</label>
                            <select
                                id="status-filter"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                disabled={isLoading}
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow shadow-sm hover:shadow-md text-sm appearance-none bg-white disabled:bg-gray-100"
                            >
                                <option value="">Todos os Status</option>
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                
                {isLoading && (
                    <div className="flex justify-center items-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                        <p className="ml-2 text-gray-500">Atualizando lista de pedidos...</p>
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
                                <p className="font-semibold">Erro ao Carregar Pedidos</p>
                                <p className="text-sm">{error instanceof Error ? error.message : "Erro desconhecido"}</p>
                                <button 
                                    onClick={() => queryClient.invalidateQueries({ queryKey: ['orders'] })} 
                                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline"
                                >
                                    Tentar Novamente (Limpar Filtros)
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {!isLoading && !error && (!data || data.length === 0) && (
                     <div className="text-center py-10 px-6 bg-white shadow-xl rounded-lg">
                        <ShoppingCart size={56} className="mx-auto text-gray-400 mb-5" />
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                            {debouncedSearchTerm || selectedStatus ? "Nenhum pedido encontrado" : "Nenhum pedido registrado"}
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            {debouncedSearchTerm || selectedStatus 
                                ? "Sua busca ou filtro não retornou resultados. Tente refinar seus termos ou limpar os filtros."
                                : "Parece que ainda não há pedidos registrados no sistema."}
                        </p>
                         {(debouncedSearchTerm || selectedStatus) && (
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedStatus(''); setCurrentPage(1); }}
                                className="flex items-center mx-auto bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow hover:shadow-md transition-all duration-150 ease-in-out disabled:opacity-50"
                                disabled={isLoading}
                            >
                                <RotateCcw size={18} className="mr-2" />
                                Limpar Busca/Filtros
                            </button>
                        )}
                    </div>
                )}

                {data && data.length > 0 && (
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
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nº Pedido</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Itens</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor Total</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedOrders.map((order: Pedido) => (
                                        <motion.tr 
                                            key={order.id} 
                                            className="hover:bg-gray-50 transition-colors duration-150 even:bg-white odd:bg-gray-50/50"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap align-top">
                                                <div className="text-sm font-medium text-green-600 hover:text-green-700 cursor-pointer" onClick={() => handleViewDetails(order)}>#{order.id}</div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="text-sm font-semibold text-gray-900">{order.user?.name}</div>
                                                <div className="text-xs text-gray-500">{order.user?.email}</div>
                                                {order.user?.phone && <div className="text-xs text-gray-500">{order.user.phone}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">{formatDate(order.created_at)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top text-center">{order.items?.length || 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 align-top">{formatCurrency(order.amount)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap align-top">
                                                <span className={`px-3 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ring-1 ${statusColors[order.status as OrderStatus]}`}>
                                                    {statusIcons[order.status as OrderStatus] || <Loader2 size={14} className="mr-1.5 animate-spin" />}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 align-top text-center">
                                                <motion.button 
                                                    onClick={() => handleViewDetails(order)} 
                                                    className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full transition-all duration-150 disabled:opacity-50"
                                                    title="Ver Detalhes"
                                                    whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}
                                                    disabled={isLoading}
                                                >
                                                    <Eye size={18} />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                         {/* Paginação */} 
                        {Math.ceil((data.length || 0) / ITEMS_PER_PAGE) > 0 && (
                            <div className="py-4 px-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <p className="text-sm text-gray-700">
                                    Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{Math.ceil((data.length || 0) / ITEMS_PER_PAGE)}</span> (<span className="font-semibold">{data.length}</span> pedidos)
                                </p>
                                <div className="flex items-center space-x-1.5">
                                    <motion.button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1 || isLoading}
                                        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Primeira Página"
                                        whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                                    >
                                        <ChevronsLeft size={20} />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1 || isLoading}
                                        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Página Anterior"
                                        whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                                    >
                                        <ChevronLeft size={20} />
                                    </motion.button>
                                    <span className="px-2 text-sm">Página {currentPage}</span>
                                    <motion.button
                                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil((data.length || 0) / ITEMS_PER_PAGE), prev + 1))}
                                        disabled={currentPage === Math.ceil((data.length || 0) / ITEMS_PER_PAGE) || isLoading}
                                        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Próxima Página"
                                        whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                                    >
                                        <ChevronRight size={20} />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setCurrentPage(Math.ceil((data.length || 0) / ITEMS_PER_PAGE))}
                                        disabled={currentPage === Math.ceil((data.length || 0) / ITEMS_PER_PAGE) || isLoading}
                                        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Última Página"
                                        whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                                    >
                                        <ChevronsRight size={20} />
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
} 