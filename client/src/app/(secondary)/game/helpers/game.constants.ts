import type { GameConfig } from './game.types';

/** Размер сетки и типы камней по макету Figma (5×5, ~66px ячейка) */
export const GAME_CONFIG: GameConfig = {
  rows: 5,
  cols: 5,
  gemTypesCount: 5,
  minMatchLength: 3,
};

/** Размер одной плитки в px (по макету ~66) */
export const TILE_SIZE_PX = 40;

/** Зазор между плитками в px */
export const TILE_GAP_PX = 20;

/** Базовый порог свайпа в px (экрана); для быстрых жестов используется меньший порог */
export const SWIPE_THRESHOLD_PX = 18;
/** Порог для быстрого свайпа (мс), ниже которого используется SWIPE_QUICK_THRESHOLD_PX */
export const SWIPE_QUICK_MAX_MS = 280;
/** Порог в px для быстрого свайпа (короткий жест) */
export const SWIPE_QUICK_THRESHOLD_PX = 10;

/** Цвета камней по типу (до 7 типов для уровней высокой сложности) */
export const GEM_COLORS: string[] = [
  '#E57373', // red
  '#81C784', // green
  '#64B5F6', // blue
  '#FFB74D', // orange
  '#BA68C8', // purple
  '#4DD0E1', // cyan
  '#FF8A65', // deep orange
];
