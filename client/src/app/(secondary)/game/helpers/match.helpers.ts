import type { Board, Position } from './game.types';
import type { GameConfig } from './game.types';
import { GAME_CONFIG } from './game.constants';
import { cloneBoard, swapCells } from './board.helpers';

const MIN_MATCH = 3;

/** Считает, сколько подряд идут клетки того же типа от pos в направлении (dRow, dCol), не включая саму pos */
function countSameInDirection(
  board: Board,
  pos: Position,
  dRow: number,
  dCol: number,
  config: GameConfig
): number {
  const { rows, cols } = config;
  const type = board[pos.row][pos.col].type;
  let count = 0;
  let r = pos.row + dRow;
  let c = pos.col + dCol;
  while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c].type === type) {
    count++;
    r += dRow;
    c += dCol;
  }
  return count;
}

/** Длина серии через клетку pos по горизонтали (включая саму клетку) */
function horizontalRunLength(board: Board, pos: Position, config: GameConfig): number {
  const left = countSameInDirection(board, pos, 0, -1, config);
  const right = countSameInDirection(board, pos, 0, 1, config);
  return left + 1 + right;
}

/** Длина серии через клетку pos по вертикали (включая саму клетку) */
function verticalRunLength(board: Board, pos: Position, config: GameConfig): number {
  const up = countSameInDirection(board, pos, -1, 0, config);
  const down = countSameInDirection(board, pos, 1, 0, config);
  return up + 1 + down;
}

/** Проверка: на доске после обмена (boardAfterSwap) есть ли у позиций from или to линия 3+ в ряд по горизонтали или вертикали */
export function swapWouldCreateMatch(
  boardAfterSwap: Board,
  from: Position,
  to: Position,
  config: GameConfig = GAME_CONFIG
): boolean {
  const minMatch = config.minMatchLength ?? MIN_MATCH;

  for (const pos of [from, to]) {
    if (horizontalRunLength(boardAfterSwap, pos, config) >= minMatch) return true;
    if (verticalRunLength(boardAfterSwap, pos, config) >= minMatch) return true;
  }
  return false;
}

/** Найти все горизонтальные серии длины >= minMatch */
function findHorizontalMatches(
  board: Board,
  minMatch: number,
  config: GameConfig
): Set<string> {
  const { rows, cols } = config;
  const matched = new Set<string>();

  for (let r = 0; r < rows; r++) {
    let start = 0;
    while (start < cols) {
      const type = board[r][start].type;
      let end = start;
      while (end + 1 < cols && board[r][end + 1].type === type) end++;
      const length = end - start + 1;
      if (length >= minMatch) {
        for (let c = start; c <= end; c++) matched.add(board[r][c].key);
      }
      start = end + 1;
    }
  }
  return matched;
}

/** Найти все вертикальные серии длины >= minMatch */
function findVerticalMatches(
  board: Board,
  minMatch: number,
  config: GameConfig
): Set<string> {
  const { rows, cols } = config;
  const matched = new Set<string>();

  for (let c = 0; c < cols; c++) {
    let start = 0;
    while (start < rows) {
      const type = board[start][c].type;
      let end = start;
      while (end + 1 < rows && board[end + 1][c].type === type) end++;
      const length = end - start + 1;
      if (length >= minMatch) {
        for (let r = start; r <= end; r++) matched.add(board[r][c].key);
      }
      start = end + 1;
    }
  }
  return matched;
}

/** Все ключи ячеек, входящих в совпадения (3+ в ряд/колонку) */
export function findMatchKeys(board: Board, config: GameConfig = GAME_CONFIG): Set<string> {
  const minMatch = config.minMatchLength;
  const horizontal = findHorizontalMatches(board, minMatch, config);
  const vertical = findVerticalMatches(board, minMatch, config);
  return new Set([...horizontal, ...vertical]);
}

/** Есть ли хотя бы одно совпадение на доске */
export function hasMatches(board: Board, config: GameConfig = GAME_CONFIG): boolean {
  return findMatchKeys(board, config).size > 0;
}

/** Есть ли хотя бы один возможный ход (обмен двух соседних клеток даёт совпадение) */
export function hasValidMoves(board: Board, config: GameConfig = GAME_CONFIG): boolean {
  const { rows, cols } = config;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols) {
        const copy = cloneBoard(board);
        swapCells(copy, { row: r, col: c }, { row: r, col: c + 1 });
        if (findMatchKeys(copy, config).size > 0) return true;
      }
      if (r + 1 < rows) {
        const copy = cloneBoard(board);
        swapCells(copy, { row: r, col: c }, { row: r + 1, col: c });
        if (findMatchKeys(copy, config).size > 0) return true;
      }
    }
  }
  return false;
}
