'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { workplaces, type WorkplaceRoom, type WorkplaceTask, type WorkplaceColleague } from '@/data/workplaces';
import { useWawa } from '@/hooks/useWawa';

export default function WorkplacePage() {
  const { wawa, addXp, addHydration, mounted } = useWawa();
  const [selectedRoom, setSelectedRoom] = useState<WorkplaceRoom | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 animate-bounce" />
        <p className="text-blue-500 text-sm">职场加载中...</p>
      </div>
    );
  }

  const handleCompleteTask = (task: WorkplaceTask) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      next.add(task.id);
      return next;
    });
    addXp(30);
    addHydration(5);
  };

  if (selectedRoom) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedRoom(null)}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          ← 返回职场列表
        </button>

        {/* 房间信息 */}
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedRoom.icon}</span>
            <div>
              <h1 className="text-lg font-bold text-blue-800">{selectedRoom.name}</h1>
              <p className="text-xs text-blue-500">{selectedRoom.company} · {selectedRoom.role}</p>
              <p className="text-xs text-gray-400">{selectedRoom.level}级 · {selectedRoom.participants}人参与</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{selectedRoom.description}</p>
        </div>

        {/* 任务列表 */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-700">📋 工作任务</h3>
          {selectedRoom.tasks.map((task, i) => {
            const isDone = completedTasks.has(task.id);
            return (
              <motion.div
                key={task.id}
                className="glass-card p-3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{isDone ? '✅' : '⬜'}</span>
                      <p className={`font-medium text-sm ${isDone ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {task.title}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-7">{task.description}</p>
                    <p className="text-xs text-blue-400 mt-1 ml-7">⏰ {task.deadline}</p>
                  </div>
                  {!isDone && (
                    <button
                      onClick={() => handleCompleteTask(task)}
                      className="shrink-0 px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs rounded-full shadow-sm hover:shadow-md transition-all"
                    >
                      完成
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 同事列表 */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-700">👥 虚拟同事</h3>
          <div className="grid gap-3">
            {selectedRoom.colleagues.map((colleague, i) => (
              <motion.div
                key={colleague.id}
                className="glass-card p-3 flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-3xl">{colleague.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-gray-800">{colleague.name}</p>
                    <span className="text-xs text-blue-400">{colleague.role}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {'⭐'.repeat(colleague.level)}{'☆'.repeat(6 - colleague.level)}
                  </p>
                  <p className="text-xs text-gray-400 italic mt-1">「{colleague.evaluation}」</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 互评提示 */}
        <motion.div
          className="glass-card p-4 text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-2xl">💬</span>
          <p className="text-sm text-blue-700">完成所有任务后，同事们会给你评价哦～</p>
          <p className="text-xs text-blue-400">
            进度：{completedTasks.size}/{selectedRoom.tasks.length} 个任务已完成
          </p>
          {completedTasks.size === selectedRoom.tasks.length && (
            <motion.p
              className="text-sm font-semibold text-green-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              🎉 全部任务完成！你获得了 +{selectedRoom.tasks.length * 30} XP！
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  }

  // 职场列表视图
  return (
    <div className="space-y-4">
      <Link href="/ocean" className="text-sm text-blue-500 hover:text-blue-600">
        ← 返回大海职场
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-blue-800">🏢 模拟职场</h1>
        <p className="text-sm text-blue-500">选择一个职场房间，体验真实工作</p>
      </div>

      <div className="space-y-4">
        {workplaces.map((room, i) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedRoom(room)}
            className="glass-card p-4 hover-float cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{room.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{room.name}</h3>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                    {room.level}级
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{room.company}</p>
                <p className="text-xs text-blue-400 mt-1">{room.role} · {room.participants}人参与</p>
              </div>
              <span className="text-gray-300 text-lg">→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
