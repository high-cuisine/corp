import type { LevelConfig } from './game.types';
import { GAME_ICON_PATHS } from './gemIcons';

const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 20;

export interface GetLevelConfigOptions {
  /** Массив URL/data URL изображений для типов камней. Если не передан — используются иконки по умолчанию. */
  gemIconUrls?: string[];
  /** Итоговое количество очков для прохождения уровня. Если не передано — считается по размеру поля и сложности. */
  targetScore?: number;
  /** Лимит времени уровня в секундах. Если не передано — считается по целевым очкам и сложности (1 уровень самый щадящий). 0 = без таймера. */
  timeLimitSeconds?: number;
}

/**
 * Генератор уровня по сложности (1–20).
 * Уровень 1 — самый лёгкий (мало очков, много времени), дальше сложность растёт, но уровни остаются проходимыми.
 */
export function getLevelConfig(
  difficulty: number,
  options: GetLevelConfigOptions = {}
): LevelConfig {
  const d = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, Math.floor(difficulty)));
  const {
    gemIconUrls = GAME_ICON_PATHS,
    targetScore: customTargetScore,
    timeLimitSeconds: customTimeLimit,
  } = options;

  // Сетка: 5×5 при 1–4, 6×6 при 5–8, 7×7 при 9–12, 8×8 при 13–16, 9×9 при 17–20
  const size = 5 + Math.floor((d - 1) / 4);
  const rows = size;
  const cols = size;
  // Типов камней: 4 при 1–5, 5 при 6–10, 6 при 11–15, 7 при 16–20
  const gemTypesCount = Math.min(
    4 + Math.floor((d - 1) / 5),
    gemIconUrls.length
  );

  // Целевые очки: выше, чтобы было что набирать. Уровень 1: 160, уровень 20: 1300.
  const targetScore = customTargetScore ?? (100 + d * 60);

  // Время: уровень 1 — 2.5 мин (150 с на 160 очков), дальше жёстче.
  // Уровень 1: ~0.94 с/очко → 2.5 мин. Уровень 20: ~0.55 с/очко → ~12 мин на 1300.
  const secondsPerPoint = Math.max(0.55, 0.94 - (d - 1) * 0.02);
  const timeLimitSeconds =
    customTimeLimit ?? Math.round(targetScore * secondsPerPoint);

  return {
    difficulty: d,
    rows,
    cols,
    gemTypesCount,
    minMatchLength: 3,
    targetScore,
    timeLimitSeconds,
    gemIconUrls: [...gemIconUrls],
  };
}

export function getMinDifficulty(): number {
  return MIN_DIFFICULTY;
}

export function getMaxDifficulty(): number {
  return MAX_DIFFICULTY;
}
