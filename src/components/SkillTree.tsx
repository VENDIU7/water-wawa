'use client';

import { motion } from 'framer-motion';
import type { SkillNode } from '@/data/skills';

interface SkillTreeProps {
  nodes: SkillNode[];
  currentNodeId: string | null;
  onSelectNode: (node: SkillNode) => void;
}

export default function SkillTree({ nodes, currentNodeId, onSelectNode }: SkillTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        该职业方向的技能树正在构建中...
      </div>
    );
  }

  const maxX = Math.max(...nodes.map(n => n.x)) + 60;
  const maxY = Math.max(...nodes.map(n => n.y)) + 60;

  return (
    <div className="relative overflow-x-auto pb-4">
      <svg
        viewBox={`0 0 ${maxX} ${maxY}`}
        className="w-full max-w-md mx-auto"
        style={{ minHeight: maxY }}
      >
        {/* 连线 */}
        {nodes.map((node, i) => {
          const next = nodes[i + 1];
          if (!next) return null;
          return (
            <motion.line
              key={`line-${node.id}`}
              x1={node.x + 20}
              y1={node.y + 20}
              x2={next.x + 20}
              y2={next.y + 20}
              stroke={node.completed ? '#4FC3F7' : next.unlocked ? '#90CAF9' : '#B0BEC5'}
              strokeWidth="2"
              strokeDasharray={node.completed ? '0' : '6 3'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          );
        })}
        {/* 节点 */}
        {nodes.map((node, i) => {
          const isCurrent = currentNodeId === node.id;
          const fill = node.completed
            ? '#4FC3F7'
            : node.unlocked
            ? '#FFFFFF'
            : '#E0E0E0';
          const stroke = node.completed
            ? '#0288D1'
            : node.unlocked
            ? '#4FC3F7'
            : '#BDBDBD';

          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15, type: 'spring' }}
              onClick={() => (node.unlocked || node.completed) && onSelectNode(node)}
              style={{ cursor: node.unlocked || node.completed ? 'pointer' : 'not-allowed' }}
            >
              {/* 光环 */}
              {isCurrent && (
                <motion.circle
                  cx={node.x + 20}
                  cy={node.y + 20}
                  r="28"
                  fill="none"
                  stroke="#4FC3F7"
                  strokeWidth="2"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              {/* 节点圆 */}
              <circle
                cx={node.x + 20}
                cy={node.y + 20}
                r="22"
                fill={fill}
                stroke={stroke}
                strokeWidth="2.5"
              />
              {/* 状态图标 */}
              <text
                x={node.x + 20}
                y={node.y + 20}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="20"
              >
                {node.completed ? '✅' : node.unlocked ? '🔵' : '🔒'}
              </text>
              {/* 名称 */}
              <text
                x={node.x + 20}
                y={node.y + 52}
                textAnchor="middle"
                fontSize="11"
                fill={node.unlocked || node.completed ? '#37474F' : '#90A4AE'}
                fontWeight="500"
              >
                {node.name}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
