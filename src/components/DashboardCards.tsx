import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const chartData = [
  { name: 'T2', audios: 12 },
  { name: 'T3', audios: 19 },
  { name: 'T4', audios: 15 },
  { name: 'T5', audios: 22 },
  { name: 'T6', audios: 28 },
  { name: 'T7', audios: 10 },
  { name: 'CN', audios: 5 },
];

interface DashboardCardsProps {
  hasResult: boolean;
}

export default function DashboardCards({ hasResult }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Compression Rate Card */}
      <div className="bg-vne-bg border border-vne-border p-4 flex flex-col justify-between rounded-none">
        <div className="text-[14px] text-vne-text-sec mb-2">Tỷ lệ nén</div>
        <div>
          <div className="text-[24px] font-bold text-vne-text mb-1">92<span className="text-[16px] text-vne-text-sec font-normal">%</span></div>
          <div className="text-[12px] text-vne-text-sec border-t border-vne-border pt-2 mt-2">
            1500 từ → 120 từ
          </div>
        </div>
      </div>

      {/* Duration Card */}
      <div className="bg-vne-bg border border-vne-border p-4 flex flex-col justify-between rounded-none">
        <div className="text-[14px] text-vne-text-sec mb-2">Thời lượng dự kiến</div>
        <div>
          <div className="text-[24px] font-bold text-vne-primary mb-1">45<span className="text-[16px] text-vne-text-sec font-normal">s</span></div>
          <div className="text-[12px] text-vne-text-sec border-t border-vne-border pt-2 mt-2">
            Tối ưu cho Shorts/Reels
          </div>
        </div>
      </div>

      {/* Emotion Score Card */}
      <div className="bg-vne-bg border border-vne-border p-4 flex flex-col justify-between rounded-none">
        <div className="text-[14px] text-vne-text-sec mb-2">Điểm cảm xúc (Hook)</div>
        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="text-[24px] font-bold text-vne-text">88<span className="text-[16px] text-vne-text-sec font-normal">/100</span></div>
          </div>
          <div className="h-1 bg-vne-border rounded-none overflow-hidden mt-2">
            <motion.div 
              className="h-full bg-vne-primary"
              initial={{ width: 0 }}
              animate={{ width: hasResult ? '88%' : '0%' }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Chart Card - Full width in this grid */}
      <div className="bg-vne-bg border border-vne-border p-4 md:col-span-3 flex flex-col rounded-none">
        <div className="text-[14px] text-vne-text-sec mb-4">Sản lượng tuần</div>
        <div className="flex-1 min-h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'var(--color-vne-text-sec)', fontFamily: 'var(--font-sans)' }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'var(--color-vne-bg-sec)' }}
                contentStyle={{ borderRadius: '0', border: '1px solid var(--color-vne-border)', boxShadow: 'none', fontFamily: 'var(--font-sans)' }}
              />
              <Bar dataKey="audios" radius={[0, 0, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 4 ? 'var(--color-vne-primary)' : 'var(--color-vne-border)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
