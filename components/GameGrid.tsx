import React from 'react';
import { Bot, BotDirection, CropState, Tile } from '../types';
import { Sprout, Droplets, Carrot, Bot as BotIcon, Loader2 } from 'lucide-react';

interface GameGridProps {
  grid: Tile[][];
  bot: Bot;
}

const GameGrid: React.FC<GameGridProps> = ({ grid, bot }) => {
  const getTileContent = (tile: Tile) => {
    switch (tile.state) {
      case CropState.PLANTED:
        return <Sprout className="w-6 h-6 text-green-400 opacity-70" />;
      case CropState.WATERED:
        return (
          <div className="relative">
            <Sprout className="w-6 h-6 text-green-500" />
            <Droplets className="w-3 h-3 text-blue-400 absolute -top-1 -right-2 animate-bounce" />
            <div className="absolute -bottom-2 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-500" style={{width: `${tile.growthProgress}%`}}></div>
            </div>
          </div>
        );
      case CropState.RIPE:
        return <Carrot className="w-8 h-8 text-orange-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getBotRotation = (dir: BotDirection) => {
    switch (dir) {
      case BotDirection.UP: return 'rotate-0';
      case BotDirection.RIGHT: return 'rotate-90';
      case BotDirection.DOWN: return 'rotate-180';
      case BotDirection.LEFT: return '-rotate-90';
    }
  };

  return (
    <div className="grid grid-cols-6 gap-1 bg-slate-800 p-2 rounded-lg shadow-2xl border border-slate-700 aspect-square w-full max-w-[500px] mx-auto">
      {grid.map((row, y) =>
        row.map((tile, x) => {
            const isBotHere = bot.x === x && bot.y === y;
            
            // Styling for ground
            let bgClass = "bg-slate-700/50";
            if (tile.state === CropState.WATERED) bgClass = "bg-amber-900/40 border-blue-900/50 border";
            else if (tile.state === CropState.PLANTED || tile.state === CropState.RIPE) bgClass = "bg-amber-900/30";
            
            return (
            <div
                key={`${x}-${y}`}
                className={`relative w-full h-full rounded-md flex items-center justify-center border border-slate-600/20 transition-colors duration-300 ${bgClass}`}
            >
                {/* Coordinates helper (subtle) */}
                <span className="absolute top-0.5 left-1 text-[8px] text-slate-500 font-mono">{x},{y}</span>

                {/* Crop Content */}
                {getTileContent(tile)}

                {/* Bot Layer */}
                {isBotHere && (
                <div className={`absolute z-10 text-white drop-shadow-lg transition-transform duration-300 ${getBotRotation(bot.direction)}`}>
                    <div className="bg-blue-600 p-1.5 rounded-full shadow-lg shadow-blue-500/50">
                        <BotIcon size={24} />
                    </div>
                </div>
                )}
            </div>
            );
        })
      )}
    </div>
  );
};

export default GameGrid;
