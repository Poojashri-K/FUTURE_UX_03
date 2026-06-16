import {
  LayoutDashboard, Users, Building2, CheckSquare,
  Calendar, BarChart3, Settings, Zap,
} from "lucide-react";
import { useCRM, View } from "../CRMContext";

type NavItem = { icon: React.ReactNode; label: View | "Calendar"; badge?: (counts: ReturnType<typeof useBadges>) => number | undefined };

function useBadges() {
  const { leads, tasks, notifications } = useCRM();
  return {
    newLeads: leads.filter(l => l.stage === "New Leads").length,
    overdue: tasks.filter(t => t.status === "overdue").length,
    unread: notifications.filter(n => !n.read).length,
  };
}

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { icon: <Users size={18} />, label: "Leads", badge: b => b.newLeads },
  { icon: <Building2 size={18} />, label: "Clients" },
  { icon: <CheckSquare size={18} />, label: "Tasks", badge: b => b.overdue },
  { icon: <Calendar size={18} />, label: "Calendar" },
  { icon: <BarChart3 size={18} />, label: "Reports" },
  { icon: <Settings size={18} />, label: "Settings" },
];

export function Sidebar() {
  const { activeView, setActiveView } = useCRM();
  const badges = useBadges();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-[#E2E8F0] flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E2E8F0]">
        <button
          onClick={() => setActiveView("Dashboard")}
          className="flex items-center gap-2.5 w-full text-left"
        >
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#111827] leading-tight tracking-tight">AgencyFlow</p>
            <p className="text-[10px] text-[#6B7280] font-medium leading-tight">CRM</p>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest px-3 mb-2">Main Menu</p>
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.label;
          const badgeVal = item.badge?.(badges);
          return (
            <button
              key={item.label}
              onClick={() => setActiveView(item.label as View)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group cursor-pointer ${
                isActive
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-[#2563EB]" : "text-[#9CA3AF] group-hover:text-[#6B7280]"}>
                  {item.icon}
                </span>
                {item.label}
              </div>
              {badgeVal != null && badgeVal > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.label === "Tasks"
                      ? "bg-[#FEE2E2] text-[#EF4444]"
                      : "bg-[#DBEAFE] text-[#2563EB]"
                  }`}
                >
                  {badgeVal}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-[#E2E8F0]">
        <div className="bg-[#EFF6FF] rounded-xl p-3">
          <p className="text-[11px] font-semibold text-[#1D4ED8] mb-0.5">Pro Plan Active</p>
          <p className="text-[10px] text-[#6B7280]">5 seats · Renews Jul 15</p>
          <div className="mt-2 h-1 bg-[#BFDBFE] rounded-full">
            <div className="h-full w-4/5 bg-[#2563EB] rounded-full" />
          </div>
          <p className="text-[10px] text-[#6B7280] mt-1">4/5 seats used</p>
        </div>
      </div>
    </aside>
  );
}
