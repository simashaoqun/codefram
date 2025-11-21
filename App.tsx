
import React, { useState, useEffect, useCallback } from 'react';
import { GRID_SIZE, MAX_LOGS, LEVELS } from './constants';
import { Tile, Bot, CropState, BotDirection, BlockContext } from './types';
import { processGameTick } from './services/gameEngine';
import GameGrid from './components/GameGrid';
import CodeEditor from './components/CodeEditor';
import Dashboard from './components/Dashboard';
import AiAssistant from './components/AiAssistant';
import { Sparkles, ChevronRight } from 'lucide-react';

const createInitialGrid = (): Tile[][] => {
  return Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) => ({
      x,
      y,
      state: CropState.EMPTY,
      growthProgress: 0,
    }))
  );
};

const initialBot: Bot = { x: 0, y: 0, direction: BotDirection.RIGHT, inventory: 0 };

const App: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const level = LEVELS[currentLevelIdx];

  // Game State
  const [grid, setGrid] = useState<Tile[][]>(createInitialGrid());
  const [bot, setBot] = useState<Bot>(initialBot);
  const [gold, setGold] = useState(20);
  
  // Execution State
  const [code, setCode] = useState(level.initialCode);
  const [currentLine, setCurrentLine] = useState(0);
  const [blockStack, setBlockStack] = useState<BlockContext[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  
  const [showAi, setShowAi] = useState(false);
  
  const addLog = useCallback((message: string) => {
    setLogs(prev => [message, ...prev].slice(0, MAX_LOGS));
  }, []);

  // Load Level
  useEffect(() => {
      const newGrid = createInitialGrid();
      if (level.gridConfig) {
          level.gridConfig(newGrid);
      }
      setGrid(newGrid);
      setBot(initialBot);
      setGold(20);
      setCode(level.initialCode);
      setCurrentLine(0);
      setBlockStack([]);
      setIsRunning(false);
      setIsLevelComplete(false);
      setLogs([]);
  }, [level]);

  const handleReset = () => {
    const newGrid = createInitialGrid();
    if (level.gridConfig) level.gridConfig(newGrid);
    setGrid(newGrid);
    setBot(initialBot);
    setCurrentLine(0);
    setBlockStack([]);
    setIsRunning(false);
    setGold(20);
    setLogs([]);
    setIsLevelComplete(false);
    addLog("关卡已重置");
  };

  const handleNextLevel = () => {
      if (currentLevelIdx < LEVELS.length - 1) {
          setCurrentLevelIdx(prev => prev + 1);
      }
  };

  // Game Loop
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isRunning && !isLevelComplete) {
      intervalId = setInterval(() => {
        const lines = code.split('\n');
        
        // Check if done (end of script and no loops)
        if (currentLine >= lines.length && blockStack.length === 0) {
            setIsRunning(false);
            addLog("脚本执行完毕");
            return;
        }

        const result = processGameTick(
          grid,
          bot,
          lines,
          currentLine,
          blockStack,
          gold,
          (val) => setGold(val)
        );

        setGrid(result.newGrid);
        setBot(result.newBot);
        setCurrentLine(result.nextLine);
        setBlockStack(result.newStack);

        if (result.log) addLog(result.log);
        if (result.error) {
          addLog(`Error [Line ${currentLine + 1}]: ${result.error}`);
          setIsRunning(false); 
        }

        // Check Goal
        if (level.goal(result.newBot, result.newGrid, gold)) {
            setIsLevelComplete(true);
            setIsRunning(false);
            addLog("🎉 恭喜！任务完成！");
        }

      }, 600); // Slightly faster for loops
    }

    return () => clearInterval(intervalId);
  }, [isRunning, grid, bot, code, currentLine, blockStack, gold, addLog, level, isLevelComplete]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200 font-sans">
      {/* Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between px-4 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-1.5 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Code Farm <span className="text-slate-500 font-normal text-xs ml-1">Python 自动化入门</span>
            </h1>
        </div>
        
        <div className="flex gap-2">
            {isLevelComplete && currentLevelIdx < LEVELS.length - 1 && (
                <button 
                    onClick={handleNextLevel}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-lg animate-pulse font-bold transition-colors shadow-lg shadow-green-900/20"
                >
                    下一关 <ChevronRight size={16} />
                </button>
            )}
            <button 
                onClick={() => setShowAi(true)}
                className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 px-3 py-1.5 rounded-full border border-purple-500/30 transition-all"
            >
                <Sparkles size={14} />
                <span className="text-sm font-semibold">AI 导师</span>
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-3.5rem)]">
        
        {/* Editor (Left) */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-[300px]">
            <div className="bg-slate-800 rounded-t-lg px-3 py-2 border-x border-t border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">script.py</span>
                <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded">Indentation: 4 spaces</span>
            </div>
            <div className="flex-1 relative min-h-0">
                <CodeEditor 
                    code={code} 
                    onChange={setCode} 
                    currentLine={currentLine}
                    isRunning={isRunning}
                />
            </div>
            <div className="bg-slate-800 rounded-b-lg p-1.5 border-x border-b border-slate-700 text-[10px] text-slate-500 text-center">
                支持 Tab 缩进 | Python 语法模拟
            </div>
        </div>

        {/* Visuals (Center) */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">
            <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/50 p-4 relative">
                 <GameGrid grid={grid} bot={bot} />
                 {isLevelComplete && (
                     <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm rounded-xl z-10">
                         <h2 className="text-3xl font-bold text-green-400 mb-2">关卡完成!</h2>
                         <p className="text-slate-300 mb-4">你的代码运行完美。</p>
                         <button onClick={handleNextLevel} className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all">
                            进入下一章
                         </button>
                     </div>
                 )}
            </div>
        </div>

        {/* Dashboard (Right) */}
        <div className="lg:col-span-3 flex flex-col h-full min-h-[300px]">
            <Dashboard 
                gold={gold} 
                isRunning={isRunning} 
                onToggleRun={() => setIsRunning(!isRunning)} 
                onReset={handleReset}
                logs={logs}
                level={level}
            />
        </div>

      </main>

      <AiAssistant 
        isOpen={showAi} 
        onClose={() => setShowAi(false)} 
        onApplyCode={(newCode) => setCode(newCode)} 
      />
    </div>
  );
};

export default App;
