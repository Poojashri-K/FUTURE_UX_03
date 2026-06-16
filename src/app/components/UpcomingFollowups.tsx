import { useState } from "react";
import { Clock, Video, Phone, CheckCircle, Calendar, X } from "lucide-react";
import { useCRM, Followup } from "../CRMContext";

function FollowupDetailModal({ fu, onClose, onComplete, onReschedule }: {
  fu: Followup;
  onClose: () => void;
  onComplete: () => void;
  onReschedule: (when: string, label: string) => void;
}) {
  const [newWhen, setNewWhen] = useState(fu.when);
  const [newLabel, setNewLabel] = useState(fu.whenLabel);
  const [rescheduling, setRescheduling] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-[14px] font-bold text-[#111827]">Follow-up Details</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]">
            <X size={14} className="text-[#6B7280]" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
            <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
              {fu.type === "meeting" ? <Video size={16} className="text-[#2563EB]" /> : <Phone size={16} className="text-[#7C3AED]" />}
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#111827]">{fu.company}</p>
              <p className="text-[11px] text-[#6B7280]">{fu.contact}</p>
            </div>
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: fu.tagBg, color: fu.tagColor }}>{fu.tag}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#374151]">
            <Clock size={13} className="text-[#6B7280]" />
            <span className="font-medium">{fu.when}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#374151]">
            {fu.type === "meeting" ? <Video size={13} className="text-[#6B7280]" /> : <Phone size={13} className="text-[#6B7280]" />}
            <span className="capitalize">{fu.type}</span>
          </div>

          {rescheduling && (
            <div className="space-y-2 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <p className="text-[11px] font-semibold text-[#374151]">New Schedule</p>
              <input
                type="text"
                placeholder="e.g. Next Wednesday, 3:00 PM"
                value={newWhen}
                onChange={e => setNewWhen(e.target.value)}
                className="w-full px-3 py-1.5 text-[12px] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
              <input
                type="text"
                placeholder="Label (e.g. Wednesday)"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                className="w-full px-3 py-1.5 text-[12px] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
              <div className="flex gap-2">
                <button onClick={() => setRescheduling(false)} className="flex-1 py-1.5 text-[11px] font-medium text-[#6B7280] border border-[#E2E8F0] rounded-lg hover:bg-[#F1F5F9]">Cancel</button>
                <button onClick={() => { onReschedule(newWhen, newLabel); onClose(); }} className="flex-1 py-1.5 text-[11px] font-medium text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8]">Save</button>
              </div>
            </div>
          )}

          {!rescheduling && (
            <div className="flex gap-2 pt-1">
              <button onClick={() => setRescheduling(true)} className="flex-1 py-2 text-[12px] font-semibold text-[#6B7280] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center gap-1.5">
                <Calendar size={12} /> Reschedule
              </button>
              <button onClick={() => { onComplete(); onClose(); }} className="flex-1 py-2 text-[12px] font-semibold text-white bg-[#22C55E] rounded-lg hover:bg-[#16A34A] flex items-center justify-center gap-1.5">
                <CheckCircle size={12} /> Mark Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function UpcomingFollowups() {
  const { followups, completeFollowup, rescheduleFollowup } = useCRM();
  const [selected, setSelected] = useState<Followup | null>(null);

  const active = followups.filter(f => !f.completed);

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-[#111827]">Upcoming Follow-ups</h2>
          <button className="text-[11px] text-[#2563EB] font-medium hover:underline">Open Calendar</button>
        </div>

        <div className="space-y-2.5">
          {active.length === 0 && (
            <p className="text-[12px] text-[#9CA3AF] text-center py-4">All follow-ups completed!</p>
          )}
          {active.map((fu) => (
            <div
              key={fu.id}
              onClick={() => setSelected(fu)}
              className="flex items-center gap-3 p-3 rounded-lg border border-[#F1F5F9] hover:border-[#DBEAFE] hover:bg-[#F8FAFC] transition-all group cursor-pointer"
            >
              <div className="w-9 h-9 bg-[#F1F5F9] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#DBEAFE] transition-colors">
                {fu.type === "meeting"
                  ? <Video size={15} className="text-[#2563EB]" />
                  : <Phone size={15} className="text-[#7C3AED]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-[#111827] truncate">{fu.company}</p>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
                    style={{ backgroundColor: fu.tagBg, color: fu.tagColor }}
                  >
                    {fu.tag}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280]">{fu.contact}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Clock size={10} className="text-[#9CA3AF]" />
                  <p className="text-[11px] font-medium text-[#374151]">{fu.whenLabel}</p>
                </div>
                <p className="text-[10px] text-[#9CA3AF]">{fu.when.split(",")[1]?.trim()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <FollowupDetailModal
          fu={selected}
          onClose={() => setSelected(null)}
          onComplete={() => { completeFollowup(selected.id); setSelected(null); }}
          onReschedule={(when, label) => rescheduleFollowup(selected.id, when, label)}
        />
      )}
    </>
  );
}
