import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, ChevronRight, Plus, X } from "lucide-react";
import { useCRM } from "../CRMContext";

function AddTaskModal({ onClose }: { onClose: () => void }) {
  const { addTask } = useCRM();
  const [form, setForm] = useState({ title: "", assignee: "Agency Owner", dueDate: "", priority: "medium" as "high" | "medium" | "low", client: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    addTask({ ...form, status: "pending" });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-[14px] font-bold text-[#111827]">Add New Task</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]">
            <X size={14} className="text-[#6B7280]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[#374151] block mb-1">Task Title *</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Design logo for client"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 text-[12px] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] bg-[#F8FAFC]"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-[#374151] block mb-1">Assignee</label>
              <select value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))} className="w-full px-2 py-2 text-[11px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]">
                {["Agency Owner", "Riya (Designer)", "Dev Team"].map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#374151] block mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as "high" | "medium" | "low" }))} className="w-full px-2 py-2 text-[11px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-[#374151] block mb-1">Due Date</label>
              <input type="text" placeholder="e.g. Jun 25" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className="w-full px-3 py-2 text-[11px] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] bg-[#F8FAFC]" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#374151] block mb-1">Client</label>
              <input type="text" placeholder="Client name" value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))} className="w-full px-3 py-2 text-[11px] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] bg-[#F8FAFC]" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-[12px] font-semibold text-[#6B7280] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]">Cancel</button>
            <button type="submit" className="flex-1 py-2 text-[12px] font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8]">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TaskSummary() {
  const { tasks, completeTask, setActiveView } = useCRM();
  const [showAddTask, setShowAddTask] = useState(false);

  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const overdue = tasks.filter(t => t.status === "overdue").length;
  const total = tasks.length;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const taskStats = [
    { label: "Completed", count: completed, icon: <CheckCircle2 size={14} />, color: "#22C55E", bg: "#DCFCE7", pct: total > 0 ? (completed / total) * 100 : 0 },
    { label: "Pending",   count: pending,   icon: <Clock size={14} />,        color: "#F59E0B", bg: "#FEF3C7", pct: total > 0 ? (pending / total) * 100 : 0 },
    { label: "Overdue",   count: overdue,   icon: <AlertCircle size={14} />,  color: "#EF4444", bg: "#FEE2E2", pct: total > 0 ? (overdue / total) * 100 : 0 },
  ];

  // Next pending task to quickly complete
  const nextPending = tasks.find(t => t.status === "pending" || t.status === "overdue");

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-[#111827]">Task Summary</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-1 text-[11px] text-white bg-[#2563EB] font-semibold px-2 py-1 rounded-lg hover:bg-[#1D4ED8] transition-colors"
            >
              <Plus size={11} /> Add
            </button>
            <button
              onClick={() => setActiveView("Tasks")}
              className="text-[11px] text-[#2563EB] font-medium hover:underline flex items-center gap-0.5"
            >
              View <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Circular progress */}
        <div className="flex items-center gap-4 mb-4 p-3 bg-[#F8FAFC] rounded-lg">
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#E2E8F0" strokeWidth="5" />
              <circle
                cx="28" cy="28" r="22"
                fill="none" stroke="#22C55E" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - completionPct / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[12px] font-bold text-[#111827]">{completionPct}%</span>
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111827]">{completed}/{total} Tasks Done</p>
            <p className="text-[11px] text-[#6B7280]">This month's progress</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {taskStats.map((t) => (
            <div key={t.label} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: t.bg, color: t.color }}>
                {t.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[12px] font-medium text-[#374151]">{t.label}</p>
                  <span className="text-[12px] font-bold" style={{ color: t.color }}>{t.count}</span>
                </div>
                <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick complete */}
        {nextPending && (
          <div className="mt-4 p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <p className="text-[10px] font-semibold text-[#6B7280] mb-1">NEXT UP</p>
            <p className="text-[11px] text-[#111827] font-medium truncate mb-1.5">{nextPending.title}</p>
            <button
              onClick={() => completeTask(nextPending.id)}
              className="text-[10px] font-semibold text-[#22C55E] flex items-center gap-1 hover:underline"
            >
              <CheckCircle2 size={11} /> Mark complete
            </button>
          </div>
        )}
      </div>

      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} />}
    </>
  );
}
