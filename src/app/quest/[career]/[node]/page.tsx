'use client';

import { use, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { careerSkills } from '@/data/skills';
import { useWawa } from '@/hooks/useWawa';
import { getStorage, setStorage } from '@/lib/storage';

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ career: string; node: string }>;
}) {
  const { career, node: nodeId } = use(params);
  const { wawa, addXp, addHydration, mounted } = useWawa();

  const nodes = careerSkills[career] || [];
  const nodeData = nodes.find(n => n.id === nodeId);

  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [submission, setSubmission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    scores: { completion: number; depth: number; expression: number };
    totalStars: number;
    comment: string;
    xpAward: number;
  } | null>(null);

  // 检查已完成的任务
  const completedTasks = getStorage<string[]>('completedTasks', []);
  const completedNodes = getStorage<string[]>('completedNodes', []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 animate-bounce" />
        <p className="text-blue-500 text-sm">加载中...</p>
      </div>
    );
  }

  if (!nodeData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <span className="text-5xl">🔍</span>
        <p className="text-blue-600/70">找不到这个技能节点</p>
        <Link href={`/quest/${career}`} className="text-blue-500 text-sm underline">返回技能树</Link>
      </div>
    );
  }

  const isNodeCompleted = completedNodes.includes(nodeId);

  const handleSubmit = async () => {
    if (!submission.trim() || !selectedTask || isSubmitting) return;
    setIsSubmitting(true);

    const task = nodeData.tasks.find(t => t.id === selectedTask);
    if (!task) return;

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: task.title,
          taskDescription: task.description,
          requirements: task.requirements,
          userSubmission: submission.trim(),
        }),
      });
      const data = await res.json();
      setResult(data);

      // 记录完成
      const updatedTasks = [...completedTasks, selectedTask];
      setStorage('completedTasks', updatedTasks);

      // 检查该节点所有任务是否完成
      const allDone = nodeData.tasks.every(t => updatedTasks.includes(t.id));
      if (allDone && !completedNodes.includes(nodeId)) {
        const updatedNodes = [...completedNodes, nodeId];
        setStorage('completedNodes', updatedNodes);
      }

      addXp(data.xpAward || 30);
      addHydration(5);
    } catch {
      // 降级处理
      setResult({
        scores: { completion: 3, depth: 3, expression: 3 },
        totalStars: 3,
        comment: '评分系统漂流中...但你提交得很棒！继续加油～🌊💧',
        xpAward: 30,
      });
      addXp(30);
      addHydration(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 渲染星级
  const renderStars = (count: number) => {
    return '⭐'.repeat(count) + '☆'.repeat(5 - count);
  };

  return (
    <div className="space-y-4">
      {/* 头部 */}
      <Link href={`/quest/${career}`} className="text-sm text-blue-500 hover:text-blue-600">
        ← 返回技能树
      </Link>

      <div className="glass-card p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isNodeCompleted ? '✅' : '🔵'}</span>
          <div>
            <h1 className="text-lg font-bold text-blue-800">Lv.{nodeData.level} {nodeData.name}</h1>
            <p className="text-sm text-gray-500">{nodeData.description}</p>
          </div>
        </div>
        {isNodeCompleted && (
          <div className="px-3 py-1.5 bg-green-50 text-green-600 text-xs rounded-full inline-block">
            🎉 全部任务已完成
          </div>
        )}
      </div>

      {/* 任务列表 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-blue-700">📝 任务列表</h3>
        {nodeData.tasks.map(task => {
          const isCompleted = completedTasks.includes(task.id);
          return (
            <motion.div
              key={task.id}
              className={`glass-card p-3 ${selectedTask === task.id ? 'ring-2 ring-blue-400' : ''} ${
                isCompleted ? 'opacity-60' : 'hover-float cursor-pointer'
              }`}
              onClick={() => !isCompleted && setSelectedTask(task.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{isCompleted ? '✅' : '⬜'}</span>
                  <div>
                    <p className="font-medium text-sm text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-400">+{task.xpReward} XP</p>
                  </div>
                </div>
              </div>
              {selectedTask === task.id && !isCompleted && (
                <motion.div
                  className="mt-3 space-y-3 pt-3 border-t border-blue-100"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="bg-blue-50/60 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium">📋 提交要求：</p>
                    <p className="text-xs text-blue-500 mt-1">{task.requirements}</p>
                  </div>

                  {!result && (
                    <>
                      <textarea
                        value={submission}
                        onChange={e => setSubmission(e.target.value)}
                        placeholder="在这里写下你的任务完成内容..."
                        rows={5}
                        className="w-full px-3 py-2 bg-white/70 border border-blue-100 rounded-lg text-sm focus:outline-none focus:border-blue-400 resize-none"
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !submission.trim()}
                        className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isSubmitting ? '⏳ 水滴娃正在评分...' : '📤 提交任务'}
                      </button>
                    </>
                  )}

                  {result && selectedTask === task.id && (
                    <motion.div
                      className="bg-white/80 rounded-lg p-4 space-y-2 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <p className="text-lg font-bold text-blue-700">{renderStars(result.totalStars)}</p>
                      <div className="flex justify-center gap-4 text-xs">
                        <span className="text-gray-500">完成度 {result.scores.completion}/5</span>
                        <span className="text-gray-500">深度 {result.scores.depth}/5</span>
                        <span className="text-gray-500">表达 {result.scores.expression}/5</span>
                      </div>
                      <p className="text-sm text-gray-600 italic">「{result.comment}」</p>
                      <p className="text-xs text-blue-500">获得 +{result.xpAward} XP</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 证书区域 */}
      {isNodeCompleted && (
        <motion.div
          className="glass-card p-5 text-center space-y-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <span className="text-5xl">📜</span>
          <h3 className="text-lg font-bold text-blue-800">技能证书</h3>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-200">
            <p className="text-2xl font-serif text-amber-800">🏆</p>
            <p className="font-serif text-amber-800 font-bold text-lg">技能认证</p>
            <p className="text-sm text-amber-700 mt-2">
              兹证明 <strong>{wawa.name}</strong> 已通过
            </p>
            <p className="text-base font-semibold text-amber-800 mt-1">
              「{nodeData.name}」技能考核
            </p>
            <p className="text-xs text-amber-600 mt-2">
              所有任务均已完成并获得AI评审认证
            </p>
            <p className="text-xs text-amber-500 mt-1">Lv.{nodeData.level} · {new Date().toLocaleDateString('zh-CN')}</p>
          </div>
          <p className="text-xs text-gray-400">截图保存你的证书吧～ 🎉</p>
        </motion.div>
      )}
    </div>
  );
}
