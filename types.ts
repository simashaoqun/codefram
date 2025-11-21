export enum CropState {
  EMPTY = 'EMPTY',
  PLANTED = 'PLANTED',
  WATERED = 'WATERED',
  RIPE = 'RIPE',
}

export enum BotDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface Tile {
  x: number;
  y: number;
  state: CropState;
  growthProgress: number; // 0 to 100
}

export interface Bot {
  x: number;
  y: number;
  direction: BotDirection;
  inventory: number;
}

export interface GameConfig {
  gridSize: number;
  tickRate: number;
}

// Loop/Block stack item
export interface BlockContext {
  type: 'while' | 'if' | 'for' | 'else';
  startLine: number;
  indentation: number;
  iterations?: number; // For for-loops
  maxIterations?: number;
}

export interface ExecutionState {
  currentLine: number;
  isRunning: boolean;
  error: string | null;
  logs: string[];
  blockStack: BlockContext[]; // To track nested loops/ifs
}

export interface Level {
  id: number;
  title: string;
  description: string;
  initialCode: string;
  gridConfig?: (grid: Tile[][]) => void; // Optional custom setup
  goal: (bot: Bot, grid: Tile[][], gold: number) => boolean;
  goalDescription: string;
  availableCommands: string[];
}
