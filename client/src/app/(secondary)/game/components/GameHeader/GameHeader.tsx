'use client';

import cls from './GameHeader.module.scss';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const TimerIcon = () => (
  <svg className={cls.pillIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const StarIcon = () => (
  <svg className={cls.pillIconStar} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

interface GameHeaderProps {
  score: number;
  targetScore: number;
  /** Оставшееся время в секундах (обратный отсчёт). Если timeLimitSeconds === 0, блок таймера не показывается. */
  remainingSeconds?: number;
  /** Лимит времени уровня в секундах (0 = без таймера) */
  timeLimitSeconds?: number;
  onExitClick: () => void;
}

export function GameHeader({
  score,
  targetScore,
  remainingSeconds = 0,
  timeLimitSeconds = 0,
  onExitClick,
}: GameHeaderProps) {
  const showTimer = timeLimitSeconds > 0;

  return (
    <header className={cls.header}>
      <button
        type="button"
        className={cls.exitButton}
        onClick={onExitClick}
        aria-label="Выйти из игры"
      >
        Выйти
      </button>
      <div className={cls.pills}>
        {showTimer && (
          <div className={cls.pill}>
            <TimerIcon />
            <span className={cls.pillValue}>{formatTime(remainingSeconds)}</span>
          </div>
        )}
        <div className={cls.pill}>
          <StarIcon />
          <span className={cls.pillValue}>{score} / {targetScore}</span>
        </div>
      </div>
    </header>
  );
}
