'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { bountyTasks, type BountyTask } from '@/data/bountyTasks';
import { useWawa } from '@/hooks/useWawa';

export default function BountyPage() {
  const { wawa, addXp, addHydration, mounted } = useWawa();
  const [selectedBounty, setSelectedBounty] = useState<BountyTask | null>(null);
  const [submission, setSubmission] = useState('');
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());
  const [showMvp, setShowMvp] = useState(false);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 animate-bounce" />
        <p className="text-blue-500 text-sm">悬赏令加载中...</p>
      </div>
    );
  }

  const handleSubmit = (bountyId: string) => {
    setSubmittedIds(prev => {
      const next = new Set(prev);
      next.add(bountyId);
      return next;
    });
    setSubmission('');
    addXp(50);
    addHydration(10);

    // 模拟MVP评选动画
    setTimeout(() => {
      setShowMvp(true);
      setTimeout(() => setShowMvp(false), 4000);
    }, 800);
  };

  if (selectedBounty) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => { setSelectedBounty(null); setSubmission(''); }}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          ← 返回悬赏列表
        </button>

        {/* 任务详情 */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedBounty.companyLogo}</span>
            <div>
              <h1 className="text-lg font-bold text-blue-800">{selectedBounty.title}</h1>
              <p className="text-sm text-blue-500">{selectedBounty.company}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
              {selectedBounty.field}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              selectedBounty.difficulty === '困难' ? 'bg-red-100 text-red-500' :
              selectedBounty.difficulty === '中等' ? 'bg-orange-100 text-orange-500' :
              'bg-green-100 text-green-500'
            }`}>
              {selectedBounty.difficulty}
            </span>
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-500 rounded-full">
              🏆 {selectedBounty.reward}
            </span>
          </div>

          <p className="text-sm text-gray-600">{selectedBounty.description}</p>

          <div className="flex justify-between text-xs text-gray-400">
            <span>⏰ 截止：{selectedBounty.deadline}</span>
            <span>👥 {selectedBounty.participants}人参与</span>
          </div>

          {selectedBounty.mvp && (
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-sm text-yellow-700">🏆 当前MVP</p>
              <p className="text-xs text-yellow-600">{selectedBounty.mvp}</p>
            </div>
          )}
        </div>

        {/* 提交区域 */}
        {!submittedIds.has(selectedBounty.id) ? (
          <motion.div
            className="glass-card p-4 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-sm font-semibold text-blue-700">📤 提交你的作品</h3>
            <textarea
              value={submission}
              onChange={e => setSubmission(e.target.value)}
              placeholder="描述你的方案或贴上作品链接..."
              rows={5}
              className="w-full px-3 py-2 bg-white/70 border border-blue-100 rounded-lg text-sm focus:outline-none focus:border-blue-400 resize-none"
            />
            <button
              onClick={() => handleSubmit(selectedBounty.id)}
              disabled={!submission.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              🚀 提交方案
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="glass-card p-4 text-center space-y-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-4xl">✅</span>
            <p className="text-sm font-semibold text-green-600">方案已提交！</p>
            <p className="text-xs text-gray-400">等待企业评审中...请关注结果通知</p>
          </motion.div>
        )}

        {/* MVP 弹出动画 */}
        <AnimatePresence>
          {showMvp && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMvp(false)}
            >
              <motion.div
                className="bg-white/95 rounded-2xl p-8 text-center space-y-4 max-w-sm mx-4 shadow-2xl"
                initial={{ scale: 0.5, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <span className="text-6xl">🏆</span>
                <h2 className="text-2xl font-bold text-amber-600">恭喜获得MVP！</h2>
                <p className="text-sm text-gray-600">
                  企业在{selectedBounty.participants + 1}份提交中注意到了你的方案！
                </p>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-amber-800">📩 面试通知</p>
                  <p className="text-xs text-amber-600 mt-1">
                    {selectedBounty.company} HR想邀请你参加面试！
                    <br />请查看你的邮箱获取详情～
                  </p>
                </div>
                <button
                  onClick={() => setShowMvp(false)}
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-sm font-semibold"
                >
                  太棒了！
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 悬赏列表视图
  return (
    <div className="space-y-4">
      <Link href="/ocean" className="text-sm text-blue-500 hover:text-blue-600">
        ← 返回大海职场
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-blue-800">🏆 企业悬赏令</h1>
        <p className="text-sm text-blue-500">企业发布微任务，赢取面试机会和奖品</p>
      </div>

      <div className="space-y-3">
        {bountyTasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => { setSelectedBounty(task); setSubmission(''); }}
            className="glass-card p-4 hover-float cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{task.companyLogo}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-sm text-gray-800">{task.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.difficulty === '困难' ? 'bg-red-100 text-red-500' :
                    task.difficulty === '中等' ? 'bg-orange-100 text-orange-500' :
                    'bg-green-100 text-green-500'
                  }`}>
                    {task.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{task.company} · {task.field}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-purple-500">🏆 {task.reward}</span>
                  <span className="text-gray-400">⏰ {task.deadline}</span>
                  <span className="text-gray-400">👥 {task.participants}</span>
                </div>
                {task.mvp && (
                  <p className="text-xs text-yellow-600 mt-1">🌟 当前MVP：{task.mvp}</p>
                )}
                {submittedIds.has(task.id) && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full">
                    ✅ 已提交
                  </span>
                )}
              </div>
              <span className="text-gray-300 text-lg shrink-0">→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
