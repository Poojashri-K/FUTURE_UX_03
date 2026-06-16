import { useState } from "react";
import "../styles/fonts.css";
import { CRMProvider, useCRM } from "./CRMContext";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { KpiCards } from "./components/KpiCards";
import { LeadPipeline } from "./components/LeadPipeline";
import { RecentActivities } from "./components/RecentActivities";
import { UpcomingFollowups } from "./components/UpcomingFollowups";
import { TaskSummary } from "./components/TaskSummary";
import { ClientStatus } from "./components/ClientStatus";
import { Analytics } from "./components/Analytics";
import { LeadsView } from "./views/LeadsView";
import { ClientsView } from "./views/ClientsView";
import { TasksView } from "./views/TasksView";
import { ReportsView } from "./views/ReportsView";
import { SettingsView } from "./views/SettingsView";
import { CalendarDays, Filter, Download } from "lucide-react";

type Period = "7D" | "1M" | "3M" | "6M" | "1Y";

function DashboardView() {
  const [period, setPeriod] = useState<Period>("1M");

  return (
    <div className="px-6 py-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#111827] leading-tight">Dashboard Overview</h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">Welcome back, Agency Owner · Monday, June 15, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[12px] text-[#6B7280] font-medium px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
            <CalendarDays size={13} /> This Month
          </button>
          <button className="flex items-center gap-1.5 text-[12px] text-[#6B7280] font-medium px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
            <Filter size={13} /> Filter
          </button>
          <button className="flex items-center gap-1.5 text-[12px] text-[#6B7280] font-medium px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="mb-5">
        <KpiCards />
      </section>

      {/* Row 2: Lead Pipeline + Activities + Task Summary */}
      <section className="grid gap-4 mb-5" style={{ gridTemplateColumns: "1fr 300px 240px" }}>
        <LeadPipeline />
        <RecentActivities />
        <TaskSummary />
      </section>

      {/* Row 3: Follow-ups + Client Status */}
      <section className="grid gap-4 mb-5" style={{ gridTemplateColumns: "360px 1fr" }}>
        <UpcomingFollowups />
        <ClientStatus />
      </section>

      {/* Row 4: Analytics */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-[#111827]">Analytics</h2>
          <div className="flex gap-1">
            {(["7D", "1M", "3M", "6M", "1Y"] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${
                  p === period
                    ? "bg-[#2563EB] text-white"
                    : "text-[#6B7280] hover:bg-white border border-transparent hover:border-[#E2E8F0]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <Analytics period={period} />
      </section>
    </div>
  );
}

function CalendarView() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-[22px] font-bold text-[#111827] mb-2">Calendar</h1>
      <p className="text-[13px] text-[#6B7280] mb-6">View and manage your schedule</p>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-[#DBEAFE] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CalendarDays size={28} className="text-[#2563EB]" />
        </div>
        <p className="text-[15px] font-bold text-[#111827] mb-1">Calendar View</p>
        <p className="text-[13px] text-[#6B7280]">Full calendar integration coming soon. Your follow-ups and meetings will appear here.</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { activeView } = useCRM();

  const viewContent = () => {
    switch (activeView) {
      case "Dashboard": return <DashboardView />;
      case "Leads":     return <div className="px-6 py-6"><LeadsView /></div>;
      case "Clients":   return <div className="px-6 py-6"><ClientsView /></div>;
      case "Tasks":     return <div className="px-6 py-6"><TasksView /></div>;
      case "Calendar":  return <CalendarView />;
      case "Reports":   return <div className="px-6 py-6"><ReportsView /></div>;
      case "Settings":  return <div className="px-6 py-6"><SettingsView /></div>;
      default:          return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar />
      <TopNav />
      <main className="ml-60 pt-14 min-h-screen">
        {viewContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CRMProvider>
      <AppContent />
    </CRMProvider>
  );
}
