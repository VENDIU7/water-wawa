// 水滴娃核心逻辑：经验计算、干涸值、等级、成长阶段

export interface WawaState {
  name: string;
  avatar: string; // emoji
  level: number;
  xp: number;
  hydration: number; // 0-100, 越低越干涸
  stage: 'stream' | 'river' | 'ocean'; // 溪水 → 河流 → 大海
  grade: 'freshman' | 'sophomore' | 'junior' | 'senior'; // 大一~大四
  createdAt: string;
  career?: string;
}

export const AVATARS = ['💧', '🌊', '💦', '🐬', '🐳', '🫧', '🌧️', '❄️'];

export function getXpForLevel(level: number): number {
  return level * 100;
}

export function calculateLevel(xp: number): number {
  let level = 1;
  let xpNeeded = getXpForLevel(level);
  while (xp >= xpNeeded) {
    xp -= xpNeeded;
    level++;
    xpNeeded = getXpForLevel(level);
  }
  return Math.min(level, 20); // 最高20级
}

export function getXpProgress(xp: number): { current: number; needed: number; percent: number } {
  const level = calculateLevel(xp);
  let accumulated = 0;
  for (let i = 1; i < level; i++) {
    accumulated += getXpForLevel(i);
  }
  const currentLevelXp = xp - accumulated;
  const needed = getXpForLevel(level);
  return {
    current: currentLevelXp,
    needed,
    percent: Math.round((currentLevelXp / needed) * 100),
  };
}

export function getStage(level: number): WawaState['stage'] {
  if (level <= 5) return 'stream';
  if (level <= 12) return 'river';
  return 'ocean';
}

export function getGrade(level: number): WawaState['grade'] {
  if (level <= 5) return 'freshman';
  if (level <= 10) return 'sophomore';
  if (level <= 15) return 'junior';
  return 'senior';
}

export function getStageLabel(stage: WawaState['stage']): string {
  switch (stage) {
    case 'stream': return '溪水期';
    case 'river': return '河流期';
    case 'ocean': return '大海期';
  }
}

export function getGradeLabel(grade: WawaState['grade']): string {
  switch (grade) {
    case 'freshman': return '大一';
    case 'sophomore': return '大二';
    case 'junior': return '大三';
    case 'senior': return '大四';
  }
}

export function getLevelTitle(level: number): string {
  if (level <= 3) return '水滴初生';
  if (level <= 6) return '涓涓细流';
  if (level <= 9) return '小河奔流';
  if (level <= 13) return '江川汇入';
  if (level <= 17) return '海湾探索';
  return '汪洋大海';
}

export function getHydrationLabel(hydration: number): string {
  if (hydration >= 80) return '水润饱满 💧';
  if (hydration >= 50) return '状态不错 🌊';
  if (hydration >= 30) return '有些干涸 🏜️';
  if (hydration >= 10) return '急需滋润 🥀';
  return '极度干涸 ⚠️';
}

export function getHydrationColor(hydration: number): string {
  if (hydration >= 80) return '#4FC3F7';
  if (hydration >= 50) return '#29B6F6';
  if (hydration >= 30) return '#FFA726';
  if (hydration >= 10) return '#FF7043';
  return '#E53935';
}
