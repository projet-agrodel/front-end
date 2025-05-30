'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DateRangeFilter from './_components/DateRangeFilter';
import AnalyticsCard, { AnalyticsCardProps } from './_components/AnalyticsCard';
import SalesByCategoryChart from './_components/SalesByCategoryChart';
// Importar novos componentes de detalhe
import TotalVendasDetalhes from './_components/TotalVendasDetalhes';
import TotalPedidosDetalhes from './_components/TotalPedidosDetalhes';
import NovosClientesDetalhes from './_components/NovosClientesDetalhes';
import VisitantesUnicosDetalhes from './_components/VisitantesUnicosDetalhes';
import TaxaConversaoDetalhes from './_components/TaxaConversaoDetalhes';
import TicketMedioDetalhes from './_components/TicketMedioDetalhes';
import AtividadeRecenteLog from './_components/AtividadeRecenteLog';

import { 
  /* PieChart, */ Activity, /* Package, */ Users, 
  TrendingUp, TrendingDown, CircleDollarSign, /* BarChart3, */
  CreditCard, ShoppingCart, UsersRound, PackageSearch // Novos ícones
} from 'lucide-react';
import {
  MiniProgressCircle,
  MiniSparkline,
  MiniBarChart,
  MiniDonutChart
} from './_components/MiniCharts';
import { motion } from 'framer-motion';

import { 
  getTotalSales, 
  getTotalOrders, 
  getTicketMedioSummary,
  getTaxaConversaoSummary,
  TotalSalesData, 
  TotalOrdersData,
  TicketMedioSummaryData,
  TaxaConversaoSummaryData
} from '@/services/adminAnalyticsService';
import { useSession } from 'next-auth/react';

const TrendIndicator = ({ value, direction, colorClass }: { value: string, direction: 'up' | 'down' | 'neutral', colorClass: string }) => {
  // LOG ADICIONADO DENTRO DE TrendIndicator
  console.log("[TrendIndicator Props]", { value, direction, colorClass });

  const getIcon = () => {
    if (direction === 'up') return <TrendingUp size={14} className={colorClass} />;
    if (direction === 'down') return <TrendingDown size={14} className={colorClass} />;
    return null;
  };
  return (
    <div className={`flex items-center gap-1 ${colorClass} text-xs font-medium`}>
      {getIcon()}
      <span>{value}</span>
    </div>
  );
};

// Resumos compactos para os cards - formato inspirado no design de referência
const CardValue = ({ 
  value, 
  subtitle, 
  trend, 
  trendDirection,
  chartComponent,
  isDarkBg = false // Nova prop para ajustar cores de texto/trend
}: { 
  value: string, 
  subtitle?: string,
  trend?: string, 
  trendDirection?: 'up' | 'down' | 'neutral',
  chartComponent?: React.ReactNode,
  isDarkBg?: boolean
}) => {
    // LOG ADICIONADO DENTRO DE CardValue
    console.log("[CardValue Props]", { value, subtitle, trend, trendDirection });

    const trendColorClass = trendDirection === 'up' ? (isDarkBg ? 'text-green-300' : 'text-green-500') 
                         : trendDirection === 'down' ? (isDarkBg ? 'text-red-300' : 'text-red-500') 
                         : (isDarkBg ? 'text-gray-300' : 'text-gray-500');
    
    return (
        <div className="mt-2">
            <div className="flex items-start justify-between">
            <div className="flex-1">
                <div className={`text-2xl md:text-3xl font-bold ${isDarkBg ? 'text-white' : 'text-gray-900'}`}>{value}</div>
                {subtitle && (
                <p className={`text-xs mt-1 ${isDarkBg ? 'opacity-80 text-white/90' : 'text-gray-600'}`}>{subtitle}</p>
                )}
                {trend && trendDirection && trendDirection !== 'neutral' && (
                <div className="mt-1.5">
                    <div className={`rounded-full px-2 py-0.5 inline-flex ${isDarkBg ? 'bg-white/20' : 'bg-gray-100'}`}>
                       <TrendIndicator value={trend} direction={trendDirection} colorClass={trendColorClass} />
                    </div>
                </div>
                )}
                 {/* Caso para trend neutro sem ícone, apenas texto */}
                {trend && trendDirection === 'neutral' && (
                    <div className="mt-1.5">
                         <p className={`text-xs ${isDarkBg ? 'text-gray-300' : 'text-gray-500'}`}>{trend}</p>
                    </div>
                )}
            </div>
            {chartComponent && (
                <div className="ml-4 flex items-end">
                {chartComponent}
                </div>
            )}
            </div>
        </div>
    );
};

