'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authService } from '@/features/user/authService';
import { useGameBoard } from './hooks';
import { GameHeader } from './components';
import cls from './game.module.scss';

const GameBoardCanvas = dynamic(
  () =>
    import('./components').then((mod) => mod.GameBoardCanvas),
  { ssr: false }
);

export default function GamePage() {
  const router = useRouter();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const {
    board,
    score,
    isAnimating,
    levelConfig,
    levelNumber,
    targetScore,
    levelComplete,
    gameOver,
    gameOverReason,
    remainingSeconds,
    elapsedSeconds,
    timeLimitSeconds,
    trySwap,
    applySwap,
    setAnimateRemoveHandler,
    startNextLevel,
    resetGame,
  } = useGameBoard(1, {
    // targetScore: 500,        // итоговое кол-во очков для уровня (если не задано — считается по сложности)
    // timeLimitSeconds: 120,   // лимит времени в секундах (если не задано — считается по сложности)
    // gemIconUrls: ['/gems/1.svg', ...],  // опционально: свои картинки для типов камней
  });

  const handleNextLevel = async () => {
    try {
      await authService.completeLevel();
    } catch (error) {
      console.error('Failed to complete level on server', error);
    } finally {
      startNextLevel();
    }
  };

  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    router.push('/');
  };

  return (
    <div className={cls.game}>
      <GameHeader
        score={score}
        targetScore={targetScore}
        remainingSeconds={remainingSeconds}
        timeLimitSeconds={timeLimitSeconds}
        onExitClick={() => setShowExitConfirm(true)}
      />
      <main className={cls.main}>
        <GameBoardCanvas
          board={board}
          levelConfig={levelConfig}
          isAnimating={isAnimating}
          trySwap={trySwap}
          applySwap={applySwap}
          setAnimateRemoveHandler={setAnimateRemoveHandler}
        />
      </main>
      {levelComplete && (
        <div className={cls.levelCompleteOverlay}>
          <div className={cls.levelCompleteCard}>
            <h2 className={cls.levelCompleteTitle}>Уровень пройден!</h2>
            <p className={cls.levelCompleteScore}>
              Очки: {score} / {targetScore}
            </p>
            <button
              type="button"
              className={cls.levelCompleteButton}
              onClick={handleNextLevel}
            >
              {levelNumber < 20 ? 'Следующий уровень' : 'Играть снова'}
            </button>
          </div>
        </div>
      )}
      {gameOver && (
        <div className={cls.gameOverOverlay}>
          <div className={cls.gameOverCard}>
            <h2 className={cls.gameOverTitle}>
              {gameOverReason === 'no_moves' ? 'Ходов больше нет' : 'Время вышло'}
            </h2>
            <p className={cls.gameOverScore}>Очки: {score}</p>
            {timeLimitSeconds > 0 && (
              <p className={cls.gameOverTime}>
                Время: {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}
              </p>
            )}
            <div className={cls.gameOverActions}>
              <button
                type="button"
                className={cls.gameOverButtonSecondary}
                onClick={resetGame}
              >
                Играть снова
              </button>
              <button
                type="button"
                className={cls.gameOverButtonPrimary}
                onClick={() => setShowExitConfirm(true)}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
      {showExitConfirm && (
        <div className={cls.exitConfirmOverlay}>
          <div className={cls.exitConfirmCard}>
            <p className={cls.exitConfirmText}>Выйти из игры?</p>
            <div className={cls.exitConfirmActions}>
              <button
                type="button"
                className={cls.exitConfirmCancel}
                onClick={() => setShowExitConfirm(false)}
              >
                Отмена
              </button>
              <button
                type="button"
                className={cls.exitConfirmOk}
                onClick={handleExitConfirm}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
