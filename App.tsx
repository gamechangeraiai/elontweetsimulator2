
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calculator,
  TrendingUp,
  ChevronRight,
  Download,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardPage from './pages/DashboardPage';
import CalculationPage from './pages/CalculationPage';
import TradingPage from './pages/TradingPage';
import { GlobalState, TradingBlockData, ForecastInputs } from './types';

const INITIAL_RANGES = [
  "240 - 259", "260 - 279", "280 - 299", "300 - 319", "320 - 339", "340 - 359", "360 - 379",
  "380 - 399", "400 - 419", "420 - 439", "440 - 459", "460 - 479",
  "480 - 499", "500 - 519", "520 - 539", "540 - 559", "560 - 579", "580 - 599", "600 - 619", "620 - 639"
];

const createEmptyTradingBlock = (title: string): TradingBlockData => ({
  title,
  currentPrice: 420,
  priceRanges: INITIAL_RANGES.map(range => ({ range, shares: 0, cost: 0, pnl: 0 })),
  activities: Array(20).fill(null).map(() => ({ activity: '', share: 0, cost: 0, sold: 0, netPnl: 0 }))
});

const STORAGE_KEY = 'elon_tracker_state';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'calculation' | 'trading'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [state, setState] = useState<GlobalState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaultInputs: ForecastInputs = {
      totalTweet: 0,
      average: 0,
      elapsed: 0,
      remainingDays: 0,
      remainingHours: 0,
      sensitivity: 0
    };

    const defaultState: GlobalState = {
      inputsA: { ...defaultInputs },
      inputsB: { ...defaultInputs },
      calculationRows: Array(20).fill(null).map(() => ({ avgDailyTweet: 0, forecastRange: 0, group: '', mark: '' })),
      tradingBlocks: [
        createEmptyTradingBlock("Day 1"),
        createEmptyTradingBlock("Day 2"),
        createEmptyTradingBlock("Day 3")
      ]
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Migration: Calculation Rows
        if (parsed.calculationRows && parsed.calculationRows.length < 20) {
          const extra = Array(20 - parsed.calculationRows.length).fill(null).map(() => ({ avgDailyTweet: 0, forecastRange: 0, group: '', mark: '' }));
          parsed.calculationRows = [...parsed.calculationRows, ...extra];
        }

        // New Migration to inputsA and inputsB
        if (!parsed.inputsA) {
          parsed.inputsA = {
            totalTweet: parsed.totalTweet ?? 0,
            average: parsed.average ?? 0,
            elapsed: parsed.elapsed ?? 0,
            remainingDays: parsed.remainingDays ?? 0,
            remainingHours: parsed.remainingHours ?? 0,
            sensitivity: 0
          };
        }
        if (!parsed.inputsB) {
          parsed.inputsB = { ...parsed.inputsA }; // Start with same values
        }

        // Migration: Trading Blocks (Activities and Ranges)
        if (parsed.tradingBlocks) {
          parsed.tradingBlocks = parsed.tradingBlocks.map((block: TradingBlockData) => {
            // Activities
            if (block.activities && block.activities.length < 20) {
              const extraAct = Array(20 - block.activities.length).fill(null).map(() => ({ activity: '', share: 0, cost: 0, sold: 0, netPnl: 0 }));
              block.activities = [...block.activities, ...extraAct];
            }
            // Price Ranges (ensure all INITIAL_RANGES are present)
            const currentRanges = block.priceRanges.map(r => r.range);
            const needsUpdate = INITIAL_RANGES.some(r => !currentRanges.includes(r));
            if (needsUpdate) {
              block.priceRanges = INITIAL_RANGES.map(rangeStr => {
                const existing = block.priceRanges.find(r => r.range === rangeStr);
                return existing || { range: rangeStr, shares: 0, cost: 0, pnl: 0 };
              });
            }
            return block;
          });
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse saved state:", e);
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "elon_tracker_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-100 text-slate-950'} font-sans`}>
      {/* Premium Navigation */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${isDarkMode ? 'bg-slate-900/80 border-white/10' : 'bg-white/70 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <TrendingUp size={24} className="text-white" />
              </div>
              <span className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                X TRACKER
              </span>
            </div>

            <nav className="hidden md:flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'calculation', label: 'Calculation', icon: Calculator },
                { id: 'trading', label: 'Simulation', icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentPage(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${currentPage === tab.id
                    ? 'bg-white text-blue-600 shadow-md scale-105'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
              >
                {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            {currentPage === 'dashboard' && <DashboardPage state={state} />}
            {currentPage === 'calculation' && <CalculationPage state={state} setState={setState} />}
            {currentPage === 'trading' && <TradingPage state={state} setState={setState} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className={`mt-auto border-t py-8 ${isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">NFA / DYOR Disclaimer</span>
            <p className="text-xs text-slate-500 max-w-xl font-medium">
              ไม่ได้ชี้นำการลงทุนใดๆทั้งสิ้น เป็นแค่เครื่องมือในการคำนวนปริมานการ post เท่านั้น
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/gKukkui"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-3 rounded-2xl border border-slate-300 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">VIBE By</span>
              <span className="font-bold text-slate-800">KuKKui</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
