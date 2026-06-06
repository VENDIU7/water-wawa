'use client';

import { useWawa } from '@/hooks/useWawa';
import WaterDrop from '@/components/WaterDrop';
import GrowthChart from '@/components/GrowthChart';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  getLevelTitle,
  getHydrationLabel,
  getHydrationColor,
  getStageLabel,
  getGradeLabel,
  getXpProgress,
} from '@/lib/wawa';

export default function HomePage() {
  const { wawa, mounted, tickHydration, addXp, addHydration } = useWawa();
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mounted && wawa.name) {
      tickHydration();
    }
  }, [mounted, wawa.name, tickHydration]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content })),
          wawaName: wawa.name || '水滴娃',
        }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      addHydration(2);
      addXp(5);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: '呀，水滴娃被水草缠住了...🌿💧' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // === 未加载完毕 ===
  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 animate-bounce" />
        <p className="text-blue-500 text-sm">水滴娃正在赶来...</p>
      </div>
    );
  }

  // === 欢迎页 ===
  if (!wawa.name) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-8xl">💧</span>
        </motion.div>
        <h1 className="text-2xl font-bold text-blue-800">欢迎来到水滴世界 🌊</h1>
        <p className="text-blue-600/70 max-w-xs">
          我是你的AI成长伙伴——水滴娃！
          <br />从大一到毕业，让我陪着你一起成长吧～
        </p>
        <Link
          href="/create-wawa"
          className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-semibold shadow-lg shadow-blue-300/40 hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          创建我的水滴娃 →
        </Link>
      </div>
    );
  }

  // === 仪表盘 ===
  const { percent } = getXpProgress(wawa.xp);

  return (
    <div className="space-y-4">
      {/* 水滴娃状态卡片 */}
      <div className="glass-card p-5 text-center space-y-3">
        <div className="flex justify-center">
          <WaterDrop avatar={wawa.avatar} hydration={wawa.hydration} size="lg" animate={false} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-blue-800">{wawa.name}</h2>
          <p className="text-sm text-blue-500">
            {getStageLabel(wawa.stage)} · {getGradeLabel(wawa.grade)} · Lv.{wawa.level}
          </p>
          <p className="text-xs text-blue-400 mt-0.5">{getLevelTitle(wawa.level)}</p>
        </div>

        {/* 经验条 */}
        <div className="px-4">
          <div className="h-2 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-blue-400 mt-1">经验 {wawa.xp} XP</p>
        </div>

        {/* 滋润度 */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm" style={{ color: getHydrationColor(wawa.hydration) }}>
            {getHydrationLabel(wawa.hydration)}
          </span>
          <span className="text-xs text-gray-400">({Math.round(wawa.hydration)}%)</span>
        </div>

        {wawa.career && (
          <span className="inline-block px-3 py-1 bg-blue-100/60 text-blue-600 text-xs rounded-full">
            🎯 {wawa.career}
          </span>
        )}
      </div>

      {/* 成长曲线 */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-blue-700 mb-3">📈 成长曲线</h3>
        <GrowthChart xpHistory={[]} currentXp={wawa.xp} hydration={wawa.hydration} />
      </div>

      {/* 聊天区域 */}
      <div className="glass-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-blue-700">💬 和水滴娃聊天</h3>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {['我今天有点焦虑...', '推荐一个学习计划', '讲个笑话给我听', '职场小白该准备什么？'].map((qa, i) => (
            <button
              key={i}
              onClick={() => setInput(qa)}
              className="shrink-0 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-full hover:bg-blue-100 transition-colors whitespace-nowrap"
            >
              {qa}
            </button>
          ))}
        </div>

        <div className="h-48 overflow-y-auto space-y-2 text-sm">
          {chatMessages.length === 0 && (
            <p className="text-center text-gray-400 text-xs py-8">
              戳上面的按钮或者输入消息，和水滴娃聊天吧～ 💧
            </p>
          )}
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                    : 'bg-white/80 text-gray-700'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/80 px-4 py-2 rounded-2xl text-sm text-gray-400">
                水滴娃正在游过来...💧
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="和水滴娃说点什么..."
            className="flex-1 px-4 py-2 bg-white/70 border border-blue-100 rounded-full text-sm focus:outline-none focus:border-blue-300 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full text-sm font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
