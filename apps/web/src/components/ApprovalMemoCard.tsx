"use client";

import { useMemo } from "react";
import {
  FileCheck2,
  ShieldCheck,
  MapPin,
  GraduationCap,
  Building2,
  Cpu,
  CheckCircle2,
  Award,
  Sparkles
} from "lucide-react";

interface ApprovalMemoCardProps {
  post: {
    id?: string;
    title: string;
    location?: string | null;
    category?: string | null;
    acceptedCollegeName?: string | null;
    acceptedIndustryName?: string | null;
    approvalMemo?: string | null;
    district?: string | null;
  };
  variant?: "college" | "industry" | "default";
  title?: string;
}

export default function ApprovalMemoCard({
  post,
  variant = "default",
  title = "Official Sanction & R&D Scope",
}: ApprovalMemoCardProps) {
  // Parse fields from approvalMemo string or fallback to post properties
  const parsedData = useMemo(() => {
    const raw = post.approvalMemo || "";
    
    const extractField = (prefix: string): string => {
      const regex = new RegExp(`${prefix}:\\s*([^\n]+)`, "i");
      const match = raw.match(regex);
      return match ? match[1].trim().replace(/^"|"$/g, "") : "";
    };

    const problem = extractField("Problem") || post.title;
    const location = extractField("Location") || post.location || (post.district ? `${post.district} District, Tamil Nadu` : "Civic Jurisdiction");
    const scope = extractField("Authorized Technical Scope") || 
      (post.category?.toLowerCase().includes("water")
        ? "Deployment of sensor-based pipeline telemetry, automated pressure valves, and potable filtration test-rig."
        : post.category?.toLowerCase().includes("energy") || post.category?.toLowerCase().includes("electric")
        ? "Installation of decentralized solar PV microgrid, dusk-to-dawn intelligent LED controllers, and battery storage."
        : post.category?.toLowerCase().includes("agri")
        ? "Automated soil moisture telemetry, IoT irrigation regulation, and crop health diagnostic prototype."
        : "Automated municipal IoT sensing, rapid lab prototyping, and community ground rollout.");
    
    const researchLead = extractField("Research Lead") || post.acceptedCollegeName || "University Engineering Research Lab";
    const corporateSponsor = extractField("Corporate CSR Sponsor") || post.acceptedIndustryName || "Industry CSR Partner";
    const status = extractField("Status") || "Fully Sanctioned for Lab Prototype & Ground Deployment";

    return {
      problem,
      location,
      scope,
      researchLead,
      corporateSponsor,
      status,
    };
  }, [post]);

  const isIndustryTheme = variant === "industry";

  return (
    <div
      className={`rounded-3xl border overflow-hidden transition-all duration-300 shadow-xl ${
        isIndustryTheme
          ? "bg-gradient-to-b from-pink-950/40 via-zinc-900/90 to-zinc-950 border-pink-500/30 shadow-pink-950/20"
          : "bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-950 border-indigo-500/30 shadow-indigo-950/20"
      }`}
    >
      {/* Header Banner */}
      <div
        className={`px-5 py-3.5 border-b flex items-center justify-between ${
          isIndustryTheme
            ? "bg-pink-500/10 border-pink-500/20"
            : "bg-indigo-500/10 border-indigo-500/20"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`h-8 w-8 rounded-xl flex items-center justify-center ${
              isIndustryTheme
                ? "bg-pink-500/20 text-pink-400 border border-pink-500/30 shadow-sm"
                : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-sm"
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-black tracking-tight text-white block">
              {title}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isIndustryTheme ? "text-pink-400" : "text-indigo-400"
              }`}
            >
              Sanction Order &bull; Connecting Social Problem Tamil Nadu
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold shadow-xs">
          <CheckCircle2 className="h-3 w-3" />
          <span>SANCTIONED</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-5 space-y-4">
        {/* Scope Highlight Box */}
        <div
          className={`p-3.5 rounded-2xl border ${
            isIndustryTheme
              ? "bg-zinc-900/90 border-pink-500/20"
              : "bg-slate-900/90 border-indigo-500/20"
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Cpu
              className={`h-3.5 w-3.5 ${
                isIndustryTheme ? "text-pink-400" : "text-indigo-400"
              }`}
            />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
              Authorized Technical Scope
            </span>
          </div>
          <p className="text-xs font-medium text-zinc-200 leading-relaxed">
            {parsedData.scope}
          </p>
        </div>

        {/* Two Columns: Research Lead & CSR Sponsor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Research Lead */}
          <div className="p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 flex-shrink-0 mt-0.5">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] uppercase font-black tracking-wider text-zinc-400 block">
                Research &amp; Prototyping Lead
              </span>
              <p className="text-xs font-bold text-white truncate mt-0.5" title={parsedData.researchLead}>
                {parsedData.researchLead}
              </p>
            </div>
          </div>

          {/* CSR Sponsor */}
          <div className="p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 flex-shrink-0 mt-0.5">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] uppercase font-black tracking-wider text-zinc-400 block">
                Corporate CSR Sponsor
              </span>
              <p className="text-xs font-bold text-white truncate mt-0.5" title={parsedData.corporateSponsor}>
                {parsedData.corporateSponsor}
              </p>
            </div>
          </div>
        </div>

        {/* Location & Status Footer */}
        <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-400 min-w-0 max-w-full">
            <MapPin className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
            <span className="truncate text-zinc-300">{parsedData.location}</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
            <Award className="h-3 w-3 text-amber-400 flex-shrink-0" />
            <span className="text-amber-300 font-semibold">{parsedData.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
