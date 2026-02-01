
import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Calculator,
  TrendingUp,
  Twitter,
  ChevronRight
} from 'lucide-react';
import DashboardPage from './pages/DashboardPage';
import CalculationPage from './pages/CalculationPage';
import TradingPage from './pages/TradingPage';
import { GlobalState, TradingBlockData, PriceRangeRow, ActivityRow, CalculationRow } from './types';

const INITIAL_RANGES = [
  "280 - 299", "300 - 319", "320 - 339", "340 - 359", "360 - 379",
  "380 - 399", "400 - 419", "420 - 439", "440 - 459", "460 - 479",
  "480 - 499", "500 - 519", "520 - 539", "540 - 559"
];

const createEmptyTradingBlock = (title: string): TradingBlockData => ({
  title,
  currentPrice: 420,
  priceRanges: INITIAL_RANGES.map(range => ({ range, shares: 0, cost: 0, pnl: 0 })),
  activities: Array(10).fill(null).map(() => ({ activity: '', share: 0, cost: 0, sold: 0, netPnl: 0 }))
});

const STORAGE_KEY = 'elon_tracker_state';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'calculation' | 'trading'>('dashboard');

  const [state, setState] = useState<GlobalState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state:", e);
      }
    }
    return {
      totalTweet: 0,
      average: 0,
      elapsed: 0,
      remainingDays: 0,
      remainingHours: 0,
      calculationRows: Array(15).fill(null).map(() => ({ avgDailyTweet: 0, forecastRange: 0, group: '', mark: '' })),
      tradingBlocks: [
        createEmptyTradingBlock("Day 1"),
        createEmptyTradingBlock("Day 2"),
        createEmptyTradingBlock("Day 3")
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage state={state} />;
      case 'calculation': return <CalculationPage state={state} setState={setState} />;
      case 'trading': return <TradingPage state={state} setState={setState} />;
      default: return <DashboardPage state={state} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sidebar-style Nav or Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#1DA1F2] p-1.5 rounded-lg text-white">
                <Twitter size={20} fill="currentColor" />
              </div>
              <span className="font-bold text-slate-800 text-lg tracking-tight">ELON TRACKER</span>
            </div>

            <nav className="flex space-x-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'calculation', label: 'Calculation', icon: Calculator },
                { id: 'trading', label: 'Simulation', icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentPage(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentPage === tab.id
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE SIMULATION ENABLED
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {renderPage()}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span>Elon Tweet Timeframe v3.0</span>
          <span>© 2024 Financial Tracker Solutions</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
