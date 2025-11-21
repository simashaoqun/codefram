
import React, { useState } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { getGeminiHelp } from '../services/geminiService';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCode: (code: string) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose, onApplyCode }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
      { role: 'ai', text: '你好！我是你的编程导师。在学习 Python 循环或判断语句时遇到困难了吗？告诉我你想做什么。' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    // We could pass current code here too, but for now just prompt
    const response = await getGeminiHelp(userMsg, "当前处于教学模式，重点讲解 while, for, if");
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-2xl h-[600px] rounded-xl border border-purple-500/50 shadow-2xl shadow-purple-900/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-2">
                <Sparkles className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">AI 编程导师</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X size={24} />
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                        {msg.role === 'ai' && <Bot className="w-5 h-5 mb-2 text-purple-400" />}
                        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{msg.text}</div>
                        
                        {/* Quick Action: Copy Code */}
                        {msg.role === 'ai' && (msg.text.includes('def ') || msg.text.includes('for ') || msg.text.includes('while ') || msg.text.includes('forward')) && (
                            <button 
                                onClick={() => {
                                    const cleanCode = msg.text.replace(/```python|```/g, '').trim();
                                    onApplyCode(cleanCode);
                                    onClose();
                                }}
                                className="mt-3 text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
                            >
                                <Sparkles size={12} /> 使用此代码
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
                    </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="例如：教我怎么用 for 循环种两排胡萝卜..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-lg disabled:opacity-50 transition-colors"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
