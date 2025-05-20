'use client';

import React from 'react';
import DateRangeFilter from './_components/DateRangeFilter';
import AnalyticsCard from './_components/AnalyticsCard';

// Componentes placeholder para o conteúdo dos cards (a serem desenvolvidos)
const PlaceholderContent = ({ text }: { text: string }) => (
  <div className="text-center text-gray-400 py-8 text-sm">
    <p>{text}</p>
    <p>(Em desenvolvimento)</p>
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
        
        <AnalyticsCard title="Vendas por Categoria" colSpan="xl:col-span-2">
          <PlaceholderContent text="Gráfico de Pizza/Barras: Vendas por Categoria" />
        </AnalyticsCard>

        <AnalyticsCard title="Ticket Médio">
          <PlaceholderContent text="Valor do Ticket Médio e Tendência" />
        </AnalyticsCard>

        <AnalyticsCard title="Top 5 Produtos Mais Vendidos" colSpan="md:col-span-1 xl:col-span-1">
          <PlaceholderContent text="Lista/Tabela: Top 5 Produtos" />
        </AnalyticsCard>

        <AnalyticsCard title="Novos Clientes vs. Recorrentes" colSpan="md:col-span-1 xl:col-span-2">
          <PlaceholderContent text="Gráfico de Barras: Novos Clientes vs. Recorrentes" />
        </AnalyticsCard>
        
        <AnalyticsCard title="Taxa de Conversão" colSpan="">
          <PlaceholderContent text="Funil de Conversão e Taxa" />
        </AnalyticsCard>

        {/* Você pode adicionar mais cards aqui */}
        <AnalyticsCard title="Receita por Período" colSpan="xl:col-span-3">
           <PlaceholderContent text="Gráfico de Linha: Evolução da Receita no Período Selecionado" />
        </AnalyticsCard>

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