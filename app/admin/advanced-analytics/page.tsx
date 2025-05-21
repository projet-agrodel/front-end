'use client';

import React from 'react';
import DateRangeFilter from './_components/DateRangeFilter';
import AnalyticsCard from './_components/AnalyticsCard';
import SalesByCategoryChart from './_components/SalesByCategoryChart';
import { 
  PieChart, Activity, Package, Users, 
  TrendingUp, TrendingDown, CircleDollarSign, BarChart3
} from 'lucide-react';
import {
  MiniProgressCircle,
  MiniSparkline,
  MiniBarChart,
  MiniDonutChart
} from './_components/MiniCharts';

// Componentes placeholder para o conteúdo dos cards (a serem desenvolvidos)
const PlaceholderContent = ({ text }: { text: string }) => (
  <div className="text-center text-gray-400 py-8 text-sm">
    <p>{text}</p>
    <p>(Em desenvolvimento)</p>
  </div>
);

// Indicador de tendência com seta para cima ou para baixo
const TrendIndicator = ({ value, direction }: { value: string, direction: 'up' | 'down' | 'neutral' }) => {
  const getIcon = () => {
    if (direction === 'up') return <TrendingUp size={14} className="text-green-500" />;
    if (direction === 'down') return <TrendingDown size={14} className="text-red-500" />;
    return null;
  };

  const getTextColor = () => {
    if (direction === 'up') return 'text-green-500';
    if (direction === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className={`flex items-center gap-1 ${getTextColor()} text-xs font-medium`}>
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
  chartComponent 
}: { 
  value: string, 
  subtitle?: string,
  trend?: string, 
  trendDirection?: 'up' | 'down' | 'neutral',
  chartComponent?: React.ReactNode
}) => (
  <div className="mt-2">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs mt-1 opacity-80">{subtitle}</p>
        )}
        {trend && trendDirection && (
          <div className="mt-1.5">
            <div className="bg-white/20 rounded-full px-2 py-0.5 inline-flex">
              <TrendIndicator value={trend} direction={trendDirection} />
            </div>
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

// Dados para visualizações
const monthlyData = [42, 38, 55, 63, 70, 62, 58];
const categoryPercentages = [35, 25, 18, 15, 7]; // Frutas, Vegetais, Ovos, Lácteos, Outros
const weekdayData = [30, 45, 65, 50, 35, 20, 15]; // Seg a Dom

export default function AdvancedAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* 1. CABEÇALHO DA PÁGINA E FILTRO DE PERÍODO GLOBAL */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Análise Avançada</h1>
        <DateRangeFilter />
      </div>

      {/* 2. GRADE DE CARDS DE ANÁLISE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        
        {/* Card Vendas Totais - Com gráfico de linha */}
        <AnalyticsCard 
          title="Total Vendas"
          icon={<CircleDollarSign size={20} />}
          variant="primary"
          colSpan="lg:col-span-1"
          summaryContent={
            <CardValue 
              value="R$ 612.917" 
              subtitle="Vendas vs último mês"
              trend="+2,08%" 
              trendDirection="up"
              chartComponent={
                <MiniSparkline 
                  data={monthlyData}
                  color="#ffffff"
                  height={40}
                  width={80}
                />
              }
            />
          }
          modalContent={
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Vendas no Período</h3>
                  <p className="text-2xl font-bold mt-2">R$ 612.917</p>
                  <TrendIndicator value="+2,08% vs último mês" direction="up" />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Ticket Médio</h3>
                  <p className="text-2xl font-bold mt-2">R$ 125,30</p>
                  <TrendIndicator value="+12,5% vs último mês" direction="up" />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Qtd. Vendas</h3>
                  <p className="text-2xl font-bold mt-2">4.892</p>
                  <TrendIndicator value="-0,7% vs último mês" direction="down" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-4">Evolução de Vendas</h3>
                <PlaceholderContent text="Gráfico de evolução de vendas" />
              </div>
              <div>
                <h3 className="font-medium mb-4">Relatório de Vendas</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Produto {i}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i * 5}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {i * 100},00</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/0{i}/2024</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
          modalDescription="Análise completa de vendas no período selecionado."
        />
        
        {/* Card Total de Pedidos com barras de progresso */}
        <AnalyticsCard 
          title="Total Pedidos"
          icon={<Package size={20} />}
          variant="default"
          colSpan="lg:col-span-1"
          summaryContent={
            <CardValue 
              value="34.760" 
              subtitle="Pedidos vs último mês"
              trend="+12,4%" 
              trendDirection="up"
              chartComponent={
                <MiniBarChart 
                  data={weekdayData}
                  color="#4f46e5"
                />
              }
            />
          }
          modalContent={<PlaceholderContent text="Detalhamento dos pedidos" />}
          modalDescription="Análise detalhada dos pedidos no período."
        />

        {/* Card de Estatísticas de Produtos com mini donut */}
        <AnalyticsCard 
          title="Estatísticas de Produtos"
          icon={<PieChart size={20} />}
          variant="default"
          colSpan="lg:col-span-1"
          summaryContent={
            <CardValue 
              value="9.829" 
              subtitle="Produtos vendidos"
              trend="+5,34%" 
              trendDirection="up"
              chartComponent={
                <MiniDonutChart 
                  percentages={categoryPercentages} 
                  colors={['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
                />
              }
            />
          }
          modalContent={<SalesByCategoryChart />}
          modalDescription="Análise detalhada das vendas distribuídas por categoria de produto."
        />
        
        {/* Card de Visitantes - com círculo de progresso */}
        <AnalyticsCard 
          title="Visitantes"
          icon={<Users size={20} />}
          variant="danger"
          colSpan="lg:col-span-1"
          summaryContent={
            <CardValue 
              value="14.987" 
              subtitle="Usuários vs último mês"
              trend="-2,08%" 
              trendDirection="down"
              chartComponent={
                <MiniProgressCircle 
                  percentage={62} 
                  color="#ef4444"
                />
              }
            />
          }
          modalContent={<PlaceholderContent text="Análise de visitantes" />}
          modalDescription="Análise detalhada de visitantes e comportamento."
        />

        {/* Card Produtos Vendidos */}
        <AnalyticsCard 
          title="Produtos Vendidos"
          icon={<BarChart3 size={20} />}
          variant="success"
          colSpan="lg:col-span-2 xl:col-span-2"
          summaryContent={
            <div className="mt-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-bold">12.987</div>
                  <p className="text-xs mt-1 opacity-80">Produtos vs último mês</p>
                  <div className="mt-1.5">
                    <div className="bg-white/20 rounded-full px-2 py-0.5 inline-flex">
                      <TrendIndicator value="+12,1%" direction="up" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-end">
                  <div className="text-right">
                    <div className="text-xs opacity-80">Frutas</div>
                    <div className="text-sm font-bold">4.521</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-80">Vegetais</div>
                    <div className="text-sm font-bold">3.246</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-80">Outros</div>
                    <div className="text-sm font-bold">5.220</div>
                  </div>
                </div>
              </div>
            </div>
          }
          modalContent={<PlaceholderContent text="Detalhamento dos produtos vendidos" />}
          modalDescription="Análise detalhada dos produtos vendidos no período."
        />

        {/* Card de Hábitos dos Clientes - com mini barras */}
        <AnalyticsCard 
          title="Hábitos dos Clientes"
          icon={<Activity size={20} />}
          variant="secondary"
          colSpan="lg:col-span-2 xl:col-span-2"
          summaryContent={
            <div className="mt-2 flex items-start justify-between">
              <div>
                <p className="text-xs opacity-80">Produtos vistos vs comprados</p>
                <div className="text-2xl font-bold mt-1">38.4%</div>
                <div className="mt-1.5">
                  <div className="bg-white/20 rounded-full px-2 py-0.5 inline-flex">
                    <TrendIndicator value="+5,2%" direction="up" />
                  </div>
                </div>
              </div>
              <div className="flex items-end">
                <MiniBarChart 
                  data={[65, 42, 38, 27, 35, 48, 55]}
                  color="#ffffff"
                  width={120}
                  height={50}
                />
              </div>
            </div>
          }
          modalContent={
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium">Visualização vs Conversão</h3>
                <PlaceholderContent text="Gráfico detalhado de visualizações vs vendas" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Produtos mais visualizados</h3>
                  <ul className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <li key={i} className="bg-white p-3 rounded shadow-sm">
                        <div className="flex justify-between">
                          <span>Produto {i}</span>
                          <span className="font-medium">{(6-i)*240} views</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Maior taxa de conversão</h3>
                  <ul className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <li key={i} className="bg-white p-3 rounded shadow-sm">
                        <div className="flex justify-between">
                          <span>Produto {i+5}</span>
                          <span className="font-medium">{(6-i)*10}%</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          }
          modalDescription="Análise detalhada do comportamento dos clientes e padrões de compra."
        />
      </div>
    </div>
  );
} 