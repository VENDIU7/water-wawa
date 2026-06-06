'use client';

import { useState, useRef, useCallback } from 'react';

// 治愈系森林溪流音效合成
function createStreamSound(audioCtx: AudioContext) {
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.15; // 柔和的整体音量
  masterGain.connect(audioCtx.destination);

  const allNodes: AudioNode[] = [];
  const allTimers: ReturnType<typeof setTimeout>[] = [];

  // ========== 第1层：轻柔溪流声（粉红噪声 + 低通滤波） ==========
  function createGentleStream() {
    const bufferSize = 4 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    // 粉红噪声：比白噪声更温暖、更接近自然流水
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // 低通滤波：去掉刺耳高频，只保留温暖的中低频流水声
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 400;
    lowpass.Q.value = 0.2;

    // 缓慢起伏模拟溪流自然变化
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.06; // 非常缓慢的起伏
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 150;
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);
    lfo.start();

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.6;

    noise.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(masterGain);
    noise.start();

    allNodes.push(noise, lowpass, gainNode, lfo, lfoGain);
  }

  // ========== 第2层：更高频的浅流声（模拟小溪流过石头的淙淙声） ==========
  function createBabblingBrook() {
    const bufferSize = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.06;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 800;
    bandpass.Q.value = 0.6;

    // 淙淙声有节奏地出现
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.14;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);
    lfo.start();

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.15;

    noise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(masterGain);
    noise.start();

    allNodes.push(noise, bandpass, gainNode, lfo, lfoGain);
  }

  // ========== 第3层：水珠滴落声（每2-3秒一滴） ==========
  function createWaterDrops() {
    function playDrop() {
      const now = audioCtx.currentTime;

      // 水滴主频
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(200 + Math.random() * 100, now + 0.3);

      // 谐波增添清脆感
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1200 + Math.random() * 600, now);
      osc2.frequency.exponentialRampToValueAtTime(500, now + 0.15);

      const dropGain = audioCtx.createGain();
      dropGain.gain.setValueAtTime(0.03, now);
      dropGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(dropGain);
      osc2.connect(dropGain);
      dropGain.connect(masterGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.6);
      osc2.stop(now + 0.3);

      // 清理
      setTimeout(() => {
        try { osc.disconnect(); osc2.disconnect(); dropGain.disconnect(); } catch {}
      }, 1000);

      // 随机间隔 2-3秒
      const delay = 2000 + Math.random() * 1000;
      const timer = setTimeout(playDrop, delay);
      allTimers.push(timer);
    }
    playDrop();
  }

  // ========== 第4层：微风拂过水面（超低音量低通白噪声） ==========
  function createBreeze() {
    const bufferSize = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.04;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 250;
    lowpass.Q.value = 0.1;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;

    // 微风偶尔吹过（随机渐入渐出）
    function breezeCycle() {
      const now = audioCtx.currentTime;
      const duration = 4 + Math.random() * 6; // 4-10秒
      const pause = 5 + Math.random() * 15;   // 间隔5-20秒

      gainNode.gain.linearRampToValueAtTime(0.08, now + duration * 0.3);
      gainNode.gain.linearRampToValueAtTime(0.08, now + duration * 0.7);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);

      const timer = setTimeout(breezeCycle, (duration + pause) * 1000);
      allTimers.push(timer);
    }
    breezeCycle();

    noise.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(masterGain);
    noise.start();

    allNodes.push(noise, lowpass, gainNode);
  }

  // ========== 第5层：远处小鸟轻鸣 ==========
  function createBirdChirps() {
    function playBird() {
      const now = audioCtx.currentTime;

      // 用两个快速调制正弦波模拟鸟鸣
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';

      const freqBase = 1800 + Math.random() * 1200; // 高频鸟鸣
      const modOsc = audioCtx.createOscillator();
      modOsc.type = 'sine';
      modOsc.frequency.value = 8 + Math.random() * 15; // 颤音频率
      const modGain = audioCtx.createGain();
      modGain.gain.value = 300;
      modOsc.connect(modGain);
      modGain.connect(osc.frequency);
      modOsc.start(now);
      modOsc.stop(now + 0.25);

      osc.frequency.setValueAtTime(freqBase, now);

      const chirpGain = audioCtx.createGain();
      chirpGain.gain.setValueAtTime(0, now);
      chirpGain.gain.linearRampToValueAtTime(0.02, now + 0.03);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(chirpGain);
      chirpGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.3);

      setTimeout(() => {
        try { osc.disconnect(); modOsc.disconnect(); modGain.disconnect(); chirpGain.disconnect(); } catch {}
      }, 1000);

      // 偶尔出现（间隔8-25秒）
      const delay = 8000 + Math.random() * 17000;
      const timer = setTimeout(playBird, delay);
      allTimers.push(timer);
    }
    playBird();
  }

  createGentleStream();
  createBabblingBrook();
  createWaterDrops();
  createBreeze();
  createBirdChirps();

  return () => {
    allTimers.forEach(t => clearTimeout(t));
    allTimers.length = 0;
    allNodes.forEach(node => {
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
      cleanupRef.current?.();
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      cleanupRef.current = null;
      setEnabled(false);
    } else {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;
        cleanupRef.current = createStreamSound(ctx);
        setEnabled(true);
      } catch {
        // 静默处理
      }
    }
  }, [enabled]);

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm border border-blue-200 shadow-md flex items-center justify-center text-lg hover:bg-white transition-all duration-200 hover:scale-110 active:scale-95"
      title={enabled ? '关闭溪流音效' : '打开溪流音效'}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}
