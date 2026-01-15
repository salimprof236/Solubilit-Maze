import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ControlsProps {
  onMove: (dx: number, dy: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ onMove }) => {
  return (
    <div className="flex flex-col items-center gap-2 mt-4 select-none touch-manipulation">
      <button 
        className="p-4 bg-blue-500 rounded-full shadow-lg active:bg-blue-600 active:scale-95 transition-transform"
        onPointerDown={(e) => { e.preventDefault(); onMove(0, -1); }}
      >
        <ArrowUp className="text-white w-6 h-6" />
      </button>
      <div className="flex gap-8">
        <button 
          className="p-4 bg-blue-500 rounded-full shadow-lg active:bg-blue-600 active:scale-95 transition-transform"
          onPointerDown={(e) => { e.preventDefault(); onMove(-1, 0); }}
        >
          <ArrowLeft className="text-white w-6 h-6" />
        </button>
        <button 
          className="p-4 bg-blue-500 rounded-full shadow-lg active:bg-blue-600 active:scale-95 transition-transform"
          onPointerDown={(e) => { e.preventDefault(); onMove(0, 1); }} // Down
        >
          <ArrowDown className="text-white w-6 h-6" />
        </button>
        <button 
          className="p-4 bg-blue-500 rounded-full shadow-lg active:bg-blue-600 active:scale-95 transition-transform"
          onPointerDown={(e) => { e.preventDefault(); onMove(1, 0); }}
        >
          <ArrowRight className="text-white w-6 h-6" />
        </button>
      </div>
    </div>
  );
};