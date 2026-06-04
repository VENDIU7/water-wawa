'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { careers, type Career } from '@/data/careers';
import { useWawa } from '@/hooks/useWawa';

export default function QuestPage() {
  const { wawa, mounted } = useWawa();

  if (mounted && !wawa.name) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-4">
        <span className="text-6xl">⚔️</span>
        <p className="text-blue-600/70">请先创建你的水滴娃～</p>
        <Link href="/create-wawa" className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full text-sm">
          去创建 →
        </Link>
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-blue-800">⚔️ 闯关升级</h1>
        <p className="text-sm text-blue-500">选择你的职业方向，开启技能闯关之旅</p>
        {wawa.career && (
          <p className="text-xs text-blue-400">
            当前方向：<span className="font-semibold text-blue-500">🎯 {wawa.career}</span>
          </p>
        )}
      </div>

      <div className="grid gap-3">
        {careers.map((career: Career, i) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/quest/${career.id}`}>
              <div className={`glass-card p-4 flex items-center gap-4 hover-float cursor-pointer ${
                wawa.career && wawa.career !== career.name ? 'opacity-50' : ''
              }`}>
                <span className="text-4xl">{career.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800">{career.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{career.description}</p>
                </div>
                <span className="text-gray-300 text-lg">→</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
