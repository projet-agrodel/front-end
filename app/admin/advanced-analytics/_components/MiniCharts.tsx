'use client';

import React from 'react';

// Mini círculo de progresso
interface MiniProgressCircleProps {
  percentage: number;
  color?: string;
  size?: number;
  bgColor?: string;
}

export const MiniProgressCircle: React.FC<MiniProgressCircleProps> = ({
  percentage,
  color = '#4f46e5',
  size = 40,
  bgColor = '#e5e7eb'
}) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dash = (percentage * circumference) / 100;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
        />
      </svg>
      <div 
        className="absolute inset-0 flex items-center justify-center text-xs font-bold"
        style={{ color: color }}
      >
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

// Mini sparkline (gráfico de linha simplificado)
interface MiniSparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  showDots?: boolean;
  lineWidth?: number;
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  color = '#4f46e5',
  height = 40,
  width = 80,
  showDots = false,
  lineWidth = 2
}) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Criar pontos para o path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Criar pontos para a área preenchida
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Área sob a linha */}
        <polygon 
          points={areaPoints} 
          fill={`${color}20`} 
        />
        
        {/* Linha principal */}
        <polyline 
          points={points} 
          fill="none" 
          stroke={color} 
          strokeWidth={lineWidth} 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Pontos nos dados, se solicitado */}
        {showDots && data.map((value, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={lineWidth + 1}
              fill="#fff"
              stroke={color}
              strokeWidth={1}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Mini barras comparativas
interface MiniBarChartProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  barWidth?: number;
  gap?: number;
}

export const MiniBarChart: React.FC<MiniBarChartProps> = ({
  data,
  color = '#4f46e5',
  height = 40,
  width = 80,
  barWidth = 4,
  gap = 2
}) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data) || 1;
  const barCount = data.length;
  const totalBarWidth = barWidth * barCount + gap * (barCount - 1);
  const startX = (width - totalBarWidth) / 2;

  return (
    <div style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {data.map((value, index) => {
          const barHeight = (value / max) * height;
          const x = startX + index * (barWidth + gap);
          const y = height - barHeight;
          
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              rx={1}
              ry={1}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Donut chart mini
interface MiniDonutChartProps {
  percentages: number[];
  colors?: string[];
  size?: number;
  strokeWidth?: number;
  bgColor?: string;
}

export const MiniDonutChart: React.FC<MiniDonutChartProps> = ({
  percentages,
  colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'],
  size = 40,
  strokeWidth = 8,
  bgColor = '#e5e7eb'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  let accumulatedPercentage = 0;

  return (
    <div style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Círculo de fundo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Segmentos de dados */}
        {percentages.map((percentage, index) => {
          const dash = (percentage * circumference) / 100;
          const offset = (accumulatedPercentage * circumference) / 100;
          accumulatedPercentage += percentage;
          
          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
    </div>
  );
}; 