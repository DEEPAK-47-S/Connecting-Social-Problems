"use client";

import { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Building,
  GraduationCap,
  Factory,
  Landmark,
  Phone,
  MapPin,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { TAMIL_NADU_DISTRICTS } from "@/data/tamilNaduDistricts";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: "CITIZEN" | "UNIVERSITY" | "INDUSTRY" | "GOVERNMENT";
  currentUser: any;
  onUpdateUser: (updatedUser: any) => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  role,
  currentUser,
  onUpdateUser,
}: ProfileModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("Chennai");
  const [orgName, setOrgName] = useState("");
  const [dept, setDept] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || currentUser.facultyName || currentUser.officerName || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
      setDistrict(currentUser.district || "Chennai");
      setOrgName(
        currentUser.collegeName ||
        currentUser.companyName ||
        currentUser.department ||
        currentUser.organization ||
        ""
      );
      setDept(currentUser.dept || currentUser.leadDept || currentUser.sector || "");
      setSkills(
        Array.isArray(currentUser.skills)
          ? currentUser.skills
          : Array.isArray(currentUser.specialization)
          ? currentUser.specialization
          : []
      );
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    setSaving(true);

    const updated = {
      ...currentUser,
      name,
      email,
      phone,
      district,
      skills,
    };

    if (role === "UNIVERSITY") {
      updated.collegeName = orgName;
      updated.facultyName = name;
      updated.dept = dept;
      localStorage.setItem("college_user", JSON.stringify(updated));
    } else if (role === "INDUSTRY") {
      updated.companyName = orgName;
      updated.sector = dept;
      updated.specialization = skills;
      localStorage.setItem("industry_user", JSON.stringify(updated));
    } else if (role === "GOVERNMENT") {
      updated.officerName = name;
      updated.department = orgName;
      localStorage.setItem("government_user", JSON.stringify(updated));
    } else {
      localStorage.setItem("user", JSON.stringify(updated));
    }

    // Also update global auth user
    localStorage.setItem("user", JSON.stringify(updated));

    onUpdateUser(updated);
    setSaving(false);
    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const roleMeta = {
    CITIZEN: {
      title: "Citizen Profile",
      icon: User,
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-400",
      orgLabel: "Community / Resident Ward",
    },
    UNIVERSITY: {
      title: "Academic Lab & Faculty Profile",
      icon: GraduationCap,
      color: "from-indigo-600 to-purple-600",
      accent: "text-indigo-400",
      orgLabel: "College / University Name",
    },
    INDUSTRY: {
      title: "Corporate & CSR Partner Profile",
      icon: Factory,
      color: "from-pink-600 to-rose-600",
      accent: "text-pink-400",
      orgLabel: "Enterprise / Company Name",
    },
    GOVERNMENT: {
      title: "Municipal Officer & Authority Profile",
      icon: Landmark,
      color: "from-teal-600 to-emerald-600",
      accent: "text-teal-400",
      orgLabel: "Department / Directorate",
    },
  }[role];

  const IconComponent = roleMeta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${roleMeta.color} flex items-center justify-between text-white`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">{roleMeta.title}</h2>
              <p className="text-xs text-white/80">Manage your credentials &amp; contact details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-200 text-xs">
          {savedSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Full Name / Representative */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Full Name / Officer / Faculty Lead
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Official Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Contact Phone / Extension
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Organization Name & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {roleMeta.orgLabel}
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Organization / Entity"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Tamil Nadu District (38 Districts)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                >
                  {TAMIL_NADU_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Department / Sector if not citizen */}
          {role !== "CITIZEN" && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {role === "UNIVERSITY"
                  ? "Research Department / Laboratory"
                  : role === "INDUSTRY"
                  ? "Sector / Business Domain"
                  : "Designated Division / Ward"}
              </label>
              <input
                type="text"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                placeholder="e.g. Dept of Electrical & Water Systems"
                className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              />
            </div>
          )}

          {/* Problem Solving Skills / Specializations */}
          {(role === "UNIVERSITY" || role === "INDUSTRY") && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Specialized Problem-Solving Focus</span>
                <span className="text-[10px] text-slate-500 font-normal">Click tag to remove</span>
              </label>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    onClick={() => handleRemoveSkill(s)}
                    className="cursor-pointer px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-200 transition text-[11px] font-semibold flex items-center gap-1 group"
                  >
                    <span>{s}</span>
                    <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add problem domain (e.g., Solar, Water, AI, Roads)..."
                  className="flex-1 px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white transition font-medium text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className={`px-5 py-2.5 bg-gradient-to-r ${roleMeta.color} text-white font-bold rounded-xl shadow-lg hover:opacity-95 active:scale-95 transition flex items-center gap-2 text-xs`}
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? "Saving..." : "Save Profile"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
