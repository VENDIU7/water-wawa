'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', icon: '💧', label: '水滴娃' },
  { href: '/schedule', icon: '📅', label: '日程' },
  { href: '/quest', icon: '⚔️', label: '闯关' },
  { href: '/ocean', icon: '🌊', label: '大海职场' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-blue-100 shadow-lg shadow-blue-200/20">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-10 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-xs mt-0.5 font-medium transition-colors duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
