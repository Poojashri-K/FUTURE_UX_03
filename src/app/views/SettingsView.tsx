import { useState } from "react";
import { Save, Check } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
        <h3 className="text-[14px] font-bold text-[#111827]">{title}</h3>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

function Field({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#F8FAFC] last:border-0">
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-[#111827]">{label}</p>
        {sub && <p className="text-[11px] text-[#6B7280] mt-0.5">{sub}</p>}
      </div>
      <div className="ml-6 flex-shrink-0">{children}</div>
    </div>
  );
}

export function SettingsView() {
  const [profile, setProfile] = useState({ name: "Agency Owner", email: "owner@agencyflow.in", phone: "+91 98765 43210", agency: "AgencyFlow Studio" });
  const [notifs, setNotifs] = useState({ leads: true, tasks: true, clients: true, reports: false });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#111827] leading-tight">Settings</h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">Manage your account and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg transition-all ${saved ? "bg-[#22C55E] text-white" : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"}`}
        >
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      <div className="space-y-4">
        <Section title="Profile Information">
          <div className="space-y-3">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-2xl flex items-center justify-center">
                <span className="text-white text-[20px] font-bold">AO</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#111827]">{profile.name}</p>
                <p className="text-[11px] text-[#6B7280]">Administrator · Pro Plan</p>
              </div>
            </div>
            {(["name", "email", "phone", "agency"] as const).map(key => (
              <div key={key}>
                <label className="text-[11px] font-semibold text-[#374151] block mb-1 capitalize">{key === "agency" ? "Agency Name" : key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                  value={profile[key]}
                  onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3 py-2 text-[13px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Notifications">
          {(Object.keys(notifs) as (keyof typeof notifs)[]).map(key => (
            <Field
              key={key}
              label={`${key.charAt(0).toUpperCase() + key.slice(1)} Notifications`}
              sub={`Receive notifications for ${key} activity`}
            >
              <button
                onClick={() => setNotifs(p => ({ ...p, [key]: !p[key] }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${notifs[key] ? "bg-[#2563EB]" : "bg-[#CBD5E1]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifs[key] ? "translate-x-5" : ""}`} />
              </button>
            </Field>
          ))}
        </Section>

        <Section title="Plan & Billing">
          <Field label="Current Plan" sub="AgencyFlow Pro · 5 seats">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#DBEAFE] text-[#2563EB]">Pro</span>
          </Field>
          <Field label="Next Billing Date" sub="Auto-renews on July 15, 2026">
            <span className="text-[12px] font-medium text-[#374151]">Jul 15, 2026</span>
          </Field>
          <Field label="Seats Used" sub="4 of 5 seats active">
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#2563EB] rounded-full" style={{ width: "80%" }} />
              </div>
              <span className="text-[11px] text-[#6B7280]">4/5</span>
            </div>
          </Field>
        </Section>

        <Section title="Security">
          <Field label="Password" sub="Last changed 45 days ago">
            <button className="text-[12px] font-semibold text-[#2563EB] hover:underline">Change Password</button>
          </Field>
          <Field label="Two-Factor Auth" sub="Add an extra layer of security">
            <button className="text-[12px] font-semibold text-white bg-[#2563EB] px-3 py-1.5 rounded-lg hover:bg-[#1D4ED8] transition-colors">Enable 2FA</button>
          </Field>
        </Section>
      </div>
    </div>
  );
}