const initialSummaryState = { value: "Carregando...", subtitle: "", trend: "", trendDirection: "neutral" as 'up' | 'down' | 'neutral' };
const initialErrorState = null;

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } }, // stagger AnalyticsCard
  exit: { opacity: 0 }
};

const headerVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function AdvancedAnalyticsPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  // Estados para dados de resumo dos cards
  const [totalSalesSummary, setTotalSalesSummary] = useState<TotalSalesData | null>(null);
  const [loadingSales, setLoadingSales] = useState(true);
  const [errorSales, setErrorSales] = useState<string | null>(initialErrorState);

  const [totalOrdersSummary, setTotalOrdersSummary] = useState<TotalOrdersData | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState<string | null>(initialErrorState);
  
  const [ticketMedioSummary, setTicketMedioSummary] = useState<TicketMedioSummaryData | null>(null);
  const [loadingTicketMedio, setLoadingTicketMedio] = useState(true);
  const [errorTicketMedio, setErrorTicketMedio] = useState<string | null>(initialErrorState);

  const [taxaConversaoSummary, setTaxaConversaoSummary] = useState<TaxaConversaoSummaryData | null>(null);
  const [loadingTaxaConversao, setLoadingTaxaConversao] = useState(true);
  const [errorTaxaConversao, setErrorTaxaConversao] = useState<string | null>(initialErrorState);
  
  // Definir quais cards usam fundo escuro para CardValue
  const darkBgVariants: Array<AnalyticsCardProps['variant']> = ['primary', 'secondary', 'success', 'danger', 'warning'];

  const fetchAllSummaries = useCallback(async () => {
    if (!token) {
      const authError = "Autenticação não encontrada. Não é possível carregar os dados.";
      setErrorSales(authError); setLoadingSales(false);
      setErrorOrders(authError); setLoadingOrders(false);
      setErrorTicketMedio(authError); setLoadingTicketMedio(false);
      setErrorTaxaConversao(authError); setLoadingTaxaConversao(false);
      return;
    }

    setLoadingSales(true); setErrorSales(null);
    try {
      const salesData = await getTotalSales(token);
      setTotalSalesSummary(salesData);
    } catch (err) {
      setErrorSales(err instanceof Error ? err.message : 'Falha ao buscar vendas.');
      console.error("Erro getTotalSales:", err);
    } finally {
      setLoadingSales(false);
    }

    setLoadingOrders(true); setErrorOrders(null);
    try {
      const ordersData = await getTotalOrders(token);
      setTotalOrdersSummary(ordersData);
    } catch (err) {
      setErrorOrders(err instanceof Error ? err.message : 'Falha ao buscar pedidos.');
      console.error("Erro getTotalOrders:", err);
    } finally {
      setLoadingOrders(false);
    }
    
    setLoadingTicketMedio(true); setErrorTicketMedio(null);
    try {
        const ticketMedioData = await getTicketMedioSummary(token);
        setTicketMedioSummary(ticketMedioData);
    } catch (err) {
        setErrorTicketMedio(err instanceof Error ? err.message : 'Falha ao buscar ticket médio.');
        console.error("Erro getTicketMedioSummary:", err);
    } finally {
        setLoadingTicketMedio(false);
    }

    setLoadingTaxaConversao(true); setErrorTaxaConversao(null);
    try {
        const taxaConversaoData = await getTaxaConversaoSummary(token);
        setTaxaConversaoSummary(taxaConversaoData);
    } catch (err) {
        setErrorTaxaConversao(err instanceof Error ? err.message : 'Falha ao buscar taxa de conversão.');
        console.error("Erro getTaxaConversaoSummary:", err);
    } finally {
        setLoadingTaxaConversao(false);
    }

  }, [token]);

  useEffect(() => {
    if (session?.accessToken) { // Verifica se o token já está disponível
        fetchAllSummaries();
    } else if (session === null) { // Sessão explicitamente nula (não está carregando, mas não há sessão)
        const authError = "Usuário não autenticado. Não é possível carregar os dados.";
        setErrorSales(authError); setLoadingSales(false);
        setErrorOrders(authError); setLoadingOrders(false);
        setErrorTicketMedio(authError); setLoadingTicketMedio(false);
        setErrorTaxaConversao(authError); setLoadingTaxaConversao(false);
    }
    // Se sessionStatus for 'loading', useEffect será re-executado quando mudar.
  }, [session, fetchAllSummaries]);

  const cardsDefinition: Omit<AnalyticsCardProps, 'summaryContent' | 'index'>[] = [
    {
      title: "Total Vendas",
      icon: <CircleDollarSign size={20} />,
      variant: "primary",
      modalContent: <TotalVendasDetalhes />,
      modalDescription: "Análise completa de vendas com dados reais do backend."
    },
    {
      title: "Total Pedidos",
      icon: <ShoppingCart size={20} />,
      variant: "secondary",
      modalContent: <TotalPedidosDetalhes />,
      modalDescription: "Análise detalhada dos pedidos com dados reais do backend."
    },
    {
      title: "Produtos Vendidos",
      icon: <PackageSearch size={20} />,
      variant: "success",
      modalContent: <SalesByCategoryChart />,
      modalDescription: "Distribuição de vendas por categoria de produto."
    },
    {
      title: "Novos Clientes",
      icon: <UsersRound size={20} />,
      variant: "warning",
      modalContent: <NovosClientesDetalhes />,
      modalDescription: "Análise de aquisição de novos clientes."
    },
    {
      title: "Visitantes Únicos",
      icon: <Users size={20} />,
      variant: "default",
      modalContent: <VisitantesUnicosDetalhes />,
      modalDescription: "Análise detalhada de visitantes e comportamento."
    },
    {
      title: "Taxa de Conversão",
      icon: <TrendingUp size={20} />,
      variant: "default",
      modalContent: <TaxaConversaoDetalhes />,
      modalDescription: "Detalhes sobre a taxa de conversão de visitantes para clientes."
    },
    {
      title: "Ticket Médio",
      icon: <CreditCard size={20} />,
      variant: "default",
      modalContent: <TicketMedioDetalhes />,
      modalDescription: "Análise do valor médio por pedido."
    },
    {
      title: "Atividade Recente",
      icon: <Activity size={20} />,
      variant: "default",
      modalContent: <AtividadeRecenteLog />,
      modalDescription: "Visualização das últimas atividades na plataforma."
    }
  ];
  
  // Mapeia os dados de resumo para os cards corretos
  const analyticsCardsData = cardsDefinition.map(cardDef => {
    let summaryData = initialSummaryState;
    let chartComponent = null; // Placeholder para mini charts

    if (cardDef.title === "Total Vendas") {
      summaryData = errorSales ? { value: "Erro!", subtitle: errorSales, trend: "", trendDirection: "neutral" } 
                    : loadingSales || !totalSalesSummary ? initialSummaryState
                    : { 
                        value: totalSalesSummary.formatted_total, 
                        subtitle: `Atualizado: ${new Date(totalSalesSummary.last_updated).toLocaleTimeString('pt-BR')}`, 
                        trend: `${totalSalesSummary.trend_percentage.toFixed(1)}%`, 
                        trendDirection: totalSalesSummary.trend_direction 
                      };
      chartComponent = !loadingSales && totalSalesSummary ? <MiniSparkline data={totalSalesSummary.daily_sales_chart} color="#FFFFFF" height={40} width={80} /> : null;
    } else if (cardDef.title === "Total Pedidos") {
      summaryData = errorOrders ? { value: "Erro!", subtitle: errorOrders, trend: "", trendDirection: "neutral" }
                    : loadingOrders || !totalOrdersSummary ? initialSummaryState
                    : { 
                        value: totalOrdersSummary.total_orders.toLocaleString('pt-BR'), 
                        subtitle: `Média diária: ${totalOrdersSummary.average_orders_per_day.toFixed(1)}`, 
                        trend: `${totalOrdersSummary.trend_percentage.toFixed(1)}%`, 
                        trendDirection: totalOrdersSummary.trend_direction
                      };
      chartComponent = !loadingOrders && totalOrdersSummary ? <MiniBarChart data={totalOrdersSummary.weekday_orders_chart.map(d => d.orders)} color="#FFFFFF" /> : null;
    } else if (cardDef.title === "Ticket Médio") {
      summaryData = errorTicketMedio ? { value: "Erro!", subtitle: errorTicketMedio, trend: "", trendDirection: "neutral" }
                    : loadingTicketMedio || !ticketMedioSummary ? initialSummaryState
                    : ticketMedioSummary;
      chartComponent = <MiniBarChart data={[100,120,110,130,125,115,128]} color="#8b5cf6"/>; 
    } else if (cardDef.title === "Taxa de Conversão") {
      summaryData = errorTaxaConversao ? { value: "Erro!", subtitle: errorTaxaConversao, trend: "", trendDirection: "neutral" }
                    : loadingTaxaConversao || !taxaConversaoSummary ? initialSummaryState
                    : taxaConversaoSummary;
      chartComponent = <MiniSparkline data={[2, 3, 5, 4, 6, 7, 8]} color="#4f46e5" height={40} width={80}/>;
    } else if (cardDef.title === "Produtos Vendidos") {
        summaryData = { value: "9.829", subtitle: "Itens vendidos", trend: "+5,34%", trendDirection: "up" };
        chartComponent = <MiniDonutChart percentages={[35, 25, 18, 15, 7]} colors={['#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669']} />;
    } else if (cardDef.title === "Novos Clientes") {
        summaryData = { value: "1.254", subtitle: "Clientes vs mês ant.", trend: "+8,2%", trendDirection: "up" };
        chartComponent = <MiniProgressCircle percentage={75} color="#854d0e" bgColor="#fde68a" />;
    } else if (cardDef.title === "Visitantes Únicos") {
        summaryData = { value: "14.987", subtitle: "Usuários vs mês ant.", trend: "-2,08%", trendDirection: "down" };
        chartComponent = <MiniProgressCircle percentage={62} color="#ef4444" />;
    } else if (cardDef.title === "Atividade Recente") {
        summaryData = { value: "Agora", subtitle: "Última ação no sistema", trend: "", trendDirection: "neutral" };
    }

    return {
      ...cardDef,
      summaryContent: (
        <CardValue 
          value={summaryData.value} 
          subtitle={summaryData.subtitle}
          trend={summaryData.trend}
          trendDirection={summaryData.trendDirection}
          chartComponent={chartComponent}
          isDarkBg={darkBgVariants.includes(cardDef.variant as AnalyticsCardProps['variant'])}
        />
      )
    };
  });

  return (
    <motion.div 
      className="space-y-6 md:space-y-8 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 md:mb-10"
        variants={headerVariants}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-900">Análise Avançada</h1>
        <DateRangeFilter />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {analyticsCardsData.map((card, idx) => (
          <AnalyticsCard 
            key={card.title} 
            title={card.title}
            icon={card.icon}
            variant={card.variant as AnalyticsCardProps['variant']}
            index={idx}
            colSpan={idx === 0 || idx === analyticsCardsData.length -1 ? "sm:col-span-2 lg:col-span-1 xl:col-span-1" : ""}
            summaryContent={card.summaryContent}
            modalContent={card.modalContent}
            modalDescription={card.modalDescription}
          />
        ))}
      </div>
    </motion.div>
  );
} 