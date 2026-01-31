'use client';

import type { BoardCell } from '../../helpers/game.types';
import type { Position } from '../../helpers/game.types';
import { GEM_COLORS } from '../../helpers/game.constants';
import cls from './GameTile.module.scss';

interface GameTileProps {
  cell: BoardCell;
  position: Position;
  isSelected: boolean;
  disabled: boolean;
  onSelect: (position: Position) => void;
  onTouchStart?: (position: Position) => void;
  tileAttr?: string;
  rowAttr?: string;
  colAttr?: string;
}

export function GameTile({
  cell,
  position,
  isSelected,
  disabled,
  onSelect,
  onTouchStart,
  tileAttr = 'data-game-tile',
  rowAttr = 'data-row',
  colAttr = 'data-col',
}: GameTileProps) {
  const color = GEM_COLORS[cell.type % GEM_COLORS.length] ?? GEM_COLORS[0];

  return (
    <button
      type="button"
      className={`${cls.tile} ${isSelected ? cls.selected : ''}`}
      style={{ backgroundColor: color }}
      disabled={disabled}
      onClick={() => onSelect(position)}
      onTouchStart={() => onTouchStart?.(position)}
      aria-label={`Камень ${position.row + 1}, ${position.col + 1}`}
      {...{ [tileAttr]: true, [rowAttr]: position.row, [colAttr]: position.col }}
    />
  );
}
