'use client';

import { motion } from 'framer-motion';

interface WaterDropProps {
  avatar: string;
  hydration: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export default function WaterDrop({ avatar, hydration, size = 'md', animate = true }: WaterDropProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 text-3xl',
    md: 'w-24 h-24 text-5xl',
    lg: 'w-32 h-32 text-6xl',
  };

  // 根据滋润度决定水滴透明度
  const opacity = 0.4 + (hydration / 100) * 0.6;

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* 水滴外圈光晕 */}
      <motion.div
        className={`absolute ${sizeClasses[size]} rounded-full bg-gradient-to-br from-cyan-300/30 to-blue-400/20 blur-md`}
        animate={animate ? {
          scale: [1, 1.1, 1],
          opacity: [opacity * 0.5, opacity * 0.8, opacity * 0.5],
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 水滴主体 */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-cyan-200/40 via-blue-300/30 to-sky-200/40 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center shadow-lg shadow-blue-300/20`}
        animate={animate ? {
          y: [0, -5, 0],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.span
          animate={animate ? {
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {avatar}
        </motion.span>
      </motion.div>
      {/* 滋润度指示圈 */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="3"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="rgba(100,200,255,0.6)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(hydration / 100) * 289} 289`}
          initial={{ strokeDasharray: '0 289' }}
          animate={{ strokeDasharray: `${(hydration / 100) * 289} 289` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
}
