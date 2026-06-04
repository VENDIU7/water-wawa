'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface WaveBackgroundProps {
  stage: 'stream' | 'river' | 'ocean';
}

// 不同阶段的背景色
const stageColors = {
  stream: {
    bg: 'from-cyan-200 via-blue-300 to-sky-200',
    wave1: 'rgba(255,255,255,0.3)',
    wave2: 'rgba(100,180,220,0.25)',
    wave3: 'rgba(70,140,200,0.2)',
  },
  river: {
    bg: 'from-sky-300 via-blue-400 to-cyan-300',
    wave1: 'rgba(255,255,255,0.25)',
    wave2: 'rgba(60,140,210,0.3)',
    wave3: 'rgba(30,100,180,0.25)',
  },
  ocean: {
    bg: 'from-blue-400 via-blue-600 to-indigo-500',
    wave1: 'rgba(255,255,255,0.2)',
    wave2: 'rgba(40,100,190,0.35)',
    wave3: 'rgba(20,60,150,0.3)',
  },
};

export default function WaveBackground({ stage }: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = stageColors[stage];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let offset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const h = canvas.height;
      const w = canvas.width;

      // 第一层波浪
      ctx.fillStyle = colors.wave1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.7);
      for (let x = 0; x <= w; x += 3) {
        const y = h * 0.7 + Math.sin(x * 0.008 + offset) * 30 + Math.sin(x * 0.02) * 15;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // 第二层波浪
      ctx.fillStyle = colors.wave2;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.78);
      for (let x = 0; x <= w; x += 3) {
        const y = h * 0.78 + Math.sin(x * 0.01 + offset * 1.5) * 25 + Math.cos(x * 0.015) * 18;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // 第三层波浪
      ctx.fillStyle = colors.wave3;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.85);
      for (let x = 0; x <= w; x += 3) {
        const y = h * 0.85 + Math.cos(x * 0.012 + offset * 0.8) * 35 + Math.sin(x * 0.018) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      offset += 0.015;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [stage]);

  return (
    <div className="fixed inset-0 -z-10">
      {/* 渐变背景 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} transition-all duration-1000`} />
      {/* Canvas波浪 */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* 粒子光点 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
