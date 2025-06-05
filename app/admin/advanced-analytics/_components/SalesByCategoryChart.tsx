'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { getSalesByCategory, SalesByCategoryData } from '../../../../services/adminAnalyticsService';
import { getAuthTokenForAdmin } from '../../../../utils/authAdmin';
import { Loader2, AlertTriangle, Package } from 'lucide-react';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', 
  '#FF4560', '#775DD0', '#00E396', '#FEB019', '#26A69A'
];

interface ActiveShapePropsFromRecharts {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: { 
    categoryName: string;
    totalSales: number;
    transactionCount: number; 
  };
  percent: number;
  [key: string]: unknown; 
}

const renderActiveShape = (props: unknown): React.ReactElement => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props as ActiveShapePropsFromRecharts;

  if (typeof cx !== 'number' || typeof cy !== 'number' || 
      typeof innerRadius !== 'number' || typeof outerRadius !== 'number' || 
      typeof startAngle !== 'number' || typeof endAngle !== 'number' || 
      !payload || typeof percent !== 'number') {
    return <g />;
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
      const token = await getAuthTokenForAdmin();
      if (!token) {
        setError('Autenticação necessária.');
        setLoading(false);
        return;
      }
      try {
        const result = await getSalesByCategory(token as unknown as string);
        const sortedData = [...result].sort((a, b) => b.totalSales - a.totalSales);
        setData(sortedData);
      } catch (err: unknown) { 
        if (err instanceof Error) {
          setError(err.message || 'Falha ao buscar dados de vendas por categoria.');
        } else {
          setError('Ocorreu um erro desconhecido ao buscar dados de vendas por categoria.');
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const onPieEnter = (_: unknown, index: number) => {
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
            formatter={(value: string, entry: any) => { 
                const { color, payload: entryPayload } = entry;
                const percentage = entryPayload?.percent as number | undefined;
                const displayPercentage = typeof percentage === 'number' ? `(${(percentage * 100).toFixed(1)}%)` : '';
                return <span style={{ color: color || '#333' }}>{value} {displayPercentage}</span>;
            }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
} 