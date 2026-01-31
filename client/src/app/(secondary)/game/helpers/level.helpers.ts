import type { LevelConfig } from './game.types';
import { GAME_ICON_PATHS } from './gemIcons';

const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 20;

export interface GetLevelConfigOptions {
  /** Массив URL/data URL изображений для типов камней. Если не передан — используются иконки по умолчанию. */
  gemIconUrls?: string[];
  /** Итоговое количество очков для прохождения уровня. Если не передано — считается по формуле 80 + difficulty × 50. */
  targetScore?: number;
  /** Лимит времени уровня в секундах. Если не передано — считается по формуле level + level/20. 0 = без таймера. */
  timeLimitSeconds?: number;
}

/**
 * Генератор уровня по сложности (1–20).
 * Возвращает конфиг с размером сетки, числом типов, целевыми очками и массивом изображений.
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

  // Типов камней: 4 при 1–5, 5 при 6–10, 6 при 11–15, 7 при 16–20.
  // Не больше, чем иконок — иначе один и тот же рисунок показывается разным типам и «совпадения» не работают.
  const gemTypesCount = Math.min(
    4 + Math.floor((d - 1) / 5),
    gemIconUrls.length
  );

  // Целевые очки: переданное значение или формула по сложности (80 + d × 50)
  const targetScore = customTargetScore ?? (80 + d * 50);

  // Лимит времени: переданное значение или level + level/20 (в секундах, округлённо)
  const timeLimitSeconds =
    customTimeLimit ?? Math.round(d + d / 20) * 60;

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
