import type { Board, BoardCell, Position } from './game.types';
import type { GameConfig } from './game.types';
import { GAME_CONFIG } from './game.constants';

let cellKeyCounter = 0;

function generateKey(): string {
  return `cell-${Date.now()}-${++cellKeyCounter}`;
}

/** Создать пустую ячейку с типом камня */
export function createCell(type: number): BoardCell {
  return { type, key: generateKey() };
}

/** Создать начальную доску без совпадений */
export function createInitialBoard(config: GameConfig = GAME_CONFIG): Board {
  const { rows, cols, gemTypesCount } = config;
  const board: Board = [];

  for (let r = 0; r < rows; r++) {
    const row: BoardCell[] = [];
    for (let c = 0; c < cols; c++) {
      let type: number;
      do {
        type = Math.floor(Math.random() * gemTypesCount);
      } while (
        (c >= 2 && row[c - 1].type === type && row[c - 2].type === type) ||
        (r >= 2 && board[r - 1][c].type === type && board[r - 2][c].type === type)
      );
      row.push(createCell(type));
    }
    board.push(row);
  }
  return board;
}

/** Проверить, являются ли две позиции соседними (по вертикали или горизонтали) */
export function areAdjacent(a: Position, b: Position): boolean {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

/** Обменять две ячейки на доске (мутирует переданную доску) */
export function swapCells(
  board: Board,
  from: Position,
  to: Position
): void {
  const temp = board[from.row][from.col];
  board[from.row][from.col] = board[to.row][to.col];
  board[to.row][to.col] = temp;
}

/** Клонировать доску */
export function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => ({ ...cell, key: cell.key }))
  );
}
