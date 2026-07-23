import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

interface Point {
  x: number;
  y: number;
}

export function LineChart({
  data,
  width,
  height,
  color,
  fillColor,
}: {
  data: number[];
  width: number;
  height: number;
  color: string;
  fillColor?: string;
}) {
  if (data.length === 0) return <View style={{ width, height }} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 12;
  const usableH = height - padding * 2;
  const step = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

  const points: Point[] = data.map((v, i) => ({
    x: padding + i * step,
    y: padding + usableH - ((v - min) / range) * usableH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <Svg width={width} height={height}>
      {[0.25, 0.5, 0.75].map((f) => (
        <Line key={f} x1={0} x2={width} y1={height * f} y2={height * f} stroke="rgba(120,120,128,0.15)" strokeWidth={1} />
      ))}
      {fillColor && <Path d={areaPath} fill={fillColor} />}
      <Path d={linePath} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} />
      ))}
    </Svg>
  );
}
