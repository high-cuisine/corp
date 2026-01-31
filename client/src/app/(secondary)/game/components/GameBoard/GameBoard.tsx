'use client';

import { useRef, useCallback } from 'react';
import type { Board } from '../../helpers/game.types';
import type { Position } from '../../helpers/game.types';
import { GameTile } from '../GameTile';
import cls from './GameBoard.module.scss';

const TILE_ATTR = 'data-game-tile';
const ROW_ATTR = 'data-row';
const COL_ATTR = 'data-col';

interface GameBoardProps {
  board: Board;
  isAnimating: boolean;
  onSelectCell: (position: Position) => void;
  onTrySwap: (from: Position, to: Position) => void;
  isSelected: (pos: Position) => boolean;
}

export function GameBoard({
  board,
  isAnimating,
  onSelectCell,
  onTrySwap,
  isSelected,
}: GameBoardProps) {
  const swipeStartRef = useRef<Position | null>(null);

  const handleTileTouchStart = useCallback((position: Position) => {
    swipeStartRef.current = position;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      if (!touch) return;

      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const tile = el?.closest(`[${TILE_ATTR}]`);
      if (!tile) {
        swipeStartRef.current = null;
        return;
      }

      const row = tile.getAttribute(ROW_ATTR);
      const col = tile.getAttribute(COL_ATTR);
      if (row == null || col == null) {
        swipeStartRef.current = null;
        return;
      }

      const end: Position = { row: parseInt(row, 10), col: parseInt(col, 10) };
      const start = swipeStartRef.current;
      swipeStartRef.current = null;

      if (start != null && (start.row !== end.row || start.col !== end.col)) {
        onTrySwap(start, end);
      }
    },
    [onTrySwap]
  );

  return (
    <div
      className={cls.board}
      role="grid"
      aria-label="Игровое поле три в ряд"
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => (swipeStartRef.current = null)}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const position: Position = { row: rowIndex, col: colIndex };
          return (
            <GameTile
              key={cell.key}
              cell={cell}
              position={position}
              isSelected={isSelected(position)}
              disabled={isAnimating}
              onSelect={onSelectCell}
              onTouchStart={handleTileTouchStart}
              tileAttr={TILE_ATTR}
              rowAttr={ROW_ATTR}
              colAttr={COL_ATTR}
            />
          );
        })
      )}
    </div>
  );
}
