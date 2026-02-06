import React from 'react';
import { GlobalState } from '../types';
import {
  ArrowRightLeft,
  LayoutGrid,
  Trash2,
  Plus,
  TrendingUp,
  DollarSign,
  BarChart2,
  List
} from 'lucide-react';
import { motion } from 'framer-motion';

const TradingPage: React.FC<{ state: GlobalState, setState: React.Dispatch<React.SetStateAction<GlobalState>> }> = ({ state, setState }) => {

  const handleBlockTitleChange = (blockIdx: number, title: string) => {
    const newBlocks = [...state.tradingBlocks];
    newBlocks[blockIdx] = { ...newBlocks[blockIdx], title };
    setState(prev => ({ ...prev, tradingBlocks: newBlocks }));
  };

  const handlePriceRangeChange = (blockIdx: number, rowIdx: number, field: any, value: any) => {
    const newBlocks = [...state.tradingBlocks];
    newBlocks[blockIdx].priceRanges[rowIdx] = { ...newBlocks[blockIdx].priceRanges[rowIdx], [field]: value };
    setState(prev => ({ ...prev, tradingBlocks: newBlocks }));
  };

  const handleActivityChange = (blockIdx: number, rowIdx: number, field: any, value: any) => {
    const newBlocks = [...state.tradingBlocks];
    newBlocks[blockIdx].activities[rowIdx] = { ...newBlocks[blockIdx].activities[rowIdx], [field]: value };
    setState(prev => ({ ...prev, tradingBlocks: newBlocks }));
  };

  const format = (val: number) => new Intl.NumberFormat('en-US').format(val);

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">
          Simulation <span className="text-blue-600 dark:text-blue-400">Workspace</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium mt-2">Manage trading blocks and activities with granular control.</p>
      </header>

      <div className="space-y-16">
        {state.tradingBlocks.map((block, blockIdx) => {
          const sumRangeCost = block.priceRanges.reduce((s, r) => s + (r.cost || 0), 0);
          const sumRangePnl = block.priceRanges.reduce((s, r) => s + (r.pnl || 0), 0);
          const sumActivityCost = block.activities.reduce((s, a) => s + (a.cost || 0), 0);
          const sumActivitySold = block.activities.reduce((s, a) => s + (a.sold || 0), 0);
          const sumActivityUnrealized = sumActivitySold - sumActivityCost;
          const sessionTotalPnl = (sumRangePnl - sumRangeCost) + sumActivityUnrealized;

          return (
            <motion.section
              key={blockIdx}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-30 z-0" />

              <div className="relative z-10">
                {/* Block Header */}
                <header className="bg-slate-50/50 dark:bg-white/5 p-8 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-200">
                      <LayoutGrid size={24} />
                    </div>
                    <input
                      className="bg-transparent border-none text-2xl font-black text-slate-900 dark:text-white focus:ring-0 w-full md:w-64 placeholder-slate-300 dark:placeholder-slate-700"
                      value={block.title}
                      onChange={(e) => handleBlockTitleChange(blockIdx, e.target.value)}
                      placeholder="Session Title..."
                    />
                  </div>

                  <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <SummaryBadge label="Cost" value={format(sumRangeCost)} color="bg-slate-900" />
                    <SummaryBadge label="Session Total" value={format(sessionTotalPnl)} color={sessionTotalPnl >= 0 ? 'bg-emerald-600' : 'bg-rose-600'} trend />
                  </div>
                </header>

                <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-10">
                  {/* Price Ranges Table */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <BarChart2 size={18} className="text-blue-600 dark:text-blue-400" />
                        Price Distribution
                      </h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Primary Matrix</span>
                    </div>

                    <div className="bg-slate-50/50 rounded-3xl border border-slate-100 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200">
                      <table className="w-full text-xs">
                        <thead className="bg-white/50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                          <tr>
                            <th className="px-4 py-4 text-left">Range</th>
                            <th className="px-4 py-4">Shares</th>
                            <th className="px-4 py-4">Cost</th>
                            <th className="px-4 py-4 text-right">PNL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {block.priceRanges.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-white dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-slate-100">
                              <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{row.range}</td>
                              <td className="px-2 py-2">
                                <input type="number" className="w-full bg-white border border-slate-100 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-400 outline-none text-center font-bold" value={row.shares || ''} onChange={(e) => handlePriceRangeChange(blockIdx, rowIdx, 'shares', Number(e.target.value))} />
                              </td>
                              <td className="px-2 py-2">
                                <input type="number" className="w-full bg-white border border-slate-100 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-400 outline-none text-center font-bold" value={row.cost || ''} onChange={(e) => handlePriceRangeChange(blockIdx, rowIdx, 'cost', Number(e.target.value))} />
                              </td>
                              <td className="px-2 py-2">
                                <input type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-400 outline-none text-right font-black text-blue-600 dark:text-blue-400" value={row.pnl || ''} onChange={(e) => handlePriceRangeChange(blockIdx, rowIdx, 'pnl', Number(e.target.value))} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Activity Log Table */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <List size={18} className="text-indigo-600 dark:text-indigo-400" />
                        Trade Log
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">Unrealized:</span>
                        <span className={`text-sm font-black ${sumActivityUnrealized >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {format(sumActivityUnrealized)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200">
                      <table className="w-full text-xs text-center">
                        <thead className="bg-white/50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <tr>
                            <th className="px-4 py-4 text-left">Activity</th>
                            <th className="px-4 py-4">Share</th>
                            <th className="px-4 py-4">Cost</th>
                            <th className="px-4 py-4">Sold</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {block.activities.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-white dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-slate-100">
                              <td className="px-2 p-1">
                                <input className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-400 outline-none text-left font-medium text-slate-900 dark:text-white" value={row.activity} onChange={(e) => handleActivityChange(blockIdx, rowIdx, 'activity', e.target.value)} placeholder="Note..." />
                              </td>
                              <td className="px-1 py-1">
                                <input type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-400 outline-none text-center font-bold text-slate-900 dark:text-white" value={row.share || ''} onChange={(e) => handleActivityChange(blockIdx, rowIdx, 'share', Number(e.target.value))} />
                              </td>
                              <td className="px-1 py-1">
                                <input type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-400 outline-none text-center font-bold text-slate-900 dark:text-white" value={row.cost || ''} onChange={(e) => handleActivityChange(blockIdx, rowIdx, 'cost', Number(e.target.value))} />
                              </td>
                              <td className="px-1 py-1">
                                <input type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-400 outline-none text-center font-bold text-slate-900 dark:text-white" value={row.sold || ''} onChange={(e) => handleActivityChange(blockIdx, rowIdx, 'sold', Number(e.target.value))} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
};

const SummaryBadge: React.FC<{ label: string, value: string, color: string, trend?: boolean }> = ({ label, value, color, trend }) => (
  <div className={`${color} px-6 py-3 rounded-2xl text-white shadow-lg flex flex-col min-w-[120px]`}>
    <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">{label}</span>
    <div className="flex items-center justify-between gap-2 mt-1">
      <span className="font-black text-lg tracking-tighter">{value}</span>
      {trend && <TrendingUp size={14} className="opacity-50" />}
    </div>
  </div>
);

export default TradingPage;
