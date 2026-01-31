import type { Board, BoardCell } from './game.types';
import type { GameConfig } from './game.types';
import { GAME_CONFIG } from './game.constants';
import { createCell } from './board.helpers';

/** Удалить совпавшие ячейки (заменить на null), затем обрушить и заполнить сверху. Возвращает новую доску. */
export function collapseAndRefill(
  board: Board,
  keysToRemove: Set<string>,
  config: GameConfig = GAME_CONFIG
): Board {
  const { rows, cols, gemTypesCount } = config;
  const next: (BoardCell | null)[][] = board.map((row) =>
    row.map((cell) => (keysToRemove.has(cell.key) ? null : { ...cell }))
  );

  for (let c = 0; c < cols; c++) {
    let write = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      if (next[r][c] != null) {
        next[write][c] = next[r][c];
        if (write !== r) next[r][c] = null;
        write--;
      }
    }
    for (let r = write; r >= 0; r--) {
      next[r][c] = createCell(Math.floor(Math.random() * gemTypesCount));
    }
  }

  return next as Board;
}
