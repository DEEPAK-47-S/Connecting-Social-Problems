"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Activity, Mail, Lock, User, CheckCircle2, ArrowRight, MapPin } from "lucide-react";
import { TAMIL_NADU_DISTRICTS } from "@/data/tamilNaduDistricts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function LoginPage() {
 const router = useRouter();
 const [isLogin, setIsLogin] = useState(true);

 // Form state
 const [name, setName] = useState("");
 const [district, setDistrict] = useState("Chennai");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [showPass, setShowPass] = useState(false);

 // UI state
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
 body.expectedRole = "CITIZEN";
 } else {
 body.name = name.trim();
 body.role = "CITIZEN";
 body.district = district;
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
 className="inline-flex items-center gap-2 text-3xl font-black italic tracking-tight text-zinc-900 dark:text-white group"
 >
 <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
 <Activity className="h-5 w-5 text-white" />
 </div>
 <span>SocialImpact</span>
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

 {/* Tamil Nadu District */}
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
 Tamil Nadu District
 </label>
 <div className="relative">
 <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
 <select
 value={district}
 onChange={(e) => setDistrict(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
 >
 {TAMIL_NADU_DISTRICTS.map((d) => (
 <option key={d} value={d}>
 {d} District
 </option>
 ))}
 </select>
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
 </form>

 </div>
 </div>

 </div>
 </div>
 );
}
