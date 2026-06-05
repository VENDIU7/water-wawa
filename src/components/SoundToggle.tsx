'use client';

import { useState, useRef, useCallback } from 'react';

// 用 Web Audio API 合成治愈系海浪声
function createWaveSound(audioCtx: AudioContext) {
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.3; // 提升整体音量
  masterGain.connect(audioCtx.destination);

  const allNodes: AudioNode[] = [];

  // --- 第1层：深沉的低频"隆隆"潮声 ---
  function createDeepRumble() {
    const bufferSize = 4 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 180;
    lowpass.Q.value = 0.3;

    // 缓慢的潮汐起伏 (8-12秒一个周期)
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // 10秒一个潮汐周期
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 60;
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);
    lfo.start();

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5;

    // 波浪振幅调制：模拟海浪一波一波拍打
    const ampLfo = audioCtx.createOscillator();
    ampLfo.type = 'sine';
    ampLfo.frequency.value = 0.12;
    const ampMod = audioCtx.createGain();
    ampMod.gain.value = 0.2;
    ampLfo.connect(ampMod);
    ampMod.connect(gainNode.gain);
    ampLfo.start();

    noise.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(masterGain);
    noise.start();

    allNodes.push(noise, lowpass, gainNode, lfo, lfoGain, ampLfo, ampMod);
  }

  // --- 第2层：中频"沙沙"浪花声 ---
  function createMidFoam() {
    const bufferSize = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 600;
    bandpass.Q.value = 0.4;

    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.09;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 350;
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);
    lfo.start();

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.25;

    // 独立的振幅节奏
    const ampLfo = audioCtx.createOscillator();
    ampLfo.type = 'sine';
    ampLfo.frequency.value = 0.15;
    const ampMod = audioCtx.createGain();
    ampMod.gain.value = 0.1;
    ampLfo.connect(ampMod);
    ampMod.connect(gainNode.gain);
    ampLfo.start();

    noise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(masterGain);
    noise.start();

    allNodes.push(noise, bandpass, gainNode, lfo, lfoGain, ampLfo, ampMod);
  }

  // --- 第3层：高频"沙沙"泡沫消退 ---
  function createHighFoam() {
    const bufferSize = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.08;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const highpass = audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 1200;
    highpass.Q.value = 0.2;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.1;

    // 高频有节奏地出现和消失
    const ampLfo = audioCtx.createOscillator();
    ampLfo.type = 'sine';
    ampLfo.frequency.value = 0.17;
    const ampMod = audioCtx.createGain();
    ampMod.gain.value = 0.06;
    ampLfo.connect(ampMod);
    ampMod.connect(gainNode.gain);
    ampLfo.start();

    noise.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(masterGain);
    noise.start();

    allNodes.push(noise, highpass, gainNode, ampLfo, ampMod);
  }

  // --- 第4层：偶尔的"啪嗒"水声 ---
  function createWaterDrops() {
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;

    // 用低频振荡器模拟滴水声
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 80;

    const dropGain = audioCtx.createGain();
    dropGain.gain.value = 0;

    osc.connect(dropGain);
    dropGain.connect(gainNode);
    gainNode.connect(masterGain);
    osc.start();

    // 随机触发水滴声 (每3-8秒一次)
    function scheduleDrop() {
      const delay = 3 + Math.random() * 5;
      const now = audioCtx.currentTime;
      const t = now + delay;

      osc.frequency.setValueAtTime(40 + Math.random() * 80, t);
      dropGain.gain.setValueAtTime(0, t);
      dropGain.gain.linearRampToValueAtTime(0.05, t + 0.05);
      dropGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      setTimeout(scheduleDrop, delay * 1000);
    }
    scheduleDrop();

    allNodes.push(osc, dropGain, gainNode);
  }

  createDeepRumble();
  createMidFoam();
  createHighFoam();
  createWaterDrops();

  return () => {
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
        cleanupRef.current = createWaveSound(ctx);
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
      title={enabled ? '关闭海浪音效' : '打开海浪音效'}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}
