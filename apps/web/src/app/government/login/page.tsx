"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Landmark,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Stamp,
  Building,
  MapPin
} from "lucide-react";
import { TAMIL_NADU_DISTRICTS } from "@/data/tamilNaduDistricts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const PRESET_AUTHORITIES = [
  { name: "City Municipal Corporation (Commissioner Office)", dept: "Municipal Administration" },
  { name: "Water Supply & Sewerage Board (BWSSB/CMWSSB)", dept: "Water Utilities" },
  { name: "Electricity Distribution Company (DISCOM)", dept: "Power & Grid Infrastructure" },
  { name: "Public Works Department (PWD)", dept: "Civic & Road Infrastructure" },
  { name: "Smart Cities Mission Directorate", dept: "Urban Governance & Telemetry" },
];

export default function GovernmentLoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [authorityName, setAuthorityName] = useState(PRESET_AUTHORITIES[0].name);
  const [officerName, setOfficerName] = useState("S. Ramaswamy, IAS (Municipal Commissioner)");
  const [district, setDistrict] = useState("Chennai");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body: any = {
        email: email.trim().toLowerCase(),
        password,
      };
      if (isLogin) {
        body.expectedRole = "GOVERNMENT";
      } else {
        body.name = officerName.trim();
        body.role = "GOVERNMENT";
      }

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please check credentials.");
      }

      const govtUser = {
        ...data.user,
        authorityName: isLogin ? data.user.authorityName || authorityName : authorityName,
        officerName: isLogin ? data.user.name || officerName : officerName,
        district: district,
        role: "GOVERNMENT",
      };

      localStorage.setItem("government_token", data.token || "demo_token");
      localStorage.setItem("government_user", JSON.stringify(govtUser));
      localStorage.setItem("token", data.token || "demo_token");
      localStorage.setItem("user", JSON.stringify(govtUser));

      setSuccessMsg(isLogin ? "Welcome back! Accessing Municipal Authority Hub..." : `Welcome, ${govtUser.officerName}! Registration successful.`);

      setTimeout(() => {
        router.push("/government");
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 selection:bg-teal-500 selection:text-white py-12">
      <div className="w-full max-w-lg">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link
            href="/government"
            className="inline-flex items-center gap-2 text-3xl font-black italic tracking-tight text-white group"
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-transform">
              <Landmark className="h-5 w-5 text-white" />
            </div>
            <span>SocialImpact</span>
          </Link>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Government &amp; Municipal Authority Portal</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden">
          <div className="p-7 sm:p-9">

            {/* Tab Switcher */}
            <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-6 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  isLogin
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:text-white"
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
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Register Municipal Office
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-black tracking-tight text-white">
                {isLogin ? "Administrative Authority Sign In" : "Register Government Department"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isLogin
                  ? "Enter your official government email and password to access municipal sanctions."
                  : "Register your administrative department or regional municipal division to verify civic projects."}
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
                  {/* Select Municipal / Government Directorate */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Department / Authority Division
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <select
                        value={authorityName}
                        onChange={(e) => setAuthorityName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"
                      >
                        {PRESET_AUTHORITIES.map((a, i) => (
                          <option key={i} value={a.name}>
                            {a.name} ({a.dept})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Officer Designation & District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Officer Name &amp; Designation
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required={!isLogin}
                          value={officerName}
                          onChange={(e) => setOfficerName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"
                          placeholder="e.g. S. Ramaswamy, IAS"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Tamil Nadu District
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"
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
                </>
              )}

              {/* ======================================================== */}
              {/* CORE CREDENTIALS (Email & Password - Shown in Both Modes) */}
              {/* ======================================================== */}

              {/* Official Email / Username */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isLogin ? "Official Government Email / Username" : "Official Government Email"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"
                    placeholder="officer@tn.gov.in"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20 text-xs uppercase tracking-wider"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? "Sign In to Municipal Portal" : "Complete Municipal Registration"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-[11px] text-slate-500">
              <span className="flex items-center justify-center gap-1.5 text-slate-400">
                <Stamp className="h-3.5 w-3.5 text-teal-400" />
                <span>Authorized Tamil Nadu Municipal &amp; Civic Governance Access Only</span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
