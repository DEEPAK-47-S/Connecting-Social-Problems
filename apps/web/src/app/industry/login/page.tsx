"use client";

import {  useState, useEffect, useMemo, useRef  } from "react";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Lock,
  Mail,
  User,
  Briefcase,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Factory,
  Search,
  Plus,
  MapPin,
  Check,
  ChevronDown,
  Sparkles,
  Coins
} from "lucide-react";
import { TAMIL_NADU_INDUSTRIES, TamilNaduIndustry } from "@/data/tamilNaduIndustries";
import { TAMIL_NADU_DISTRICTS } from "@/data/tamilNaduDistricts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const INDUSTRY_SECTORS = [
  "IT & Smart Public Infrastructure",
  "Civil, Construction & Water Infra",
  "Clean Transportation & EV",
  "Renewable Energy & Solar Power",
  "Automotive & Heavy Engineering",
  "Textiles, Processing & Effluent Treatment",
  "AgriTech & Food Processing",
  "BioTech & Healthcare CSR",
  "Solid Waste Management & Circular Economy",
  "Hardware, IoT & Sensor Electronics"
];

const CSR_PROBLEM_DOMAINS = [
  "Water Management",
  "Electricity & Power",
  "Roads & Transport",
  "Sanitation & Waste",
  "Agriculture & Irrigation",
  "Smart City & AI",
  "Renewable Energy",
  "Healthcare & Clinics",
  "Rural Development"
];

