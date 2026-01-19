
import React, { useState, useCallback, useEffect } from 'react';
import { PasswordSettings, SecurityReport } from './types';
import { generatePassword } from './utils';
import { analyzePassword } from './services/passwordAnalyzer';
import PasswordDisplay from './components/PasswordDisplay';
import SettingsControl from './components/SettingsControl';
import SecurityInsight from './components/SecurityInsight';

const App: React.FC = () => {
  const [settings, setSettings] = useState<PasswordSettings>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    funToType: false,
  });

  const [password, setPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerate = useCallback(async () => {
    // Generate password instantly
    const newPass = generatePassword(settings);
    setPassword(newPass);
    setIsGenerating(false);

    // AI Analysis in background (non-blocking)
    setIsAnalyzing(true);
    try {
      const result = await analyzePassword(newPass);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  }, [settings]);

  // Initial generate
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass rounded-2xl shadow-2xl overflow-hidden p-4 space-y-3 relative border-t-4 border-orange-500">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <header className="flex items-center justify-center mb-1 -mt-1">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-1.5 rounded-lg shadow-md">
            <i className="fas fa-shield-halved text-white text-sm"></i>
          </div>
          <h1 className="text-base font-semibold tracking-wide text-slate-200">
            Elite<span className="text-orange-400">Pass</span>
          </h1>
        </div>
      </header>

      <div className="mt-1">
        <PasswordDisplay 
          password={password} 
          isGenerating={isGenerating} 
          onCopy={() => {}}
        />
      </div>

      <SettingsControl settings={settings} setSettings={setSettings} />

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={`w-full py-2.5 rounded-xl font-bold text-base shadow-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center ${
          isGenerating 
          ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
          : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-orange-500/20'
        }`}
      >
        {isGenerating && <i className="fas fa-spinner fa-spin mr-2"></i>}
        <span>{isGenerating ? 'GENETIC MAPPING...' : 'GENERATE PASSWORD'}</span>
      </button>

      <SecurityInsight report={report} isLoading={isAnalyzing} />
    </div>
  );
};

export default App;
