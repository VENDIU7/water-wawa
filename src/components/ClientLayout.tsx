'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from './BottomNav';
import SoundToggle from './SoundToggle';
import WaveBackground from './WaveBackground';
import ErrorBoundary from './ErrorBoundary';
import { useState, useEffect } from 'react';
import { getStorage } from '@/lib/storage';
import { getStage, calculateLevel } from '@/lib/wawa';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [stage, setStage] = useState<'stream' | 'river' | 'ocean'>('stream');

  useEffect(() => {
    const wawa = getStorage<{ xp: number }>('wawa', { xp: 0 });
    if (wawa && typeof wawa.xp === 'number') {
      setStage(getStage(calculateLevel(wawa.xp)));
    }
  }, [pathname]);

  return (
    <>
      <WaveBackground stage={stage} />
      <SoundToggle />
      <main className="flex-1 pb-20 max-w-lg mx-auto w-full px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ErrorBoundary>{children}</ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </>
  );
}
