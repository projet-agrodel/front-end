'use client';

import React from 'react';
import DateRangeFilter from './_components/DateRangeFilter';
import AnalyticsCard, { AnalyticsCardProps } from './_components/AnalyticsCard';
import SalesByCategoryChart from './_components/SalesByCategoryChart';
// Importar novos componentes de detalhe
import TotalPedidosDetalhes from './_components/TotalPedidosDetalhes';
import NovosClientesDetalhes from './_components/NovosClientesDetalhes';
import VisitantesUnicosDetalhes from './_components/VisitantesUnicosDetalhes';
import TaxaConversaoDetalhes from './_components/TaxaConversaoDetalhes';
import TicketMedioDetalhes from './_components/TicketMedioDetalhes';
import AtividadeRecenteLog from './_components/AtividadeRecenteLog';

import { 
  PieChart, Activity, Package, Users, 
  TrendingUp, TrendingDown, CircleDollarSign, BarChart3,
  CreditCard, ShoppingCart, UsersRound, PackageSearch // Novos ícones
} from 'lucide-react';
import {
  MiniProgressCircle,
  MiniSparkline,
  MiniBarChart,
  MiniDonutChart
} from './_components/MiniCharts';
import { motion } from 'framer-motion';

// Componentes placeholder para o conteúdo dos cards (a serem desenvolvidos)
// Removido PlaceholderContent pois agora usaremos componentes específicos
// const PlaceholderContent = ({ text }: { text: string }) => (
//   <div className="text-center text-gray-400 py-8 text-sm">
//     <p>{text}</p>
//     <p>(Em desenvolvimento)</p>
//   </div>
// );

// Indicador de tendência com seta para cima ou para baixo
const TrendIndicator = ({ value, direction, colorClass }: { value: string, direction: 'up' | 'down' | 'neutral', colorClass: string }) => {
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

  const analyticsCardsData = [
    {
      title: "Total Vendas",
      icon: <CircleDollarSign size={20} />,
      variant: "primary",
      summary: { value: "R$ 612.917", subtitle: "Vendas vs último mês", trend: "+2,08%", trendDirection: "up" },
      chart: <MiniSparkline data={monthlyData} color="#FFFFFF" height={40} width={80} />,
      modalContent: <div>... (conteúdo do modal vendas) ...</div>,
      modalDescription: "Análise completa de vendas no período selecionado."
    },
    {
      title: "Total Pedidos",
      icon: <ShoppingCart size={20} />,
      variant: "secondary",
      summary: { value: "34.760", subtitle: "Pedidos vs último mês", trend: "+12,4%", trendDirection: "up" },
      chart: <MiniBarChart data={weekdayData} color="#FFFFFF" />,
      modalContent: <TotalPedidosDetalhes />,
      modalDescription: "Análise detalhada dos pedidos no período."
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
      summary: { value: "4,8%", subtitle: "Conversão vs último mês", trend: "+0.5%", trendDirection: "up" },
      chart: <MiniSparkline data={[2, 3, 5, 4, 6, 7, 8]} color="#4f46e5" height={40} width={80}/>,
      modalContent: <TaxaConversaoDetalhes />,
      modalDescription: "Detalhes sobre a taxa de conversão de visitantes para clientes."
    },
    {
      title: "Ticket Médio",
      icon: <CreditCard size={20} />,
      variant: "default",
      summary: { value: "R$ 125,30", subtitle: "Ticket vs último mês", trend: "-1,2%", trendDirection: "down" },
      chart: <MiniBarChart data={[100,120,110,130,125,115,128]} color="#8b5cf6"/>,
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
        ))}
      </div>
    </motion.div>
  );
} 