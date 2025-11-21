import { Level, CropState } from './types';

export const GRID_SIZE = 6;
export const MAX_LOGS = 20;
export const CROP_GROWTH_SPEED = 25; 
export const HARVEST_VALUE = 15;
export const PLANT_COST = 2;
export const WATER_COST = 1;

// Syntax coloring mapping (Python style)
export const SYNTAX_HIGHLIGHTS: Record<string, string> = {
  import: 'text-purple-400 font-bold',
  from: 'text-purple-400 font-bold',
  def: 'text-purple-400 font-bold',
  return: 'text-purple-400 font-bold',
  while: 'text-purple-400 font-bold',
  for: 'text-purple-400 font-bold',
  if: 'text-purple-400 font-bold',
  else: 'text-purple-400 font-bold',
  elif: 'text-purple-400 font-bold',
  in: 'text-purple-400',
  range: 'text-yellow-300',
  True: 'text-orange-400',
  False: 'text-orange-400',
  // Turtle commands
  forward: 'text-blue-400',
  fd: 'text-blue-400',
  left: 'text-blue-400',
  lt: 'text-blue-400',
  right: 'text-blue-400',
  rt: 'text-blue-400',
  // Farm commands
  plant: 'text-green-400',
  water: 'text-cyan-400',
  harvest: 'text-orange-400',
  check_ripe: 'text-yellow-300',
  check_soil: 'text-yellow-300',
  // Symbols
  '#': 'text-gray-500', 
  '(': 'text-slate-400',
  ')': 'text-slate-400',
  ':': 'text-slate-200',
};

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "第一章：海龟起步",
    description: "欢迎来到编程世界。即使是复杂的自动化，也是从一步一步的指令开始的。使用 turtle (海龟) 绘图库风格的指令来控制机器人。",
    goalDescription: "移动到 (3, 3) 并播种",
    availableCommands: ['forward()', 'left()', 'right()', 'plant()'],
    initialCode: `# 关卡 1: 顺序执行
# 任务: 移动到坐标 (3,3) 并播种
# 提示: 使用 forward() 前进, left() 左转

forward()
forward()
forward()
left()
# 继续写你的代码...
`,
    goal: (bot, grid) => bot.x === 3 && bot.y === 3 && grid[3][3].state === CropState.PLANTED
  },
  {
    id: 2,
    title: "第二章：循环的力量",
    description: "重复的代码是程序员的大敌。使用 'for' 循环让机器人重复执行动作。",
    goalDescription: "在第一行 (y=0) 连续播种 5 个地块",
    availableCommands: ['for i in range(n):', 'forward()', 'plant()'],
    initialCode: `# 关卡 2: 循环结构
# 任务: 在第一行连续播种 5 次
# Python 使用缩进 (Tab 或 4个空格) 来表示代码块

for i in range(5):
    plant()
    forward()
    
# 循环结束后的代码
right()
`,
    goal: (bot, grid) => {
        let count = 0;
        for(let x=0; x<5; x++) if(grid[0][x].state !== CropState.EMPTY) count++;
        return count >= 5;
    }
  },
  {
    id: 3,
    title: "第三章：无限与判断",
    description: "使用 'while' 循环进行持续工作，并用 'if' 判断环境状态。",
    goalDescription: "收获地图上随机生成的 3 个成熟作物",
    availableCommands: ['while True:', 'if check_ripe():', 'harvest()', 'move()'],
    initialCode: `# 关卡 3: 条件判断
# 任务: 巡逻并收获成熟的胡萝卜
# 提示: 机器人需要不断移动，如果发现成熟就收获

while True:
    forward()
    
    # 边界检测：如果到了边缘就右转
    if bot.x == 5:
        right()
        
    if check_ripe():
        harvest()
`,
    gridConfig: (grid) => {
        // Randomly spawn some ripe crops for testing logic
        grid[1][1].state = CropState.RIPE;
        grid[3][3].state = CropState.RIPE;
        grid[4][1].state = CropState.RIPE;
    },
    goal: (bot, grid, gold) => gold >= 20 + (15 * 3) // Started with 20, harvested 3 (15 each)
  }
];
