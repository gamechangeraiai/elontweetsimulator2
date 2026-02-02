
import React, { useState } from 'react';
import { GlobalState } from '../types';
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
  const [sensitivity, setSensitivity] = useState(0); // Offset for average

  const handleTopInput = (field: keyof GlobalState, value: number) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleRowInput = (idx: number, field: 'avgDailyTweet' | 'group' | 'mark', value: any) => {
    const newRows = [...state.calculationRows];
    newRows[idx] = { ...newRows[idx], [field]: value };
    setState(prev => ({ ...prev, calculationRows: newRows }));
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Forecasting <span className="text-blue-600">Engine</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">Adjust variables and simulate future tweet volume outcomes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Settings size={20} className="text-blue-600" />
              Core Parameters
            </h3>

            <div className="space-y-6">
              <InputGroup
                label="Total Tweets"
                value={state.totalTweet}
                onChange={(val) => handleTopInput('totalTweet', val)}
                icon={<Zap size={16} />}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Average"
                  value={state.average}
                  onChange={(val) => handleTopInput('average', val)}
                  small
                />
                <InputGroup
                  label="Elapsed"
                  value={state.elapsed}
                  onChange={(val) => handleTopInput('elapsed', val)}
                  small
                />
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 flex items-center gap-2">
                  <Clock size={14} className="text-blue-500" />
                  Time Remaining
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Days" value={state.remainingDays} onChange={(val) => handleTopInput('remainingDays', val)} small />
                  <InputGroup label="Hours" value={state.remainingHours} onChange={(val) => handleTopInput('remainingHours', val)} small />
                </div>
              </div>
            </div>
          </section>

          {/* New Feature: Sensitivity Analysis */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
            <h3 className="font-black mb-6 flex items-center gap-2">
              <Sparkles size={20} />
              Scenario Simulator
            </h3>
            <p className="text-xs text-blue-100 mb-6 leading-relaxed">
              Instantly adjust the global average to see how sensitivity impacts your forecasts.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-200">
                <span>Conservative</span>
                <span>Extreme</span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full h-2 bg-blue-400/30 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
                <p className="text-[10px] font-bold text-blue-200 uppercase">Impact on Average</p>
                <p className="text-2xl font-black">{sensitivity > 0 ? '+' : ''}{sensitivity}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Results Table */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50/50 p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Target size={20} className="text-blue-600" />
              Forecast Projections
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200">
              <Info size={12} />
              AUTO-CALCULATION ENABLED
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                <tr>
                  <th className="px-6 py-4">Daily Avg</th>
                  <th className="px-6 py-4">Forecast Range</th>
                  <th className="px-6 py-4">Group</th>
                  <th className="px-6 py-4">Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {state.calculationRows.map((row, idx) => {
                  let baseAvg = row.avgDailyTweet;
                  let isLinked = false;
                  let label = "";
                  let rowContext = "";

                  if (idx === 5) { baseAvg = state.average - 4; isLinked = true; label = "-4"; rowContext = "bg-blue-50/30"; }
                  else if (idx === 6) { baseAvg = state.average - 2; isLinked = true; label = "-2"; rowContext = "bg-blue-50/30"; }
                  else if (idx === 7) { baseAvg = state.average; isLinked = true; label = "AVG"; rowContext = "bg-blue-100/50"; }
                  else if (idx === 8) { baseAvg = state.average + 2; isLinked = true; label = "+2"; rowContext = "bg-blue-50/30"; }
                  else if (idx === 9) { baseAvg = state.average + 4; isLinked = true; label = "+4"; rowContext = "bg-blue-50/30"; }

                  const effectiveAvg = baseAvg + sensitivity;
                  const forecast = calculateForecastRange(effectiveAvg, state.remainingDays, state.remainingHours, state.totalTweet);

                  return (
                    <motion.tr
                      key={idx}
                      layout
                      className={`transition-colors duration-300 ${rowContext} hover:bg-slate-50`}
                    >
                      <td className="p-3 px-6">
                        {isLinked ? (
                          <div className="flex flex-col items-center">
                            <span className="font-black text-blue-600 text-lg">{effectiveAvg}</span>
                            <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 mt-1 uppercase">{label}</span>
                          </div>
                        ) : (
                          <input
                            type="number"
                            className="w-full bg-white border border-slate-200 rounded-xl px-2 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none text-center shadow-sm"
                            value={row.avgDailyTweet || ''}
                            onChange={(e) => handleRowInput(idx, 'avgDailyTweet', Number(e.target.value))}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-mono font-black text-xl text-slate-900">{Math.round(forecast).toLocaleString()}</span>
                      </td>
                      <td className="p-3 px-6">
                        <input className="w-full text-center border border-slate-200 bg-white rounded-xl py-3 font-bold text-slate-700 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" value={row.group} onChange={(e) => handleRowInput(idx, 'group', e.target.value)} />
                      </td>
                      <td className="p-3 px-6">
                        <input className="w-full text-center border border-slate-200 bg-white rounded-xl py-3 font-bold text-slate-700 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" value={row.mark} onChange={(e) => handleRowInput(idx, 'mark', e.target.value)} />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup: React.FC<{ label: string, value: number, onChange: (val: number) => void, small?: boolean, icon?: React.ReactNode }> = ({ label, value, onChange, small, icon }) => (
  <div className="space-y-2">
    <label className={`text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1`}>
      {icon}
      {label}
    </label>
    <input
      type="number"
      className={`w-full bg-white border border-slate-200 rounded-2xl px-4 ${small ? 'py-2.5 text-lg' : 'py-4 text-2xl'} font-black text-center text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all hover:bg-slate-50`}
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

export default CalculationPage;
