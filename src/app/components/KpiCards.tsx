import { Users, Building2, TrendingUp, IndianRupee, ArrowUp, ArrowDown } from "lucide-react";
import { useCRM } from "../CRMContext";

export function KpiCards() {
  const { totalLeads, activeClientsCount, conversionRate, monthlyRevenue, prevMonthlyRevenue, leads } = useCRM();

  const prevLeads = totalLeads - 12;
  const leadsTrend = Math.round(((totalLeads - prevLeads) / prevLeads) * 100);
  const prevClients = activeClientsCount - 3;
  const revL = (monthlyRevenue / 100000).toFixed(1);
  const prevRevL = (prevMonthlyRevenue / 100000).toFixed(1);
  const revTrend = prevMonthlyRevenue > 0 ? Math.round(((monthlyRevenue - prevMonthlyRevenue) / prevMonthlyRevenue) * 100) : 0;

  const cards = [
    {
      title: "Total Leads",
      value: totalLeads.toString(),
      trend: `+${leadsTrend}%`,
      trendUp: true,
      icon: <Users size={18} />,
      iconBg: "#DBEAFE", iconColor: "#2563EB",
      sub: "vs last month",
    },
    {
      title: "Active Clients",
      value: activeClientsCount.toString(),
      trend: `+${activeClientsCount - prevClients}`,
      trendUp: activeClientsCount > prevClients,
      icon: <Building2 size={18} />,
      iconBg: "#DCFCE7", iconColor: "#22C55E",
      sub: "new this month",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      trend: conversionRate >= 28 ? `+${conversionRate - 26}%` : `-${26 - conversionRate}%`,
      trendUp: conversionRate >= 26,
      icon: <TrendingUp size={18} />,
      iconBg: "#FEF3C7", iconColor: "#F59E0B",
      sub: "from last month",
    },
    {
      title: "Monthly Revenue",
      value: `₹${revL}L`,
      trend: `${revTrend >= 0 ? "+" : ""}${revTrend}%`,
      trendUp: revTrend >= 0,
      icon: <IndianRupee size={18} />,
      iconBg: "#EDE9FE", iconColor: "#7C3AED",
      sub: "vs last month",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[12px] font-medium text-[#6B7280] mb-1">{card.title}</p>
              <p className="text-[28px] font-bold text-[#111827] leading-none">{card.value}</p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: card.iconBg, color: card.iconColor }}
            >
              {card.icon}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                card.trendUp ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
              }`}
            >
              {card.trendUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              {card.trend}
            </div>
            <p className="text-[11px] text-[#9CA3AF]">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
