import { useState, useMemo } from "react";
import { Plus, Search, CheckCircle2, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useCRM, Task } from "../CRMContext";

type StatusFilter = "All" | "pending" | "completed" | "overdue";
type PriorityFilter = "All" | "high" | "medium" | "low";

const priorityConfig = {
  high:   { color: "#DC2626", bg: "#FEE2E2", label: "High" },
  medium: { color: "#D97706", bg: "#FEF3C7", label: "Medium" },
  low:    { color: "#16A34A", bg: "#DCFCE7", label: "Low" },
};

const statusConfig = {
  pending:   { color: "#D97706", bg: "#FEF3C7", icon: <Clock size={13} />, label: "Pending" },
  completed: { color: "#16A34A", bg: "#DCFCE7", icon: <CheckCircle2 size={13} />, label: "Completed" },
  overdue:   { color: "#DC2626", bg: "#FEE2E2", icon: <AlertCircle size={13} />, label: "Overdue" },
};

function AddTaskInlineModal({ onClose }: { onClose: () => void }) {
  const { addTask } = useCRM();
  const [form, setForm] = useState({ title: "", assignee: "Agency Owner", dueDate: "", priority: "medium" as Task["priority"], client: "" });
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    addTask({ ...form, status: "pending" });
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-[15px] font-bold text-[#111827]">Add New Task</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[#374151] block mb-1">Task Title *</label>
            <input autoFocus type="text" placeholder="Describe the task..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 text-[13px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#374151] block mb-1">Assignee</label>
              <select value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))} className="w-full px-3 py-2 text-[12px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]">
                {["Agency Owner", "Riya (Designer)", "Dev Team"].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#374151] block mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as Task["priority"] }))} className="w-full px-3 py-2 text-[12px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#374151] block mb-1">Due Date</label>
              <input type="text" placeholder="e.g. Jun 25" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className="w-full px-3 py-2 text-[12px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#374151] block mb-1">Client</label>
              <input type="text" placeholder="Client name" value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))} className="w-full px-3 py-2 text-[12px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-[13px] font-semibold text-[#6B7280] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 text-[13px] font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8]">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TasksView() {
  const { tasks, completeTask } = useCRM();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [showModal, setShowModal] = useState(false);

  const counts = {
    pending:   tasks.filter(t => t.status === "pending").length,
    completed: tasks.filter(t => t.status === "completed").length,
    overdue:   tasks.filter(t => t.status === "overdue").length,
  };

  const filtered = useMemo(() => {
    let list = tasks;
    if (statusFilter !== "All") list = list.filter(t => t.status === statusFilter);
    if (priorityFilter !== "All") list = list.filter(t => t.priority === priorityFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.client.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q));
    }
    return list;
  }, [tasks, statusFilter, priorityFilter, search]);

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-bold text-[#111827] leading-tight">Tasks</h1>
            <p className="text-[13px] text-[#6B7280] mt-0.5">{tasks.length} total tasks</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 bg-[#2563EB] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors">
            <Plus size={14} /> Add Task
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {(["pending", "completed", "overdue"] as const).map(s => {
            const cfg = statusConfig[s];
            return (
              <button key={s} onClick={() => setStatusFilter(s)} className={`bg-white rounded-xl border p-4 shadow-sm text-left transition-all ${statusFilter === s ? "border-[#2563EB] ring-2 ring-[#2563EB]/10" : "border-[#E2E8F0] hover:shadow-md"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.icon}</div>
                  <div>
                    <p className="text-[22px] font-bold text-[#111827]">{counts[s]}</p>
                    <p className="text-[12px] text-[#6B7280]">{cfg.label}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]" />
            </div>
            <div className="flex gap-1.5">
              {(["All", "pending", "completed", "overdue"] as StatusFilter[]).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border capitalize transition-all ${statusFilter === s ? "bg-[#111827] text-white border-[#111827]" : "text-[#6B7280] border-[#E2E8F0] hover:bg-[#F8FAFC]"}`}>
                  {s === "All" ? "All" : s}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              {(["All", "high", "medium", "low"] as PriorityFilter[]).map(p => (
                <button key={p} onClick={() => setPriorityFilter(p)} className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border capitalize transition-all ${priorityFilter === p ? "bg-[#111827] text-white border-[#111827]" : "text-[#6B7280] border-[#E2E8F0] hover:bg-[#F8FAFC]"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task list */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="grid grid-cols-[auto_3fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]">
            <div className="w-5" />
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Task</p>
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Assignee</p>
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Due</p>
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Priority</p>
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Status</p>
          </div>
          <div className="divide-y divide-[#F1F5F9] max-h-[480px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-5 py-10 text-center"><p className="text-[13px] text-[#9CA3AF]">No tasks found</p></div>
            ) : filtered.map(task => {
              const pCfg = priorityConfig[task.priority];
              const sCfg = statusConfig[task.status];
              return (
                <div key={task.id} className={`grid grid-cols-[auto_3fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 items-center hover:bg-[#F8FAFC] transition-colors ${task.status === "completed" ? "opacity-60" : ""}`}>
                  <button
                    onClick={() => task.status !== "completed" && completeTask(task.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.status === "completed" ? "bg-[#22C55E] border-[#22C55E]" : "border-[#CBD5E1] hover:border-[#22C55E]"}`}
                  >
                    {task.status === "completed" && <CheckCircle size={12} className="text-white" />}
                  </button>
                  <div>
                    <p className={`text-[13px] font-semibold text-[#111827] ${task.status === "completed" ? "line-through" : ""}`}>{task.title}</p>
                    {task.client && <p className="text-[10px] text-[#9CA3AF]">{task.client}</p>}
                  </div>
                  <p className="text-[11px] text-[#6B7280]">{task.assignee}</p>
                  <p className={`text-[11px] font-medium ${task.status === "overdue" ? "text-[#DC2626]" : "text-[#374151]"}`}>{task.dueDate || "—"}</p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit" style={{ backgroundColor: pCfg.bg, color: pCfg.color }}>{pCfg.label}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit flex items-center gap-1" style={{ backgroundColor: sCfg.bg, color: sCfg.color }}>
                    {sCfg.icon} {sCfg.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 border-t border-[#F1F5F9] bg-[#F8FAFC]">
            <p className="text-[11px] text-[#9CA3AF]">Showing {filtered.length} of {tasks.length} tasks</p>
          </div>
        </div>
      </div>

      {showModal && <AddTaskInlineModal onClose={() => setShowModal(false)} />}
    </>
  );
}
