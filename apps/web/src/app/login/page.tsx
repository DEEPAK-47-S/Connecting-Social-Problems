"use client";
import Image from "next/image";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Activity, Mail, Lock, User, CheckCircle2, ArrowRight, MapPin , ShieldCheck } from "lucide-react";
import { TAMIL_NADU_DISTRICTS } from "@/data/tamilNaduDistricts";
import { INDIAN_STATES } from "@/data/indianStates";
import { getDistrictsForState } from "@/data/districts";


const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function LoginPage() {
 const router = useRouter();
 const [isLogin, setIsLogin] = useState(true);

 // Form state
 const [name, setName] = useState("");
 const [district, setDistrict] = useState("Chennai");
 const [state, setState] = useState("");
 const [isOtherDistrict, setIsOtherDistrict] = useState(false);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [showPass, setShowPass] = useState(false);

 // UI state
 const [loading, setLoading] = useState(false);

  // OTP States
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccessMsg("A new OTP has been sent!");
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((c) => {
          if (c <= 1) clearInterval(timer);
          return c - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 const [error, setError] = useState("");
 const [successMsg, setSuccessMsg] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError("");
 setSuccessMsg("");
 setLoading(true);

 try {
      if (step === 2) {
        const res = await fetch(`${API}/api/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, otp }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Invalid OTP.");

        if(window.location.pathname.includes('admin')) {
           localStorage.setItem("admin_token", data.token);
           localStorage.setItem("admin_user", JSON.stringify({...data.user, role: "ADMIN"}));
        } else {
           localStorage.setItem("token", data.token);
           localStorage.setItem("user", JSON.stringify(data.user));
        }
        setSuccessMsg("Verification successful! Redirecting...");
        setTimeout(() => {
          router.push(window.location.pathname.replace("/login", "") || "/");
          router.refresh();
        }, 700);
        return;
      }

 const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
 const body: any = {
 email: email.trim().toLowerCase(),
 password,
 };
 if (isLogin) {
 body.expectedRole = "CITIZEN";
 } else {
 body.name = name.trim();
 body.role = "CITIZEN";
 body.district = district;
 body.state = state;
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
      if (data.requiresOtp) {
        setUserId(data.userId);
        setStep(2);
        setSuccessMsg("OTP sent to your email.");
        setLoading(false);
        return;
      }


 const citizenUser = {
 ...data.user,
 district: district,
 };

 // Save token and user directly to localStorage
 localStorage.setItem("token", data.token);
 localStorage.setItem("user", JSON.stringify(citizenUser));

 setSuccessMsg(isLogin ? "Welcome back! Redirecting..." : "Account created! Redirecting to feed...");

 // Redirect after smooth visual feedback
 setTimeout(() => {
 router.push("/");
 router.refresh();
 }, 700);
 } catch (err: any) {
 setError(err.message || "An unexpected error occurred. Please try again.");
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors">
 <div className="w-full max-w-md">
 
 {/* Brand Header */}
 <div className="text-center mb-8">
  <Link
  href="/"
  className="inline-flex flex-wrap justify-center items-center gap-2 text-2xl sm:text-3xl font-black italic tracking-tight text-zinc-900 dark:text-white group"
  >
  <Image src="/logo.jpg" alt="Connecting Social Problem Logo" width={40} height={40} className="rounded-xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform flex-shrink-0 object-cover" />
  <span className="break-words text-center">Connecting Social Problem</span>
  </Link>
 <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
 Citizen Voice &amp; Public Problem Solver Portal
 </p>
 </div>

 {/* Main Card */}
 <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
 
 <div className="p-8 sm:p-10">
 {/* Tab Switcher */}
 <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl mb-8">
 <button
 type="button"
 onClick={() => {
 setIsLogin(true);
 setError("");
 setSuccessMsg("");
 }}
 className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
 isLogin
 ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
 : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
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
 ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
 : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
 }`}
 >
 Create Account (Sign Up)
 </button>
 </div>

 <div className="mb-6">
 <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
 {isLogin ? "Citizen Sign In" : "Join as a Citizen"}
 </h2>
 <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
 {isLogin
 ? "Enter your email/username and password to access your community feed."
 : "Create an account in seconds to raise public problems and track solutions."}
 </p>
 </div>

 {/* Error Message */}
 {error && (
 <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3">
 <div className="h-5 w-5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-center flex-shrink-0 text-xs font-bold">!</div>
 <div className="font-medium">{error}</div>
 </div>
 )}

 {/* Success Message */}
 {successMsg && (
 <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-3">
 <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
 <div className="font-medium">{successMsg}</div>
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
  {step === 1 ? (
    <>
      
 
 {/* ======================================================== */}
 {/* SIGN UP / REGISTRATION FIELDS ONLY (Hidden in Login Mode) */}
 {/* ======================================================== */}
 {!isLogin && (
 <>
 {/* Full Name */}
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
 Full Name
 </label>
 <div className="relative">
 <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
 <input
 type="text"
 required={!isLogin}
 value={name}
 onChange={(e) => setName(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
 placeholder="e.g. Ramesh Kumar"
 />
 </div>
 </div>

 {/* State & District */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
  <div>
  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
  State
  </label>
  <div className="relative">
  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
  <select
  value={state}
  onChange={(e) => {
    setState(e.target.value);
    setIsOtherDistrict(false);
  }}
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
  >
  <option value="" disabled>Select State</option>
  {INDIAN_STATES.map((s) => (
    <option key={s} value={s}>{s}</option>
  ))}
  </select>
  </div>
  </div>

  <div>
  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
  District
  </label>
  <div className="relative">
  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
  {getDistrictsForState(state).length > 0 && !isOtherDistrict ? (
  <select
  value={district}
  onChange={(e) => {
    if (e.target.value === "Others") {
      setIsOtherDistrict(true);
      setDistrict("");
    } else {
      setDistrict(e.target.value);
    }
  }}
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
  >
  {getDistrictsForState(state).map((d) => (
  <option key={d} value={d}>
  {d} District
  </option>
  ))}
  <option value="Others">Others (Type manually)</option>
  </select>
  ) : (
  <input
  type="text"
  required={!isLogin}
  value={district}
  onChange={(e) => setDistrict(e.target.value)}
  placeholder="Enter District Name"
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
  />
  )}
  </div>
  </div>
  </div>
  </>
  )}

 {/* ======================================================== */}
 {/* CORE CREDENTIALS (Email & Password - Shown in Both Modes) */}
 {/* ======================================================== */}

 {/* Email / Username */}
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
 {isLogin ? "Email Address / Username" : "Email Address"}
 </label>
 <div className="relative">
 <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
 <input
 type="email"
 required
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
 placeholder="name@example.com"
 />
 </div>
 </div>

 {/* Password */}
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
 Password
 </label>
 <div className="relative">
 <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
 <input
 type={showPass ? "text" : "password"}
 required
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
 placeholder="••••••••"
 />
 <button
 type="button"
 onClick={() => setShowPass(!showPass)}
 className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
 >
 {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
 </button>
 </div>
 </div>

 {/* Submit Button */}
 <button
 type="submit"
 disabled={loading}
 className="w-full mt-2 py-3 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 text-xs uppercase tracking-wider"
 >
 {loading ? (
 <>
 <Loader2 className="h-4 w-4 animate-spin" />
 <span>Please wait...</span>
 </>
 ) : (
 <>
 <span>{isLogin ? "Sign In" : "Complete Registration"}</span>
 <ArrowRight className="h-4 w-4" />
 </>
 )}
 </button>
 
    </>
  ) : (
    <>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
          Enter OTP
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-xl tracking-[0.5em] focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-foreground font-mono"
          placeholder="••••••"
          maxLength={6}
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 text-white"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        <span>{loading ? "Verifying..." : "Verify OTP"}</span>
      </button>
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendCooldown > 0 || loading}
          className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline disabled:opacity-50 disabled:no-underline"
        >
          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
        </button>
      </div>
    </>
  )}
</form>

 </div>
 </div>

 </div>
 </div>
 );
}
