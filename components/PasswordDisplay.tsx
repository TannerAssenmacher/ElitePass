
import React, { useState, useEffect, useRef } from 'react';

interface PasswordDisplayProps {
  password: string;
  isGenerating: boolean;
  onCopy: () => void;
}

const PasswordDisplay: React.FC<PasswordDisplayProps> = ({ password, isGenerating, onCopy }) => {
  const [displayText, setDisplayText] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Fix: useRef requires an initial value in some TypeScript configurations.
  // Initializing with null as the default for the animation frame reference.
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isGenerating) {
      let count = 0;
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
      const animate = () => {
        const randomStr = Array(password.length || 12)
          .fill(0)
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join('');
        setDisplayText(randomStr);
        count++;
        if (count < 20) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayText(password);
        }
      };
      animate();
    } else {
      setDisplayText(password);
    }
    return () => {
      // Fix: frameRef.current can be null, check before calling cancelAnimationFrame.
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [password, isGenerating]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="w-full bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 flex flex-col items-center justify-center min-h-[100px] transition-all duration-300 hover:border-orange-500/50">
        <div className="mono text-2xl md:text-3xl font-bold tracking-wider text-orange-400 break-all text-center">
          {displayText || '••••••••'}
        </div>
        
        <button 
          onClick={handleCopy}
          className={`absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 ${copied ? 'text-green-400' : 'text-slate-400 hover:text-white'}`}
          title="Copy Password"
        >
          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
        </button>
      </div>
      
      {copied && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-green-400 animate-bounce">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default PasswordDisplay;
