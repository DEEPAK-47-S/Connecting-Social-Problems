"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
 Landmark,
 ShieldCheck,
 FileCheck2,
 CheckCircle2,
 AlertCircle,
 Loader2,
 Search,
 Filter,
 MapPin,
 Clock,
 Sparkles,
 ChevronRight,
 GraduationCap,
 Building2,
 Users,
 Stamp,
 Award,
 ScrollText,
 BadgeCheck,
 Check,
 ArrowRight,
 Eye,
 Activity,
 Briefcase,
 LogOut,
 UserCheck
} from "lucide-react";
import ProfileModal from "@/components/ProfileModal";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const GOVT_DEPARTMENTS = [
 "All Municipal Departments",
 "Water Supply & Sewerage Board (BWSSB/CMWSSB)",
 "Electricity & Power Distribution (DISCOM)",
 "Public Works Department (PWD - Roads & Infra)",
 "Municipal Solid Waste & Sanitation",
 "Smart Cities Mission Directorate",
 "Agriculture & Rural Development Dept",
];

const SCHEMES = [
 "Smart Cities Urban Mission",
 "Jal Jeevan Mission (Urban/Rural)",
 "Swachh Bharat Cleanliness Mission",
 "National Clean Air Programme (NCAP)",
 "PM-KUSUM Solar Energy Scheme",
 "Municipal Innovation & Civic Grant",
];

