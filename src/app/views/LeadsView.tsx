import { useState, useMemo } from "react";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { useCRM, Lead, Stage } from "../CRMContext";
import { AddLeadModal } from "../components/AddLeadModal";

const STAGES: (Stage | "All")[] = ["All", "New Leads", "Contacted", "Proposal Sent", "Negotiation", "Converted", "Lost"];
const STAGE_COLORS: Record<Stage, { color: string; bg: string }> = {
  "New Leads":     { color: "#2563EB", bg: "#DBEAFE" },
  "Contacted":     { color: "#7C3AED", bg: "#EDE9FE" },
  "Proposal Sent": { color: "#F59E0B", bg: "#FEF3C7" },
  "Negotiation":   { color: "#EF4444", bg: "#FEE2E2" },
  "Converted":     { color: "#22C55E", bg: "#DCFCE7" },
  "Lost":          { color: "#9CA3AF", bg: "#F1F5F9" },
};
const SOURCE_COLORS: Record<string, string> = {
  Website: "#2563EB", Referral: "#22C55E", LinkedIn: "#7C3AED", "Google Ads": "#F59E0B",
};

export function LeadsView() {
  const { leads, moveLeadStage } = useCRM();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<Stage | "All">("All");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let list = filter === "All" ? leads : leads.filter(l => l.stage === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      return mul * (b.createdAt.getTime() - a.createdAt.getTime());
    });
  }, [leads, filter, search, sortDir]);

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-bold text-[#111827] leading-tight">Leads</h1>
            <p className="text-[13px] text-[#6B7280] mt-0.5">{leads.length} leads across all stages</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-[#2563EB] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {STAGES.map(s => {
                const count = s === "All" ? leads.length : leads.filter(l => l.stage === s).length;
                const cfg = s !== "All" ? STAGE_COLORS[s] : null;
                return (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                      filter === s
                        ? s === "All" ? "bg-[#111827] text-white border-[#111827]" : "border-transparent"
                        : "text-[#6B7280] border-[#E2E8F0] hover:bg-[#F8FAFC]"
                    }`}
                    style={filter === s && cfg ? { backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.bg } : undefined}
                  >
                    {s} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="grid grid-cols-[2fr_2fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]">
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Name</p>
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Company</p>
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Email</p>
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Source</p>
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Stage</p>
            <button
              onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
              className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1 hover:text-[#6B7280]"
            >
              Added <ArrowUpDown size={10} />
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9] max-h-[500px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-[13px] text-[#9CA3AF]">No leads found</p>
              </div>
            ) : filtered.map(lead => {
              const cfg = STAGE_COLORS[lead.stage];
              const srcColor = SOURCE_COLORS[lead.source] || "#9CA3AF";
              return (
                <div key={lead.id} className="grid grid-cols-[2fr_2fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-3 items-center hover:bg-[#F8FAFC] transition-colors">
                  <p className="text-[13px] font-semibold text-[#111827] truncate">{lead.name}</p>
                  <p className="text-[12px] text-[#374151] truncate">{lead.company}</p>
                  <p className="text-[11px] text-[#6B7280] truncate">{lead.email}</p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit" style={{ backgroundColor: srcColor + "20", color: srcColor }}>
                    {lead.source}
                  </span>
                  <div className="relative group">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-pointer" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                      {lead.stage}
                    </span>
                    <div className="absolute left-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-10 hidden group-hover:block min-w-[140px]">
                      {(["New Leads", "Contacted", "Proposal Sent", "Negotiation", "Converted", "Lost"] as Stage[]).map(s => (
                        <button
                          key={s}
                          onClick={() => moveLeadStage(lead.id, s)}
                          className="w-full text-left px-3 py-1.5 text-[11px] font-medium hover:bg-[#F8FAFC] truncate"
                          style={{ color: STAGE_COLORS[s].color }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF]">
                    {lead.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 border-t border-[#F1F5F9] bg-[#F8FAFC]">
            <p className="text-[11px] text-[#9CA3AF]">Showing {filtered.length} of {leads.length} leads</p>
          </div>
        </div>
      </div>

      {showModal && <AddLeadModal onClose={() => setShowModal(false)} />}
    </>
  );
}
