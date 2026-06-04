'use client';

import { useState, useEffect, useRef } from 'react';

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 尝试加载波浪音效
    try {
      const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_c6d4c9e2c9.mp3?filename=ocean-waves-112906.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audioRef.current = audio;
    } catch {
      // 音频加载失败则静默处理
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (enabled) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setEnabled(!enabled);
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm border border-blue-200 shadow-md flex items-center justify-center text-lg hover:bg-white transition-all duration-200 hover:scale-110 active:scale-95"
      title={enabled ? '关闭海浪音效' : '打开海浪音效'}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}
