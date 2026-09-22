"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
 Building2,
 Handshake,
 DollarSign,
 TrendingUp,
 Search,
 CheckCircle2,
 AlertCircle,
 Loader2,
 Sparkles,
 Zap,
 MapPin,
 ChevronRight,
 Factory,
 GraduationCap,
 ArrowRight,
 Check,
 Clock,
 Briefcase,
 Lock,
 MessageSquare,
 Send,
 User,
 ShieldCheck,
 FileCheck,
 XCircle,
 LogOut,
 AlertTriangle,
 Bot,
 UserCheck
} from "lucide-react";
import ProfileModal from "@/components/ProfileModal";
import ApprovalMemoCard from "@/components/ApprovalMemoCard";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const PRESET_COMPANIES = [
 { name: "Tata Power Solar Systems", sector: "Clean Energy & Microgrids", cin: "L28920MH1919PLC000567", grantRange: "₹20L – ₹50L", facilities: "Solar PV Test Bed & Microgrid Lab", mentorLead: "Dr. Alok Verma (VP - Renewable Eng)" },
 { name: "Larsen & Toubro Water Infra", sector: "Engineering & Water Tech", cin: "L99999MH1946PLC004768", grantRange: "₹20L – ₹40L", facilities: "Civil Pipe Fabrication & Leak Telemetry", mentorLead: "Er. Rajesh Singhal (Chief Project Director)" },
 { name: "Reliance Foundation CSR", sector: "Corporate Social Responsibility", cin: "L17110MH1973PLC019786", grantRange: "₹25L – ₹75L", facilities: "IoT Prototyping & High Capacity Compute", mentorLead: "J. Jagannathan (Head of CSR Strategy)" },
 { name: "Adani Green Energy Ltd", sector: "Renewable Utilities", cin: "L40106GJ2015PLC082007", grantRange: "₹25L – ₹60L", facilities: "Grid Synchronization & High Capacity Inverters", mentorLead: "Prashant Sen (Director - Clean Energy)" },
 { name: "ITC Agribusiness CSR Fund", sector: "AgriTech & Food Supply", cin: "L16005WB1910PLC001985", grantRange: "₹15L – ₹35L", facilities: "e-Choupal Rural Network & Soil Sensors", mentorLead: "S. Sivakumar (Group Head - Agri)" },
 { name: "Thermax Environmental Solutions", sector: "Water & Waste Management", cin: "L29299PN1980PLC022787", grantRange: "₹12L – ₹25L", facilities: "Membrane Filtration & Waste Recycling", mentorLead: "Ananya Deshmukh (Head of Sustainability)" },
 { name: "Schneider Electric India CSR", sector: "Smart Power Distribution", cin: "U31900DL1995PTC063991", grantRange: "₹18L – ₹40L", facilities: "Automated Switchgear & Power Telemetry", mentorLead: "Marc Dupont (Global Access to Energy)" },
 { name: "Mahindra Rise Innovation CSR", sector: "Mobility & Social Tech", cin: "L65990MH1945PLC004558", grantRange: "₹15L – ₹40L", facilities: "Fabrication & Low Cost Mechanical Hardware", mentorLead: "Sheetal Mehta (Senior VP - CSR)" },
 { name: "Bosch India Smart Infrastructure", sector: "Sensors & Smart Mobility", cin: "L85110KA1951PLC000761", grantRange: "₹18L – ₹45L", facilities: "Micro-Sensors & Automated Assembly", mentorLead: "Soumitra Bhattacharya (MD & CSR Head)" },
 { name: "VA Tech Wabag Ltd", sector: "Water & Wastewater Tech", cin: "L45205TN1995PLC030231", grantRange: "₹15L – ₹28L", facilities: "Municipal Desalination & Sewage Purification", mentorLead: "S. Kalyanaraman (Tech Director)" },
];

