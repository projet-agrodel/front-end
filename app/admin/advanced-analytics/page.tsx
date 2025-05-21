'use client';

import React from 'react';
import DateRangeFilter from './_components/DateRangeFilter';
import AnalyticsCard from './_components/AnalyticsCard';
import SalesByCategoryChart from './_components/SalesByCategoryChart';
import { PieChart, LineChart, Activity, Package, Users, ShoppingCart } from 'lucide-react';

// Componentes placeholder para o conteúdo dos cards (a serem desenvolvidos)
const PlaceholderContent = ({ text }: { text: string }) => (
  <div className="text-center text-gray-400 py-8 text-sm">
    <p>{text}</p>
    <p>(Em desenvolvimento)</p>
  </div>
);

// Resumos compactos para os cards
const SummaryContent = ({ title, value, trend, trendDirection }: { 
  title: string, 
  value: string, 
  trend?: string, 
  trendDirection?: 'up' | 'down' | 'neutral'
}) => (
  <div className="flex flex-col space-y-1">
    <div className="font-medium">{title}</div>
    <div className="flex items-center">
      <span className="text-lg font-bold">{value}</span>
      {trend && (
        <span className={`ml-2 text-xs ${
          trendDirection === 'up' ? 'text-green-500' : 
          trendDirection === 'down' ? 'text-red-500' : 'text-gray-500'
        }`}>
          {trend}
        </span>
      )}
    </div>
  </div>
);

export default function AdvancedAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* 1. CABEÇALHO DA PÁGINA E FILTRO DE PERÍODO GLOBAL */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Análise Avançada</h1>
        <DateRangeFilter />
      </div>

      {/* 2. GRADE DE CARDS DE ANÁLISE */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        <AnalyticsCard 
          title="Vendas por Categoria" 
          icon={<PieChart size={18} />}
          colSpan="xl:col-span-1"
          summaryContent={
            <SummaryContent 
              title="Distribuição" 
              value="5 categorias" 
              trend="Frutas em destaque" 
            />
          }
          modalContent={<SalesByCategoryChart />}
          modalDescription="Análise detalhada das vendas distribuídas por categoria de produto."
        />

        <AnalyticsCard 
          title="Ticket Médio"
          icon={<ShoppingCart size={18} />}
          colSpan="xl:col-span-1"
          summaryContent={
            <SummaryContent 
              title="Valor médio" 
              value="R$125,30" 
              trend="+12,5%" 
              trendDirection="up"
            />
          }
          modalContent={<PlaceholderContent text="Valor do Ticket Médio e Tendência" />}
          modalDescription="Análise detalhada do valor médio de compra e tendências ao longo do tempo."
        />

        <AnalyticsCard 
          title="Top 5 Produtos" 
          icon={<Package size={18} />}
          colSpan="xl:col-span-1"
          summaryContent={
            <SummaryContent 
              title="Mais vendido" 
              value="Tomate Orgânico" 
              trend="150 unid." 
            />
          }
          modalContent={<PlaceholderContent text="Lista/Tabela: Top 5 Produtos" />}
          modalDescription="Detalhamento dos produtos mais vendidos no período."
        />

        <AnalyticsCard 
          title="Novos vs. Recorrentes" 
          icon={<Users size={18} />}
          colSpan="xl:col-span-1"
          summaryContent={
            <SummaryContent 
              title="Novos clientes" 
              value="48%" 
              trend="+5%" 
              trendDirection="up"
            />
          }
          modalContent={<PlaceholderContent text="Gráfico de Barras: Novos Clientes vs. Recorrentes" />}
          modalDescription="Comparativo entre novos clientes e recorrentes."
        />
        
        <AnalyticsCard 
          title="Taxa de Conversão" 
          icon={<Activity size={18} />}
          colSpan="xl:col-span-1"
          summaryContent={
            <SummaryContent 
              title="Conversão média" 
              value="23,7%" 
              trend="-2,1%" 
              trendDirection="down"
            />
          }
          modalContent={<PlaceholderContent text="Funil de Conversão e Taxa" />}
          modalDescription="Análise detalhada do funil de conversão de vendas."
        />

        <AnalyticsCard 
          title="Receita por Período" 
          icon={<LineChart size={18} />}
          colSpan="xl:col-span-1"
          summaryContent={
            <SummaryContent 
              title="Total no período" 
              value="R$45.320,00" 
              trend="+18,7%" 
              trendDirection="up"
            />
          }
          modalContent={<PlaceholderContent text="Gráfico de Linha: Evolução da Receita no Período Selecionado" />}
          modalDescription="Evolução da receita ao longo do tempo no período selecionado."
        />

      </div>

      {/* 3. TABELAS DETALHADAS (opcional para depois) */}
      {/* 
      <div className="mt-8">
        <AnalyticsCard title="Relatório Detalhado de Vendas">
          <PlaceholderContent text="Tabela Detalhada de Vendas com Paginação e Filtros" />
        </AnalyticsCard>
      </div>
      */}
    </div>
  );
} 