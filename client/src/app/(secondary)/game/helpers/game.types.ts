export type GemType = number;

export interface BoardCell {
  type: GemType;
  key: string;
}

export type Board = BoardCell[][];

export interface Position {
  row: number;
  col: number;
}

export interface GameConfig {
  rows: number;
  cols: number;
  gemTypesCount: number;
  minMatchLength: number;
}

/** Конфиг уровня: сложность, целевые очки, лимит времени и массив URL изображений для типов камней */
export interface LevelConfig extends GameConfig {
  difficulty: number;
  targetScore: number;
  /** Лимит времени уровня в секундах (0 = без таймера) */
  timeLimitSeconds: number;
  /** URL или data URL картинок для каждого типа камня (по индексу) */
  gemIconUrls: string[];
}
