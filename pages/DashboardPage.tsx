
import React from 'react';
import { GlobalState } from '../types';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'framer-motion';

const DashboardPage: React.FC<{ state: GlobalState }> = ({ state }) => {
  const sessionMetrics = state.tradingBlocks.map(block => {
    const blockCost = block.priceRanges.reduce((sum, r) => sum + (r.cost || 0), 0);
    const blockPnlRanges = block.priceRanges.reduce((sum, r) => sum + (r.pnl || 0), 0);
    const blockPnlActivities = block.activities.reduce((sum, act) => sum + (act.sold - act.cost), 0);
    const blockSummaryTotal = blockPnlRanges - blockCost;
    const blockGrandTotal = blockSummaryTotal + blockPnlActivities;

    return {
      name: block.title || 'unnamed',
      cost: blockCost,
      pnl: blockGrandTotal,
      activityPnl: blockPnlActivities
    };
  });

  const totalCost = sessionMetrics.reduce((sum, m) => sum + m.cost, 0);
  const totalPnl = sessionMetrics.reduce((sum, m) => sum + m.pnl, 0);
  const totalActivityPnl = sessionMetrics.reduce((sum, m) => sum + m.activityPnl, 0);

  const format = (val: number) => new Intl.NumberFormat('en-US').format(val);

  const chartData = sessionMetrics.map(m => ({
    name: m.name,
    pnl: m.pnl,
    cost: m.cost
  }));

  const pieData = sessionMetrics.map(m => ({
    name: m.name,
    value: m.cost
  })).filter(d => d.value > 0);

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Portfolio <span className="text-blue-600">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Advanced simulation analytics and performance tracking.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/50 backdrop-blur-xl border border-slate-200 p-4 rounded-3xl shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total PNL</p>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black ${totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {totalPnl >= 0 ? '+' : ''}{format(totalPnl)}
              </span>
              {totalPnl >= 0 ? <ArrowUpRight className="text-emerald-500" /> : <ArrowDownRight className="text-rose-500" />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
        <StatCard
          title="Total Invested"
          value={format(totalCost)}
          icon={<DollarSign size={24} />}
          color="bg-slate-900"
          trend="Aggregated Cost"
        />
        <StatCard
          title="Unrealized PNL"
          value={`${totalActivityPnl >= 0 ? '+' : ''}${format(totalActivityPnl)}`}
          icon={<TrendingUp size={24} />}
          color="bg-emerald-600"
          trend="Trade Log Performance"
        />
        <StatCard
          title="Net Liquidity"
          value={format(totalCost + totalPnl)}
          icon={<PieIcon size={24} />}
          color="bg-blue-600"
          trend="Current Valuation"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
          <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
            <Layers size={20} className="text-blue-600" />
            PNL Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="pnl" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
            <PieIcon size={20} className="text-indigo-600" />
            Allocation
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Session Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 tracking-tight">Session Breakdown</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Data Stream</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Session</th>
                <th className="px-8 py-5 text-center">Cost</th>
                <th className="px-8 py-5 text-center">Unrealized</th>
                <th className="px-8 py-5 text-right">Total PNL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessionMetrics.map((session, idx) => (
                <tr key={idx} className="group hover:bg-blue-50/30 transition-all duration-300 cursor-default">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{session.name}</div>
                  </td>
                  <td className="px-8 py-6 text-center font-mono font-bold text-slate-500">{format(session.cost)}</td>
                  <td className={`px-8 py-6 text-center font-mono font-black ${session.activityPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {session.activityPnl >= 0 ? '+' : ''}{format(session.activityPnl)}
                  </td>
                  <td className={`px-8 py-6 text-right font-mono font-black ${session.pnl >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                    <div className="flex items-center justify-end gap-2">
                      {format(session.pnl)}
                      {session.pnl >= 0 ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-rose-500" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, color: string, trend: string }> = ({ title, value, icon, color, trend }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`${color} rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group`}
  >
    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
      {icon}
    </div>
    <div className="relative z-10">
      <div className="p-3 bg-white/10 rounded-2xl w-fit mb-6">
        {icon}
      </div>
      <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{title}</p>
      <h2 className="text-4xl font-black mt-2 tracking-tighter">{value}</h2>
      <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{trend}</span>
      </div>
    </div>
  </motion.div>
);

export default DashboardPage;
