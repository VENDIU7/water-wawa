'use client';

import { useState, useRef, useCallback } from 'react';

// 使用 Web Audio API 实时生成海浪白噪音
function createWaveSound(audioCtx: AudioContext) {
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.12;
  masterGain.connect(audioCtx.destination);

  // 创建多个噪声源模拟海浪层次
  const layers = [
    { freq: 200, gain: 0.4, rate: 0.08 },   // 低频深沉浪
    { freq: 400, gain: 0.3, rate: 0.06 },   // 中频浪花
    { freq: 800, gain: 0.15, rate: 0.1 },   // 高频泡沫
  ];

  const activeNodes: AudioNode[] = [];

  layers.forEach(({ freq, gain: layerGain, rate }) => {
    // 用振荡器 + 随机频率调制模拟噪声
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // 带通滤波器
    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = freq;
    bandpass.Q.value = 0.5;

    // LFO 调制频率，模拟潮汐起伏
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = rate;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = freq * 0.5;
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);
    lfo.start();

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = layerGain;

    noise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(masterGain);
    noise.start();

    activeNodes.push(noise, bandpass, gainNode, lfo, lfoGain);
  });

  // 返回清理函数
  return () => {
    activeNodes.forEach(node => {
      try { (node as any).stop?.(); } catch {}
      try { node.disconnect(); } catch {}
    });
    masterGain.disconnect();
  };
}

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const toggle = useCallback(() => {
    if (enabled) {
      // 停止音效
      cleanupRef.current?.();
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      cleanupRef.current = null;
      setEnabled(false);
    } else {
      // 启动音效
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;
        cleanupRef.current = createWaveSound(ctx);
        setEnabled(true);
      } catch {
        // Web Audio API 不可用
      }
    }
  }, [enabled]);

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
