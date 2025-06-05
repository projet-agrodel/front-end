'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    ShoppingCart, Search, AlertTriangle, Eye, Edit, Trash2, Package, Users, DollarSign, TrendingUp, Filter, Loader2, RotateCcw, Truck, CheckCircle, XCircle,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    getAdminOrders,
    // getAdminOrderById, // Para detalhes futuros
    updateAdminOrderStatus, // Para edição de status futura
    type Order, type OrderStatus, type PaginatedOrdersResponse
} from '../../../services/orderService'; // Ajuste o caminho se necessário

// Interfaces para os dados de Pedido
interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl?: string;
}

interface CustomerInfo {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

const ITEMS_PER_PAGE = 10;

const statusOptions: OrderStatus[] = ['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado'];

const statusColors: Record<OrderStatus, string> = {
    'Pendente': 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    'Processando': 'bg-blue-100 text-blue-800 ring-blue-200',
    'Enviado': 'bg-indigo-100 text-indigo-800 ring-indigo-200',
    'Entregue': 'bg-green-100 text-green-800 ring-green-200',
    'Cancelado': 'bg-red-100 text-red-800 ring-red-200',
};

const statusIcons: Record<OrderStatus, React.JSX.Element> = {
    'Pendente': <Loader2 size={14} className="mr-1.5 animate-spin" />,
    'Processando': <RotateCcw size={14} className="mr-1.5" />,
    'Enviado': <Truck size={14} className="mr-1.5" />,
    'Entregue': <CheckCircle size={14} className="mr-1.5" />,
    'Cancelado': <XCircle size={14} className="mr-1.5" />,
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    const fetchOrders = useCallback(async (pageToFetch = currentPage, search = debouncedSearchTerm, status = selectedStatus) => {
        setIsLoading(true);
        setError(null);
        try {
            const data: PaginatedOrdersResponse = await getAdminOrders({
                page: pageToFetch,
                per_page: ITEMS_PER_PAGE,
                search: search,
                status: status,
            });
            setOrders(data.orders);
            setTotalPages(data.total_pages);
            setTotalOrders(data.total_orders);
            if (pageToFetch > data.total_pages && data.total_pages > 0) {
                setCurrentPage(data.total_pages); // Ajusta se a página atual for inválida
            } else if (data.total_pages === 0 && pageToFetch !==1) {
                setCurrentPage(1); // Reseta para pagina 1 se não houver resultados
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Falha ao carregar pedidos.";
            setError(errorMessage);
            setOrders([]);
            setTotalPages(0);
            setTotalOrders(0);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearchTerm, selectedStatus]); // Removido fetchOrders da lista de dependências

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        // Se o termo de busca ou status mudou, resetamos para a primeira página
        if (currentPage !== 1 && (debouncedSearchTerm !== searchTermRef.current.debounced || selectedStatus !== searchTermRef.current.status) ) {
            setCurrentPage(1);
            fetchOrders(1, debouncedSearchTerm, selectedStatus);
        } else {
            fetchOrders(currentPage, debouncedSearchTerm, selectedStatus);
        }
        // Guardar os valores atuais para comparação na próxima renderização
        searchTermRef.current = { debounced: debouncedSearchTerm, status: selectedStatus };
    }, [debouncedSearchTerm, selectedStatus, currentPage, fetchOrders]);

    // Usar ref para guardar valores anteriores de debouncedSearchTerm e selectedStatus para o useEffect acima
    const searchTermRef = React.useRef({debounced: debouncedSearchTerm, status: selectedStatus});

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
        // setCurrentPage(1); // Removido, o useEffect de debouncedSearchTerm cuidará disso
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value as OrderStatus | '');
        // setCurrentPage(1); // Removido, o useEffect de selectedStatus cuidará disso
    };

    const handleViewDetails = (order: Order) => {
        console.log("Ver detalhes (futuramente com modal e getAdminOrderById):", order);
        // Ex: setIsViewModalOpen(true); setCurrentDetailedOrder(await getAdminOrderById(order.id));
    };

    const handleEditStatus = async (order: Order, newStatus: OrderStatus) => {
        if (order.status === newStatus) return;
        // TODO: Implementar modal de confirmação e seleção de status aqui.
        // Por agora, vamos simular uma atualização direta para fins de teste da API.
        console.log(`Tentando atualizar status do pedido ${order.id} para ${newStatus}`);
        try {
            // setIsLoading(true); // Poderia ter um loading específico para a linha/botão
            await updateAdminOrderStatus(order.id, newStatus);
            // alert(`Status do pedido ${order.orderNumber} atualizado para ${newStatus}`);
            fetchOrders(currentPage); // Re-fetch a lista atual para refletir a mudança
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Falha ao atualizar status.";
            setError(errorMessage); // Mostrar erro global ou específico
            // alert(`Erro ao atualizar status: ${errorMessage}`);
        } finally {
            // setIsLoading(false);
        }
    };
    
    // Mock de handleEditStatus para o botão, futuramente um modal abriria para selecionar o status
    const triggerEditStatus = (order: Order) => {
        // Simulando a seleção de um novo status. Idealmente, um modal/dropdown permitiria ao usuário escolher.
        const nextStatusCycle: Record<OrderStatus, OrderStatus> = {
            'Pendente': 'Processando',
            'Processando': 'Enviado',
            'Enviado': 'Entregue',
            'Entregue': 'Entregue', // não muda mais
            'Cancelado': 'Cancelado' // não muda mais
        };
        const newStatus = nextStatusCycle[order.status];
        if (order.status !== newStatus) {
          // Adicionar uma confirmação antes de mudar
          if(confirm(`Deseja alterar o status do pedido ${order.orderNumber} de "${order.status}" para "${newStatus}"?`)){
            handleEditStatus(order, newStatus);
          }
        } else {
            alert("O pedido já está no estado final (Entregue ou Cancelado) ou não há próximo estado definido.");
        }
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
        // totalOrders agora vem do backend
        // pendingOrders precisaria de uma chamada específica ou cálculo no backend.
        // Por ora, vamos simular ou calcular com base nos dados da página atual (o que não é ideal).
        const pendingOnPage = orders.filter(o => o.status === 'Pendente').length;
        
        // Receita e Ticket Médio também seriam idealmente do backend.
        // Calculando com base nos pedidos da página atual (não reflete o total real)
        const revenueOnPage = orders.filter(o => o.status === 'Entregue' || o.status === 'Enviado' || o.status === 'Processando').reduce((sum, o) => sum + o.totalAmount, 0);
        const relevantOrdersForAvgOnPage = orders.filter(o => o.status === 'Entregue' || o.status === 'Enviado' || o.status === 'Processando');
        const avgValueOnPage = relevantOrdersForAvgOnPage.length > 0 ? revenueOnPage / relevantOrdersForAvgOnPage.length : 0;

        return {
            totalOrders: { value: String(totalOrders), trend: "Total no sistema" }, // Usando totalOrders do estado
            pendingOrders: { value: String(pendingOnPage), trend: isLoading ? "" : `${pendingOnPage} nesta página` }, // Simulado
            totalRevenue: { value: formatCurrency(revenueOnPage), trend: isLoading ? "" : "Receita (pág. atual)" }, // Simulado
            avgOrderValue: { value: formatCurrency(isNaN(avgValueOnPage) ? 0 : avgValueOnPage), trend: isLoading ? "" : "Ticket Médio (pág. atual)" }, // Simulado
        };
    }, [orders, totalOrders, isLoading]);


    if (isLoading && orders.length === 0 && currentPage === 1 && !debouncedSearchTerm && !selectedStatus) {
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
                    <SummaryCard title="Total de Pedidos" value={summaryData.totalOrders.value} icon={<Package size={20} />} trend={summaryData.totalOrders.trend} isLoadingCard={isLoading && totalOrders === 0} />
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
                
                {(isLoading && orders.length > 0) && (
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
                                <p className="text-sm">{error}</p>
                                <button 
                                    onClick={() => fetchOrders(1, '', '')} 
                                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline"
                                >
                                    Tentar Novamente (Limpar Filtros)
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {!isLoading && !error && orders.length === 0 && (
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
                                onClick={() => { setSearchTerm(''); setSelectedStatus(''); setCurrentPage(1); /* fetchOrders será chamado pelo useEffect */}}
                                className="flex items-center mx-auto bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow hover:shadow-md transition-all duration-150 ease-in-out disabled:opacity-50"
                                disabled={isLoading}
                            >
                                <RotateCcw size={18} className="mr-2" />
                                Limpar Busca/Filtros
                            </button>
                        )}
                    </div>
                )}

                {orders.length > 0 && (
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
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <motion.tr 
                                            key={order.id} 
                                            className="hover:bg-gray-50 transition-colors duration-150 even:bg-white odd:bg-gray-50/50"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap align-top">
                                                <div className="text-sm font-medium text-green-600 hover:text-green-700 cursor-pointer" onClick={() => handleViewDetails(order)}>#{order.orderNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="text-sm font-semibold text-gray-900">{order.customer.name}</div>
                                                <div className="text-xs text-gray-500">{order.customer.email}</div>
                                                {order.customer.phone && <div className="text-xs text-gray-500">{order.customer.phone}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">{formatDate(order.orderDate)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top text-center">{order.itemCount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 align-top">{formatCurrency(order.totalAmount)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap align-top">
                                                <span className={`px-3 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ring-1 ${statusColors[order.status]}`}>
                                                    {statusIcons[order.status] || <Loader2 size={14} className="mr-1.5 animate-spin" />}{/* Fallback icon */}
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
                                                <motion.button 
                                                    onClick={() => triggerEditStatus(order)} 
                                                    className="p-1.5 text-orange-500 hover:text-orange-700 hover:bg-orange-100 rounded-full transition-all duration-150 disabled:opacity-50"
                                                    title="Atualizar Status (Simulado)"
                                                    whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}
                                                    disabled={isLoading || order.status === 'Entregue' || order.status === 'Cancelado'}
                                                >
                                                    <Edit size={18} />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                         {/* Paginação */} 
                        {totalPages > 0 && (
                            <div className="py-4 px-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <p className="text-sm text-gray-700">
                                    Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span> (<span className="font-semibold">{totalOrders}</span> pedidos)
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
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages || isLoading}
                                        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Próxima Página"
                                        whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                                    >
                                        <ChevronRight size={20} />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages || isLoading}
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
                {/* Modais para Detalhes e Edição de Status irão aqui */}
            </motion.div>
        </AnimatePresence>
  );
} 