'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useWawa } from '@/hooks/useWawa';
import { AVATARS } from '@/lib/wawa';

export default function CreateWawaPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const { createWawa } = useWawa();
  const router = useRouter();

  const handleCreate = () => {
    if (!name.trim()) return;
    createWawa(name.trim(), selectedAvatar);
    router.push('/');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
      {/* Step 1: 选择外观 */}
      {step === 1 && (
        <motion.div
          className="text-center space-y-6 w-full"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <h1 className="text-2xl font-bold text-blue-800">选择你的水滴娃外观 💧</h1>
          <p className="text-blue-500 text-sm">每个水滴娃都是独一无二的～</p>

          <div className="grid grid-cols-4 gap-4 max-w-xs mx-auto">
            {AVATARS.map(avatar => (
              <motion.button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-200 ${
                  selectedAvatar === avatar
                    ? 'bg-gradient-to-br from-cyan-300 to-blue-400 shadow-lg shadow-blue-300/40 scale-110 border-2 border-white'
                    : 'bg-white/60 hover:bg-white/80 border-2 border-transparent'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                {avatar}
              </motion.button>
            ))}
          </div>

          <motion.div
            className="flex justify-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-6xl">{selectedAvatar}</span>
          </motion.div>

          <button
            onClick={() => setStep(2)}
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-semibold shadow-lg shadow-blue-300/40 hover:shadow-xl hover:scale-105 transition-all"
          >
            选定外观，下一步 →
          </button>
        </motion.div>
      )}

      {/* Step 2: 命名 */}
      {step === 2 && (
        <motion.div
          className="text-center space-y-6 w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="flex justify-center">
            <motion.span
              className="text-6xl"
              animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {selectedAvatar}
            </motion.span>
          </div>

          <h1 className="text-2xl font-bold text-blue-800">给你的水滴娃取个名字吧 🌊</h1>
          <p className="text-blue-500 text-sm">一个好名字是成长的开始～</p>

          <div className="max-w-xs mx-auto">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="例如：小蓝、浪花、泡泡..."
              maxLength={12}
              className="w-full px-5 py-3 bg-white/70 border-2 border-blue-200 rounded-2xl text-center text-lg text-blue-800 placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-all"
              autoFocus
            />
            <p className="text-xs text-blue-400 mt-2">{name.length}/12 个字符</p>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2.5 bg-white/60 text-blue-600 rounded-full font-medium hover:bg-white transition-all"
            >
              ← 返回
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="px-8 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-semibold shadow-lg shadow-blue-300/40 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ 创造水滴娃！
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
