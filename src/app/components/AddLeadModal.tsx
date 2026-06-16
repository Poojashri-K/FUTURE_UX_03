import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useCRM, Stage, LeadSource } from "../CRMContext";

const STAGES: Stage[] = ["New Leads", "Contacted", "Proposal Sent", "Negotiation", "Converted"];
const SOURCES: LeadSource[] = ["Website", "Referral", "LinkedIn", "Google Ads"];

interface Props {
  onClose: () => void;
}

export function AddLeadModal({ onClose }: Props) {
  const { addLead } = useCRM();
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    source: "Website" as LeadSource,
    stage: "New Leads" as Stage,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.company.trim()) e.company = "Company is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addLead({
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      source: form.source,
      stage: form.stage,
    });
    onClose();
  }

  function field(label: string, key: keyof typeof form, type = "text", placeholder = "") {
    return (
      <div>
        <label className="text-[12px] font-semibold text-[#374151] block mb-1">{label}</label>
        <input
          ref={key === "name" ? firstRef : undefined}
          type={type}
          placeholder={placeholder || label}
          value={form[key] as string}
          onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: "" })); }}
          className={`w-full px-3 py-2 text-[13px] border rounded-lg bg-[#F8FAFC] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 transition-all ${
            errors[key] ? "border-[#EF4444] focus:ring-[#EF4444]" : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]"
          }`}
        />
        {errors[key] && <p className="text-[11px] text-[#EF4444] mt-0.5">{errors[key]}</p>}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-[16px] font-bold text-[#111827]">Add New Lead</h2>
            <p className="text-[12px] text-[#6B7280]">Fill in the lead details below</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <X size={16} className="text-[#6B7280]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {field("Full Name", "name", "text", "e.g. Krish Mehta")}
            {field("Company", "company", "text", "e.g. TechNova Inc.")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("Email Address", "email", "email", "email@company.com")}
            {field("Phone Number", "phone", "tel", "e.g. 9876543210")}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold text-[#374151] block mb-1">Lead Source</label>
              <select
                value={form.source}
                onChange={e => setForm(p => ({ ...p, source: e.target.value as LeadSource }))}
                className="w-full px-3 py-2 text-[13px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              >
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#374151] block mb-1">Pipeline Stage</label>
              <select
                value={form.stage}
                onChange={e => setForm(p => ({ ...p, stage: e.target.value as Stage }))}
                className="w-full px-3 py-2 text-[13px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              >
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-[13px] font-semibold text-[#6B7280] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-[13px] font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8] transition-colors"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
