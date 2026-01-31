'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { Board, Position } from '../helpers/game.types';
import type { LevelConfig } from '../helpers/game.types';
import {
  createInitialBoard,
  cloneBoard,
  swapCells,
  areAdjacent,
} from '../helpers/board.helpers';
import { findMatchKeys, hasValidMoves, swapWouldCreateMatch } from '../helpers/match.helpers';
import { collapseAndRefill } from '../helpers/collapse.helpers';
import { getLevelConfig, type GetLevelConfigOptions } from '../helpers/level.helpers';

export type AnimateRemoveHandler = (
  keys: Set<string>,
  currentBoard: Board,
  nextBoard: Board,
  onComplete: () => void
) => void;

export interface UseGameBoardOptions extends GetLevelConfigOptions {}

const DEFAULT_LEVEL = 1;

export function useGameBoard(
  initialLevel: number = DEFAULT_LEVEL,
  options: UseGameBoardOptions = {}
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [levelNumber, setLevelNumber] = useState(initialLevel);
  const levelConfig = useMemo(
    () => getLevelConfig(levelNumber, optionsRef.current),
    [levelNumber, options.gemIconUrls, options.targetScore, options.timeLimitSeconds]
  );

  const [board, setBoard] = useState<Board>(() =>
    createInitialBoard(levelConfig)
  );
  const [selected, setSelected] = useState<Position | null>(null);
  const [score, setScore] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'time' | 'no_moves' | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(levelConfig.timeLimitSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animateRemoveHandlerRef = useRef<AnimateRemoveHandler | null>(null);

  const timeLimit = levelConfig.timeLimitSeconds;

  useEffect(() => {
    if (timeLimit <= 0) return;
    setRemainingSeconds(timeLimit);
    setElapsedSeconds(0);
  }, [levelNumber, timeLimit]);

  useEffect(() => {
    if (timeLimit <= 0 || gameOver || levelComplete) return;
    const id = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setGameOverReason('time');
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((e) => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [timeLimit, gameOver, levelComplete]);

  const setAnimateRemoveHandler = useCallback((handler: AnimateRemoveHandler | null) => {
    animateRemoveHandlerRef.current = handler;
  }, []);

  const resolveMatches = useCallback(
    (currentBoard: Board) => {
      setIsAnimating(true);
      let b = cloneBoard(currentBoard);
      let totalScore = 0;
      const config = levelConfig;

      const step = () => {
        const keys = findMatchKeys(b, config);
        if (keys.size === 0) {
          setBoard(b);
          setScore((s) => {
            const next = s + totalScore;
            if (next >= config.targetScore) {
              setLevelComplete(true);
            }
            return next;
          });
          setIsAnimating(false);
          if (!hasValidMoves(b, config)) {
            setGameOver(true);
            setGameOverReason('no_moves');
          }
          return;
        }
        totalScore += keys.size;
        const nextBoard = collapseAndRefill(b, keys, config);
        const handler = animateRemoveHandlerRef.current;

        if (handler) {
          handler(keys, b, nextBoard, () => {
            setBoard(nextBoard);
            b = nextBoard;
            setTimeout(step, 180);
          });
        } else {
          setBoard(nextBoard);
          b = nextBoard;
          setTimeout(step, 300);
        }
      };

      setTimeout(step, 200);
    },
    [levelConfig]
  );

  const selectCell = useCallback(
    (pos: Position) => {
      if (isAnimating || levelComplete || gameOver) return;

      if (selected == null) {
        setSelected(pos);
        return;
      }

      if (selected.row === pos.row && selected.col === pos.col) {
        setSelected(null);
        return;
      }

      if (!areAdjacent(selected, pos)) {
        setSelected(pos);
        return;
      }

      const next = cloneBoard(board);
      swapCells(next, selected, pos);
      if (swapWouldCreateMatch(next, selected, pos, levelConfig)) {
        setSelected(null);
        setBoard(next);
        resolveMatches(next);
      } else {
        setSelected(null);
      }
    },
    [board, selected, isAnimating, levelComplete, gameOver, levelConfig, resolveMatches]
  );

  /** Проверка обмена: возвращает результат без изменения состояния (для анимации в canvas) */
  const trySwap = useCallback(
    (
      from: Position,
      to: Position
    ): { valid: true; nextBoard: Board } | { valid: false } | null => {
      if (isAnimating || levelComplete || gameOver) return null;
      if (!areAdjacent(from, to)) return null;

      const next = cloneBoard(board);
      swapCells(next, from, to);
      if (swapWouldCreateMatch(next, from, to, levelConfig)) {
        return { valid: true as const, nextBoard: next };
      }
      return { valid: false as const };
    },
    [board, isAnimating, levelComplete, gameOver, levelConfig]
  );

  /** Применить обмен после анимации (обновляет доску и запускает resolve) */
  const applySwap = useCallback(
    (nextBoard: Board) => {
      setSelected(null);
      setBoard(nextBoard);
      resolveMatches(nextBoard);
    },
    [resolveMatches]
  );

  /** Начать следующий уровень (1–20, после 20 остаётся 20) */
  const startNextLevel = useCallback(() => {
    const nextLevel = Math.min(levelNumber + 1, 20);
    setLevelNumber(nextLevel);
    const nextConfig = getLevelConfig(nextLevel, optionsRef.current);
    setBoard(createInitialBoard(nextConfig));
    setSelected(null);
    setScore(0);
    setLevelComplete(false);
    setGameOver(false);
    setGameOverReason(null);
    setRemainingSeconds(nextConfig.timeLimitSeconds);
    setElapsedSeconds(0);
    setIsAnimating(false);
  }, [levelNumber]);

  /** Сброс текущего уровня (в т.ч. после game over) */
  const resetGame = useCallback(() => {
    setBoard(createInitialBoard(levelConfig));
    setSelected(null);
    setScore(0);
    setLevelComplete(false);
    setGameOver(false);
    setGameOverReason(null);
    setRemainingSeconds(levelConfig.timeLimitSeconds);
    setElapsedSeconds(0);
    setIsAnimating(false);
  }, [levelConfig]);

  return {
    board,
    selected,
    score,
    isAnimating,
    levelConfig,
    levelNumber,
    targetScore: levelConfig.targetScore,
    levelComplete,
    gameOver,
    gameOverReason,
    remainingSeconds,
    elapsedSeconds,
    timeLimitSeconds: levelConfig.timeLimitSeconds,
    selectCell,
    trySwap,
    applySwap,
    setAnimateRemoveHandler,
    startNextLevel,
    resetGame,
    isSelected: (pos: Position) =>
      selected != null && selected.row === pos.row && selected.col === pos.col,
  };
}
