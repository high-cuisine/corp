'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Читает start_param из Telegram WebApp при старте приложения.
 * Формат: send_{token}_{username} → перенаправляет на /payment/send?token=...&to=...
 */
export default function StartParamRouter() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const check = () => {
      const startParam =
        window.Telegram?.WebApp?.initDataUnsafe?.start_param;
      if (!startParam || typeof startParam !== 'string') return false;

      const parts = startParam.split('_');
      // send_{token}_{username}
      if (parts[0] === 'send' && parts.length >= 3) {
        handled.current = true;
        const token = parts[1];
        const username = parts.slice(2).join('_');
        router.replace(`/payment/send?token=${token}&to=${username}`);
        return true;
      }
      return false;
    };

    if (check()) return;

    const interval = setInterval(() => {
      if (check()) clearInterval(interval);
    }, 150);

    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return null;
}
