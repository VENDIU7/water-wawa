'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWawa } from '@/hooks/useWawa';
import { workplaces } from '@/data/workplaces';
import { bountyTasks } from '@/data/bountyTasks';

export default function OceanPage() {
  const { wawa, mounted } = useWawa();

  if (mounted && !wawa.name) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-4">
        <span className="text-6xl">🌊</span>
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
      {/* 头部 */}
      <motion.div
        className="text-center space-y-3 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="text-6xl">🌊</span>
        <h1 className="text-xl font-bold text-blue-800">大海职场</h1>
        <p className="text-sm text-blue-500 max-w-xs mx-auto">
          这里连接着真实的职场世界，你的水滴娃已经游到了大海～
        </p>
      </motion.div>

      {/* 模拟职场入口 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link href="/ocean/workplace">
          <div className="glass-card p-4 hover-float">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-400 flex items-center justify-center text-2xl shadow-md">
                🏢
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800">模拟职场</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  体验真实工作场景，和真人同事互评成长
                </p>
                <p className="text-xs text-blue-400 mt-1">
                  {workplaces.length} 个职场房间 · {workplaces.reduce((s, w) => s + w.participants, 0)} 人参与
                </p>
              </div>
              <span className="text-gray-300 text-xl">→</span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* 企业悬赏令入口 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/ocean/bounty">
          <div className="glass-card p-4 hover-float">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-2xl shadow-md">
                🏆
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800">企业悬赏令</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  企业发布微任务，提交作品赢取面试机会和奖品
                </p>
                <p className="text-xs text-orange-400 mt-1">
                  {bountyTasks.length} 个悬赏任务 · {bountyTasks.filter(b => b.mvp).length} 位MVP已产生
                </p>
              </div>
              <span className="text-gray-300 text-xl">→</span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* 水滴娃状态提示 */}
      <motion.div
        className="glass-card p-4 text-center space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-3xl">{wawa.avatar}</span>
        <p className="text-sm text-blue-700 font-medium">
          {wawa.name} 已抵达大海 🌊
        </p>
        <p className="text-xs text-blue-400">
          {wawa.level >= 13
            ? '你已经足够强大，去征服职场吧！💪'
            : wawa.level >= 7
            ? '你正在成长中，可以先在模拟职场练练手～'
            : '先在技能树中提升自己，大海职场永远在这里等你！'}
        </p>
      </motion.div>
    </div>
  );
}
