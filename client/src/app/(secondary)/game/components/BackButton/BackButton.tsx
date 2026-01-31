'use client';

import Link from 'next/link';
import cls from './BackButton.module.scss';

export function BackButton() {
  return (
    <Link href="/" className={cls.backButton} aria-label="Назад">
      <svg
        width="6"
        height="11"
        viewBox="0 0 6 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cls.icon}
      >
        <path
          d="M5 1L1 5.5L5 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={cls.label}>Назад</span>
    </Link>
  );
}
