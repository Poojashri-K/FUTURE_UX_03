import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, Plus, User, Settings, LogOut, CheckCheck, X } from "lucide-react";
import { useCRM } from "../CRMContext";
import { AddLeadModal } from "./AddLeadModal";

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, cb]);
}

const NOTIF_ICONS: Record<string, string> = {
  lead: "🧑",
  task: "✅",
  client: "🏢",
  system: "⚙️",
};

export function TopNav() {
  const { leads, clients, activities, notifications, searchQuery, setSearchQuery,
    markNotificationRead, markAllNotificationsRead, setActiveView } = useCRM();

  const [showModal, setShowModal] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const notifsRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useClickOutside(notifsRef, () => setShowNotifs(false));
  useClickOutside(avatarRef, () => setShowAvatar(false));
  useClickOutside(searchRef, () => setShowSearch(false));

  const unreadCount = notifications.filter(n => !n.read).length;

  const searchResults = searchQuery.trim().length > 1 ? (() => {
    const q = searchQuery.toLowerCase();
    const matchedLeads = leads
      .filter(l => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q))
      .slice(0, 4)
      .map(l => ({ type: "Lead" as const, label: l.name, sub: l.company, stage: l.stage }));
    const matchedClients = clients
      .filter(c => c.name.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q) || c.project.toLowerCase().includes(q))
      .slice(0, 4)
      .map(c => ({ type: "Client" as const, label: c.name, sub: c.project, status: c.status }));
    return [...matchedLeads, ...matchedClients];
  })() : [];

  return (
    <>
      <header className="fixed top-0 left-60 right-0 h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <div ref={searchRef} className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search clients, leads, tasks..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              className="pl-9 pr-4 py-2 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg w-72 text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowSearch(false); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
              >
                <X size={12} />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showSearch && searchQuery.trim().length > 1 && (
              <div className="absolute top-full mt-1.5 left-0 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 overflow-hidden">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-[12px] text-[#9CA3AF]">No results for "{searchQuery}"</p>
                  </div>
                ) : (
                  <>
                    <div className="px-3 py-2 border-b border-[#F1F5F9]">
                      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                        {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {searchResults.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveView(r.type === "Lead" ? "Leads" : "Clients");
                          setShowSearch(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F8FAFC] transition-colors text-left"
                      >
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                          r.type === "Lead" ? "bg-[#DBEAFE] text-[#2563EB]" : "bg-[#DCFCE7] text-[#16A34A]"
                        }`}>
                          {r.type}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-[#111827] truncate">{r.label}</p>
                          <p className="text-[10px] text-[#6B7280] truncate">{r.sub}</p>
                        </div>
                        <span className="text-[10px] text-[#9CA3AF] flex-shrink-0 ml-auto">
                          {"stage" in r ? r.stage : r.status}
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-[#2563EB] text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#1D4ED8] transition-colors"
          >
            <Plus size={13} />
            Add Lead
          </button>

          {/* Notifications Bell */}
          <div ref={notifsRef} className="relative">
            <button
              onClick={() => { setShowNotifs(v => !v); setShowAvatar(false); }}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] transition-colors"
            >
              <Bell size={16} className="text-[#6B7280]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#EF4444] rounded-full flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white px-0.5">{unreadCount}</span>
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9]">
                  <p className="text-[13px] font-bold text-[#111827]">Notifications</p>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="flex items-center gap-1 text-[11px] text-[#2563EB] font-medium hover:underline"
                    >
                      <CheckCheck size={12} /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 10).map(n => (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0 ${
                        !n.read ? "bg-[#EFF6FF]" : ""
                      }`}
                    >
                      <span className="text-base mt-0.5 flex-shrink-0">{NOTIF_ICONS[n.type]}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-[#111827]">{n.title}</p>
                        <p className="text-[11px] text-[#6B7280] truncate">{n.message}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">{n.time}</p>
                      </div>
                      {!n.read && <span className="w-2 h-2 bg-[#2563EB] rounded-full flex-shrink-0 mt-1.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Avatar Dropdown */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => { setShowAvatar(v => !v); setShowNotifs(false); }}
              className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] cursor-pointer hover:bg-[#F8FAFC] rounded-lg px-2 py-1 transition-colors"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-full flex items-center justify-center">
                <span className="text-white text-[11px] font-bold">AO</span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#111827] leading-tight">Agency Owner</p>
                <p className="text-[10px] text-[#6B7280] leading-tight">Admin</p>
              </div>
              <ChevronDown size={13} className={`text-[#9CA3AF] ml-0.5 transition-transform ${showAvatar ? "rotate-180" : ""}`} />
            </button>

            {showAvatar && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 overflow-hidden py-1">
                <div className="px-4 py-2.5 border-b border-[#F1F5F9]">
                  <p className="text-[12px] font-bold text-[#111827]">Agency Owner</p>
                  <p className="text-[10px] text-[#6B7280]">owner@agencyflow.in</p>
                </div>
                {[
                  { icon: <User size={13} />, label: "Profile", action: () => {} },
                  { icon: <Settings size={13} />, label: "Settings", action: () => { setActiveView("Settings"); setShowAvatar(false); } },
                  { icon: <LogOut size={13} />, label: "Logout", action: () => {} },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F8FAFC] transition-colors text-left ${
                      item.label === "Logout" ? "text-[#EF4444]" : "text-[#374151]"
                    }`}
                  >
                    <span className={item.label === "Logout" ? "text-[#EF4444]" : "text-[#6B7280]"}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {showModal && <AddLeadModal onClose={() => setShowModal(false)} />}
    </>
  );
}
