'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Group, Rect, Image } from 'react-konva';
import Konva from 'konva';
import type { Board } from '../../helpers/game.types';
import type { Position } from '../../helpers/game.types';
import type { LevelConfig } from '../../helpers/game.types';
import type { AnimateRemoveHandler } from '../../hooks';
import { areAdjacent } from '../../helpers/board.helpers';
import {
  TILE_SIZE_PX,
  TILE_GAP_PX,
  SWIPE_THRESHOLD_PX,
  SWIPE_QUICK_MAX_MS,
  SWIPE_QUICK_THRESHOLD_PX,
} from '../../helpers/game.constants';
import { getNeighbor, getSwipeDirection } from '../../helpers/swipe.helpers';
import cls from './GameBoardCanvas.module.scss';

const CELL_SIZE = TILE_SIZE_PX + TILE_GAP_PX;
const TILE_PREFIX = 'tile-';

const SWAP_DURATION = 0.2;
const SHAKE_OFFSET = 8;
const SHAKE_STEP = 0.045;
const REMOVE_DURATION = 0.22;
const REMOVE_OFFSET = TILE_SIZE_PX / 2;
const FALL_DURATION = 0.38;
const FALL_START_Y_OFFSET = -TILE_SIZE_PX * 2;

function posToXY(pos: Position, _config: LevelConfig): { x: number; y: number } {
  return {
    x: TILE_GAP_PX + pos.col * CELL_SIZE,
    y: TILE_GAP_PX + pos.row * CELL_SIZE,
  };
}

function tweenPromise(
  node: Konva.Node,
  attrs: Record<string, number>,
  duration: number,
  easing?: (t: number, b: number, c: number, d: number) => number
): Promise<void> {
  return new Promise((resolve) => {
    new Konva.Tween({
      node,
      duration,
      easing: easing ?? Konva.Easings.EaseOut,
      ...attrs,
      onFinish: () => resolve(),
    }).play();
  });
}

/** Анимация исчезновения группы: scale 0 + opacity 0, принудительно прокидывая opacity во все дочерние узлы (Konva.Image с SVG часто не наследует opacity родителя). */
function tweenRemovePromise(
  group: Konva.Group,
  attrs: { scaleX: number; scaleY: number; opacity: number },
  duration: number
): Promise<void> {
  return new Promise((resolve) => {
    new Konva.Tween({
      node: group,
      duration,
      easing: Konva.Easings.EaseIn,
      ...attrs,
      onUpdate: () => {
        const op = group.getAttr('opacity');
        group.getChildren().forEach((child) => child.setAttrs({ opacity: op }));
      },
      onFinish: () => resolve(),
    }).play();
  });
}

function parseTileName(name: string): Position | null {
  if (!name.startsWith(TILE_PREFIX)) return null;
  const parts = name.slice(TILE_PREFIX.length).split('-');
  if (parts.length !== 2) return null;
  const row = parseInt(parts[0], 10);
  const col = parseInt(parts[1], 10);
  if (Number.isNaN(row) || Number.isNaN(col)) return null;
  return { row, col };
}

function findTilePosition(node: Konva.Node | null): Position | null {
  let current: Konva.Node | null = node;
  while (current) {
    const name = (current.getAttr?.('name') ?? '') as string;
    if (name.startsWith(TILE_PREFIX)) {
      return parseTileName(name);
    }
    current = current.getParent();
  }
  return null;
}

interface GameBoardCanvasProps {
  board: Board;
  levelConfig: LevelConfig;
  isAnimating: boolean;
  trySwap: (
    from: Position,
    to: Position
  ) => { valid: true; nextBoard: Board } | { valid: false } | null;
  applySwap: (nextBoard: Board) => void;
  setAnimateRemoveHandler: (handler: AnimateRemoveHandler | null) => void;
}

function getPositionsByKeys(currentBoard: Board, keys: Set<string>): Position[] {
  const positions: Position[] = [];
  currentBoard.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (keys.has(cell.key)) positions.push({ row: rowIndex, col: colIndex });
    });
  });
  return positions;
}

function positionKey(pos: Position): string {
  return `${pos.row}-${pos.col}`;
}

/** Найти позицию ячейки с ключом key в доске */
function findPositionByKey(board: Board, key: string): Position | null {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c].key === key) return { row: r, col: c };
    }
  }
  return null;
}

