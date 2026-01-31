import type { Position } from './game.types';
import type { GameConfig } from './game.types';
import { GAME_CONFIG } from './game.constants';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

/** Соседняя ячейка в заданном направлении или null, если за границей */
export function getNeighbor(
  pos: Position,
  direction: SwipeDirection,
  config: GameConfig = GAME_CONFIG
): Position | null {
  const { rows, cols } = config;
  switch (direction) {
    case 'left':
      return pos.col > 0 ? { row: pos.row, col: pos.col - 1 } : null;
    case 'right':
      return pos.col < cols - 1 ? { row: pos.row, col: pos.col + 1 } : null;
    case 'up':
      return pos.row > 0 ? { row: pos.row - 1, col: pos.col } : null;
    case 'down':
      return pos.row < rows - 1 ? { row: pos.row + 1, col: pos.col } : null;
    default:
      return null;
  }
}

/**
 * По смещению (deltaX, deltaY) определить направление свайпа.
 * Горизонталь/вертикаль выбирается по большей компоненте; порог задаёт минимальное смещение.
 */
export function getSwipeDirection(
  deltaX: number,
  deltaY: number,
  threshold: number
): SwipeDirection | null {
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  const primary = Math.max(absX, absY);
  if (primary < threshold) return null;
  if (absX >= absY) return deltaX > 0 ? 'right' : 'left';
  return deltaY > 0 ? 'down' : 'up';
}
