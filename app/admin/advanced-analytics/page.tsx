'use client';

import React from 'react';
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

import { getTotalSales, getTotalOrders, TotalSalesData, TotalOrdersData } from '@/services/adminAnalyticsService'; // Importar serviços e tipos
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

// Dados para visualizações
const monthlyData = [42, 38, 55, 63, 70, 62, 58];
const categoryPercentages = [35, 25, 18, 15, 7]; // Frutas, Vegetais, Ovos, Lácteos, Outros
const weekdayData = [30, 45, 65, 50, 35, 20, 15]; // Seg a Dom

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
  // Definir quais cards usam fundo escuro para CardValue
  const darkBgVariants: Array<AnalyticsCardProps['variant']> = ['primary', 'secondary', 'success', 'danger', 'warning'];

  // Dados iniciais dos cards (sem o resumo do Ticket Médio que virá do backend)
  const initialCardsData = [
    {
      title: "Total Vendas",
      icon: <CircleDollarSign size={20} />,
      variant: "primary",
      summary: { 
        value: loadingSales || !totalSalesSummary ? "Carregando..." : totalSalesSummary.formatted_total, 
        subtitle: loadingSales || !totalSalesSummary ? "Conectando..." : `Última atualização: ${new Date(totalSalesSummary.last_updated).toLocaleTimeString('pt-BR')}`, 
        trend: loadingSales || !totalSalesSummary ? "" : `${totalSalesSummary.trend_percentage.toFixed(1)}%`, 
        trendDirection: loadingSales || !totalSalesSummary ? "neutral" : totalSalesSummary.trend_direction 
      },
      chart: <MiniSparkline data={totalSalesSummary?.daily_sales_chart || monthlyData} color="#FFFFFF" height={40} width={80} />,
      modalContent: <TotalVendasDetalhes />,
      modalDescription: "Análise completa de vendas com dados reais do backend."
    },
    {
      title: "Total Pedidos",
      icon: <ShoppingCart size={20} />,
      variant: "secondary",
      summary: { 
        value: loadingOrders || !totalOrdersSummary ? "Carregando..." : totalOrdersSummary.total_orders.toLocaleString('pt-BR'), 
        subtitle: loadingOrders || !totalOrdersSummary ? "Conectando..." : `Média diária: ${totalOrdersSummary.average_orders_per_day}`, 
        trend: loadingOrders || !totalOrdersSummary ? "" : `${totalOrdersSummary.trend_percentage.toFixed(1)}%`, 
        trendDirection: loadingOrders || !totalOrdersSummary ? "neutral" : totalOrdersSummary.trend_direction
      },
      chart: <MiniBarChart data={totalOrdersSummary?.weekday_orders_chart.map(d => d.orders) || weekdayData} color="#FFFFFF" />,
      modalContent: <TotalPedidosDetalhes />,
      modalDescription: "Análise detalhada dos pedidos com dados reais do backend."
    },
    {
      title: "Produtos Vendidos",
      icon: <PackageSearch size={20} />,
      variant: "success",
      summary: { value: "9.829", subtitle: "Itens vendidos", trend: "+5,34%", trendDirection: "up" },
      chart: <MiniDonutChart percentages={categoryPercentages} colors={['#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669']} />,
      modalContent: <SalesByCategoryChart />,
      modalDescription: "Distribuição de vendas por categoria de produto."
    },
    {
      title: "Novos Clientes",
      icon: <UsersRound size={20} />,
      variant: "warning",
      summary: { value: "1.254", subtitle: "Clientes vs último mês", trend: "+8,2%", trendDirection: "up" },
      chart: <MiniProgressCircle percentage={75} color="#854d0e" bgColor="#fde68a" />,
      modalContent: <NovosClientesDetalhes />,
      modalDescription: "Análise de aquisição de novos clientes."
    },
    {
      title: "Visitantes Únicos",
      icon: <Users size={20} />,
      variant: "default",
      summary: { value: "14.987", subtitle: "Usuários vs último mês", trend: "-2,08%", trendDirection: "down" },
      chart: <MiniProgressCircle percentage={62} color="#ef4444" />,
      modalContent: <VisitantesUnicosDetalhes />,
      modalDescription: "Análise detalhada de visitantes e comportamento."
    },
     {
      title: "Taxa de Conversão",
      icon: <TrendingUp size={20} />,
      variant: "default",
      summary: { value: "Carregando...", subtitle: "", trend: "", trendDirection: "neutral" }, // MUDADO PARA PLACEHOLDER
      chart: <MiniSparkline data={[2, 3, 5, 4, 6, 7, 8]} color="#4f46e5" height={40} width={80}/>,
      modalContent: <TaxaConversaoDetalhes />,
      modalDescription: "Detalhes sobre a taxa de conversão de visitantes para clientes."
    },
    // Card de Ticket Médio será atualizado com dados do backend
    {
      title: "Ticket Médio",
      icon: <CreditCard size={20} />,
      variant: "default",
      summary: { value: "Carregando...", subtitle: "", trend: "", trendDirection: "neutral" }, // Placeholder
      chart: <MiniBarChart data={[100,120,110,130,125,115,128]} color="#8b5cf6"/>, // Pode ser atualizado ou removido se o backend fornecer dados para o mini chart
      modalContent: <TicketMedioDetalhes />,
      modalDescription: "Análise do valor médio por pedido."
    },
    {
      title: "Atividade Recente",
      icon: <Activity size={20} />,
      variant: "default",
      summary: { value: "27 min atrás", subtitle: "Última venda realizada", trend: "", trendDirection: "neutral" },
      modalContent: <AtividadeRecenteLog />,
      modalDescription: "Visualização das últimas atividades na plataforma."
    }
  ];

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoadingCards(true);
        setErrorCards(null);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        // Fetch para Ticket Médio Summary
        const ticketMedioResponse = await fetch(`${baseUrl}/admin/analytics/ticket-medio/summary`);
        if (!ticketMedioResponse.ok) {
          console.error('Falha ao buscar resumo do ticket médio');
          // Lidar com erro específico do ticket médio se necessário, ou lançar um erro geral
        }
        const ticketMedioSummaryData = await ticketMedioResponse.json();

        // Fetch para Taxa de Conversão Summary
        const taxaConversaoResponse = await fetch(`${baseUrl}/admin/analytics/taxa-conversao/summary`);
        if (!taxaConversaoResponse.ok) {
          console.error('Falha ao buscar resumo da taxa de conversão. Status:', taxaConversaoResponse.status);
          // Lidar com erro específico da taxa de conversão se necessário
        }
        const taxaConversaoSummaryData = await taxaConversaoResponse.json();

        // LOGS ADICIONADOS PARA DEBUG
        console.log("Dados recebidos para Ticket Médio Summary:", ticketMedioSummaryData);
        console.log("Dados recebidos para Taxa de Conversão Summary:", taxaConversaoSummaryData);

        setAnalyticsCardsData(prevCards => 
          prevCards.map(card => {
            if (card.title === "Ticket Médio") {
              return { ...card, summary: ticketMedioSummaryData ? ticketMedioSummaryData : card.summary }; 
            }
            if (card.title === "Taxa de Conversão") {
              return { ...card, summary: taxaConversaoSummaryData ? taxaConversaoSummaryData : card.summary }; 
            }
            return card;
          })
        );

      } catch (err) {
        if (err instanceof Error) {
          setErrorCards(err.message);
        } else {
          setErrorCards('Erro ao buscar resumos dos cards.');
        }
        console.error("Erro ao buscar resumos para page.tsx:", err);
        // Em caso de erro geral, os cards manterão seus valores mockados ou placeholders
        // Poderia-se definir um estado de erro individual por card se desejado
      } finally {
        setLoadingCards(false);
      }
    };
    
    setAnalyticsCardsData(initialCardsData); 
    fetchCardData(); // Renomeado de fetchTicketMedioSummary para fetchCardData

  }, []);

  // Mostrar mensagem de carregamento geral ou erro para os cards, se aplicável
  // if (loadingCards) {
  //   return <div className="p-8 text-center"><p>Carregando dados dos cards de análise...</p></div>;
  // }
  // if (errorCards) {
  //   return <div className="p-8 text-center text-red-500"><p>Erro ao carregar dados dos cards: {errorCards}</p></div>;
  // }

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
        {analyticsCardsData.length > 0 ? analyticsCardsData.map((card, idx) => (
          <AnalyticsCard 
            key={card.title} 
            title={card.title}
            icon={card.icon}
            variant={card.variant as AnalyticsCardProps['variant']} // Cast para garantir tipo
            index={idx} // Passando index para animação escalonada
            colSpan={idx === 0 || idx === analyticsCardsData.length -1 ? "sm:col-span-2 lg:col-span-1 xl:col-span-1" : ""} // Ajuste experimental de colspan
            summaryContent={
              <CardValue 
                value={card.summary.value} 
                subtitle={card.summary.subtitle}
                trend={card.summary.trend}
                trendDirection={card.summary.trendDirection as 'up' | 'down' | 'neutral'}
                chartComponent={card.chart}
                isDarkBg={darkBgVariants.includes(card.variant as AnalyticsCardProps['variant'])}
              />
            }
            modalContent={card.modalContent}
            modalDescription={card.modalDescription}
          />
        )) : (
          <div className="col-span-full text-center">
            {loadingCards ? (
              <p>Carregando dados dos cards de análise...</p>
            ) : errorCards ? (
              <p>Erro ao carregar dados dos cards: {errorCards}</p>
            ) : (
              <p>Nenhum dado encontrado para os cards de análise.</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
} 