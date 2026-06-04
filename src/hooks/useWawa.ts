'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStorage, setStorage } from '@/lib/storage';
import type { WawaState } from '@/lib/wawa';
import {
  calculateLevel,
  getStage,
  getGrade,
} from '@/lib/wawa';

const DEFAULT_WAWA: WawaState = {
  name: '',
  avatar: '💧',
  level: 1,
  xp: 0,
  hydration: 80,
  stage: 'stream',
  grade: 'freshman',
  createdAt: '',
  career: undefined,
};

export function useWawa() {
  const [wawa, setWawa] = useState<WawaState>(DEFAULT_WAWA);
  const [mounted, setMounted] = useState(false);

  // 初始化加载
  useEffect(() => {
    const saved = getStorage<WawaState>('wawa', DEFAULT_WAWA);
    // 重新计算派生值
    if (saved.name) {
      saved.level = calculateLevel(saved.xp);
      saved.stage = getStage(saved.level);
      saved.grade = getGrade(saved.level);
    }
    setWawa(saved);
    setMounted(true);
  }, []);

  // 持久化
  const saveWawa = useCallback((updated: WawaState) => {
    setStorage('wawa', updated);
    setWawa(updated);
  }, []);

  // 创建水滴娃
  const createWawa = useCallback((name: string, avatar: string) => {
    const newWawa: WawaState = {
      ...DEFAULT_WAWA,
      name,
      avatar,
      hydration: 100,
      createdAt: new Date().toISOString(),
    };
    saveWawa(newWawa);
  }, [saveWawa]);

  // 增加经验
  const addXp = useCallback((amount: number) => {
    setWawa(prev => {
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp);
      const updated: WawaState = {
        ...prev,
        xp: newXp,
        level: newLevel,
        stage: getStage(newLevel),
        grade: getGrade(newLevel),
      };
      setStorage('wawa', updated);
      return updated;
    });
  }, []);

  // 增加滋润度
  const addHydration = useCallback((amount: number) => {
    setWawa(prev => {
      const updated: WawaState = {
        ...prev,
        hydration: Math.min(100, prev.hydration + amount),
      };
      setStorage('wawa', updated);
      return updated;
    });
  }, []);

  // 每日衰减滋润度
  const tickHydration = useCallback(() => {
    setWawa(prev => {
      const lastTick = getStorage<string>('lastHydrationTick', '');
      const today = new Date().toDateString();
      if (lastTick === today) return prev; // 今天已衰减过
      setStorage('lastHydrationTick', today);
      const updated: WawaState = {
        ...prev,
        hydration: Math.max(0, prev.hydration - 5),
      };
      setStorage('wawa', updated);
      return updated;
    });
  }, []);

  // 设置职业方向
  const setCareer = useCallback((career: string) => {
    setWawa(prev => {
      const updated: WawaState = { ...prev, career };
      setStorage('wawa', updated);
      return updated;
    });
  }, []);

  return {
    wawa,
    mounted,
    createWawa,
    addXp,
    addHydration,
    tickHydration,
    setCareer,
  };
}
