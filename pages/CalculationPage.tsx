
import React, { useState } from 'react';
import { GlobalState, ForecastInputs } from '../types';
import { calculateForecastRange } from '../utils/formulas';
import {
  Clock,
  Calendar,
  BarChart,
  Sparkles,
  Info,
  Settings,
  Target,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const CalculationPage: React.FC<{ state: GlobalState, setState: React.Dispatch<React.SetStateAction<GlobalState>> }> = ({ state, setState }) => {
  const handleTopInput = (set: 'inputsA' | 'inputsB', field: keyof ForecastInputs, value: number) => {
    setState(prev => ({
      ...prev,
      [set]: { ...prev[set], [field]: value }
    }));
  };

  const handleSensitivity = (set: 'inputsA' | 'inputsB', value: number) => {
    setState(prev => ({
      ...prev,
      [set]: { ...prev[set], sensitivity: value }
    }));
  };

  const handleRowInput = (idx: number, field: 'avgDailyTweet' | 'group' | 'mark', value: any) => {
    const newRows = [...state.calculationRows];
    newRows[idx] = { ...newRows[idx], [field]: value };
    setState(prev => ({ ...prev, calculationRows: newRows }));
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-slate-950">
          Forecasting <span className="text-blue-600">Engine</span>
        </h1>
        <p className="text-slate-600 font-medium mt-2">Adjust variables and simulate future tweet volume outcomes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Results Tables */}
        <div className="lg:col-span-12 space-y-12">
          {[0, 10].map((startIndex) => {
            const isSetA = startIndex === 0;
            const currentInputs = isSetA ? state.inputsA : state.inputsB;
            const inputKey = isSetA ? 'inputsA' : 'inputsB';

            return (
              <div key={startIndex} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Tool Set for this Table */}
                <div className="lg:col-span-4 space-y-6">
                  <section className="bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
                    <h3 className="font-black text-slate-950 dark:text-slate-100 flex items-center gap-2 text-sm uppercase tracking-tight">
                      <Settings size={18} className="text-blue-600" />
                      Parameters: Set {isSetA ? 'A' : 'B'}
                    </h3>

                    <div className="space-y-4">
                      <InputGroup
                        label="Total Tweets"
                        value={currentInputs.totalTweet}
                        onChange={(val) => handleTopInput(inputKey, 'totalTweet', val)}
                        icon={<Zap size={14} />}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup
                          label="Average"
                          value={currentInputs.average}
                          onChange={(val) => handleTopInput(inputKey, 'average', val)}
                          small
                        />
                        <InputGroup
                          label="Elapsed"
                          value={currentInputs.elapsed}
                          onChange={(val) => handleTopInput(inputKey, 'elapsed', val)}
                          small
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                        <div className="grid grid-cols-2 gap-3">
                          <InputGroup label="Days" value={currentInputs.remainingDays} onChange={(val) => handleTopInput(inputKey, 'remainingDays', val)} small />
                          <InputGroup label="Hours" value={currentInputs.remainingHours} onChange={(val) => handleTopInput(inputKey, 'remainingHours', val)} small />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <h3 className="font-black mb-4 flex items-center gap-2 text-sm">
                      <Sparkles size={18} />
                      Simulator {isSetA ? 'A' : 'B'}
                    </h3>
                    <div className="space-y-4 relative z-10">
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="1"
                        value={currentInputs.sensitivity}
                        onChange={(e) => handleSensitivity(inputKey, Number(e.target.value))}
                        className="w-full h-1.5 bg-blue-400/30 rounded-lg appearance-none cursor-pointer accent-white"
                      />
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <p className="text-[10px] font-bold text-blue-100 uppercase">Impact: {currentInputs.sensitivity > 0 ? '+' : ''}{currentInputs.sensitivity}</p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Table for this Tool Set */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-md overflow-hidden">
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <h3 className="font-black text-slate-950 dark:text-slate-100 flex items-center gap-2">
                      <Target size={18} className="text-blue-600" />
                      Forecast Set {isSetA ? 'A' : 'B'}
                    </h3>
                    {isSetA && (
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">
                        <Info size={10} />
                        AUTO-CALCULATION ENABLED
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto text-slate-950 dark:text-slate-100">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50/30 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        <tr>
                          <th className="px-6 py-4">Daily Avg</th>
                          <th className="px-6 py-4">Forecast Range</th>
                          <th className="px-6 py-4">Group</th>
                          <th className="px-6 py-4">Mark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                        {state.calculationRows.slice(startIndex, startIndex + 10).map((row, relativeIdx) => {
                          const idx = startIndex + relativeIdx;
                          let baseAvg = row.avgDailyTweet;
                          let isLinked = false;
                          let label = "";
                          let rowContext = "";

                          if (idx === 5) { baseAvg = currentInputs.average - 4; isLinked = true; label = "-4"; rowContext = "bg-blue-50/30 dark:bg-blue-900/10"; }
                          else if (idx === 6) { baseAvg = currentInputs.average - 2; isLinked = true; label = "-2"; rowContext = "bg-blue-50/30 dark:bg-blue-900/10"; }
                          else if (idx === 7) { baseAvg = currentInputs.average; isLinked = true; label = "AVG"; rowContext = "bg-blue-100/50 dark:bg-blue-900/30"; }
                          else if (idx === 8) { baseAvg = currentInputs.average + 2; isLinked = true; label = "+2"; rowContext = "bg-blue-50/30 dark:bg-blue-900/10"; }
                          else if (idx === 9) { baseAvg = currentInputs.average + 4; isLinked = true; label = "+4"; rowContext = "bg-blue-50/30 dark:bg-blue-900/10"; }

                          const effectiveAvg = baseAvg + currentInputs.sensitivity;
                          const forecast = calculateForecastRange(effectiveAvg, currentInputs.remainingDays, currentInputs.remainingHours, currentInputs.totalTweet);

                          return (
                            <motion.tr
                              key={idx}
                              layout
                              className={`transition-colors duration-300 ${rowContext} hover:bg-slate-50 dark:hover:bg-white/5`}
                            >
                              <td className="p-3 px-6">
                                {isLinked ? (
                                  <div className="flex flex-col items-center">
                                    <span className="font-black text-blue-600 dark:text-blue-400 text-lg">{effectiveAvg}</span>
                                    <span className="text-[10px] font-black text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/10 mt-1 uppercase">{label}</span>
                                  </div>
                                ) : (
                                  <input
                                    type="number"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-2 py-3 font-bold text-slate-950 dark:text-white focus:ring-2 focus:ring-blue-400 outline-none text-center shadow-sm"
                                    value={row.avgDailyTweet || ''}
                                    onChange={(e) => handleRowInput(idx, 'avgDailyTweet', Number(e.target.value))}
                                  />
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="font-mono font-black text-xl text-slate-900 dark:text-slate-100">{Math.round(forecast).toLocaleString()}</span>
                              </td>
                              <td className="p-3 px-6">
                                <input className="w-full text-center border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 rounded-xl py-3 font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" value={row.group} onChange={(e) => handleRowInput(idx, 'group', e.target.value)} />
                              </td>
                              <td className="p-3 px-6">
                                <input className="w-full text-center border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 rounded-xl py-3 font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" value={row.mark} onChange={(e) => handleRowInput(idx, 'mark', e.target.value)} />
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const InputGroup: React.FC<{ label: string, value: number, onChange: (val: number) => void, small?: boolean, icon?: React.ReactNode }> = ({ label, value, onChange, small, icon }) => (
  <div className="space-y-2">
    <label className={`text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1`}>
      {icon}
      {label}
    </label>
    <input
      type="number"
      className={`w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-4 ${small ? 'py-2.5 text-lg' : 'py-4 text-2xl'} font-black text-center text-slate-950 dark:text-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-white/5`}
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

export default CalculationPage;
