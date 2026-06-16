import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useCRM, Stage } from "../CRMContext";

const STAGE_CONFIG: { label: Stage; color: string; bg: string }[] = [
  { label: "New Leads",     color: "#2563EB", bg: "#EFF6FF" },
  { label: "Contacted",     color: "#7C3AED", bg: "#EDE9FE" },
  { label: "Proposal Sent", color: "#F59E0B", bg: "#FEF3C7" },
  { label: "Negotiation",   color: "#EF4444", bg: "#FEE2E2" },
  { label: "Converted",     color: "#22C55E", bg: "#DCFCE7" },
];

export function LeadPipeline() {
  const { leads, moveLeadStage, setActiveView } = useCRM();
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);

  const activeLeads = leads.filter(l => l.stage !== "Lost");
  const total = activeLeads.length;
  const maxCount = Math.max(...STAGE_CONFIG.map(s => activeLeads.filter(l => l.stage === s.label).length), 1);

  function handleDragStart(e: React.DragEvent, leadId: string) {
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedLeadId(leadId);
  }

  function handleDragOver(e: React.DragEvent, stage: Stage) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
  }

  function handleDrop(e: React.DragEvent, stage: Stage) {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain");
    if (leadId) moveLeadStage(leadId, stage);
    setDraggedLeadId(null);
    setDragOverStage(null);
  }

  function handleDragEnd() {
    setDraggedLeadId(null);
    setDragOverStage(null);
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[15px] font-bold text-[#111827]">Lead Pipeline</h2>
          <p className="text-[12px] text-[#6B7280] mt-0.5">{total} active leads across all stages</p>
        </div>
        <button
          onClick={() => setActiveView("Leads")}
          className="text-[12px] text-[#2563EB] font-medium flex items-center gap-1 hover:underline"
        >
          View All <ChevronRight size={13} />
        </button>
      </div>

      {/* Funnel bar */}
      <div className="flex gap-0.5 mb-5 h-2.5 rounded-full overflow-hidden">
        {STAGE_CONFIG.map(s => {
          const count = activeLeads.filter(l => l.stage === s.label).length;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return <div key={s.label} className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: s.color }} />;
        })}
      </div>

      <div className="space-y-3">
        {STAGE_CONFIG.map((stage) => {
          const stageLeads = activeLeads.filter(l => l.stage === stage.label);
          const count = stageLeads.length;
          const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
          const isDropTarget = dragOverStage === stage.label;

          return (
            <div
              key={stage.label}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all ${isDropTarget ? "bg-[#F0F9FF] border-2 border-dashed border-[#2563EB]" : "border-2 border-transparent"}`}
              onDragOver={e => handleDragOver(e, stage.label)}
              onDrop={e => handleDrop(e, stage.label)}
              onDragLeave={() => setDragOverStage(null)}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: stage.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[13px] font-medium text-[#111827]">{stage.label}</p>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: stage.bg, color: stage.color }}
                  >
                    {count}
                  </span>
                </div>
                <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: stage.color, opacity: 0.7 }}
                  />
                </div>
                {/* Lead tags — draggable */}
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {stageLeads.slice(0, 3).map((lead) => (
                    <span
                      key={lead.id}
                      draggable
                      onDragStart={e => handleDragStart(e, lead.id)}
                      onDragEnd={handleDragEnd}
                      title={`Drag to move: ${lead.name}`}
                      className={`text-[10px] text-[#6B7280] bg-[#F8FAFC] border border-[#E2E8F0] px-1.5 py-0.5 rounded-md cursor-grab active:cursor-grabbing select-none hover:border-[#2563EB] hover:text-[#2563EB] transition-colors ${
                        draggedLeadId === lead.id ? "opacity-40" : ""
                      }`}
                    >
                      {lead.company || lead.name}
                    </span>
                  ))}
                  {stageLeads.length > 3 && (
                    <span className="text-[10px] text-[#9CA3AF] px-1.5 py-0.5">+{stageLeads.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {draggedLeadId && (
        <p className="text-[10px] text-[#2563EB] text-center mt-3 animate-pulse">
          Drop on a stage to move the lead
        </p>
      )}
    </div>
  );
}
