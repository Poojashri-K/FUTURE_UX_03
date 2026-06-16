import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useCRM, Client } from "../CRMContext";

type SortKey = "name" | "valueNum";
type SortDir = "asc" | "desc";
type StatusFilter = "All" | "Active" | "Waiting" | "At Risk";

const statusConfig = {
  Active:    { color: "#16A34A", bg: "#DCFCE7" },
  Waiting:   { color: "#D97706", bg: "#FEF3C7" },
  "At Risk": { color: "#DC2626", bg: "#FEE2E2" },
};

const avatarColors = ["#2563EB", "#7C3AED", "#059669", "#D97706", "#DC2626", "#0891B2"];

export function ClientStatus() {
  const { clients, updateClientStatus } = useCRM();
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const counts = {
    Active:    clients.filter(c => c.status === "Active").length,
    Waiting:   clients.filter(c => c.status === "Waiting").length,
    "At Risk": clients.filter(c => c.status === "At Risk").length,
  };

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const filtered = useMemo(() => {
    let list = statusFilter === "All" ? clients : clients.filter(c => c.status === statusFilter);
    list = [...list].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return mul * a.name.localeCompare(b.name);
      return mul * (a.valueNum - b.valueNum);
    });
    return list.slice(0, 6);
  }, [clients, sortKey, sortDir, statusFilter]);

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown size={11} className="text-[#CBD5E1]" />;
    return sortDir === "asc"
      ? <ArrowUp size={11} className="text-[#2563EB]" />
      : <ArrowDown size={11} className="text-[#2563EB]" />;
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-bold text-[#111827]">Client Status Overview</h2>
          <p className="text-[12px] text-[#6B7280] mt-0.5">{clients.length} total clients</p>
        </div>
        <button className="text-[11px] text-[#2563EB] font-medium hover:underline">View All Clients</button>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["All", "Active", "Waiting", "At Risk"] as StatusFilter[]).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all ${
              statusFilter === s
                ? s === "All"
                  ? "bg-[#111827] text-white border-[#111827]"
                  : `border-transparent`
                : "bg-white text-[#6B7280] border-[#E2E8F0] hover:bg-[#F8FAFC]"
            }`}
            style={statusFilter === s && s !== "All" ? {
              backgroundColor: statusConfig[s as keyof typeof statusConfig].bg,
              color: statusConfig[s as keyof typeof statusConfig].color,
              borderColor: statusConfig[s as keyof typeof statusConfig].bg,
            } : undefined}
          >
            {s !== "All" && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusFilter === s ? statusConfig[s as keyof typeof statusConfig].color : "#CBD5E1" }}
              />
            )}
            {s !== "All" ? `${counts[s as keyof typeof counts]} ${s}` : "All"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div>
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 px-2 py-1 mb-1">
          <div className="w-7" />
          <button
            onClick={() => toggleSort("name")}
            className="flex items-center gap-1 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider hover:text-[#6B7280]"
          >
            Client <SortIcon k="name" />
          </button>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Project</p>
          <button
            onClick={() => toggleSort("valueNum")}
            className="flex items-center gap-1 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-right hover:text-[#6B7280]"
          >
            Value <SortIcon k="valueNum" />
          </button>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Status</p>
        </div>
        {filtered.map((client, i) => {
          const cfg = statusConfig[client.status];
          return (
            <div
              key={client.id}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center px-2 py-2.5 rounded-lg hover:bg-[#F8FAFC] transition-colors group"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ backgroundColor: avatarColors[i % avatarColors.length] }}
              >
                {client.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#111827] truncate">{client.name}</p>
                <p className="text-[10px] text-[#9CA3AF]">{client.domain}</p>
              </div>
              <p className="text-[11px] text-[#6B7280] truncate max-w-[120px]">{client.project}</p>
              <p className="text-[12px] font-bold text-[#111827] text-right">{client.value}</p>
              {/* Status badge as dropdown */}
              <div className="relative group/status">
                <button
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap transition-all"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  {client.status}
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-10 hidden group-hover/status:block min-w-[100px]">
                  {(["Active", "Waiting", "At Risk"] as Client["status"][]).map(s => (
                    <button
                      key={s}
                      onClick={() => updateClientStatus(client.id, s)}
                      className={`w-full text-left px-3 py-1.5 text-[11px] font-medium hover:bg-[#F8FAFC] transition-colors ${client.status === s ? "font-bold" : ""}`}
                      style={{ color: statusConfig[s].color }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
