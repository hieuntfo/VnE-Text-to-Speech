import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const chartData = [
  { name: 'Mon', audios: 12 },
  { name: 'Tue', audios: 19 },
  { name: 'Wed', audios: 15 },
  { name: 'Thu', audios: 22 },
  { name: 'Fri', audios: 28 },
  { name: 'Sat', audios: 10 },
  { name: 'Sun', audios: 5 },
];

interface DashboardCardsProps {
  hasResult: boolean;
}

export default function DashboardCards({ hasResult }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Compression Rate Card */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
        <div className="text-sm font-medium text-neutral-500 mb-4">Compression Rate</div>
        <div>
          <div className="text-3xl font-light mb-1">92<span className="text-xl text-neutral-400">%</span></div>
          <div className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 inline-block px-2 py-1 rounded-md">
            1500 words → 120 words
          </div>
        </div>
      </div>

      {/* Duration Card */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
        <div className="text-sm font-medium text-neutral-500 mb-4">Est. Audio Duration</div>
        <div>
          <div className="text-3xl font-light mb-1 text-green-600 dark:text-green-400">45<span className="text-xl text-neutral-400">s</span></div>
          <div className="text-xs text-neutral-500">
            Optimal for YouTube Shorts (&lt;60s)
          </div>
        </div>
      </div>

      {/* Emotion Score Card */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
        <div className="text-sm font-medium text-neutral-500 mb-4">Hook Emotion Score</div>
        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="text-3xl font-light">88<span className="text-xl text-neutral-400">/100</span></div>
            <div className="text-xs font-medium text-amber-600 dark:text-amber-400">High Engagement</div>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: hasResult ? '88%' : '0%' }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm md:col-span-3 lg:col-span-1 flex flex-col">
        <div className="text-sm font-medium text-neutral-500 mb-4">Weekly Output</div>
        <div className="flex-1 min-h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#888' }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="audios" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 4 ? '#dc2626' : '#e5e5e5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
