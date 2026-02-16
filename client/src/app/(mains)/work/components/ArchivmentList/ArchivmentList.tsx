'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/entites/user/api/api';
import cls from './ArchivmentList.module.scss';

export interface AchievementItem {
  id: number;
  title: string;
  description: string;
  type: string;
  targetValue: number | null;
  sortOrder: number;
  obtained: boolean;
}

const ArchivmentList = () => {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    userService
      .getAchievements()
      .then((data) => {
        if (!cancelled) {
          setAchievements(data.achievements);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? 'Не удалось загрузить достижения');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className={cls.section}>
        <h2 className={cls.title}>Достижения</h2>
        <p className={cls.loading}>Загрузка...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cls.section}>
        <h2 className={cls.title}>Достижения</h2>
        <p className={cls.error}>{error}</p>
      </section>
    );
  }

  return (
    <section className={cls.section}>
      <h2 className={cls.title}>Достижения</h2>
      <ul className={cls.list}>
        {achievements.map((item) => (
          <li
            key={item.id}
            className={item.obtained ? cls.item : cls.itemLocked}
          >
            <span className={cls.icon} aria-hidden>
              {item.obtained ? '🏆' : '🔒'}
            </span>
            <span className={cls.description}>{item.description}</span>
            {item.obtained && <span className={cls.badge}>Получено</span>}
          </li>
        ))}
      </ul>
      {achievements.length === 0 && (
        <p className={cls.empty}>Пока нет достижений</p>
      )}
    </section>
  );
};

export { ArchivmentList };