export default function IndustryPortal() {
 const router = useRouter();
 const { theme } = useTheme();
 const [authChecking, setAuthChecking] = useState(true);
 const [posts, setPosts] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState<"opportunities" | "active" | "impact">("opportunities");
 const [searchQuery, setSearchQuery] = useState("");
 const [showProfile, setShowProfile] = useState(false);

 // Corporate Profile Session
 const [currentCompany, setCurrentCompany] = useState(PRESET_COMPANIES[0].name);
 const [currentSector, setCurrentSector] = useState(PRESET_COMPANIES[0].sector);
 const [industryUser, setIndustryUser] = useState<any | null>(null);

 // Selected post for Modals
 const [selectedPost, setSelectedPost] = useState<any | null>(null);
 const [actionModalType, setActionModalType] = useState<"sponsor" | "reject" | "chat" | "details" | "lockWarning" | null>(null);

 // Form states for sponsoring
 const [sponsorType, setSponsorType] = useState("CSR Grant & Pilot Manufacturing");
 const [grantAmount, setGrantAmount] = useState("₹15,00,000");
 const [mentorLead, setMentorLead] = useState("Director of CSR & Engineering");
 const [sponsorshipNotes, setSponsorshipNotes] = useState("");
 
 // Form state for decline / reject (Task 2)
 const [declineReason, setDeclineReason] = useState("Budget allocated to other CSR focus verticals");
 const [submittingAction, setSubmittingAction] = useState(false);
 const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

 // Chat / Messaging states (Task 5)
 const [chatMessages, setChatMessages] = useState<any[]>([]);
 const [chatInput, setChatInput] = useState("");
 const [chatLoading, setChatLoading] = useState(false);
 const [senderRole, setSenderRole] = useState<"INDUSTRY" | "COLLEGE">("INDUSTRY");

 // Mandatory Authentication Gate: Industry must login first
 useEffect(() => {
 try {
 const stored = localStorage.getItem("industry_user");
 if (!stored) {
 router.replace("/industry/login");
 return;
 }
 const u = JSON.parse(stored);
 if (!u || u.role !== "INDUSTRY") {
 router.replace("/industry/login");
 return;
 }
 setIndustryUser(u);
 if (u.companyName) setCurrentCompany(u.companyName);
 if (u.sector) setCurrentSector(u.sector);
 setAuthChecking(false);
 } catch {
 router.replace("/industry/login");
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
 console.error("Failed to load industry challenges:", e);
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

 // Open Chat Drawer
 const openChat = async (post: any) => {
 setSelectedPost(post);
 setActionModalType("chat");
 setChatLoading(true);
 try {
 const res = await fetch(`${API}/api/posts/${post.id}/collaboration-messages`);
 const data = await res.json();
 if (res.ok) {
 setChatMessages(data.messages || []);
 }
 } catch (e) {
 console.error("Failed to load messages:", e);
 } finally {
 setChatLoading(false);
 }
 };

 // Send Chat Message
 const handleSendMessage = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!chatInput.trim() || !selectedPost) return;
 const textToSend = chatInput.trim();
 setChatInput("");

 const sName = senderRole === "INDUSTRY"
 ? `${currentCompany} Rep`
 : `${selectedPost.acceptedCollegeName || "University Lab Lead"}`;

 try {
 const res = await fetch(`${API}/api/posts/${selectedPost.id}/collaboration-messages`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 senderRole,
 senderName: sName,
 text: textToSend,
 }),
 });
 const data = await res.json();
 if (res.ok && data.message) {
 setChatMessages((prev) => [...prev, data.message]);
 }
 } catch (e) {
 showToast("error", "Failed to send message.");
 }
 };

 // Task 4 & 5: Handle First-Come First-Served Industry Acceptance
 const handleSponsorChallenge = async () => {
 if (!selectedPost) return;
 setSubmittingAction(true);
 try {
 const token = localStorage.getItem("industry_token");
 const res = await fetch(`${API}/api/posts/${selectedPost.id}/industry/accept`, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 ...(token ? { Authorization: `Bearer ${token}` } : {})
 },
 body: JSON.stringify({
 companyName: currentCompany,
 sponsorType,
 grantAmount,
 mentorLead,
 notes: sponsorshipNotes,
 }),
 });
 const data = await res.json();

 if (res.status === 409) {
 setActionModalType(null);
 showToast("error", data.error || "This challenge was already adopted by another industry!");
 fetchChallenges();
 return;
 }

 if (!res.ok) {
 throw new Error(data.error || "Failed to sponsor challenge.");
 }

 showToast("success", `🤝 Project successfully locked & sponsored by ${currentCompany}!`);
 setActionModalType(null);
 fetchChallenges();
 } catch (err: any) {
 showToast("error", err.message || "Failed to commit sponsorship.");
 } finally {
 setSubmittingAction(false);
 }
 };

 // Task 2: Handle Decline / Reject Collaboration
 const handleDeclineChallenge = async () => {
 if (!selectedPost) return;
 setSubmittingAction(true);
 try {
 const token = localStorage.getItem("industry_token");
 const res = await fetch(`${API}/api/posts/${selectedPost.id}/industry/reject`, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 ...(token ? { Authorization: `Bearer ${token}` } : {})
 },
 body: JSON.stringify({
 companyName: currentCompany,
 reason: declineReason,
 }),
 });
 if (!res.ok) throw new Error("Failed to decline collaboration.");

 showToast("success", `Collaboration declined by ${currentCompany}.`);
 setActionModalType(null);
 fetchChallenges();
 } catch (err: any) {
 showToast("error", err.message || "Failed to decline.");
 } finally {
 setSubmittingAction(false);
 }
 };

 const handleSwitchCompany = (e: React.ChangeEvent<HTMLSelectElement>) => {
 const found = PRESET_COMPANIES.find((c) => c.name === e.target.value);
 if (found) {
 setCurrentCompany(found.name);
 setCurrentSector(found.sector);
 showToast("success", `Switched active corporate entity to: ${found.name}`);
 }
 };

 const handleLogout = () => {
 localStorage.removeItem("industry_user");
 localStorage.removeItem("industry_token");
 setIndustryUser(null);
 router.replace("/industry/login");
 };

 // Multi-Tenant Isolation: Check if post is sponsored by THIS logged-in industry
 const isSponsoredByMyCompany = (p: any) => {
 const myCo = (currentCompany || industryUser?.companyName || "").toLowerCase().trim();
 if (!myCo) return false;

 // Direct match on acceptedIndustryName
 if (p.acceptedIndustryName && p.acceptedIndustryName.toLowerCase().includes(myCo)) return true;

 // Match in isolated industrySponsorships table
 if (p.industrySponsorships && Array.isArray(p.industrySponsorships)) {
 const match = p.industrySponsorships.some((s: any) => 
 (industryUser?.id && s.industryId === industryUser.id) ||
 (s.companyName && s.companyName.toLowerCase().includes(myCo))
 );
 if (match) return true;
 }
 return false;
 };

 // Filter posts with strict multi-tenant isolation
 const filteredPosts = posts.filter((p) => {
 if (activeTab === "opportunities") {
 if (["UNIVERSITY_ACCEPTED", "PROTOTYPING", "TESTING", "INDUSTRY_MATCHING"].indexOf(p.status) === -1) return false;
 // If another company has already adopted this, hide it from other companies' opportunities
 if (p.acceptedIndustryName && !isSponsoredByMyCompany(p)) return false;
 } else if (activeTab === "active") {
 if (["INDUSTRY_ACCEPTED", "GOVT_REVIEW", "GOVT_APPROVED", "IMPLEMENTATION"].indexOf(p.status) === -1) return false;
 // Strict Isolation: Only show if sponsored by THIS company
 if (!isSponsoredByMyCompany(p)) return false;
 } else if (activeTab === "impact") {
 if (p.status !== "COMPLETED") return false;
 // Strict Isolation: Only show if completed with THIS company's sponsorship
 if (!isSponsoredByMyCompany(p)) return false;
 }

 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 const match = (p.title?.toLowerCase() || "").includes(q) || (p.description?.toLowerCase() || "").includes(q) || (p.category?.toLowerCase() || "").includes(q) || (p.location?.toLowerCase() || "").includes(q);
 if (!match) return false;
 }

 return true;
 });

 const oppsCount = posts.filter((p) => {
 if (!["UNIVERSITY_ACCEPTED", "PROTOTYPING", "TESTING", "INDUSTRY_MATCHING"].includes(p.status)) return false;
 if (p.acceptedIndustryName && !isSponsoredByMyCompany(p)) return false;
 return true;
 }).length;

 const activeCount = posts.filter((p) => {
 if (!["INDUSTRY_ACCEPTED", "GOVT_REVIEW", "GOVT_APPROVED", "IMPLEMENTATION"].includes(p.status)) return false;
 return isSponsoredByMyCompany(p);
 }).length;

 const impactCount = posts.filter((p) => {
 if (p.status !== "COMPLETED") return false;
 return isSponsoredByMyCompany(p);
 }).length;

 if (authChecking) {
 return (
 <div className={`min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground`}>
 <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
 <p className={`text-sm font-semibold text-zinc-600 dark:text-zinc-400`}>
 Verifying Corporate Partner Session...
 </p>
 </div>
 );
 }

 return (
 <div className={`min-h-screen font-sans selection:bg-pink-500 selection:text-zinc-900 dark:text-white transition-colors duration-200 bg-background text-foreground`}>
 
 {/* Toast Notification */}
 {notification && (
 <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-md border text-sm font-semibold flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
 notification.type === "success"
 ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
 : "bg-rose-950/90 border-rose-500/50 text-rose-200"
 }`}>
 {notification.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <AlertCircle className="h-5 w-5 text-rose-400" />}
 <span>{notification.text}</span>
 </div>
 )}

 {/* Top Header */}
 <header className={`border-b sticky top-0 z-40 transition-colors border-zinc-200 bg-white text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/75 dark:text-white`}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
 
 <div className="flex items-center gap-3">
 <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
 <Factory className="h-6 w-6 text-zinc-900 dark:text-white" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-black text-xl tracking-tight bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
 Industry &amp; CSR Innovation Hub
 </span>
 <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
 Corporate Portal
 </span>
 <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden md:inline-flex items-center gap-1">
 🛡️ Isolated Workspace
 </span>
 </div>
 <p className={`text-xs text-zinc-500 dark:text-zinc-400`}>
 10-Industry AI Dispatch &amp; Locking Mechanism (Private CSR Pool)
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <ThemeToggle />

 {/* Dedicated Industry User Profile & Logout */}
 <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs shadow-inner bg-white border-zinc-300 text-zinc-900 dark:bg-zinc-900/75 dark:border-zinc-800 dark:text-white`}>
 <div className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
 <span className="font-bold max-w-[150px]">{industryUser?.companyName || currentCompany}</span>
 <button
 onClick={() => setShowProfile(true)}
 className={`flex items-center gap-1 text-pink-500 hover:text-pink-400 ml-2 pl-2 border-l transition-colors border-zinc-200 dark:border-zinc-800`}
 title="Edit Corporate Profile"
 >
 <UserCheck className="h-3.5 w-3.5" />
 <span className="hidden sm:inline text-[11px] font-semibold">Profile</span>
 </button>
 
 </div>

 </div>

 </div>
 </header>

 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

 {/* Corporate Active Bar */}
 <div className="mb-8 p-4 bg-white dark:bg-zinc-900/75 rounded-2xl border border-pink-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
 <div className="flex items-center gap-3">
 <div className="h-9 w-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold">
 <Building2 className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-zinc-600 dark:text-zinc-400">Active Corporate Session:</p>
 <p className="text-sm font-black text-zinc-900 dark:text-white">{currentCompany} <span className="text-xs font-normal text-pink-400 font-mono">({currentSector})</span></p>
 </div>
 </div>

 <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
 <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
 <Sparkles className="h-3 w-3" /> Multi-Dispatch Queue Active
 </span>
 </div>
 </div>

 {/* Hero Banner */}
 <div className="relative overflow-hidden rounded-3xl bg-card text-card-foreground border-border p-8 sm:p-10 mb-10 shadow-md">
 <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
 <div className="relative z-10 max-w-3xl">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold border border-pink-500/30 mb-4">
 <Bot className="h-3.5 w-3.5 text-pink-400" />
 <span>Multi-Industry AI Dispatch &amp; First-Come Lock Workflow</span>
 </div>
 <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
 10 Industry Candidates AI-Matched Per University Project
 </h1>
 <p className="mt-3 text-zinc-900 dark:text-zinc-100 text-base leading-relaxed">
 When a university takes on a citizen problem, the AI Engine selects the <strong>Top 10 matched industries</strong> and invites them simultaneously. The <strong>first industry to accept</strong> exclusively locks the project, while others receive automated lock notifications.
 </p>
 </div>

 {/* Quick Metrics */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-zinc-800">
 <div className="bg-white dark:bg-zinc-900/75 rounded-2xl p-4 border border-zinc-800">
 <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Invited R&amp;D Opportunities</p>
 <p className="text-2xl font-black text-pink-400 mt-1">{oppsCount}</p>
 </div>
 <div className="bg-white dark:bg-zinc-900/75 rounded-2xl p-4 border border-zinc-800">
 <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Active Corporate Partnerships</p>
 <p className="text-2xl font-black text-purple-400 mt-1">{activeCount}</p>
 </div>
 <div className="bg-white dark:bg-zinc-900/75 rounded-2xl p-4 border border-zinc-800">
 <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">AI Match Accuracy</p>
 <p className="text-2xl font-black text-amber-400 mt-1">97.8%</p>
 </div>
 <div className="bg-white dark:bg-zinc-900/75 rounded-2xl p-4 border border-zinc-800">
 <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Deployed Ground Solutions</p>
 <p className="text-2xl font-black text-emerald-400 mt-1">{impactCount}</p>
 </div>
 </div>
 </div>

 {/* Tab & Search Bar */}
 <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 pb-4 border-b border-zinc-800">
 <div className="flex bg-white dark:bg-zinc-900/75 p-1.5 rounded-2xl border border-zinc-800 w-full sm:w-auto overflow-x-auto">
 <button
 onClick={() => setActiveTab("opportunities")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
 activeTab === "opportunities"
 ? "bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-zinc-900 dark:text-white shadow-lg shadow-pink-500/25"
 : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white"
 }`}
 >
 <Sparkles className="h-4 w-4" />
 <span>AI Matched Queue ({oppsCount})</span>
 </button>

 <button
 onClick={() => setActiveTab("active")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
 activeTab === "active"
 ? "bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-zinc-900 dark:text-white shadow-lg shadow-pink-500/25"
 : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white"
 }`}
 >
 <Handshake className="h-4 w-4" />
 <span>Locked &amp; Active Pilots ({activeCount})</span>
 </button>

 <button
 onClick={() => setActiveTab("impact")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
 activeTab === "impact"
 ? "bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-zinc-900 dark:text-white shadow-lg shadow-pink-500/25"
 : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white"
 }`}
 >
 <ShieldCheck className="h-4 w-4" />
 <span>Verified ESG Solutions ({impactCount})</span>
 </button>
 </div>

 <div className="relative w-full sm:w-72">
 <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-600 dark:text-zinc-400" />
 <input
 type="text"
 placeholder="Search challenges..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition"
 />
 </div>
 </div>

 {/* Challenge Cards Grid */}
 {loading ? (
 <div className="py-24 text-center">
 <Loader2 className="h-10 w-10 animate-spin text-pink-500 mx-auto mb-4" />
 <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading AI matched industry proposals...</p>
 </div>
 ) : filteredPosts.length === 0 ? (
 <div className="py-24 text-center bg-white dark:bg-zinc-900/75 rounded-3xl border border-zinc-800 p-8">
 <CheckCircle2 className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
 <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No challenges in this section</h3>
 <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mt-1">
 Check back soon as university labs accept new citizen challenges.
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {filteredPosts.map((post) => {
 const isLockedByOther = post.acceptedIndustryName && post.acceptedIndustryName !== currentCompany;
 const isAdoptedByCurrent = post.acceptedIndustryName === currentCompany;
 const topMatches = post.industryMatches || [];

 return (
 <div
 key={post.id}
 className={`rounded-3xl border transition shadow-md flex flex-col justify-between overflow-hidden ${
 isAdoptedByCurrent
 ? "bg-white dark:bg-zinc-900/75 border-pink-500/50 shadow-pink-500/10"
 : isLockedByOther
 ? "bg-white dark:bg-zinc-900/75/90 border-zinc-800 opacity-80"
 : "bg-white dark:bg-zinc-900/75 border-zinc-800 hover:border-zinc-700"
 }`}
 >
 <div className="p-6 sm:p-7">
 
 {/* Header Status & Lock Status */}
 <div className="flex items-center justify-between gap-2 mb-4">
 {isAdoptedByCurrent ? (
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-pink-500/20 text-pink-400 border border-pink-500/40">
 <CheckCircle2 className="h-3.5 w-3.5" />
 <span>Locked by Your Company ({currentCompany})</span>
 </span>
 ) : isLockedByOther ? (
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/40 text-amber-400 border border-amber-500/30">
 <Lock className="h-3.5 w-3.5" />
 <span>Locked by {post.acceptedIndustryName}</span>
 </span>
 ) : (
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
 <Sparkles className="h-3.5 w-3.5 text-pink-400" />
 <span>10 Industries Invited · Open First-Come</span>
 </span>
 )}

 <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
 {post.category || "General"}
 </span>
 </div>

 <h3 className="text-xl font-black text-zinc-900 dark:text-white leading-snug">
 {post.title}
 </h3>

 <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 mt-2 mb-4">
 {post.location && (
 <div className="flex items-center gap-1">
 <MapPin className="h-3 w-3 text-zinc-500" />
 <span>{post.location}</span>
 </div>
 )}
 <span>•</span>
 <span>University: <strong className="text-indigo-400">{post.acceptedCollegeName || "Academic R&D Lab"}</strong></span>
 </div>

 <p className="text-xs text-zinc-900 dark:text-zinc-100 leading-relaxed mb-5">
 {post.description}
 </p>

 {/* Problem-Specific Official Approval & CSR Mandate Card */}
 <div className="mb-5">
 <ApprovalMemoCard
 post={post}
 variant="industry"
 title="Problem-Specific Approval & CSR Mandate"
 />
 </div>

 {/* TASK 5: AI LOCK NOTIFICATION IF ADOPTED BY ANOTHER */}
 {isLockedByOther && (
 <div className="mb-5 p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-2xl flex items-start gap-3">
 <Lock className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
 <div>
 <p className="text-xs font-bold text-amber-300">
 🔒 AI Notice: Opportunity Already Adopted
 </p>
 <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-normal">
 This project was adopted by <strong>{post.acceptedIndustryName}</strong>. Collaboration opportunity is now closed.
 </p>
 </div>
 </div>
 )}

 </div>

 {/* Actions & Chat Footer with Reject Button (Task 2) */}
 <div className="p-6 pt-4 border-t border-zinc-800 bg-white dark:bg-zinc-900/75 flex flex-wrap items-center gap-3">
 
 {!post.acceptedIndustryName ? (
 <>
 <button
 onClick={() => {
 setSelectedPost(post);
 setActionModalType("sponsor");
 }}
 className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-zinc-900 dark:text-white rounded-xl text-xs font-bold hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
 >
 <Handshake className="h-4 w-4" />
 <span>Accept &amp; Lock Project</span>
 </button>

 {/* Task 2: DECLINE / REJECT BUTTON */}
 <button
 onClick={() => {
 setSelectedPost(post);
 setActionModalType("reject");
 }}
 className="py-3 px-4 bg-zinc-100 hover:bg-rose-100 dark:bg-zinc-800 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-300 hover:border-rose-500/30 border border-zinc-200 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
 title="Decline this collaboration opportunity"
 >
 <XCircle className="h-4 w-4 text-rose-400" />
 <span>Decline</span>
 </button>
 </>
 ) : isAdoptedByCurrent ? (
 <div className="flex-1 py-2.5 px-3 bg-pink-950/40 border border-pink-500/30 rounded-xl text-xs font-bold text-pink-300 text-center">
 ✓ Sponsored &amp; Locked by {currentCompany}
 </div>
 ) : (
 <button
 onClick={() => {
 setSelectedPost(post);
 setActionModalType("lockWarning");
 }}
 className="flex-1 py-2.5 px-3 bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 flex items-center justify-center gap-2 cursor-not-allowed"
 >
 <Lock className="h-3.5 w-3.5" />
 <span>Locked (Already Adopted by {post.acceptedIndustryName})</span>
 </button>
 )}

 {/* Task 5: Live Chat Channel with College */}
 <button
 onClick={() => openChat(post)}
 className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
 post.acceptedIndustryName
 ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
 : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
 }`}
 >
 <MessageSquare className="h-4 w-4" />
 <span>{post.acceptedIndustryName ? "Live Collaboration Chat" : "Discussion"}</span>
 </button>
 </div>

 </div>
 );
 })}
 </div>
 )}

 </main>

 {/* MODAL 1: ACCEPT & LOCK SPONSORSHIP */}
 {actionModalType === "sponsor" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className="bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-md animate-in zoom-in-95 duration-200">
 <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
 <div className="flex items-center gap-2">
 <Building2 className="h-6 w-6 text-pink-400" />
 <h3 className="text-lg font-black text-zinc-900 dark:text-white">Accept &amp; Lock Challenge</h3>
 </div>
 <button onClick={() => setActionModalType(null)} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white text-sm">✕</button>
 </div>

 <div className="my-5 p-4 bg-white dark:bg-zinc-900/75 rounded-2xl border border-zinc-800">
 <p className="text-[11px] text-pink-400 font-bold uppercase tracking-wider">First-Come First-Served Adoption</p>
 <h4 className="font-bold text-zinc-900 dark:text-white text-sm mt-1">{selectedPost.title}</h4>
 <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 ">{selectedPost.description}</p>
 </div>

 <div className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Adopting Corporate Entity
 </label>
 <input
 type="text"
 value={currentCompany}
 onChange={(e) => setCurrentCompany(e.target.value)}
 className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-pink-500"
 />
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Sponsorship Type
 </label>
 <select
 value={sponsorType}
 onChange={(e) => setSponsorType(e.target.value)}
 className="w-full px-3 py-2.5 bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-pink-500"
 >
 <option>CSR Grant &amp; Funding</option>
 <option>Pilot Manufacturing Facility</option>
 <option>Hardware Component Supply</option>
 <option>Engineering Mentorship</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Pledged Grant / Budget
 </label>
 <input
 type="text"
 value={grantAmount}
 onChange={(e) => setGrantAmount(e.target.value)}
 className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-pink-500"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Corporate Lead / Mentor
 </label>
 <input
 type="text"
 value={mentorLead}
 onChange={(e) => setMentorLead(e.target.value)}
 className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-pink-500"
 />
 </div>
 </div>

 <div className="mt-8 flex gap-3">
 <button
 onClick={() => setActionModalType(null)}
 className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-xs transition"
 >
 Cancel
 </button>
 <button
 onClick={handleSponsorChallenge}
 disabled={submittingAction}
 className="flex-1 py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-zinc-900 dark:text-white font-bold rounded-xl text-xs hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25"
 >
 {submittingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
 <span>Confirm &amp; Lock Project</span>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Task 2: MODAL 2 — DECLINE / REJECT OPPORTUNITY */}
 {actionModalType === "reject" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className="bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-center shadow-md animate-in zoom-in-95 duration-200">
 <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
 <XCircle className="h-6 w-6" />
 </div>
 <h3 className="text-lg font-black text-zinc-900 dark:text-white">Decline Collaboration Opportunity</h3>
 <p className="text-xs text-zinc-900 dark:text-zinc-100 mt-1 leading-relaxed ">
 "{selectedPost.title}"
 </p>

 <div className="my-5 text-left">
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Reason for Declining
 </label>
 <select
 value={declineReason}
 onChange={(e) => setDeclineReason(e.target.value)}
 className="w-full px-3 py-2.5 bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-rose-500"
 >
 <option>Budget allocated to other CSR focus verticals</option>
 <option>Manufacturing lines currently operating at maximum capacity</option>
 <option>Geographic location outside current operational reach</option>
 <option>Component supply chain currently constrained</option>
 </select>
 </div>

 <div className="flex gap-3">
 <button
 onClick={() => setActionModalType(null)}
 className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-xs transition"
 >
 Cancel
 </button>
 <button
 onClick={handleDeclineChallenge}
 disabled={submittingAction}
 className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
 >
 {submittingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
 <span>Confirm Decline</span>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* TASK 5: CHAT / MESSENGER BETWEEN COLLEGE & INDUSTRY */}
 {actionModalType === "chat" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className="bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-3xl max-w-2xl w-full h-[85vh] flex flex-col shadow-md animate-in zoom-in-95 duration-200 overflow-hidden">
 
 <div className="p-5 border-b border-zinc-800 bg-white dark:bg-zinc-900/75/70 flex items-center justify-between">
 <div>
 <div className="flex items-center gap-2">
 <MessageSquare className="h-5 w-5 text-pink-400" />
 <h3 className="font-black text-zinc-900 dark:text-white text-base">College &amp; Industry Collaboration Channel</h3>
 </div>
 <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 max-w-md">
 Project: <strong className="text-zinc-900 dark:text-white">{selectedPost.title}</strong>
 </p>
 </div>

 <div className="flex items-center gap-3">
 <button onClick={() => setActionModalType(null)} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white text-sm">✕</button>
 </div>
 </div>

 <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-white dark:bg-zinc-900/75/40">
 {chatLoading ? (
 <div className="py-20 text-center">
 <Loader2 className="h-8 w-8 animate-spin text-pink-500 mx-auto mb-2" />
 <p className="text-xs text-zinc-600 dark:text-zinc-400">Loading conversation history...</p>
 </div>
 ) : chatMessages.length === 0 ? (
 <div className="py-20 text-center text-zinc-500">
 <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
 <p className="text-xs">No messages yet. Send the first message to start collaborating!</p>
 </div>
 ) : (
 chatMessages.map((msg, i) => {
 const isAi = msg.senderRole === "AI";
 const isInd = msg.senderRole === "INDUSTRY";
 const isCol = msg.senderRole === "COLLEGE";

 if (isAi) {
 return (
 <div key={i} className="p-3.5 bg-purple-100 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 rounded-2xl text-xs text-purple-900 dark:text-purple-200">
 <div className="flex items-center gap-1.5 font-bold text-pink-600 dark:text-pink-400 mb-1">
 <Bot className="h-3.5 w-3.5" />
 <span>{msg.senderName}</span>
 </div>
 <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
 </div>
 );
 }

 return (
 <div
 key={i}
 className={`flex flex-col ${isInd ? "items-end" : "items-start"}`}
 >
 <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 mb-1 px-1">
 {isInd ? `🏭 ${msg.senderName}` : `🎓 ${msg.senderName}`}
 </span>
 <div
 className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
 isInd
 ? "bg-pink-600 text-white rounded-tr-none shadow-md shadow-pink-600/20"
 : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-300 dark:border-zinc-700"
 }`}
 >
 {msg.text}
 </div>
 </div>
 );
 })
 )}
 </div>

 <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-white dark:bg-zinc-900/75 flex items-center gap-2">
 <input
 type="text"
 value={chatInput}
 onChange={(e) => setChatInput(e.target.value)}
 placeholder={`Type a message as ${senderRole === "INDUSTRY" ? currentCompany : "University Research Lead"}...`}
 className="flex-1 bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-2xl px-4 py-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition"
 />
 <button
 type="submit"
 disabled={!chatInput.trim()}
 className="p-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-zinc-900 dark:text-white rounded-2xl transition disabled:opacity-40"
 >
 <Send className="h-4 w-4" />
 </button>
 </form>

 </div>
 </div>
 )}

 {/* MODAL 4: LOCKED WARNING (TASK 5) */}
 {actionModalType === "lockWarning" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className="bg-white dark:bg-zinc-900/75 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-center shadow-md animate-in zoom-in-95 duration-200">
 <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
 <Lock className="h-6 w-6" />
 </div>
 <h3 className="text-lg font-black text-zinc-900 dark:text-white">Collaboration Opportunity Closed</h3>
 <p className="text-xs text-zinc-900 dark:text-zinc-100 mt-2 leading-relaxed">
 This challenge has already been adopted by <strong className="text-zinc-900 dark:text-white">{selectedPost.acceptedIndustryName}</strong>. Under the AI first-come locking policy, exclusive sponsorship is already assigned.
 </p>
 <button
 onClick={() => setActionModalType(null)}
 className="mt-6 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl text-xs transition"
 >
 Understood
 </button>
 </div>
 </div>
 )}

 {/* Profile Modal */}
 {showProfile && (
 <ProfileModal
 isOpen={showProfile}
 onClose={() => setShowProfile(false)}
 role="INDUSTRY"
 currentUser={industryUser}
 onUpdateUser={(updated) => {
 setIndustryUser(updated);
 if (updated.companyName) setCurrentCompany(updated.companyName);
 if (updated.sector) setCurrentSector(updated.sector);
 }}
 />
 )}

 </div>
 );
}
