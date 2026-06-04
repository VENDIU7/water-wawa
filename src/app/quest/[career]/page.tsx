'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { careerSkills } from '@/data/skills';
import { careers } from '@/data/careers';
import SkillTree from '@/components/SkillTree';
import { useWawa } from '@/hooks/useWawa';
import type { SkillNode } from '@/data/skills';

export default function CareerSkillTreePage({
  params,
}: {
  params: Promise<{ career: string }>;
}) {
  const { career } = use(params);
  const { wawa, setCareer, mounted } = useWawa();

  const careerData = careers.find(c => c.id === career);
  const nodes = careerSkills[career] || [];

  if (!mounted) return null;

  if (!careerData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <span className="text-5xl">🔍</span>
        <p className="text-blue-600/70">找不到这个职业方向</p>
        <Link href="/quest" className="text-blue-500 text-sm underline">返回选择</Link>
      </div>
    );
  }

  const handleSelectNode = (node: SkillNode) => {
    // 在 SkillTree 组件中不会直接导航，这里只是一个回调
  };

  const handleSetCareer = () => {
    setCareer(careerData.name);
  };

  return (
    <div className="space-y-4">
      {/* 头部 */}
      <div className="text-center space-y-2">
        <span className="text-5xl">{careerData.icon}</span>
        <h1 className="text-xl font-bold text-blue-800">{careerData.name}</h1>
        <p className="text-sm text-blue-500">{careerData.description}</p>
        {wawa.career !== careerData.name && (
          <button
            onClick={handleSetCareer}
            className="px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm rounded-full shadow-md hover:shadow-lg transition-all"
          >
            选择此方向
          </button>
        )}
      </div>

      {/* 技能树 */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-blue-700 mb-2">🌳 技能树</h3>
        <SkillTree
          nodes={nodes}
          currentNodeId={null}
          onSelectNode={handleSelectNode}
        />
      </div>

      {/* 技能节点列表 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-blue-700">📋 技能节点</h3>
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/quest/${career}/${node.id}`}>
              <div className={`glass-card p-3 hover-float ${
                !node.unlocked && !node.completed ? 'opacity-50 pointer-events-none' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {node.completed ? '✅' : node.unlocked ? '🔵' : '🔒'}
                    </span>
                    <div>
                      <p className="font-medium text-sm text-gray-800">Lv.{node.level} {node.name}</p>
                      <p className="text-xs text-gray-400">{node.description}</p>
                    </div>
                  </div>
                  <span className="text-gray-300">→</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
