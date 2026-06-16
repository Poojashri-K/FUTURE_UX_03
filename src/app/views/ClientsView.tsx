import { useState, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useCRM, Client } from "../CRMContext";

type StatusFilter = "All" | "Active" | "Waiting" | "At Risk";
type SortKey = "name" | "valueNum" | "status";

const statusConfig = {
  Active:    { color: "#16A34A", bg: "#DCFCE7" },
  Waiting:   { color: "#D97706", bg: "#FEF3C7" },
  "At Risk": { color: "#DC2626", bg: "#FEE2E2" },
};

const avatarColors = ["#2563EB", "#7C3AED", "#059669", "#D97706", "#DC2626", "#0891B2", "#0EA5E9", "#F97316"];

export function ClientsView() {
  const { clients, updateClientStatus } = useCRM();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const counts = {
    Active:    clients.filter(c => c.status === "Active").length,
    Waiting:   clients.filter(c => c.status === "Waiting").length,
    "At Risk": clients.filter(c => c.status === "At Risk").length,
  };

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const filtered = useMemo(() => {
    let list = filter === "All" ? clients : clients.filter(c => c.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.project.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return mul * a.name.localeCompare(b.name);
      if (sortKey === "valueNum") return mul * (a.valueNum - b.valueNum);
      return mul * a.status.localeCompare(b.status);
    });
  }, [clients, filter, search, sortKey, sortDir]);

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown size={10} className="text-[#CBD5E1]" />;
    return sortDir === "asc" ? <ArrowUp size={10} className="text-[#2563EB]" /> : <ArrowDown size={10} className="text-[#2563EB]" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#111827] leading-tight">Clients</h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">{clients.length} total clients · {counts.Active} active</p>
        </div>
        <div className="flex gap-2">
          {(["Active", "Waiting", "At Risk"] as StatusFilter[]).map(s => (
            <div key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold" style={{ backgroundColor: statusConfig[s as keyof typeof statusConfig].bg, color: statusConfig[s as keyof typeof statusConfig].color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusConfig[s as keyof typeof statusConfig].color }} />
              {counts[s as keyof typeof counts]} {s}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]" />
          </div>
          <div className="flex gap-1.5">
            {(["All", "Active", "Waiting", "At Risk"] as StatusFilter[]).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${filter === s ? s === "All" ? "bg-[#111827] text-white border-[#111827]" : "border-transparent" : "text-[#6B7280] border-[#E2E8F0] hover:bg-[#F8FAFC]"}`}
                style={filter === s && s !== "All" ? { backgroundColor: statusConfig[s as keyof typeof statusConfig].bg, color: statusConfig[s as keyof typeof statusConfig].color, borderColor: statusConfig[s as keyof typeof statusConfig].bg } : undefined}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="grid grid-cols-[auto_2fr_1fr_2fr_1fr_1fr] gap-4 px-5 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]">
          <div className="w-8" />
          <button onClick={() => handleSort("name")} className="flex items-center gap-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hover:text-[#6B7280]">Client <SortIcon k="name" /></button>
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Domain</p>
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Project</p>
          <button onClick={() => handleSort("valueNum")} className="flex items-center gap-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hover:text-[#6B7280]">Value <SortIcon k="valueNum" /></button>
          <button onClick={() => handleSort("status")} className="flex items-center gap-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hover:text-[#6B7280]">Status <SortIcon k="status" /></button>
        </div>

        <div className="divide-y divide-[#F1F5F9] max-h-[520px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center"><p className="text-[13px] text-[#9CA3AF]">No clients found</p></div>
          ) : filtered.map((client, i) => {
            const cfg = statusConfig[client.status];
            return (
              <div key={client.id} className="grid grid-cols-[auto_2fr_1fr_2fr_1fr_1fr] gap-4 px-5 py-3 items-center hover:bg-[#F8FAFC] transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: avatarColors[i % avatarColors.length] }}>{client.avatar}</div>
                <div>
                  <p className="text-[13px] font-semibold text-[#111827]">{client.name}</p>
                </div>
                <p className="text-[11px] text-[#6B7280]">{client.domain}</p>
                <p className="text-[12px] text-[#374151] truncate">{client.project}</p>
                <p className="text-[12px] font-bold text-[#111827]">{client.value}</p>
                <div className="relative group">
                  <button className="text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-pointer" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                    {client.status}
                  </button>
                  <div className="absolute left-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-10 hidden group-hover:block min-w-[100px]">
                    {(["Active", "Waiting", "At Risk"] as Client["status"][]).map(s => (
                      <button key={s} onClick={() => updateClientStatus(client.id, s)} className="w-full text-left px-3 py-1.5 text-[11px] font-medium hover:bg-[#F8FAFC]" style={{ color: statusConfig[s].color }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-3 border-t border-[#F1F5F9] bg-[#F8FAFC]">
          <p className="text-[11px] text-[#9CA3AF]">Showing {filtered.length} of {clients.length} clients</p>
        </div>
      </div>
    </div>
  );
}
