import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

type Period = "7D" | "1M" | "3M" | "6M" | "1Y";

const PIE_COLORS = ["#2563EB", "#22C55E", "#7C3AED", "#F59E0B"];

const leadsBySource = [
  { source: "Website", leads: 38 },
  { source: "Referral", leads: 29 },
  { source: "LinkedIn", leads: 31 },
  { source: "Google Ads", leads: 26 },
];

const CONVERSION_DATA: Record<Period, { month: string; rate: number }[]> = {
  "7D": [
    { month: "Mon", rate: 25 }, { month: "Tue", rate: 28 }, { month: "Wed", rate: 24 },
    { month: "Thu", rate: 30 }, { month: "Fri", rate: 27 }, { month: "Sat", rate: 22 }, { month: "Sun", rate: 28 },
  ],
  "1M": [
    { month: "Jan", rate: 22 }, { month: "Feb", rate: 25 }, { month: "Mar", rate: 24 },
    { month: "Apr", rate: 29 }, { month: "May", rate: 26 }, { month: "Jun", rate: 28 }, { month: "Jul", rate: 31 },
  ],
  "3M": [
    { month: "Apr", rate: 20 }, { month: "May", rate: 23 }, { month: "Jun", rate: 25 },
    { month: "Jul", rate: 22 }, { month: "Aug", rate: 27 }, { month: "Sep", rate: 28 },
    { month: "Oct", rate: 30 }, { month: "Nov", rate: 27 }, { month: "Dec", rate: 29 },
  ],
  "6M": [
    { month: "Jan", rate: 18 }, { month: "Feb", rate: 20 }, { month: "Mar", rate: 22 },
    { month: "Apr", rate: 21 }, { month: "May", rate: 24 }, { month: "Jun", rate: 26 },
    { month: "Jul", rate: 25 }, { month: "Aug", rate: 27 }, { month: "Sep", rate: 26 },
    { month: "Oct", rate: 29 }, { month: "Nov", rate: 28 }, { month: "Dec", rate: 31 },
  ],
  "1Y": [
    { month: "Jan", rate: 15 }, { month: "Feb", rate: 17 }, { month: "Mar", rate: 19 },
    { month: "Apr", rate: 20 }, { month: "May", rate: 22 }, { month: "Jun", rate: 21 },
    { month: "Jul", rate: 23 }, { month: "Aug", rate: 25 }, { month: "Sep", rate: 24 },
    { month: "Oct", rate: 26 }, { month: "Nov", rate: 27 }, { month: "Dec", rate: 28 },
  ],
};

const REVENUE_DATA: Record<Period, { month: string; revenue: number }[]> = {
  "7D": [
    { month: "Mon", revenue: 0.4 }, { month: "Tue", revenue: 0.3 }, { month: "Wed", revenue: 0.5 },
    { month: "Thu", revenue: 0.6 }, { month: "Fri", revenue: 0.8 }, { month: "Sat", revenue: 0.2 }, { month: "Sun", revenue: 0.4 },
  ],
  "1M": [
    { month: "Jan", revenue: 1.8 }, { month: "Feb", revenue: 2.1 }, { month: "Mar", revenue: 1.9 },
    { month: "Apr", revenue: 2.4 }, { month: "May", revenue: 2.9 }, { month: "Jun", revenue: 2.6 }, { month: "Jul", revenue: 3.2 },
  ],
  "3M": [
    { month: "Apr", revenue: 1.5 }, { month: "May", revenue: 1.8 }, { month: "Jun", revenue: 2.0 },
    { month: "Jul", revenue: 1.9 }, { month: "Aug", revenue: 2.2 }, { month: "Sep", revenue: 2.5 },
    { month: "Oct", revenue: 2.4 }, { month: "Nov", revenue: 2.8 }, { month: "Dec", revenue: 3.2 },
  ],
  "6M": [
    { month: "Jan", revenue: 1.2 }, { month: "Feb", revenue: 1.4 }, { month: "Mar", revenue: 1.6 },
    { month: "Apr", revenue: 1.8 }, { month: "May", revenue: 2.0 }, { month: "Jun", revenue: 2.2 },
    { month: "Jul", revenue: 2.1 }, { month: "Aug", revenue: 2.4 }, { month: "Sep", revenue: 2.6 },
    { month: "Oct", revenue: 2.8 }, { month: "Nov", revenue: 3.0 }, { month: "Dec", revenue: 3.2 },
  ],
  "1Y": [
    { month: "Jan", revenue: 0.8 }, { month: "Feb", revenue: 1.0 }, { month: "Mar", revenue: 1.2 },
    { month: "Apr", revenue: 1.4 }, { month: "May", revenue: 1.5 }, { month: "Jun", revenue: 1.7 },
    { month: "Jul", revenue: 1.9 }, { month: "Aug", revenue: 2.1 }, { month: "Sep", revenue: 2.3 },
    { month: "Oct", revenue: 2.6 }, { month: "Nov", revenue: 2.9 }, { month: "Dec", revenue: 3.2 },
  ],
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-[11px] font-semibold text-[#111827]">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-[11px]" style={{ color: p.color || p.fill }}>
          {p.value}{p.name === "rate" ? "%" : p.name === "revenue" ? "L" : " leads"}
        </p>
      ))}
    </div>
  );
};

interface Props { period: Period; }

export function Analytics({ period }: Props) {
  const conversionData = CONVERSION_DATA[period];
  const revenueData = REVENUE_DATA[period];

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Leads by Source */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
        <h2 className="text-[15px] font-bold text-[#111827] mb-1">Leads by Source</h2>
        <p className="text-[11px] text-[#6B7280] mb-4">124 total leads this month</p>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={leadsBySource} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="leads">
              {leadsBySource.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-1 mt-2">
          {leadsBySource.map((s, i) => (
            <div key={s.source} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
              <span className="text-[10px] text-[#6B7280]">{s.source}</span>
              <span className="text-[10px] font-bold text-[#111827] ml-auto">{s.leads}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Trend */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
        <h2 className="text-[15px] font-bold text-[#111827] mb-1">Conversion Trend</h2>
        <p className="text-[11px] text-[#6B7280] mb-4">Monthly lead-to-client rate</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={conversionData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="rate" stroke="#2563EB" strokeWidth={2} fill="url(#convGrad)" dot={{ r: 3, fill: "#2563EB" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Growth */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
        <h2 className="text-[15px] font-bold text-[#111827] mb-1">Revenue Growth</h2>
        <p className="text-[11px] text-[#6B7280] mb-4">Revenue in lakhs (₹)</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} unit="L" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {revenueData.map((_, i) => (
                <Cell key={i} fill={i === revenueData.length - 1 ? "#2563EB" : "#BFDBFE"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
