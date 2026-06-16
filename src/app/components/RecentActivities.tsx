import { FileText, Phone, CheckCircle, Clipboard, FileSignature, User, ArrowRight, Clock, CheckSquare } from "lucide-react";
import { useCRM, ActivityIcon } from "../CRMContext";

const ICON_MAP: Record<ActivityIcon, React.ReactNode> = {
  file:      <FileText size={13} />,
  phone:     <Phone size={13} />,
  check:     <CheckCircle size={13} />,
  clipboard: <Clipboard size={13} />,
  sign:      <FileSignature size={13} />,
  user:      <User size={13} />,
  move:      <ArrowRight size={13} />,
  task:      <CheckSquare size={13} />,
};

export function RecentActivities() {
  const { activities } = useCRM();
  const visible = activities.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-[#111827]">Recent Activity</h2>
        <button className="text-[11px] text-[#2563EB] font-medium hover:underline">View all</button>
      </div>

      <div className="space-y-0">
        {visible.map((act, i) => (
          <div key={act.id} className="flex gap-3 relative">
            {i < visible.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-[#E2E8F0]" />
            )}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 z-10"
              style={{ backgroundColor: act.iconBg, color: act.iconColor }}
            >
              {ICON_MAP[act.iconType]}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-[13px] font-semibold text-[#111827] leading-tight">{act.title}</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">{act.subtitle}</p>
              <div className="flex items-center gap-1 mt-1">
                <Clock size={10} className="text-[#9CA3AF]" />
                <p className="text-[10px] text-[#9CA3AF]">{act.time}</p>
              </div>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="text-[12px] text-[#9CA3AF] text-center py-4">No activity yet</p>
        )}
      </div>
    </div>
  );
}