export default function GovernmentPortal() {
 const router = useRouter();
 const { theme } = useTheme();
 const [authChecking, setAuthChecking] = useState(true);
 const [govtUser, setGovtUser] = useState<any | null>(null);
 const [posts, setPosts] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [showProfile, setShowProfile] = useState(false);
 const [activeTab, setActiveTab] = useState<"reviews" | "implementation" | "completed" | "schemes">("reviews");
 const [searchQuery, setSearchQuery] = useState("");
 const [selectedDept, setSelectedDept] = useState("All Municipal Departments");

 // Selected post for modal action
 const [selectedPost, setSelectedPost] = useState<any | null>(null);
 const [actionModalType, setActionModalType] = useState<"approve" | "complete" | "details" | null>(null);

 // Approval Form states
 const [department, setDepartment] = useState("Water Supply & Sewerage Board");
 const [sanctionNumber, setSanctionNumber] = useState("SMC/ENG/2026/0941");
 const [officerName, setOfficerName] = useState("S. Ramaswamy, IAS (Municipal Commissioner)");
 const [allocatedScheme, setAllocatedScheme] = useState("Smart Cities Urban Mission");
 const [sanctionNotes, setSanctionNotes] = useState("");
 
 // Completion Form states
 const [beneficiaries, setBeneficiaries] = useState("12,500+ Ward Residents");
 const [completionNotes, setCompletionNotes] = useState("");
 const [submittingAction, setSubmittingAction] = useState(false);
 const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

 // Mandatory Authentication Gate: Government authority must login first
 useEffect(() => {
 try {
 const stored = localStorage.getItem("government_user");
 if (!stored) {
 router.replace("/government/login");
 return;
 }
 const u = JSON.parse(stored);
 if (!u || u.role !== "GOVERNMENT") {
 router.replace("/government/login");
 return;
 }
 setGovtUser(u);
 if (u.authorityName) setDepartment(u.authorityName);
 if (u.officerName) setOfficerName(u.officerName);
 setAuthChecking(false);
 } catch {
 router.replace("/government/login");
 }
 }, [router]);

 const fetchChallenges = useCallback(async () => {
 setLoading(true);
 try {
 const res = await fetch(`${API}/api/posts?limit=50`);
 const data = await res.json();
 if (res.ok) {
 setPosts(data.posts || []);
 }
 } catch (e) {
 console.error("Failed to load govt portal challenges:", e);
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => {
 fetchChallenges();
 }, [fetchChallenges]);

 const showToast = (type: "success" | "error", text: string) => {
 setNotification({ type, text });
 setTimeout(() => setNotification(null), 4000);
 };

 // Multi-Tenant Isolation: Check if post belongs to THIS government authority
 const isSanctionedByMyAuthority = (p: any) => {
 const myAuth = (govtUser?.authorityName || department || "").toLowerCase().trim();
 if (!myAuth) return false;

 if (p.governmentSanctions && Array.isArray(p.governmentSanctions)) {
 const match = p.governmentSanctions.some((gs: any) => 
 (govtUser?.id && gs.govtId === govtUser.id) ||
 (gs.authorityName && gs.authorityName.toLowerCase().includes(myAuth))
 );
 if (match) return true;
 }
 return p.statusHistory?.some((sh: any) => sh.actor && sh.actor.toLowerCase().includes(myAuth));
 };

 // Filter posts based on active tab with municipal isolation
 const filteredPosts = posts.filter((p) => {
 if (activeTab === "reviews") {
 // Pending review / approval
 if (["INDUSTRY_ACCEPTED", "GOVT_REVIEW"].indexOf(p.status) === -1) return false;
 } else if (activeTab === "implementation") {
 if (["GOVT_APPROVED", "IMPLEMENTATION"].indexOf(p.status) === -1) return false;
 // Scoped to this authority
 if (!isSanctionedByMyAuthority(p)) return false;
 } else if (activeTab === "completed") {
 if (p.status !== "COMPLETED") return false;
 // Scoped to this authority
 if (!isSanctionedByMyAuthority(p)) return false;
 }

 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 const match = (p.title?.toLowerCase() || "").includes(q) || (p.description?.toLowerCase() || "").includes(q) || (p.category?.toLowerCase() || "").includes(q) || (p.location?.toLowerCase() || "").includes(q);
 if (!match) return false;
 }

 return true;
 });

 // Handle Official Government Approval
 const handleApproveSanction = async () => {
 if (!selectedPost) return;
 setSubmittingAction(true);
 try {
 const token = localStorage.getItem("government_token");
 const res = await fetch(`${API}/api/posts/${selectedPost.id}/status`, {
 method: "PATCH",
 headers: {
 "Content-Type": "application/json",
 ...(token ? { Authorization: `Bearer ${token}` } : {})
 },
 body: JSON.stringify({
 status: "GOVT_APPROVED",
 authorityName: govtUser?.authorityName || department,
 department: department || govtUser?.dept,
 sanctionNumber: sanctionNumber,
 scheme: allocatedScheme,
 message: `Official Sanction Order #${sanctionNumber} issued by ${officerName} (${department}) under ${allocatedScheme}.`,
 actor: officerName,
 }),
 });
 if (!res.ok) throw new Error("Failed to sanction project.");

 showToast("success", `🏛️ Sanction Order #${sanctionNumber} issued successfully!`);
 setActionModalType(null);
 fetchChallenges();
 } catch (err: any) {
 showToast("error", err.message || "Failed to issue approval.");
 } finally {
 setSubmittingAction(false);
 }
 };

 // Handle Final Mark as Solved & Deployed
 const handleMarkCompleted = async () => {
 if (!selectedPost) return;
 setSubmittingAction(true);
 try {
 const token = localStorage.getItem("government_token");
 const res = await fetch(`${API}/api/posts/${selectedPost.id}/status`, {
 method: "PATCH",
 headers: {
 "Content-Type": "application/json",
 ...(token ? { Authorization: `Bearer ${token}` } : {})
 },
 body: JSON.stringify({
 status: "COMPLETED",
 authorityName: govtUser?.authorityName || department,
 department: department || govtUser?.dept,
 message: completionNotes || `Ground installation inspected & verified active by ${department}. Issue permanently resolved.`,
 actor: officerName || "Municipal Authority",
 beneficiaries: beneficiaries,
 }),
 });
 if (!res.ok) throw new Error("Failed to close and verify project.");

 showToast("success", `🌟 Issue successfully verified as resolved on ground! Impact logged.`);
 setActionModalType(null);
 fetchChallenges();
 } catch (err: any) {
 showToast("error", err.message || "Failed to complete challenge.");
 } finally {
 setSubmittingAction(false);
 }
 };

 const handleLogout = () => {
 localStorage.removeItem("government_user");
 localStorage.removeItem("government_token");
 setGovtUser(null);
 router.replace("/government/login");
 };

 const reviewsCount = posts.filter((p) => ["INDUSTRY_ACCEPTED", "GOVT_REVIEW"].includes(p.status)).length;
 const implementationCount = posts.filter((p) => ["GOVT_APPROVED", "IMPLEMENTATION"].includes(p.status) && isSanctionedByMyAuthority(p)).length;
 const completedCount = posts.filter((p) => p.status === "COMPLETED" && isSanctionedByMyAuthority(p)).length;

 if (authChecking) {
 return (
 <div className={`min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground`}>
 <Loader2 className="h-10 w-10 animate-spin text-teal-500" />
 <p className={`text-sm font-semibold text-slate-600 dark:text-slate-400`}>
 Verifying Civic Authority Session...
 </p>
 </div>
 );
 }

 return (
 <div className={`min-h-screen font-sans selection:bg-teal-500 selection:text-foreground transition-colors duration-200 bg-background text-foreground`}>
 
 {/* Toast Notification */}
 {notification && (
 <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-md border text-sm font-semibold flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
 notification.type === "success"
 ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-700 dark:text-emerald-200"
 : "bg-rose-950/80 border-rose-500/50 text-rose-700 dark:text-rose-200"
 }`}>
 {notification.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
 <span>{notification.text}</span>
 </div>
 )}

 {/* Top Header */}
 <header className={`border-b sticky top-0 z-40 transition-colors border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-800 dark:bg-zinc-900/75 dark:text-white`}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
 <Landmark className={`h-6 w-6 text-foreground`} />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-black text-xl tracking-tight bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
 Government &amp; Municipal Authority Hub
 </span>
 <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30">
 Civic Governance
 </span>
 <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hidden md:inline-flex items-center gap-1">
 🛡️ Isolated Workspace
 </span>
 </div>
 <p className={`text-xs text-slate-500 dark:text-slate-400`}>
 Official Municipal Sanctions &amp; Ground Verification (Private Authority Scope)
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <ThemeToggle />

 {/* Dedicated Municipal Authority Profile & Logout */}
 <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs shadow-inner bg-white border-slate-300 text-slate-900 dark:bg-zinc-900/75 dark:border-slate-800 dark:text-white`}>
 <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
 <div className="text-left">
 <p className="font-bold max-w-[160px]">{govtUser?.officerName || officerName}</p>
 <p className="text-[10px] text-teal-500 max-w-[160px]">{govtUser?.authorityName || department}</p>
 </div>
 <button
 onClick={() => setShowProfile(true)}
 className={`flex items-center gap-1 text-teal-500 hover:text-teal-600 dark:text-teal-400 ml-2 pl-2 border-l transition-colors border-slate-200 dark:border-slate-800`}
 title="Edit Authority Profile"
 >
 <UserCheck className="h-3.5 w-3.5" />
 <span className="hidden sm:inline text-[11px] font-semibold">Profile</span>
 </button>
 
 </div>
 </div>
 </div>
 </header>

 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

 {/* Hero Banner */}
 <div className="relative overflow-hidden rounded-3xl bg-card text-card-foreground border-border p-8 sm:p-10 mb-10 shadow-md">
 <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
 <div className="relative z-10 max-w-3xl">
 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-500/30 mb-4`}>
 <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
 <span>Official Municipal &amp; State Administrative Portal</span>
 </div>
 <h1 className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground`}>
 Sanction Verified Academic-Industry Solutions for Citizen Relief
 </h1>
 <p className="mt-3 text-zinc-900 dark:text-zinc-100 text-base leading-relaxed">
 Review engineering solutions engineered by universities and backed by industry partners. Issue administrative clearances, connect projects to official national welfare schemes, and certify ground resolution.
 </p>
 </div>

 {/* Metrics Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800">
 <div className={`/70 rounded-2xl p-4 border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className={`text-xs font-medium text-slate-600 dark:text-slate-400`}>Pending Sanctions &amp; Permits</p>
 <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">{reviewsCount}</p>
 </div>
 <div className={`/70 rounded-2xl p-4 border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className={`text-xs font-medium text-slate-600 dark:text-slate-400`}>Active Ground Deployments</p>
 <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{implementationCount}</p>
 </div>
 <div className={`/70 rounded-2xl p-4 border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className={`text-xs font-medium text-slate-600 dark:text-slate-400`}>Verified Solved Grievances</p>
 <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">{completedCount}</p>
 </div>
 <div className={`/70 rounded-2xl p-4 border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className={`text-xs font-medium text-slate-600 dark:text-slate-400`}>Citizen Resolution Rate</p>
 <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">98.4%</p>
 </div>
 </div>
 </div>

 {/* Tab & Search Bar */}
 <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 pb-4 border-b border-slate-800">
 <div className={`flex /90 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto overflow-x-auto bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <button
 onClick={() => setActiveTab("reviews")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
 activeTab === "reviews"
 ? "bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-foreground shadow-lg shadow-teal-500/25"
 : "text-slate-600 dark:text-slate-400 hover:text-foreground"
 }`}
 >
 <Stamp className="h-4 w-4" />
 <span>Pending Clearance ({reviewsCount})</span>
 </button>

 <button
 onClick={() => setActiveTab("implementation")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
 activeTab === "implementation"
 ? "bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-foreground shadow-lg shadow-teal-500/25"
 : "text-slate-600 dark:text-slate-400 hover:text-foreground"
 }`}
 >
 <FileCheck2 className="h-4 w-4" />
 <span>Active Civic Works ({implementationCount})</span>
 </button>

 <button
 onClick={() => setActiveTab("completed")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
 activeTab === "completed"
 ? "bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-foreground shadow-lg shadow-teal-500/25"
 : "text-slate-600 dark:text-slate-400 hover:text-foreground"
 }`}
 >
 <BadgeCheck className="h-4 w-4" />
 <span>Certified Solved ({completedCount})</span>
 </button>

 <button
 onClick={() => setActiveTab("schemes")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
 activeTab === "schemes"
 ? "bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-foreground shadow-lg shadow-teal-500/25"
 : "text-slate-600 dark:text-slate-400 hover:text-foreground"
 }`}
 >
 <ScrollText className="h-4 w-4" />
 
 </button>
 </div>

 <div className="relative w-full sm:w-72">
 <Search className={`absolute left-3.5 top-3 h-4 w-4 text-slate-600 dark:text-slate-400`} />
 <input
 type="text"
 placeholder="Search by area or grievance..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className={`w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500 transition text-foreground`}
 />
 </div>
 </div>

 {/* Content Section */}
 {activeTab === "schemes" ? (
 /* National Schemes Alignment Hub */
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {[
 { scheme: "Smart Cities Mission (MoHUA)", budget: "₹48,000 Cr", projects: 24, focus: "Intelligent street lighting, automated flood sensors, digital grievance redressal" },
 { scheme: "Jal Jeevan Mission (JJM)", budget: "₹60,000 Cr", projects: 31, focus: "Tap water quality monitoring, underground pipeline burst telemetry, rural water ATMs" },
 { scheme: "Swachh Bharat Urban 2.0", budget: "₹15,000 Cr", projects: 19, focus: "Decentralized organic composters, smart garbage bins, wastewater remediation" },
 ].map((s, idx) => (
 <div key={idx} className={`/80 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <div>
 <div className="flex items-center justify-between mb-4">
 <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
 Central Scheme
 </span>
 <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">{s.budget} Outlay</span>
 </div>
 <h3 className={`text-lg font-bold text-foreground`}>{s.scheme}</h3>

 <div className={`mt-4 p-3 /60 rounded-xl border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className={`text-xs text-slate-600 dark:text-slate-400`}>Target Action Areas:</p>
 <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 mt-1">{s.focus}</p>
 <p className="mt-3 text-xs font-semibold text-teal-600 dark:text-teal-400">✓ {s.projects} Municipal Solutions Aligned</p>
 </div>
 </div>

 <button className={`mt-6 w-full py-2.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-500 transition text-foreground`}>
 Map Civic Project to Scheme
 </button>
 </div>
 ))}
 </div>
 ) : loading ? (
 <div className="py-24 text-center">
 <Loader2 className="h-10 w-10 animate-spin text-teal-500 mx-auto mb-4" />
 <p className={`text-sm text-slate-600 dark:text-slate-400`}>Loading municipal administrative queue...</p>
 </div>
 ) : filteredPosts.length === 0 ? (
 <div className={`py-24 text-center /40 rounded-3xl border border-slate-800 p-8 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <CheckCircle2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
 <h3 className={`text-lg font-bold text-foreground`}>No items in this administrative view</h3>
 <p className={`text-sm max-w-md mx-auto mt-1 text-slate-600 dark:text-slate-400`}>
 {activeTab === "reviews"
 ? "No university-industry proposals are awaiting municipal sanction right now."
 : "No active civic works found in this section."}
 </p>
 </div>
 ) : (
 /* Cards Grid */
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredPosts.map((post) => (
 <div
 key={post.id}
 className={`/90 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition shadow-xl group bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}
 >
 <div>
 <div className="p-6 pb-4">
 <div className="flex items-center justify-between gap-2 mb-3">
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
 <Stamp className="h-3.5 w-3.5" />
 <span>{post.status.replace("_", " ")}</span>
 </span>

 <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
 High Civic Priority
 </span>
 </div>

 <h3 className={`text-lg font-bold group-hover:text-teal-300 transition text-foreground`}>
 {post.title}
 </h3>

 <div className={`flex items-center gap-2 text-xs mt-2 text-slate-600 dark:text-slate-400`}>
 {post.location && (
 <div className="flex items-center gap-1">
 <MapPin className="h-3 w-3 text-slate-500" />
 <span>{post.location}</span>
 </div>
 )}
 <span>•</span>
 <span className="text-teal-600 dark:text-teal-400 font-medium">#{post.category || "General"}</span>
 </div>

 <p className="mt-3 text-xs text-zinc-900 dark:text-zinc-100 leading-relaxed ">
 {post.description}
 </p>
 </div>

 {post.imageUrl && (
 <div className="px-6 py-2">
 <img
 src={post.imageUrl.startsWith("data:") ? post.imageUrl : `${API}${post.imageUrl}`}
 alt={post.title}
 className="w-full h-36 object-cover rounded-2xl border border-slate-800"
 />
 </div>
 )}

 {/* Ground Status Box */}
 <div className={`mx-6 my-2 p-3 /80 rounded-2xl border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <div className="flex items-center justify-between text-xs mb-1">
 <span className={`font-medium text-slate-600 dark:text-slate-400`}>University Lab:</span>
 <span className="text-indigo-600 dark:text-indigo-400 font-bold">Tested &amp; Prototyped</span>
 </div>
 <div className="flex items-center justify-between text-xs">
 <span className={`font-medium text-slate-600 dark:text-slate-400`}>Industry Partner:</span>
 <span className="text-pink-600 dark:text-pink-400 font-bold">Corporate CSR Funded</span>
 </div>
 </div>
 </div>

 {/* Footer Buttons */}
 <div className={`p-6 pt-4 border-t border-slate-800 /40 flex items-center gap-2 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 {post.status !== "GOVT_APPROVED" && post.status !== "IMPLEMENTATION" && post.status !== "COMPLETED" ? (
 <button
 onClick={() => {
 setSelectedPost(post);
 setActionModalType("approve");
 }}
 className={`flex-1 py-3 px-4 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-xl text-xs font-bold hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 text-foreground`}
 >
 <Stamp className="h-4 w-4" />
 <span>Issue Official Sanction</span>
 </button>
 ) : post.status !== "COMPLETED" ? (
 <button
 onClick={() => {
 setSelectedPost(post);
 setActionModalType("complete");
 }}
 className={`flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 text-foreground`}
 >
 <CheckCircle2 className="h-4 w-4" />
 <span>Verify &amp; Mark Solved</span>
 </button>
 ) : (
 <div className="flex-1 py-2.5 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
 🌟 Ground Solution Active
 </div>
 )}

 <button
 onClick={() => {
 setSelectedPost(post);
 setActionModalType("details");
 }}
 className="p-3 bg-slate-800 hover:bg-slate-700 text-zinc-900 dark:text-zinc-100 rounded-xl transition"
 title="View full audit trail"
 >
 <ChevronRight className="h-4 w-4" />
 </button>
 </div>
 </div>
 ))}
 </div>
 )}

 </main>

 {/* MODAL 1: ISSUE OFFICIAL SANCTION */}
 {actionModalType === "approve" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className={`border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-md animate-in zoom-in-95 duration-200 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <div className="flex items-center justify-between pb-4 border-b border-slate-800">
 <div className="flex items-center gap-2">
 <Stamp className="h-6 w-6 text-teal-600 dark:text-teal-400" />
 <h3 className={`text-lg font-black text-foreground`}>Issue Municipal Sanction Order</h3>
 </div>
 <button onClick={() => setActionModalType(null)} className={`text-slate-600 dark:text-slate-400 hover: text-sm text-foreground`}>✕</button>
 </div>

 <div className={`my-5 p-4 rounded-2xl border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className="text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">Citizen Problem to Resolve</p>
 <h4 className={`font-bold text-sm mt-1 text-foreground`}>{selectedPost.title}</h4>
 <p className={`text-xs mt-1 text-slate-600 dark:text-slate-400`}>{selectedPost.description}</p>
 </div>

 <div className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Sanctioning Department
 </label>
 <select
 value={department}
 onChange={(e) => setDepartment(e.target.value)}
 className={`w-full px-3 py-2.5 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-foreground`}
 >
 <option>Water Supply &amp; Sewerage Board (BWSSB)</option>
 <option>City Municipal Corporation Engineering Wing</option>
 <option>State Electricity Distribution Company</option>
 <option>Public Works Department (PWD)</option>
 <option>Smart City Development Authority</option>
 </select>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Official Order Number
 </label>
 <input
 type="text"
 value={sanctionNumber}
 onChange={(e) => setSanctionNumber(e.target.value)}
 className={`w-full px-3 py-2 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-foreground`}
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Aligned Central/State Scheme
 </label>
 <select
 value={allocatedScheme}
 onChange={(e) => setAllocatedScheme(e.target.value)}
 className={`w-full px-3 py-2 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-foreground`}
 >
 <option>Smart Cities Urban Mission</option>
 <option>Jal Jeevan Mission</option>
 <option>Swachh Bharat Cleanliness Mission</option>
 <option>Municipal Civic Redressal Fund</option>
 </select>
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Authorizing Officer
 </label>
 <input
 type="text"
 value={officerName}
 onChange={(e) => setOfficerName(e.target.value)}
 className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-500 text-foreground`}
 />
 </div>
 </div>

 <div className="mt-8 flex gap-3">
 <button
 onClick={() => setActionModalType(null)}
 className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-xs transition"
 >
 Cancel
 </button>
 <button
 onClick={handleApproveSanction}
 disabled={submittingAction}
 className={`flex-1 py-3 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 font-bold rounded-xl text-xs hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 text-foreground`}
 >
 {submittingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <Stamp className="h-4 w-4" />}
 <span>Sign &amp; Issue Sanction</span>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* MODAL 2: CERTIFY & MARK SOLVED */}
 {actionModalType === "complete" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className={`border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-md animate-in zoom-in-95 duration-200 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <div className="flex items-center justify-between pb-4 border-b border-slate-800">
 <div className="flex items-center gap-2">
 <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
 <h3 className={`text-lg font-black text-foreground`}>Certify Ground Resolution</h3>
 </div>
 <button onClick={() => setActionModalType(null)} className={`text-slate-600 dark:text-slate-400 hover: text-sm text-foreground`}>✕</button>
 </div>

 <div className={`my-5 p-4 rounded-2xl border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Resolved Public Challenge</p>
 <h4 className={`font-bold text-sm mt-1 text-foreground`}>{selectedPost.title}</h4>
 </div>

 <div className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Benefited Citizens / Households
 </label>
 <input
 type="text"
 value={beneficiaries}
 onChange={(e) => setBeneficiaries(e.target.value)}
 className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-foreground`}
 placeholder="e.g. 15,000+ Ward Residents"
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Inspection Sign-Off Notes
 </label>
 <textarea
 rows={3}
 value={completionNotes}
 onChange={(e) => setCompletionNotes(e.target.value)}
 className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-500 text-foreground`}
 placeholder="e.g. Completed ground installation of automated pressure valves and sensors. Problem resolved."
 />
 </div>
 </div>

 <div className="mt-8 flex gap-3">
 <button
 onClick={() => setActionModalType(null)}
 className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-xs transition"
 >
 Cancel
 </button>
 <button
 onClick={handleMarkCompleted}
 disabled={submittingAction}
 className={`flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 text-foreground`}
 >
 {submittingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
 <span>Certify Problem as Solved</span>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* MODAL 3: FULL DETAILS */}
 {actionModalType === "details" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className={`border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-md animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <div className="flex items-center justify-between pb-4 border-b border-slate-800">
 <h3 className={`text-xl font-black text-foreground`}>{selectedPost.title}</h3>
 <button onClick={() => setActionModalType(null)} className={`text-slate-600 dark:text-slate-400 hover: text-sm text-foreground`}>✕</button>
 </div>

 <div className="my-6 space-y-4">
 <div className={`flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400`}>
 <span>Citizen: <strong className="text-slate-800 dark:text-slate-200">{selectedPost.user?.name || "Citizen"}</strong></span>
 <span>•</span>
 <span>Location: <strong className="text-slate-800 dark:text-slate-200">{selectedPost.location || "N/A"}</strong></span>
 <span>•</span>
 <span>Sector: <strong className="text-teal-600 dark:text-teal-400">{selectedPost.category}</strong></span>
 </div>

 <div className={`p-4 rounded-2xl border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className={`text-xs font-bold uppercase tracking-wider mb-1 text-slate-600 dark:text-slate-400`}>Citizen Problem Statement</p>
 <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{selectedPost.description}</p>
 </div>

 {selectedPost.imageUrl && (
 <img
 src={selectedPost.imageUrl.startsWith("data:") ? selectedPost.imageUrl : `${API}${selectedPost.imageUrl}`}
 alt={selectedPost.title}
 className="w-full max-h-72 object-cover rounded-2xl border border-slate-800"
 />
 )}

 <div className="p-4 bg-teal-950/30 rounded-2xl border border-teal-500/30">
 <p className={`text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider mb-1`}>Administrative Status Log</p>
 <p className={`text-sm font-semibold text-foreground`}>{selectedPost.statusMessage || selectedPost.status}</p>
 </div>
 </div>

 <button
 onClick={() => setActionModalType(null)}
 className={`w-full py-3 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl text-xs transition text-foreground`}
 >
 Close Details
 </button>
 </div>
 </div>
 )}

 {/* Profile Modal */}
 {showProfile && (
 <ProfileModal
 isOpen={showProfile}
 onClose={() => setShowProfile(false)}
 role="GOVERNMENT"
 currentUser={govtUser}
 onUpdateUser={(updated) => {
 setGovtUser(updated);
 if (updated.officerName) setOfficerName(updated.officerName);
 if (updated.department) setDepartment(updated.department);
 }}
 />
 )}

 </div>
 );
}
