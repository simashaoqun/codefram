
import React, { useEffect, useRef } from 'react';
import { SYNTAX_HIGHLIGHTS } from '../constants';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  currentLine: number;
  isRunning: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, currentLine, isRunning }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (backdropRef.current && textareaRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Tab') {
          e.preventDefault();
          const start = textareaRef.current?.selectionStart || 0;
          const end = textareaRef.current?.selectionEnd || 0;
          
          // Insert 4 spaces
          const newValue = code.substring(0, start) + '    ' + code.substring(end);
          onChange(newValue);
          
          // Move cursor
          setTimeout(() => {
              if (textareaRef.current) {
                  textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
              }
          }, 0);
      }
  };

  // Simple syntax highlighting
  const applyHighlighting = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.trim().startsWith('#')) {
          return <div key={index} className="text-gray-500 italic">{line || '\u00A0'}</div>;
      }

      // Tokenize roughly
      const parts = line.split(/([ \(\):\.])/); 
      
      return (
        <div key={index} className={`${index === currentLine && isRunning ? 'bg-blue-900/40 w-full' : ''}`}>
          {parts.map((part, i) => {
             if (part === '') return null;
             const cleanPart = part.trim();
             // Check exact match or startsWith for function calls
             const colorClass = SYNTAX_HIGHLIGHTS[cleanPart] 
                || SYNTAX_HIGHLIGHTS[Object.keys(SYNTAX_HIGHLIGHTS).find(k => cleanPart === k) || ''] 
                || 'text-slate-300';
             
             // Preserve whitespace in the span so pre-wrap handles it
             return <span key={i} className={colorClass}>{part}</span>;
          })}
          {line === '' ? '\u00A0' : ''}
        </div>
      );
    });
  };

  return (
    <div className="relative w-full h-full font-mono text-sm bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex flex-col">
      <div className="flex-1 relative flex">
          {/* Line Numbers */}
          <div className="w-10 bg-slate-800 text-slate-500 text-right pr-2 pt-4 select-none border-r border-slate-700 font-mono text-xs">
            {code.split('\n').map((_, i) => (
              <div key={i} className={`leading-6 ${i === currentLine && isRunning ? 'text-yellow-400 font-bold' : ''}`}>
                {i + 1}
              </div>
            ))}
          </div>

          <div className="relative flex-1 h-full">
            {/* Highlight Layer */}
            <div
                ref={backdropRef}
                className="absolute top-0 left-0 w-full h-full p-4 pointer-events-none whitespace-pre overflow-auto leading-6 code-font"
                aria-hidden="true"
            >
                {applyHighlighting(code)}
            </div>

            {/* Input Layer */}
            <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="absolute top-0 left-0 w-full h-full p-4 bg-transparent text-transparent caret-white resize-none outline-none whitespace-pre overflow-auto leading-6 code-font z-10"
            />
          </div>
      </div>
    </div>
  );
};

export default CodeEditor;
