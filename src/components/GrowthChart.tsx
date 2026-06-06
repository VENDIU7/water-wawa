'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getXpProgress } from '@/lib/wawa';

interface GrowthChartProps {
  xpHistory: { date: string; xp: number }[];
  currentXp: number;
  hydration: number;
}

// 预生成的确定性数据，避免 SSR/客户端不一致
const WEEK_BARS = [35, 55, 42, 68, 50, 72, 58];
const HYDRATION_BARS = [62, 55, 70, 58, 65, 72, 60, 68, 75, 63, 70, 78, 65, 72];

export default function GrowthChart({ currentXp, hydration }: GrowthChartProps) {
  const { percent, current, needed } = getXpProgress(currentXp);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  if (!mounted) {
    return <div className="h-40 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 animate-pulse" />
    </div>;
  }

  return (
    <div className="space-y-4">
      {/* 经验进度条 */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>经验进度</span>
          <span>{current} / {needed} XP</span>
        </div>
        <div className="h-3 bg-white/50 rounded-full overflow-hidden border border-blue-100">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 本周活跃度 */}
      <div>
        <p className="text-xs text-gray-500 mb-2">本周活跃度</p>
        <div className="flex justify-between items-end h-20 gap-1">
          {days.map((day, i) => {
            const isToday = i === adjustedToday;
            return (
              <div key={day} className="flex flex-col items-center flex-1">
                <motion.div
                  className={`w-full rounded-t-md ${isToday ? 'bg-gradient-to-t from-cyan-400 to-blue-400' : 'bg-blue-200/60'}`}
                  initial={{ height: 0 }}
                  animate={{ height: WEEK_BARS[i] }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                />
                <span className={`text-[10px] mt-1 ${isToday ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 滋润度变化 */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>滋润度趋势</span>
          <span>{Math.round(hydration)}%</span>
        </div>
        <div className="h-16 flex items-end gap-0.5">
          {HYDRATION_BARS.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-cyan-300/50 to-blue-400/60 rounded-t-sm"
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>14天前</span>
          <span>今天</span>
        </div>
      </div>
    </div>
  );
}
