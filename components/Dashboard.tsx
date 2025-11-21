
import React from 'react';
import { Coins, Zap, Play, Pause, RotateCcw, Bug, Target } from 'lucide-react';
import { Level } from '../types';

interface DashboardProps {
  gold: number;
  isRunning: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  logs: string[];
  level: Level;
}

const Dashboard: React.FC<DashboardProps> = ({ gold, isRunning, onToggleRun, onReset, logs, level }) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Level Goal Header */}
      <div className="bg-slate-800 p-4 rounded-lg border border-purple-500/30 shadow-lg">
         <div className="flex items-center gap-2 mb-2">
            <Target className="text-purple-400" size={20} />
            <h3 className="font-bold text-slate-200">{level.title}</h3>
         </div>
         <p className="text-sm text-slate-400">{level.goalDescription}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-3 rounded-lg border border-yellow-500/20 flex items-center gap-3 shadow-lg">
          <div className="bg-yellow-500/10 p-2 rounded-full">
            <Coins className="text-yellow-400 w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">金库</div>
            <div className="text-xl font-bold text-white">{gold} G</div>
          </div>
        </div>

        <div className="bg-slate-800 p-3 rounded-lg border border-blue-500/20 flex items-center gap-3 shadow-lg">
          <div className="bg-blue-500/10 p-2 rounded-full">
            <Zap className="text-blue-400 w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">状态</div>
            <div className="text-xl font-bold text-white">{isRunning ? '运行中' : '待机'}</div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex flex-col gap-2">
         <button
            onClick={onToggleRun}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${
                isRunning
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50'
            }`}
         >
            {isRunning ? <><Pause size={20} /> 停止程序</> : <><Play size={20} /> 运行代码</>}
         </button>

         <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors font-semibold text-sm"
         >
            <RotateCcw size={16} /> 重置关卡
         </button>
      </div>

      {/* Console Logs */}
      <div className="flex-1 bg-black rounded-lg border border-slate-700 p-3 overflow-hidden flex flex-col min-h-[150px]">
        <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-800 pb-2">
            <Bug size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">运行日志 (Terminal)</span>
        </div>
        <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-1 scrollbar-thin">
            {logs.length === 0 && <span className="text-slate-600 italic">等待指令...</span>}
            {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                    <span className={log.includes('Error') || log.includes('不足') || log.includes('无效') || log.includes('撞墙') ? 'text-red-400' : 'text-green-400'}>
                        {'> ' + log}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