export default function IndustryLoginPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // Custom industries loaded from localStorage
  const [allIndustries, setAllIndustries] = useState<TamilNaduIndustry[]>(TAMIL_NADU_INDUSTRIES);

  // Typing & Autocomplete state (Registration only)
  const [industryQuery, setIndustryQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<TamilNaduIndustry | null>(TAMIL_NADU_INDUSTRIES[0]);
  const [isNewIndustry, setIsNewIndustry] = useState(false);

  // Registration & Form details
  const [district, setDistrict] = useState("Chennai");
  const [sector, setSector] = useState(TAMIL_NADU_INDUSTRIES[0].sector);
  const [grantRange, setGrantRange] = useState(TAMIL_NADU_INDUSTRIES[0].grantRange || "₹25L – ₹50L");
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>(TAMIL_NADU_INDUSTRIES[0].specialization || []);
  const [facilities, setFacilities] = useState("Corporate R&D Lab & CSR Innovation Fund");
  const [mentorLead, setMentorLead] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load custom industries on mount
  useEffect(() => {
    try {
      const storedCustom = localStorage.getItem("custom_industries");
      if (storedCustom) {
        const parsed = JSON.parse(storedCustom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllIndustries([...parsed, ...TAMIL_NADU_INDUSTRIES]);
        }
      }
    } catch {}
  }, []);

  // Filter suggestions as user types
  const suggestions = useMemo(() => {
    if (!industryQuery.trim()) return allIndustries.slice(0, 8);
    const q = industryQuery.toLowerCase();
    return allIndustries
      .filter((ind) => ind.name.toLowerCase().includes(q) || ind.district.toLowerCase().includes(q) || ind.sector.toLowerCase().includes(q))
      .slice(0, 8);
  }, [industryQuery, allIndustries]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle typing in industry input
  const handleIndustryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIndustryQuery(val);
    setShowSuggestions(true);

    const exactMatch = allIndustries.find((ind) => ind.name.toLowerCase() === val.trim().toLowerCase());
    if (exactMatch) {
      setSelectedIndustry(exactMatch);
      setDistrict(exactMatch.district || "Chennai");
      setSector(exactMatch.sector);
      setGrantRange(exactMatch.grantRange || "₹25L – ₹50L");
      setSelectedSpecializations(exactMatch.specialization || []);
      setFacilities(exactMatch.facilities || "Corporate R&D Lab");
      setMentorLead(exactMatch.mentorLead || "");
      setIsNewIndustry(false);
    } else {
      setSelectedIndustry(null);
      setIsNewIndustry(val.trim().length > 2);
    }
  };

  // Select suggestion
  const handleSelectSuggestion = (ind: TamilNaduIndustry) => {
    setSelectedIndustry(ind);
    setIndustryQuery(ind.name);
    setDistrict(ind.district || "Chennai");
    setSector(ind.sector);
    setGrantRange(ind.grantRange || "₹25L – ₹50L");
    setSelectedSpecializations(ind.specialization || []);
    setFacilities(ind.facilities || "Corporate R&D Lab");
    setMentorLead(ind.mentorLead || "");
    setIsNewIndustry(false);
    setShowSuggestions(false);
  };

  // Toggle problem domain
  const toggleDomain = (domain: string) => {
    if (selectedSpecializations.includes(domain)) {
      setSelectedSpecializations(selectedSpecializations.filter((s) => s !== domain));
    } else {
      setSelectedSpecializations([...selectedSpecializations, domain]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const targetCompanyName = selectedIndustry ? selectedIndustry.name : industryQuery.trim();

    if (!isLogin) {
      if (!targetCompanyName) {
        setError("Please enter or select a corporate / company name.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body: any = {
        email: email.trim().toLowerCase(),
        password,
      };
      if (isLogin) {
        body.expectedRole = "INDUSTRY";
      } else {
        body.name = mentorLead.trim() || `${targetCompanyName} CSR Director`;
        body.role = "INDUSTRY";
        body.companyName = targetCompanyName;
        body.sector = sector;
      }

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please check your credentials.");
      }

      // If new industry registration, save to custom list
      if (!isLogin) {
        if (isNewIndustry || !selectedIndustry) {
          const newIndObj: TamilNaduIndustry = {
            name: targetCompanyName,
            district: district,
            sector: sector,
            grantRange: grantRange,
            facilities: facilities,
            mentorLead: mentorLead || `${targetCompanyName} Lead`,
            specialization: selectedSpecializations.length > 0 ? selectedSpecializations : ["Infrastructure", "Water Management"]
          };

          const existingCustom = JSON.parse(localStorage.getItem("custom_industries") || "[]");
          const filtered = existingCustom.filter((i: any) => i.name !== targetCompanyName);
          localStorage.setItem("custom_industries", JSON.stringify([newIndObj, ...filtered]));
        }
      }

      let activeIndustryInfo: any = selectedIndustry;
      if (isLogin) {
        const matched = allIndustries.find((i) => i.name.toLowerCase() === (data.user?.companyName || "").toLowerCase());
        if (matched) activeIndustryInfo = matched;
      }

      const industryUser = {
        ...data.user,
        companyName: targetCompanyName || activeIndustryInfo?.name || data.user.companyName || "Tata Consultancy Services CSR (Siruseri)",
        sector: sector || activeIndustryInfo?.sector || "IT & Smart Public Infrastructure",
        district: district || activeIndustryInfo?.district || "Chengalpattu",
        grantRange: grantRange || activeIndustryInfo?.grantRange || "₹25L – ₹75L",
        specialization: selectedSpecializations.length > 0 ? selectedSpecializations : activeIndustryInfo?.specialization || ["AI", "Software", "Smart City"],
        facilities: facilities || activeIndustryInfo?.facilities || "Corporate R&D Lab",
        mentorLead: mentorLead || data.user.name || "Corporate Lead",
        role: "INDUSTRY",
      };

      localStorage.setItem("industry_token", data.token);
      localStorage.setItem("industry_user", JSON.stringify(industryUser));

      // Global auth sync
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(industryUser));

      setSuccessMsg(isLogin ? "Welcome back! Opening Industry Hub..." : `Welcome, ${industryUser.companyName}! Registration successful.`);

      setTimeout(() => {
        router.push("/industry");
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-950 via-zinc-950 to-slate-950 text-zinc-100 p-4 selection:bg-pink-500 selection: py-12 ${isDark ? "text-white" : "text-slate-900"}`}>
      <div className="w-full max-w-lg">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link
            href="/industry"
            className={`inline-flex items-center gap-2 text-3xl font-black italic tracking-tight  group ${isDark ? "text-white" : "text-slate-900"}`}
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform">
              <Factory className={`h-5 w-5 ${isDark ? "text-white" : "text-slate-900"}`} />
            </div>
            <span>SocialImpact</span>
          </Link>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-bold text-pink-400">
            <Building2 className="h-3.5 w-3.5" />
            <span>Tamil Nadu Industry CSR &amp; Corporate Innovation Hub</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-zinc-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-zinc-800/80 overflow-hidden">
          <div className="p-7 sm:p-9">

            {/* Tab Switcher */}
            <div className="flex bg-zinc-950 p-1.5 rounded-2xl mb-6 border border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  isLogin
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-500/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Sign In (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  !isLogin
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-500/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Register Enterprise / Company
              </button>
            </div>

            <div className="mb-6">
              <h2 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {isLogin ? "Corporate Partner Sign In" : "Join as Tamil Nadu Industry Partner"}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {isLogin
                  ? "Enter your corporate work email and password to access the industry innovation hub."
                  : "Register your corporate CSR entity across Tamil Nadu districts to sponsor university prototypes."}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 bg-rose-950/50 border border-rose-900/80 rounded-2xl text-rose-300 text-xs font-semibold flex items-center gap-2.5">
                <div className="h-4 w-4 rounded-full bg-rose-900 text-rose-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">!</div>
                <div>{error}</div>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="mb-5 p-3.5 bg-emerald-950/50 border border-emerald-900/80 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <div>{successMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ======================================================== */}
              {/* SIGN UP / REGISTRATION FIELDS ONLY (Hidden in Login Mode) */}
              {/* ======================================================== */}
              {!isLogin && (
                <>
                  {/* Industry Search / Autocomplete Field */}
                  <div ref={dropdownRef} className="relative">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
                      <span>Company / Industry Name (Autocomplete)</span>
                      <span className="text-[10px] text-pink-400 font-semibold">{allIndustries.length}+ Tamil Nadu Companies</span>
                    </label>

                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                      <input
                        type="text"
                        required={!isLogin}
                        value={industryQuery}
                        onChange={handleIndustryInputChange}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Type to search or enter company name..."
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950  placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 outline-none text-xs font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                      />
                      <ChevronDown
                        className="absolute right-3.5 top-3 h-4 w-4 text-zinc-500 cursor-pointer"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                      />
                    </div>

                    {/* Live Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl max-h-56 overflow-y-auto divide-y divide-zinc-800 animate-in fade-in">
                        {suggestions.map((ind, i) => (
                          <div
                            key={i}
                            onClick={() => handleSelectSuggestion(ind)}
                            className="p-3 hover:bg-zinc-800/80 cursor-pointer transition flex items-start justify-between gap-2"
                          >
                            <div>
                              <p className={`text-xs font-bold  flex items-center gap-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                                <span>{ind.name}</span>
                                <span className="text-[9px] px-1.5 py-0.2 bg-pink-500/20 text-pink-300 rounded font-semibold">
                                  {ind.district}
                                </span>
                              </p>
                              <p className="text-[10px] text-zinc-400 mt-0.5">
                                {ind.sector} · Grant: {ind.grantRange}
                              </p>
                            </div>
                            {selectedIndustry?.name === ind.name && (
                              <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                        ))}

                        {industryQuery.trim() && !allIndustries.some((i) => i.name.toLowerCase() === industryQuery.trim().toLowerCase()) && (
                          <div
                            onClick={() => {
                              setIsNewIndustry(true);
                              setShowSuggestions(false);
                            }}
                            className="p-3 bg-pink-950/40 hover:bg-pink-900/50 cursor-pointer transition flex items-center gap-2 text-xs font-bold text-pink-300"
                          >
                            <Plus className="h-4 w-4 text-pink-400" />
                            <span>Register new enterprise: &quot;{industryQuery}&quot;</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Detailed Industry Configuration */}
                  <div className="p-4 rounded-2xl bg-pink-950/25 border border-pink-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-pink-300 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                        <span>Sector, District &amp; CSR Grant Allocation</span>
                      </span>
                      {isNewIndustry && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                          New Enterprise Setup
                        </span>
                      )}
                    </div>

                    {/* District & Grant Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 mb-1">
                          Tamil Nadu District
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className={`w-full px-2.5 py-1.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs  focus:ring-2 focus:ring-pink-500 outline-none ${isDark ? "text-white" : "text-slate-900"}`}
                        >
                          {TAMIL_NADU_DISTRICTS.map((d) => (
                            <option key={d} value={d}>
                              {d} District
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 mb-1">
                          CSR Prototype Grant Budget
                        </label>
                        <select
                          value={grantRange}
                          onChange={(e) => setGrantRange(e.target.value)}
                          className={`w-full px-2.5 py-1.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs  focus:ring-2 focus:ring-pink-500 outline-none font-semibold text-emerald-400 ${isDark ? "text-white" : "text-slate-900"}`}
                        >
                          <option value="₹10L – ₹25L">₹10L – ₹25L</option>
                          <option value="₹25L – ₹50L">₹25L – ₹50L</option>
                          <option value="₹50L – ₹1 Crore">₹50L – ₹1 Crore</option>
                          <option value="₹1 Crore+">₹1 Crore+ (Large Scale)</option>
                        </select>
                      </div>
                    </div>

                    {/* Industry Sector */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 mb-1">
                        Industry Sector / Domain
                      </label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className={`w-full px-2.5 py-1.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs  focus:ring-2 focus:ring-pink-500 outline-none ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {INDUSTRY_SECTORS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Priority CSR Focus Areas */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 mb-1.5">
                        Select Ground Problem Areas Supported by CSR:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {CSR_PROBLEM_DOMAINS.map((domain, idx) => {
                          const isSelected = selectedSpecializations.includes(domain);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleDomain(domain)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                                isSelected
                                  ? "bg-pink-600 text-white shadow-sm shadow-pink-500/30"
                                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                              <span>{domain}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                      Authorized Representative / CSR Director Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                      <input
                        type="text"
                        required={!isLogin}
                        value={mentorLead}
                        onChange={(e) => setMentorLead(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950  placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 outline-none text-xs font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                        placeholder="e.g. Anand Mahindra / CSR Lead"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ======================================================== */}
              {/* CORE CREDENTIALS (Email & Password - Shown in Both Modes) */}
              {/* ======================================================== */}

              {/* Corporate Email / Username */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  {isLogin ? "Corporate Work Email / Username" : "Corporate Work Email"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950  placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 outline-none text-xs font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                    placeholder="csr@company.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950  placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 outline-none text-xs font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600  font-bold rounded-xl hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-xl shadow-pink-500/20 text-xs uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? "Sign In to Industry Hub" : "Complete Enterprise Registration"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-zinc-800 text-center text-[11px] text-zinc-500">
              <span className="flex items-center justify-center gap-1.5 text-zinc-400">
                <ShieldCheck className="h-3.5 w-3.5 text-pink-400" />
                <span>Authorized Tamil Nadu Industry CSR &amp; Partner Access Only</span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