/**
 * Для доски после collapse: по текущей и следующей доске строит карту
 * positionKey -> startY (откуда анимировать падение).
 * Ячейки, пришедшие сверху, стартуют с Y старой позиции; новые — с FALL_START_Y_OFFSET выше цели.
 */
function computeFallStartYMap(
  currentBoard: Board,
  nextBoard: Board,
  levelConfig: LevelConfig
): Map<string, number> {
  const map = new Map<string, number>();
  const { rows, cols } = levelConfig;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = nextBoard[r][c];
      const prevPos = findPositionByKey(currentBoard, cell.key);
      const targetY = TILE_GAP_PX + r * (TILE_SIZE_PX + TILE_GAP_PX);

      if (prevPos == null) {
        // Новая ячейка (refill)
        map.set(positionKey({ row: r, col: c }), targetY + FALL_START_Y_OFFSET);
      } else if (prevPos.col === c && prevPos.row < r) {
        // Ячейка опустилась в той же колонке
        const startY = TILE_GAP_PX + prevPos.row * (TILE_SIZE_PX + TILE_GAP_PX);
        map.set(positionKey({ row: r, col: c }), startY);
      }
    }
  }
  return map;
}

export function GameBoardCanvas({
  board,
  levelConfig,
  isAnimating,
  trySwap,
  applySwap,
  setAnimateRemoveHandler,
}: GameBoardCanvasProps) {
  const { rows, cols } = levelConfig;
  const stageWidth = cols * CELL_SIZE + TILE_GAP_PX;
  const stageHeight = rows * CELL_SIZE + TILE_GAP_PX;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      setContainerSize({ width: el.clientWidth, height: el.clientHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale =
    containerSize.width > 0 && containerSize.height > 0
      ? Math.min(
          containerSize.width / stageWidth,
          containerSize.height / stageHeight
        )
      : 1;

  const [gemImages, setGemImages] = useState<HTMLImageElement[]>([]);
  const gemIconUrls = levelConfig.gemIconUrls ?? [];
  const gemIconCount = gemIconUrls.length;

  useEffect(() => {
    if (gemIconUrls.length === 0) {
      setGemImages([]);
      return;
    }
    const loaders = gemIconUrls.map((src) => {
      const img = new window.Image();
      return new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    });
    Promise.all(loaders).then(setGemImages);
  }, [gemIconUrls.join(',')]);

  const stageRef = useRef<Konva.Stage>(null);
  const groupsRef = useRef<(Konva.Group | null)[][]>([]);
  const [isSwapAnimating, setIsSwapAnimating] = useState(false);
  /** Карта positionKey -> startY для анимации падения (всех ячеек, что опустились или новые). */
  const [fallingStartY, setFallingStartY] = useState<Map<string, number>>(new Map());
  const swipeStartRef = useRef<{
    position: Position;
    clientX: number;
    clientY: number;
    touchId: number;
    timeStamp: number;
  } | null>(null);
  const lastTapRef = useRef<Position | null>(null);

  const blocked = isAnimating || isSwapAnimating;

  const animateSwap = useCallback(
    (from: Position, to: Position): Promise<void> => {
      const groupFrom = groupsRef.current[from.row]?.[from.col];
      const groupTo = groupsRef.current[to.row]?.[to.col];
      if (!groupFrom || !groupTo) return Promise.resolve();

      const { x: xFrom, y: yFrom } = posToXY(from, levelConfig);
      const { x: xTo, y: yTo } = posToXY(to, levelConfig);

      return Promise.all([
        tweenPromise(groupFrom, { x: xTo, y: yTo }, SWAP_DURATION),
        tweenPromise(groupTo, { x: xFrom, y: yFrom }, SWAP_DURATION),
      ]).then(() => {});
    },
    [levelConfig]
  );

  const animateShake = useCallback(
    (from: Position, to: Position): Promise<void> => {
      const groupFrom = groupsRef.current[from.row]?.[from.col];
      const groupTo = groupsRef.current[to.row]?.[to.col];
      if (!groupFrom || !groupTo) return Promise.resolve();

      const fromPos = posToXY(from, levelConfig);
      const toPos = posToXY(to, levelConfig);

      const shakeOne = (node: Konva.Node, baseX: number, baseY: number) =>
        tweenPromise(node, { x: baseX + SHAKE_OFFSET, y: baseY }, SHAKE_STEP)
          .then(() => tweenPromise(node, { x: baseX - SHAKE_OFFSET, y: baseY }, SHAKE_STEP))
          .then(() => tweenPromise(node, { x: baseX, y: baseY }, SHAKE_STEP));

      return Promise.all([
        shakeOne(groupFrom, fromPos.x, fromPos.y),
        shakeOne(groupTo, toPos.x, toPos.y),
      ]).then(() => {});
    },
    [levelConfig]
  );

  const animateRemove = useCallback(
    (keys: Set<string>, currentBoard: Board, nextBoard: Board, onComplete: () => void) => {
      const positions = getPositionsByKeys(currentBoard, keys);
      const items: { group: Konva.Group; baseX: number; baseY: number }[] = [];
      for (const pos of positions) {
        const g = groupsRef.current[pos.row]?.[pos.col];
        if (g) {
          const { x: baseX, y: baseY } = posToXY(pos, levelConfig);
          items.push({ group: g, baseX, baseY });
        }
      }

      const finish = () => {
        // Не сбрасываем удалённые группы — оставляем их невидимыми (scale 0, opacity 0),
        // чтобы анимация исчезновения была видна до размонтирования при обновлении доски.
        const fallMap = computeFallStartYMap(currentBoard, nextBoard, levelConfig);
        setFallingStartY(fallMap);
        onComplete();
      };

      if (items.length === 0) {
        const fallMap = computeFallStartYMap(currentBoard, nextBoard, levelConfig);
        setFallingStartY(fallMap);
        onComplete();
        return;
      }

      // Центр плитки — точка масштабирования; offset + сдвиг позиции, чтобы не прыгало
      items.forEach(({ group, baseX, baseY }) => {
        group.offset({ x: REMOVE_OFFSET, y: REMOVE_OFFSET });
        group.position({ x: baseX + REMOVE_OFFSET, y: baseY + REMOVE_OFFSET });
        group.setAttrs({ scaleX: 1, scaleY: 1, opacity: 1 });
        group.getChildren().forEach((c) => c.setAttrs({ opacity: 1 }));
      });

      const layer = items[0]?.group.getLayer();
      if (layer) layer.batchDraw();

      const promises = items.map(({ group }) =>
        tweenRemovePromise(
          group,
          { scaleX: 0, scaleY: 0, opacity: 0 },
          REMOVE_DURATION
        )
      );

      Promise.all(promises).then(finish);
    },
    [levelConfig]
  );

  useEffect(() => {
    if (fallingStartY.size === 0) return;
    const entries = Array.from(fallingStartY.entries());
    const id = requestAnimationFrame(() => {
      const promises = entries.map(([key]) => {
        const [r, c] = key.split('-').map(Number);
        const pos = { row: r, col: c };
        const group = groupsRef.current[r]?.[c];
        if (!group) return Promise.resolve();
        const { y: targetY } = posToXY(pos, levelConfig);
        return tweenPromise(
          group,
          { y: targetY },
          FALL_DURATION,
          Konva.Easings.EaseOut
        );
      });
      Promise.all(promises).then(() => setFallingStartY(new Map()));
    });
    return () => cancelAnimationFrame(id);
  }, [fallingStartY, levelConfig]);

  useEffect(() => {
    const handler: AnimateRemoveHandler = (
      keys: Set<string>,
      currentBoard: Board,
      nextBoard: Board,
      onComplete: () => void
    ) => {
      animateRemove(keys, currentBoard, nextBoard, onComplete);
    };
    setAnimateRemoveHandler(handler);
    return () => setAnimateRemoveHandler(null);
  }, [setAnimateRemoveHandler, animateRemove]);

  const performSwap = useCallback(
    (from: Position, to: Position) => {
      const result = trySwap(from, to);
      if (result == null) return;

      setIsSwapAnimating(true);
      if (result.valid && result.nextBoard) {
        animateSwap(from, to).then(() => {
          applySwap(result.nextBoard!);
          setIsSwapAnimating(false);
        });
      } else {
        animateShake(from, to).then(() => setIsSwapAnimating(false));
      }
    },
    [trySwap, applySwap, animateSwap, animateShake]
  );

  const getStagePoint = useCallback(
    (clientX: number, clientY: number) => {
      const stage = stageRef.current;
      if (!stage) return null;
      const rect = stage.container().getBoundingClientRect();
      const sx = (clientX - rect.left) / scale;
      const sy = (clientY - rect.top) / scale;
      return { x: sx, y: sy };
    },
    [scale]
  );

  const handleTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (blocked) return;
      const touch = e.evt.touches[0];
      if (!touch) return;

      const point = getStagePoint(touch.clientX, touch.clientY);
      if (!point) return;

      const stage = stageRef.current;
      if (!stage) return;

      const shape = stage.getIntersection(point);
      const position = shape ? findTilePosition(shape) : null;
      if (position === null) return;

      swipeStartRef.current = {
        position,
        clientX: touch.clientX,
        clientY: touch.clientY,
        touchId: touch.identifier,
        timeStamp: e.evt.timeStamp,
      };
    },
    [blocked, getStagePoint]
  );

  const handleTouchEnd = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      const start = swipeStartRef.current;
      swipeStartRef.current = null;
      if (!start) return;

      const touch = Array.from(e.evt.changedTouches).find(
        (t) => t.identifier === start.touchId
      );
      if (!touch) return;

      const deltaX = touch.clientX - start.clientX;
      const deltaY = touch.clientY - start.clientY;
      const durationMs = e.evt.timeStamp - start.timeStamp;
      const isQuickSwipe = durationMs > 0 && durationMs < SWIPE_QUICK_MAX_MS;
      const thresholdPx = isQuickSwipe ? SWIPE_QUICK_THRESHOLD_PX : SWIPE_THRESHOLD_PX;
      const effectiveThreshold = scale < 1 ? Math.max(8, thresholdPx * scale) : thresholdPx;
      const direction = getSwipeDirection(deltaX, deltaY, effectiveThreshold);
      if (!direction) return;

      const toPos = getNeighbor(start.position, direction, levelConfig);
      if (toPos) performSwap(start.position, toPos);
    },
    [performSwap, levelConfig, scale]
  );

  const handleTap = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent | PointerEvent>) => {
      if (blocked) return;
      const shape = e.target;
      const position = findTilePosition(shape);
      if (position === null) return;

      const last = lastTapRef.current;
      lastTapRef.current = position;

      if (last && areAdjacent(last, position)) {
        lastTapRef.current = null;
        performSwap(last, position);
      }
    },
    [blocked, performSwap]
  );

  const setGroupRef = useCallback((rowIndex: number, colIndex: number) => (node: Konva.Group | null) => {
    if (!groupsRef.current[rowIndex]) groupsRef.current[rowIndex] = [];
    groupsRef.current[rowIndex][colIndex] = node;
  }, []);

  return (
    <div ref={wrapperRef} className={cls.wrapper}>
      <div
        className={cls.stageWrap}
        style={{
          width: stageWidth,
          height: stageHeight,
          transform: `scale(${scale})`,
        }}
      >
        <Stage
          ref={stageRef}
          width={stageWidth}
          height={stageHeight}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => (swipeStartRef.current = null)}
          onTap={handleTap}
          className={cls.stage}
        >
        <Layer>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const pos = { row: rowIndex, col: colIndex };
              const { x, y: targetY } = posToXY(pos, levelConfig);
              const startY = fallingStartY.get(positionKey(pos));
              const y = startY !== undefined ? startY : targetY;
              return (
              <Group
                key={cell.key}
                ref={setGroupRef(rowIndex, colIndex)}
                name={`${TILE_PREFIX}${rowIndex}-${colIndex}`}
                x={x}
                y={y}
                listening={!blocked}
              >
                <Rect
                  width={TILE_SIZE_PX}
                  height={TILE_SIZE_PX}
                  fill="#ffffff"
                  cornerRadius={12}
                  shadowColor="black"
                  shadowBlur={2}
                  shadowOpacity={0.12}
                  shadowOffset={{ x: 0, y: 1 }}
                />
                {gemIconCount > 0 && gemImages[cell.type % gemIconCount] && (
                  <Image
                    image={gemImages[cell.type % gemIconCount]}
                    x={0}
                    y={0}
                    width={TILE_SIZE_PX}
                    height={TILE_SIZE_PX}
                    listening={false}
                  />
                )}
              </Group>
              );
            })
          )}
        </Layer>
      </Stage>
      </div>
    </div>
  );
}
