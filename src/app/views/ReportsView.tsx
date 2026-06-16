import { useState } from "react";
import { useCRM } from "../CRMContext";
import { Analytics } from "../components/Analytics";
import { TrendingUp, Users, Building2, IndianRupee, ArrowUp } from "lucide-react";

type Period = "7D" | "1M" | "3M" | "6M" | "1Y";

export function ReportsView() {
  const { leads, clients, tasks, totalLeads, activeClientsCount, conversionRate, monthlyRevenue } = useCRM();
  const [period, setPeriod] = useState<Period>("1M");

  const completed = tasks.filter(t => t.status === "completed").length;
  const taskRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#111827] leading-tight">Reports & Analytics</h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">Comprehensive performance overview</p>
        </div>
        <div className="flex gap-1 bg-white border border-[#E2E8F0] rounded-lg p-1">
          {(["7D", "1M", "3M", "6M", "1Y"] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-md transition-colors ${p === period ? "bg-[#2563EB] text-white" : "text-[#6B7280] hover:bg-[#F8FAFC]"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Leads", value: totalLeads.toString(), icon: <Users size={16} />, trend: "+12%", iconBg: "#DBEAFE", iconColor: "#2563EB" },
          { label: "Active Clients", value: activeClientsCount.toString(), icon: <Building2 size={16} />, trend: "+3", iconBg: "#DCFCE7", iconColor: "#22C55E" },
          { label: "Conversion Rate", value: `${conversionRate}%`, icon: <TrendingUp size={16} />, trend: "+2%", iconBg: "#FEF3C7", iconColor: "#F59E0B" },
          { label: "Monthly Revenue", value: `₹${(monthlyRevenue / 100000).toFixed(1)}L`, icon: <IndianRupee size={16} />, trend: "+18%", iconBg: "#EDE9FE", iconColor: "#7C3AED" },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] text-[#6B7280]">{card.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.iconBg, color: card.iconColor }}>{card.icon}</div>
            </div>
            <p className="text-[24px] font-bold text-[#111827]">{card.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp size={10} className="text-[#16A34A]" />
              <span className="text-[11px] font-semibold text-[#16A34A]">{card.trend}</span>
              <span className="text-[11px] text-[#9CA3AF]">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Task completion */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
          <h3 className="text-[13px] font-bold text-[#111827] mb-3">Task Completion Rate</h3>
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#E2E8F0" strokeWidth="5" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#22C55E" strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - taskRate / 100)}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[13px] font-bold text-[#111827]">{taskRate}%</span>
              </div>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#111827]">{completed}/{tasks.length}</p>
              <p className="text-[11px] text-[#6B7280]">Tasks completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
          <h3 className="text-[13px] font-bold text-[#111827] mb-3">Lead Stage Breakdown</h3>
          <div className="space-y-2">
            {(["New Leads", "Contacted", "Proposal Sent", "Negotiation", "Converted"] as const).map(stage => {
              const count = leads.filter(l => l.stage === stage).length;
              const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
              const colors: Record<string, string> = { "New Leads": "#2563EB", Contacted: "#7C3AED", "Proposal Sent": "#F59E0B", Negotiation: "#EF4444", Converted: "#22C55E" };
              return (
                <div key={stage} className="flex items-center gap-2">
                  <p className="text-[10px] text-[#6B7280] w-24 flex-shrink-0 truncate">{stage}</p>
                  <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: colors[stage] }} />
                  </div>
                  <p className="text-[10px] font-bold text-[#111827] w-5 text-right">{count}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
          <h3 className="text-[13px] font-bold text-[#111827] mb-3">Client Health</h3>
          {(["Active", "Waiting", "At Risk"] as const).map(s => {
            const count = clients.filter(c => c.status === s).length;
            const colors = { Active: "#22C55E", Waiting: "#F59E0B", "At Risk": "#EF4444" };
            return (
              <div key={s} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[s] }} />
                  <p className="text-[12px] text-[#374151]">{s}</p>
                </div>
                <p className="text-[13px] font-bold text-[#111827]">{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <Analytics period={period} />
    </div>
  );
}
