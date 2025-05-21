'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { getSalesByCategory, SalesByCategoryData } from '../../../../services/adminAnalyticsService';
import { getAuthTokenForAdmin } from '../../../../utils/authAdmin';
import { Loader2, AlertTriangle, Package } from 'lucide-react';

// Cores para as fatias do gráfico de pizza
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', 
  '#FF4560', '#775DD0', '#00E396', '#FEB019', '#26A69A'
];

// Simplificando a tipagem para ActiveShapeProps, focando no essencial
interface ActiveShapePropsFromRecharts {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: { // O payload aqui é o item de dados original passado para o <Pie data={data} />
    categoryName: string;
    totalSales: number;
    transactionCount: number; 
    // Outros campos do SalesByCategoryData estarão aqui
  };
  percent: number;
  // Outras props que o Recharts pode passar
  [key: string]: any; 
}

const renderActiveShape = (props: ActiveShapePropsFromRecharts) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  // Adicionando checagens para garantir que os valores numéricos principais existem
  if (typeof cx !== 'number' || typeof cy !== 'number' || 
      typeof innerRadius !== 'number' || typeof outerRadius !== 'number' || 
      typeof startAngle !== 'number' || typeof endAngle !== 'number' || 
      !payload || typeof percent !== 'number') {
    return null;
  }

  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill={fill} fontSize={14} fontWeight="bold">
        {payload.categoryName}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#4A5568" fontSize={13}>
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#FFFFFF"
        strokeWidth={2}
      />
    </g>
  );
};

export default function SalesByCategoryChart() {
  const [data, setData] = useState<SalesByCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthTokenForAdmin();
      if (!token) {
        setError('Autenticação necessária.');
        setLoading(false);
        return;
      }
      try {
        const result = await getSalesByCategory(token);
        const sortedData = [...result].sort((a, b) => b.totalSales - a.totalSales);
        setData(sortedData);
      } catch (err: any) { // Manter any para err por enquanto para evitar problemas com tipo desconhecido
        setError(err.message || 'Falha ao buscar dados de vendas por categoria.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <Loader2 className="animate-spin h-12 w-12 mb-3" />
        Carregando dados do gráfico...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-600 bg-red-50 p-6 rounded-lg border border-red-200">
        <AlertTriangle className="h-12 w-12 mb-3 text-red-500" />
        <p className="font-semibold text-lg text-red-700">Erro ao carregar gráfico</p>
        <p className="text-sm text-center text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 h-96 flex flex-col items-center justify-center">
        <Package size={48} className="mb-3 text-gray-400" />
        <p className="font-semibold">Nenhum dado disponível</p>
        <p className="text-sm">Não há dados de vendas por categoria para exibir no momento.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={450}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          // @ts-expect-error Recharts pode ter tipagem complexa para activeShape, usando expect-error para prosseguir
          activeShape={renderActiveShape} 
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={140}
          innerRadius={80}
          fill="#8884d8"
          dataKey="totalSales"
          nameKey="categoryName"
          onMouseEnter={onPieEnter}
          paddingAngle={1}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]} 
              stroke="#FFFFFF"
              strokeWidth={1}
            />
          ))}
        </Pie>
        <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            itemStyle={{ fontSize: '13px' }}
            formatter={(value: number, name: string, props: { payload?: { payload: SalesByCategoryData, percent?: number } }) => {
                if (!props.payload || !props.payload.payload) return [null, null];
                // Acessando diretamente do payload do item de dados original
                const itemData = props.payload.payload;
                const percentage = props.payload.percent ? (props.payload.percent * 100).toFixed(1) : '0';
                const formattedValue = itemData.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                return [
                    <span key={`${name}-val`} style={{ color: '#333' }}>{`${formattedValue} (${percentage}%) - ${itemData.transactionCount} trans.`}</span>,
                    <span key={`${name}-cat`} style={{ color: '#000', fontWeight: 500 }}>{itemData.categoryName}</span>
                ];
            }}
            labelFormatter={(label: string) => <span style={{ fontWeight: 'bold', color: '#333'}}>{label}</span>}
        />
        <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center" 
            iconSize={10}
            wrapperStyle={{ paddingTop: '20px', paddingBottom: '10px', fontSize: '13px' }}
            formatter={(value, entry: any) => { 
                const { color } = entry;
                const itemPayload = entry.payload?.payload; // Acessando o payload do item de dados
                const percentage = itemPayload?.percent; // Recharts aninha o percent aqui
                const displayPercentage = typeof percentage === 'number' ? `(${(percentage * 100).toFixed(1)}%)` : '';
                return <span style={{ color: color || '#333' }}>{value} {displayPercentage}</span>;
            }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
} 