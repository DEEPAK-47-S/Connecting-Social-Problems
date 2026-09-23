"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, Activity, AlertCircle , ShieldCheck } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminLoginPage() {
 const { theme } = useTheme();
 const router = useRouter();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [showPass, setShowPass] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [successMsg, setSuccessMsg] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError("");
 setSuccessMsg("");
 setLoading(true);

 try {
 const res = await fetch(`${API}/api/auth/login`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 email: email.trim().toLowerCase(),
 password,
 expectedRole: "ADMIN",
 }),
 });

 const data = await res.json();

 if (!res.ok) {
 throw new Error(data.error || "Authentication failed. Please check administrator credentials.");
 }

 const adminUser = {
 ...data.user,
 role: "ADMIN",
 };

 localStorage.setItem("admin_token", data.token);
 localStorage.setItem("admin_user", JSON.stringify(adminUser));

 setSuccessMsg("Administrator verified. Entering Command Center...");

 setTimeout(() => {
 router.push("/admin");
 router.refresh();
 }, 600);
 } catch (err: any) {
 setError(err.message || "Invalid administrator credentials.");
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className={`min-h-screen flex items-center justify-center bg-background text-foreground p-4`}>
 <div className="w-full max-w-md">
 
 {/* Brand Header */}
 <div className="text-center mb-8">
 <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 mb-4 shadow-md shadow-rose-600/30">
 <ShieldCheck className={`h-8 w-8 text-foreground`} />
 </div>
 <h1 className={`text-2xl font-black tracking-tight text-foreground`}>
 System Administration Portal
 </h1>
 <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400">
 Central moderation, database oversight, and complaint removal hub.
 </p>
 </div>

 {/* Card */}
 <div className="bg-white dark:bg-zinc-900/75 rounded-3xl border dark:border-zinc-800 p-8 shadow-md ">
 {error && (
 <div className="mb-6 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
 <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
 <span>{error}</span>
 </div>
 )}

 {successMsg && (
 <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
 {successMsg}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
 Admin Email / Account
 </label>
 <div className="relative">
 <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
 <input
 type="email"
 required
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="admin@socialimpact.org"
 className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900/75 border dark:border-zinc-800 rounded-xl text-xs sm:text-sm placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition text-foreground`}
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
 Admin Secure Password
 </label>
 <div className="relative">
 <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
 <input
 type={showPass ? "text" : "password"}
 required
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="••••••••"
 className={`w-full pl-10 pr-12 py-2.5 bg-white dark:bg-zinc-900/75 border dark:border-zinc-800 rounded-xl text-xs sm:text-sm placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition text-foreground`}
 />
 <button
 type="button"
 onClick={() => setShowPass(!showPass)}
 className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-700 dark:text-zinc-300"
 >
 {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
 </button>
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 className={`w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 text-foreground`}
 >
 {loading ? (
 <>
 <Loader2 className="h-4 w-4 animate-spin" />
 <span>Verifying Credentials...</span>
 </>
 ) : (
 <>
 <span>Authenticate as Admin</span>
 <ArrowRight className="h-4 w-4" />
 </>
 )}
 </button>
 </form>

 <div className="mt-6 pt-4 border-t dark:border-zinc-800 text-center">
 <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-300 transition">
 ← Return to Public Portal
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}
