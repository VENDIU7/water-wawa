'use client';

import { useState, useRef, useCallback } from 'react';

// 治愈系真实海浪声
function createOceanSound(audioCtx: AudioContext) {
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.2;
  masterGain.connect(audioCtx.destination);

  const allNodes: AudioNode[] = [];

  function createNoiseBuffer(duration: number, volume: number): AudioBuffer {
    const size = duration * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = (Math.random() * 2 - 1) * volume;
    }
    return buffer;
  }

  // === 第1层：深远低频潮声（暖色调） ===
  function createDeepSwell() {
    const noise = audioCtx.createBufferSource();
    noise.buffer = createNoiseBuffer(6, 0.12);
    noise.loop = true;

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 200;
    lowpass.Q.value = 0.15;

    // 12秒潮汐周期：慢慢涨起，缓缓退去
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.083;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 60;
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);
    lfo.start();

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.45;

    // 潮汐振幅包络
    const swellLfo = audioCtx.createOscillator();
    swellLfo.type = 'sine';
    swellLfo.frequency.value = 0.083;
    const swellMod = audioCtx.createGain();
    swellMod.gain.value = 0.15;
    swellLfo.connect(swellMod);
    swellMod.connect(gainNode.gain);
    swellLfo.start();

    noise.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(masterGain);
    noise.start();

    allNodes.push(noise, lowpass, gainNode, lfo, lfoGain, swellLfo, swellMod);
  }

  // === 第2层：中层浪花冲刷声 ===
  function createMidWash() {
    const noise = audioCtx.createBufferSource();
    noise.buffer = createNoiseBuffer(4, 0.1);
    noise.loop = true;

    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 500;
    bandpass.Q.value = 0.3;

    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);
    lfo.start();

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.2;

    // 浪花冲刷节奏
    const washLfo = audioCtx.createOscillator();
    washLfo.type = 'sine';
    washLfo.frequency.value = 0.11;
    const washMod = audioCtx.createGain();
    washMod.gain.value = 0.08;
    washLfo.connect(washMod);
    washMod.connect(gainNode.gain);
    washLfo.start();

    noise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(masterGain);
    noise.start();

    allNodes.push(noise, bandpass, gainNode, lfo, lfoGain, washLfo, washMod);
  }

  // === 第3层：泡沫消退的沙沙声 ===
  function createFoamRetreat() {
    const noise = audioCtx.createBufferSource();
    noise.buffer = createNoiseBuffer(3, 0.08);
    noise.loop = true;

    const highpass = audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 1000;
    highpass.Q.value = 0.15;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.08;

    // 泡沫消退节奏
    const retreatLfo = audioCtx.createOscillator();
    retreatLfo.type = 'sine';
    retreatLfo.frequency.value = 0.09;
    const retreatMod = audioCtx.createGain();
    retreatMod.gain.value = 0.05;
    retreatLfo.connect(retreatMod);
    retreatMod.connect(gainNode.gain);
    retreatLfo.start();

    noise.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(masterGain);
    noise.start();

    allNodes.push(noise, highpass, gainNode, retreatLfo, retreatMod);
  }

  // === 第4层：轻柔海风 ===
  function createSeaBreeze() {
    const noise = audioCtx.createBufferSource();
    noise.buffer = createNoiseBuffer(4, 0.06);
    noise.loop = true;

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 150;
    lowpass.Q.value = 0.05;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.05;

    // 海风时有时无
    const breezeLfo = audioCtx.createOscillator();
    breezeLfo.type = 'sine';
    breezeLfo.frequency.value = 0.04;
    const breezeMod = audioCtx.createGain();
    breezeMod.gain.value = 0.03;
    breezeLfo.connect(breezeMod);
    breezeMod.connect(gainNode.gain);
    breezeLfo.start();

    noise.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(masterGain);
    noise.start();

    allNodes.push(noise, lowpass, gainNode, breezeLfo, breezeMod);
  }

  createDeepSwell();
  createMidWash();
  createFoamRetreat();
  createSeaBreeze();

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
        cleanupRef.current = createOceanSound(ctx);
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
