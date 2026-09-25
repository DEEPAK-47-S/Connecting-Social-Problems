"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
 GraduationCap,
 Sparkles,
 Search,
 CheckCircle2,
 Clock,
 ArrowRight,
 Layers,
 Building2,
 Award,
 ChevronRight,
 Send,
 AlertCircle,
 Loader2,
 MapPin,
 Check,
 Zap,
 BookOpen,
 MessageSquare,
 Bot,
 Lock,
 XCircle,
 FileCheck,
 User,
 ShieldAlert,
 LogOut,
 Target,
 UserCheck
} from "lucide-react";
import { TAMIL_NADU_COLLEGES, TamilNaduCollege } from "@/data/tamilNaduColleges";
import ProfileModal from "@/components/ProfileModal";
import ApprovalMemoCard from "@/components/ApprovalMemoCard";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const PIPELINE_STAGES = [
 { key: "UNIVERSITY_MATCHING", label: "Open for Intake", icon: Sparkles, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
 { key: "UNIVERSITY_ACCEPTED", label: "Research Initiated", icon: BookOpen, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
 { key: "PROTOTYPING", label: "Lab Prototyping", icon: Layers, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
 { key: "TESTING", label: "Field Testing", icon: Zap, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
 { key: "INDUSTRY_MATCHING", label: "Industry Collaboration", icon: Building2, color: "text-pink-500 bg-pink-500/10 border-pink-500/20" },
 { key: "COMPLETED", label: "Solved & Deployed", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
];

export default function CollegePortal() {
 const router = useRouter();
 const { theme } = useTheme();
 const [authChecking, setAuthChecking] = useState(true);
 const [posts, setPosts] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState<"intake" | "active" | "completed">("intake");
 const [searchQuery, setSearchQuery] = useState("");
 const [showProfile, setShowProfile] = useState(false);
 
 // College Session User & Tamil Nadu Profile
 const [collegeUser, setCollegeUser] = useState<any | null>(null);
 const [activeCollege, setActiveCollege] = useState<TamilNaduCollege>(TAMIL_NADU_COLLEGES[0]);
 const [activeSkills, setActiveSkills] = useState<string[]>(TAMIL_NADU_COLLEGES[0].skills);

 // Selected post for modal action
 const [selectedPost, setSelectedPost] = useState<any | null>(null);
 const [actionModalType, setActionModalType] = useState<"accept" | "reject" | "progress" | "chat" | "details" | null>(null);
 
 // Accept form inputs
 const [teamName, setTeamName] = useState("EcoEngineers Lab Team");
 const [facultyGuide, setFacultyGuide] = useState("Prof. Anand Kumar, Ph.D");
 
 // Reject form input (Task 2)
 const [rejectReason, setRejectReason] = useState("Outside Department Specialization & Scope");
 
 // Progress form inputs
 const [nextStage, setNextStage] = useState("PROTOTYPING");
 const [progressNotes, setProgressNotes] = useState("");
 const [submittingAction, setSubmittingAction] = useState(false);
 const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

 // Chat state (Task 5)
 const [chatMessages, setChatMessages] = useState<any[]>([]);
 const [chatInput, setChatInput] = useState("");
 const [chatLoading, setChatLoading] = useState(false);

 // Mandatory Authentication Gate: College / University must login first
 useEffect(() => {
 try {
 const stored = localStorage.getItem("college_user");
 if (!stored) {
 router.replace("/college/login");
 return;
 }
 const u = JSON.parse(stored);
 if (!u || u.role !== "UNIVERSITY") {
 router.replace("/college/login");
 return;
 }
 setCollegeUser(u);
 
 // Match active Tamil Nadu college profile
 const matched = TAMIL_NADU_COLLEGES.find((c) => c.name === u.collegeName);
 if (matched) {
 setActiveCollege(matched);
 setActiveSkills(matched.skills);
 } else if (u.skills && Array.isArray(u.skills)) {
 setActiveSkills(u.skills);
 }

 if (u.collegeName) setTeamName(`${u.collegeName} Research Team`);
 if (u.facultyName) setFacultyGuide(u.facultyName);
 setAuthChecking(false);
 } catch {
 router.replace("/college/login");
 }
 }, [router]);

 const handleSwitchCollege = (e: React.ChangeEvent<HTMLSelectElement>) => {
 const found = TAMIL_NADU_COLLEGES.find((c) => c.name === e.target.value);
 if (found) {
 setActiveCollege(found);
 setActiveSkills(found.skills);
 setTeamName(`${found.name} Research Team`);
 const updatedUser = {
 ...collegeUser,
 collegeName: found.name,
 dept: found.leadDept,
 skills: found.skills,
 };
 setCollegeUser(updatedUser);
 localStorage.setItem("college_user", JSON.stringify(updatedUser));
 showToast("success", `Switched active institution to: ${found.name}`);
 }
 };

 const fetchChallenges = useCallback(async () => {
 setLoading(true);
 try {
 const res = await fetch(`${API}/api/posts?limit=50`);
 const data = await res.json();
 if (res.ok) {
 setPosts(data.posts || []);
 }
 } catch (e) {
 console.error("Failed to fetch college challenges:", e);
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

 const handleLogout = () => {
 localStorage.removeItem("college_user");
 localStorage.removeItem("college_token");
 setCollegeUser(null);
 router.replace("/college/login");
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

 try {
 const res = await fetch(`${API}/api/posts/${selectedPost.id}/collaboration-messages`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 senderRole: "COLLEGE",
 senderName: `${teamName} (Lead Researcher)`,
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

 // Handle Accept Challenge
 const handleAcceptChallenge = async () => {
 if (!selectedPost) return;
 setSubmittingAction(true);
 try {
 const activeCollegeName = collegeUser?.collegeName || activeCollege.name;
 const fullCollegeIdentifier = `${activeCollegeName} — ${teamName}`;
 const token = localStorage.getItem("college_token");

 const res = await fetch(`${API}/api/posts/${selectedPost.id}/status`, {
 method: "PATCH",
 headers: {
 "Content-Type": "application/json",
 ...(token ? { Authorization: `Bearer ${token}` } : {})
 },
 body: JSON.stringify({
 status: "UNIVERSITY_ACCEPTED",
 collegeName: activeCollegeName,
 facultyGuide: facultyGuide,
 message: `Accepted by ${activeCollegeName} (${teamName}, Guide: ${facultyGuide}). 10 Industry candidates notified by AI.`,
 actor: fullCollegeIdentifier,
 }),
 });
 if (!res.ok) throw new Error("Failed to accept challenge.");
 
 showToast("success", `🎯 Challenge accepted! Locked exclusively to ${activeCollegeName}.`);
 setActionModalType(null);
 fetchChallenges();
 } catch (err: any) {
 showToast("error", err.message || "Failed to update challenge.");
 } finally {
 setSubmittingAction(false);
 }
 };

 // Task 2: Handle Reject Challenge
 const handleRejectChallenge = async () => {
 if (!selectedPost) return;
 setSubmittingAction(true);
 try {
 const activeCollegeName = collegeUser?.collegeName || activeCollege.name;
 const res = await fetch(`${API}/api/posts/${selectedPost.id}/college/reject`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 collegeName: activeCollegeName,
 reason: rejectReason,
 }),
 });
 if (!res.ok) throw new Error("Failed to decline challenge.");

 showToast("success", "❌ Challenge declined. Re-queued for other universities.");
 setActionModalType(null);
 fetchChallenges();
 } catch (err: any) {
 showToast("error", err.message || "Failed to decline challenge.");
 } finally {
 setSubmittingAction(false);
 }
 };

 // Handle Pipeline Progression
 const handleAdvancePipeline = async () => {
 if (!selectedPost) return;
 setSubmittingAction(true);
 try {
 const activeCollegeName = collegeUser?.collegeName || activeCollege.name;
 const token = localStorage.getItem("college_token");
 const res = await fetch(`${API}/api/posts/${selectedPost.id}/status`, {
 method: "PATCH",
 headers: {
 "Content-Type": "application/json",
 ...(token ? { Authorization: `Bearer ${token}` } : {})
 },
 body: JSON.stringify({
 status: nextStage,
 collegeName: activeCollegeName,
 message: progressNotes || `Advanced to ${nextStage} stage.`,
 actor: facultyGuide || activeCollegeName,
 beneficiaries: nextStage === "COMPLETED" ? "10,000+ Citizens impacted" : undefined,
 }),
 });
 if (!res.ok) throw new Error("Failed to advance pipeline.");

 showToast("success", `🚀 Project advanced to stage: ${nextStage}!`);
 setActionModalType(null);
 setProgressNotes("");
 fetchChallenges();
 } catch (err: any) {
 showToast("error", err.message || "Failed to advance stage.");
 } finally {
 setSubmittingAction(false);
 }
 };

 // Multi-Tenant Isolation: Check if a post belongs to THIS logged-in college
 const isOwnedByMyCollege = (p: any) => {
 const myCol = (collegeUser?.collegeName || activeCollege?.name || "").toLowerCase().trim();
 if (!myCol) return false;

 // Direct match on acceptedCollegeName
 if (p.acceptedCollegeName && p.acceptedCollegeName.toLowerCase().includes(myCol)) return true;

 // Match in isolated collegeProjects table
 if (p.collegeProjects && Array.isArray(p.collegeProjects)) {
 const match = p.collegeProjects.some((cp: any) => 
 (collegeUser?.id && cp.collegeId === collegeUser.id) ||
 (cp.collegeName && cp.collegeName.toLowerCase().includes(myCol))
 );
 if (match) return true;
 }
 return false;
 };

 // Filter posts with strict isolation
 const filteredPosts = posts.filter((p) => {
 if (activeTab === "intake") {
 if (p.status !== "UNIVERSITY_MATCHING" && p.status !== "SUBMITTED" && p.status !== "AI_ANALYZING") return false;
 // If another college has already adopted this problem, hide it from other colleges' intake!
 if (p.acceptedCollegeName && !isOwnedByMyCollege(p)) return false;
 } else if (activeTab === "active") {
 if (["UNIVERSITY_ACCEPTED", "PROTOTYPING", "TESTING", "INDUSTRY_MATCHING", "INDUSTRY_ACCEPTED", "GOVT_REVIEW", "GOVT_APPROVED", "IMPLEMENTATION"].indexOf(p.status) === -1) return false;
 // Strict Data Isolation: ONLY show if adopted by THIS college
 if (!isOwnedByMyCollege(p)) return false;
 } else if (activeTab === "completed") {
 if (p.status !== "COMPLETED") return false;
 // Strict Data Isolation: ONLY show if completed by THIS college
 if (!isOwnedByMyCollege(p)) return false;
 }

 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 const match = (p.title?.toLowerCase() || "").includes(q) || (p.description?.toLowerCase() || "").includes(q) || (p.category?.toLowerCase() || "").includes(q) || (p.location?.toLowerCase() || "").includes(q);
 if (!match) return false;
 }

 return true;
 });

 const intakeCount = posts.filter((p) => {
 if (p.status !== "UNIVERSITY_MATCHING" && p.status !== "SUBMITTED" && p.status !== "AI_ANALYZING") return false;
 if (p.acceptedCollegeName && !isOwnedByMyCollege(p)) return false;
 return true;
 }).length;

 const activeCount = posts.filter((p) => {
 if (!["UNIVERSITY_ACCEPTED", "PROTOTYPING", "TESTING", "INDUSTRY_MATCHING", "INDUSTRY_ACCEPTED", "GOVT_REVIEW", "GOVT_APPROVED", "IMPLEMENTATION"].includes(p.status)) return false;
 return isOwnedByMyCollege(p);
 }).length;

 const completedCount = posts.filter((p) => {
 if (p.status !== "COMPLETED") return false;
 return isOwnedByMyCollege(p);
 }).length;

 if (authChecking) {
 return (
 <div className={`min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground`}>
 <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
 <p className={`text-sm font-semibold text-slate-600 dark:text-slate-400`}>
 Verifying Academic Lab Session...
 </p>
 </div>
 );
 }

 return (
 <div className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-foreground transition-colors duration-200 bg-background text-foreground`}>
 
 {/* Toast Notification */}
 {notification && (
 <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-md border text-sm font-semibold flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
 notification.type === "success"
 ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-700 dark:text-emerald-200"
 : "bg-rose-950/90 border-rose-500/50 text-rose-700 dark:text-rose-200"
 }`}>
 {notification.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
 <span>{notification.text}</span>
 </div>
 )}

 {/* Top Academic Header */}
 <header className={`border-b sticky top-0 z-40 transition-colors border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-800 dark:bg-zinc-900/75 dark:text-white`}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-0 min-h-[5rem] md:h-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
 <div className="flex items-center gap-3">
 <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
 <GraduationCap className={`h-6 w-6 text-foreground`} />
 </div>
 <div>
 <div className="flex flex-wrap items-center gap-2">
 <span className="font-black text-xl tracking-tight break-words bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
 College &amp; University R&amp;D Hub
 </span>
 <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
 Academic Portal
 </span>
 <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hidden md:inline-flex items-center gap-1">
 🛡️ Isolated Workspace
 </span>
 </div>
 <p className={`text-xs text-slate-500 dark:text-slate-400`}>
 Transforming Citizen Problems into Student Engineering Solutions (Private Institution Scope)
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <ThemeToggle />

 {/* Dedicated College User Profile & Logout */}
 <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs shadow-inner bg-white border-slate-300 text-slate-900 dark:bg-zinc-900/75 dark:border-slate-800 dark:text-white`}>
 <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
 <div className="flex flex-col text-left">
 <span className="font-bold max-w-[120px] sm:max-w-[150px] truncate leading-tight">{collegeUser?.name || collegeUser?.collegeName || "Academic Lab"}</span>
 <p className="text-[10px] text-indigo-500 max-w-[160px] truncate">{collegeUser?.facultyName || facultyGuide}</p>
 </div>
 <button
 onClick={() => setShowProfile(true)}
 className={`flex items-center gap-1 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 ml-2 pl-2 border-l transition-colors border-slate-200 dark:border-slate-800`}
 title="Edit College Profile"
 >
 <UserCheck className="h-3.5 w-3.5" />
 <span className="hidden sm:inline text-[11px] font-semibold">Profile</span>
 </button>
 
 </div>
 </div>
 </div>
 </header>

 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
 
 {/* Active Institution Specialization Profile Bar */}
 <div className="mb-8 p-5 bg-white dark:bg-zinc-900/75 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
 <div className="flex items-center gap-3.5">
 <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shadow-lg shadow-indigo-500/10">
 <GraduationCap className="h-6 w-6" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className={`text-xs font-semibold text-slate-600 dark:text-slate-400`}>Active Tamil Nadu Institution:</span>
 <span className={`px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-[10px] font-bold`}>
 {activeCollege.type || "Institution"}
 </span>
 {(activeCollege.district || collegeUser?.district) && (
 <span className={`px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1`}>
 <MapPin className="h-2.5 w-2.5" />
 <span>{activeCollege.district || collegeUser?.district} District</span>
 </span>
 )}
 </div>
 <h2 className={`text-lg font-black text-foreground`}>{activeCollege.name}</h2>
 <p className={`text-xs text-indigo-700 dark:text-indigo-300 font-mono mt-0.5`}>{activeCollege.leadDept || "R&D Center"}</p>
 </div>
 </div>

 {/* Suitable Problem Areas Tag Badges */}
 <div className="flex flex-col md:items-end gap-1.5">
 <p className={`text-[11px] font-bold flex items-center gap-1 text-slate-600 dark:text-slate-400`}>
 <Target className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
 <span>Registered Problem-Solving Skills:</span>
 </p>
 <div className="flex flex-wrap gap-1.5 max-w-lg">
 {activeSkills.map((skill, si) => (
 <span
 key={si}
 className={`px-2.5 py-1 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-700 dark:text-indigo-200 border border-indigo-500/30 text-xs font-bold transition flex items-center gap-1`}
 >
 <Sparkles className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400" />
 <span>{skill}</span>
 </span>
 ))}
 </div>
 </div>
 </div>

 {/* Banner with Stats */}
 <div className="relative overflow-hidden rounded-3xl bg-card text-card-foreground border-border p-8 sm:p-10 mb-10 shadow-md">
 <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
 <div className="relative z-10 max-w-3xl">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-4 whitespace-normal text-center">
 <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
 <span>Tamil Nadu Colleges R&amp;D Problem Solver Network</span>
 </div>
 <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight break-words">
 Solve Community Grievances Matching Your College Skills
 </h1>
 <p className="mt-3 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
 When your academic lab accepts a problem, AI analyzes and matches the <strong>Top 10 industry partners</strong>. The first industry partner to accept locks the project, enabling real-time collaboration messaging with your team.
 </p>
 </div>

 {/* Quick Metrics */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
 <div className="bg-white dark:bg-zinc-900/75 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
 <p className={`text-xs font-medium text-slate-600 dark:text-slate-400`}>Challenges for Intake</p>
 <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{intakeCount}</p>
 </div>
 <div className="bg-white dark:bg-zinc-900/75 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
 <p className={`text-xs font-medium text-slate-600 dark:text-slate-400`}>Active Lab Projects</p>
 <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{activeCount}</p>
 </div>
 <div className={`/60 rounded-2xl p-4 border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className={`text-xs font-medium text-slate-600 dark:text-slate-400`}>Industry Partner Labs</p>
 <p className="text-2xl font-black text-pink-600 dark:text-pink-400 mt-1">10 Per Project</p>
 </div>
 <div className={`/60 rounded-2xl p-4 border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className={`text-xs font-medium text-slate-600 dark:text-slate-400`}>Deployed Solutions</p>
 <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</p>
 </div>
 </div>
 </div>

 {/* Tab & Filter Bar */}
 <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 pb-4 border-b border-slate-800">
 <div className={`flex /90 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto overflow-x-auto bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <button
 onClick={() => setActiveTab("intake")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
 activeTab === "intake"
 ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-foreground shadow-lg shadow-indigo-500/25"
 : "text-slate-600 dark:text-slate-400 hover:text-foreground"
 }`}
 >
 <Sparkles className="h-4 w-4" />
 <span>Intake Queue ({intakeCount})</span>
 </button>

 <button
 onClick={() => setActiveTab("active")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
 activeTab === "active"
 ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-foreground shadow-lg shadow-indigo-500/25"
 : "text-slate-600 dark:text-slate-400 hover:text-foreground"
 }`}
 >
 <Layers className="h-4 w-4" />
 <span>Active Projects ({activeCount})</span>
 </button>

 <button
 onClick={() => setActiveTab("completed")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
 activeTab === "completed"
 ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-foreground shadow-lg shadow-indigo-500/25"
 : "text-slate-600 dark:text-slate-400 hover:text-foreground"
 }`}
 >
 <Award className="h-4 w-4" />
 <span>Solved &amp; Deployed ({completedCount})</span>
 </button>
 </div>

 <div className="relative w-full sm:w-72">
 <Search className={`absolute left-3.5 top-3 h-4 w-4 text-slate-600 dark:text-slate-400`} />
 <input
 type="text"
 placeholder="Search challenges..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className={`w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-foreground`}
 />
 </div>
 </div>

 {/* Challenge Cards Grid */}
 {loading ? (
 <div className="py-24 text-center">
 <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mx-auto mb-4" />
 <p className={`text-sm text-slate-600 dark:text-slate-400`}>Loading university challenge queue...</p>
 </div>
 ) : filteredPosts.length === 0 ? (
 <div className={`py-24 text-center /40 rounded-3xl border border-slate-800 p-8 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <CheckCircle2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
 <h3 className={`text-lg font-bold text-foreground`}>No challenges found in this section</h3>
 <p className={`text-sm max-w-md mx-auto mt-1 text-slate-600 dark:text-slate-400`}>
 Check back soon as new citizen complaints are raised.
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {filteredPosts.map((post) => {
 const stageInfo = PIPELINE_STAGES.find((s) => s.key === post.status) || {
 label: post.status,
 icon: Clock,
 color: "text-slate-600 dark:text-slate-400 bg-slate-800 border-slate-700",
 };
 const StageIcon = stageInfo.icon;
 const matches = post.industryMatches || [];
 const isOpen = post.status === "UNIVERSITY_MATCHING" || post.status === "SUBMITTED" || post.status === "AI_ANALYZING";

 return (
 <div
 key={post.id}
 className={`/90 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 transition shadow-xl group bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}
 >
 <div className="p-6 sm:p-7">
 
 {/* Compute matching skills with active college */}
 {(() => {
 const q = `${post.title} ${post.description || ''} ${post.category || ''}`.toLowerCase();
 const matched = activeSkills.filter(s => {
 const sk = s.toLowerCase();
 if (q.includes("water") && (sk.includes("water") || sk.includes("environment") || sk.includes("infrastructure"))) return true;
 if (q.includes("electric") && (sk.includes("electric") || sk.includes("energy") || sk.includes("power") || sk.includes("electronics"))) return true;
 if (q.includes("power") && (sk.includes("energy") || sk.includes("electricity") || sk.includes("solar"))) return true;
 if (q.includes("drain") && (sk.includes("water") || sk.includes("infrastructure") || sk.includes("waste"))) return true;
 if (q.includes("road") && (sk.includes("infrastructure") || sk.includes("transportation") || sk.includes("smart city"))) return true;
 if (q.includes("waste") && (sk.includes("waste") || sk.includes("environment"))) return true;
 if (q.includes("agri") && (sk.includes("agriculture") || sk.includes("rural"))) return true;
 return q.includes(sk);
 });
 const displaySkills = matched.length > 0 ? matched : activeSkills.slice(0, 2);
 const matchPct = matched.length > 0 ? 85 + Math.min(matched.length * 5, 14) : 78;

 return (
 <>
 <div className="flex items-center justify-between gap-2 mb-3">
 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${stageInfo.color}`}>
 <StageIcon className="h-3.5 w-3.5" />
 <span>{stageInfo.label}</span>
 </span>
 
 <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
 <Sparkles className="h-3 w-3" />
 <span>{matchPct}% Skill Match</span>
 </span>
 </div>

 <h3 className={`text-xl font-black group-hover:text-indigo-300 transition text-foreground`}>
 {post.title}
 </h3>

 <div className={`flex items-center gap-2 text-xs mt-2 mb-3 text-slate-600 dark:text-slate-400`}>
 {post.location && (
 <div className="flex items-center gap-1">
 <MapPin className="h-3 w-3 text-slate-500" />
 <span>{post.location}</span>
 </div>
 )}
 <span>•</span>
 <span className="text-indigo-600 dark:text-indigo-400 font-medium">#{post.category || "General"}</span>
 </div>

 {/* Problem Solving Skill Badges */}
 <div className="flex flex-wrap items-center gap-1.5 mb-4">
 <span className={`text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400`}>Suitable Skills:</span>
 {displaySkills.map((sk, idx) => (
 <span
 key={idx}
 className={`px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold`}
 >
 {sk}
 </span>
 ))}
 </div>
 </>
 );
 })()}

 
  {/* Citizen Uploaded Image */}
  {post.imageUrl && (
   <div className="px-6 pb-3">
    <img
     src={post.imageUrl.startsWith('http') ? post.imageUrl : `${API}${post.imageUrl}`}
     alt={post.title}
     className="w-full h-auto rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"
     onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
   </div>
  )}
<p className="text-xs text-zinc-900 dark:text-zinc-100 leading-relaxed mb-5">
 {post.description}
 </p>

 {/* Problem-Specific Official Approval & R&D Scope */}
 {post.status !== "SUBMITTED" && post.status !== "AI_ANALYZING" && post.status !== "UNIVERSITY_MATCHING" && (
 <div className="mb-5">
 <ApprovalMemoCard
 post={post}
 variant="college"
 title="Official Academic Approval & R&D Scope"
 />
 </div>
 )}

 {/* Industry Sponsor Banner if locked */}
 {post.acceptedIndustryName ? (
 <div className="p-3.5 bg-pink-950/40 rounded-2xl border border-pink-500/30 flex items-center justify-between mb-4">
 <div>
 <p className="text-[10px] uppercase font-black text-pink-600 dark:text-pink-400">Industry Partner Locked</p>
 <p className={`text-xs font-bold mt-0.5 text-foreground`}>{post.acceptedIndustryName}</p>
 </div>
 <button
 onClick={() => openChat(post)}
 className={`px-3 py-1.5 bg-pink-600 hover:bg-pink-500 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-500/20 text-foreground`}
 >
 <MessageSquare className="h-3.5 w-3.5" /> Collaboration Chat
 </button>
 </div>
 ) : (
 <div className={`p-3.5 /80 rounded-2xl border border-slate-800 mb-4 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
 <div className="flex items-center gap-1.5">
 <Sparkles className="h-4 w-4 text-pink-600 dark:text-pink-400" />
 <span>CSR Industry Sponsorship</span>
 </div>
 <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Awaiting Industry Partner</span>
 </div>
 <p className={`text-[11px] mt-1 text-slate-600 dark:text-slate-400`}>
 Invitations dispatched to verified CSR partners. The first industry partner to accept will fund the lab prototype.
 </p>
 </div>
 )}

 </div>

 {/* Actions Footer with Accept & REJECT (Task 2) */}
 <div className={`p-6 pt-4 border-t border-slate-800 /40 flex items-center gap-2 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 {isOpen ? (
 <>
 <button
 onClick={() => {
 setSelectedPost(post);
 setActionModalType("accept");
 }}
 className={`flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl text-xs font-bold hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 text-foreground`}
 >
 <BookOpen className="h-4 w-4" />
 <span>Accept Challenge</span>
 </button>

 {/* Task 2: REJECT BUTTON */}
 <button
 onClick={() => {
 setSelectedPost(post);
 setActionModalType("reject");
 }}
 className={`py-3 px-4 bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-900 dark:text-zinc-100 hover:text-rose-700 dark:hover:text-rose-300 border border-slate-300 dark:border-slate-700/60 rounded-xl text-xs font-bold transition flex items-center gap-1.5`}
 title="Reject this challenge"
 >
 <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
 <span>Reject</span>
 </button>
 </>
 ) : (
 <>
 <button
 onClick={() => {
 setSelectedPost(post);
 setNextStage(post.status === "UNIVERSITY_ACCEPTED" ? "PROTOTYPING" : post.status === "PROTOTYPING" ? "TESTING" : post.status === "TESTING" ? "INDUSTRY_MATCHING" : "COMPLETED");
 setActionModalType("progress");
 }}
 className={`flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 text-foreground`}
 >
 <Zap className="h-4 w-4" />
 <span>Update Stage Progress</span>
 </button>

 <button
 onClick={() => openChat(post)}
 className="py-3 px-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-pink-700 dark:text-pink-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
 >
 <MessageSquare className="h-4 w-4" />
 <span>Chat</span>
 </button>
 </>
 )}

 <button
 onClick={() => {
 setSelectedPost(post);
 setActionModalType("details");
 }}
 className="p-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-zinc-100 rounded-xl transition"
 title="View details"
 >
 <ChevronRight className="h-4 w-4" />
 </button>
 </div>

 </div>
 );
 })}
 </div>
 )}

 </main>

 {/* MODAL 1: ACCEPT CHALLENGE */}
 {actionModalType === "accept" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className={`border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-md animate-in zoom-in-95 duration-200 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <div className="flex items-center justify-between pb-4 border-b border-slate-800">
 <div className="flex items-center gap-2">
 <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
 <h3 className={`text-lg font-black text-foreground`}>Accept Challenge for R&amp;D</h3>
 </div>
 <button onClick={() => setActionModalType(null)} className={`text-slate-600 dark:text-slate-400 hover: text-sm text-foreground`}>✕</button>
 </div>

 <div className={`my-5 p-4 rounded-2xl border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Problem Statement</p>
 <h4 className={`font-bold text-sm mt-1 text-foreground`}>{selectedPost.title}</h4>
 <p className={`text-xs mt-1 text-slate-600 dark:text-slate-400`}>{selectedPost.description}</p>
 </div>

 <div className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Assign Student Team Name
 </label>
 <input
 type="text"
 value={teamName}
 onChange={(e) => setTeamName(e.target.value)}
 className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-foreground`}
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Faculty Guide / Professor
 </label>
 <input
 type="text"
 value={facultyGuide}
 onChange={(e) => setFacultyGuide(e.target.value)}
 className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-foreground`}
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
 onClick={handleAcceptChallenge}
 disabled={submittingAction}
 className={`flex-1 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-bold rounded-xl text-xs hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 text-foreground`}
 >
 {submittingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
 <span>Confirm &amp; Notify 10 Industries</span>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Task 2: MODAL 2 — REJECT CHALLENGE */}
 {actionModalType === "reject" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className={`border border-slate-800 rounded-3xl max-w-md w-full p-6 text-center shadow-md animate-in zoom-in-95 duration-200 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
 <XCircle className="h-6 w-6" />
 </div>
 <h3 className={`text-lg font-black text-foreground`}>Decline Citizen Challenge</h3>
 <p className="text-xs text-zinc-900 dark:text-zinc-100 mt-1 leading-relaxed ">
 "{selectedPost.title}"
 </p>

 <div className="my-5 text-left">
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Reason for Declining
 </label>
 <select
 value={rejectReason}
 onChange={(e) => setRejectReason(e.target.value)}
 className={`w-full px-3 py-2.5 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-rose-500 text-foreground`}
 >
 <option>Outside Department Specialization &amp; Scope</option>
 <option>Lab Capacity &amp; Research Cohort Full</option>
 <option>Requires Heavy Metallurgy / Civil Equipment</option>
 <option>Insufficient Baseline Ground Data</option>
 </select>
 </div>

 <div className="flex gap-3">
 <button
 onClick={() => setActionModalType(null)}
 className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-xs transition"
 >
 Cancel
 </button>
 <button
 onClick={handleRejectChallenge}
 disabled={submittingAction}
 className={`flex-1 py-3 bg-rose-600 hover:bg-rose-500 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 text-foreground`}
 >
 {submittingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
 <span>Confirm Decline</span>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* MODAL 3: ADVANCE PROGRESS */}
 {actionModalType === "progress" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className={`border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-md animate-in zoom-in-95 duration-200 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <div className="flex items-center justify-between pb-4 border-b border-slate-800">
 <div className="flex items-center gap-2">
 <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
 <h3 className={`text-lg font-black text-foreground`}>Advance Project Stage</h3>
 </div>
 <button onClick={() => setActionModalType(null)} className={`text-slate-600 dark:text-slate-400 hover: text-sm text-foreground`}>✕</button>
 </div>

 <div className="my-5">
 <p className={`text-xs text-slate-600 dark:text-slate-400`}>Current Stage: <strong className={` text-foreground`}>{selectedPost.status}</strong></p>
 <h4 className={`font-bold text-sm mt-1 text-foreground`}>{selectedPost.title}</h4>
 </div>

 <div className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Select Next Stage
 </label>
 <select
 value={nextStage}
 onChange={(e) => setNextStage(e.target.value)}
 className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-foreground`}
 >
 <option value="PROTOTYPING">🔧 Prototyping (Lab testing started)</option>
 <option value="TESTING">🧪 Field Testing (Validating on site)</option>
 <option value="INDUSTRY_MATCHING">🏭 Industry Matching (Scale &amp; Manufacture)</option>
 <option value="GOVT_REVIEW">📋 Government Review (Regulatory clearance)</option>
 <option value="COMPLETED">🌟 Completed &amp; Ground Solution Deployed</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
 Progress Notes / Prototype Findings
 </label>
 <textarea
 rows={3}
 value={progressNotes}
 onChange={(e) => setProgressNotes(e.target.value)}
 className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500 text-foreground`}
 placeholder="e.g. Completed initial 3D design and circuit testing with 94% efficiency."
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
 onClick={handleAdvancePipeline}
 disabled={submittingAction}
 className={`flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center justify-center gap-2 text-foreground`}
 >
 {submittingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
 <span>Publish Update</span>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* TASK 5: LIVE COLLABORATION MESSENGER */}
 {actionModalType === "chat" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className={`border border-slate-800 rounded-3xl max-w-2xl w-full h-[85vh] flex flex-col shadow-md animate-in zoom-in-95 duration-200 overflow-hidden bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 
 <div className={`p-5 border-b border-slate-800 /70 flex items-center justify-between bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <div>
 <div className="flex items-center gap-2">
 <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
 <h3 className={`font-black text-base text-foreground`}>University &amp; Industry Collaboration Channel</h3>
 </div>
 <p className={`text-xs mt-0.5 max-w-md text-slate-600 dark:text-slate-400`}>
 Project: <strong className={` text-foreground`}>{selectedPost.title}</strong>
 </p>
 </div>

 <div className="flex items-center gap-3">
 <span className={`px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30`}>
 🎓 College Lead Session
 </span>
 <button onClick={() => setActionModalType(null)} className={`text-slate-600 dark:text-slate-400 hover: text-sm text-foreground`}>✕</button>
 </div>
 </div>

 <div className={`flex-1 p-5 overflow-y-auto space-y-4 /40 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 {chatLoading ? (
 <div className="py-20 text-center">
 <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto mb-2" />
 <p className={`text-xs text-slate-600 dark:text-slate-400`}>Loading channel messages...</p>
 </div>
 ) : chatMessages.length === 0 ? (
 <div className="py-20 text-center text-slate-500">
 <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
 <p className="text-xs">No messages yet. Send a message to the Industry partner!</p>
 </div>
 ) : (
 chatMessages.map((msg, i) => {
 const isAi = msg.senderRole === "AI";
 const isCol = msg.senderRole === "COLLEGE";

 if (isAi) {
 return (
 <div key={i} className={`p-3 bg-purple-950/30 border border-purple-500/20 rounded-2xl text-xs text-purple-700 dark:text-purple-200`}>
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
 className={`flex flex-col ${isCol ? "items-end" : "items-start"}`}
 >
 <span className={`text-[10px] font-bold mb-1 px-1 text-slate-600 dark:text-slate-400`}>
 {isCol ? `🎓 ${msg.senderName}` : `🏭 ${msg.senderName}`}
 </span>
 <div
 className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
 isCol
 ? "bg-indigo-600 text-foreground rounded-tr-none shadow-md shadow-indigo-600/20"
 : "bg-pink-950/60 border border-pink-500/40 text-pink-100 rounded-tl-none"
 }`}
 >
 {msg.text}
 </div>
 </div>
 );
 })
 )}
 </div>

 <form onSubmit={handleSendMessage} className={`p-4 border-t border-slate-800 flex items-center gap-2 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <input
 type="text"
 value={chatInput}
 onChange={(e) => setChatInput(e.target.value)}
 placeholder="Message the Industry Partner (prototype specs, funding release, meeting request)..."
 className={`flex-1 bg-white dark:bg-zinc-900/75 border border-slate-800 rounded-2xl px-4 py-3 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-foreground`}
 />
 <button
 type="submit"
 disabled={!chatInput.trim()}
 className={`p-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition disabled:opacity-40 text-foreground`}
 >
 <Send className="h-4 w-4" />
 </button>
 </form>

 </div>
 </div>
 )}

 {/* MODAL 4: FULL DETAILS */}
 {actionModalType === "details" && selectedPost && (
 <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900/75 flex items-center justify-center p-4">
 <div className={`border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-md animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <div className="flex items-center justify-between pb-4 border-b border-slate-800">
 <h3 className={`text-xl font-black text-foreground`}>{selectedPost.title}</h3>
 <button onClick={() => setActionModalType(null)} className={`text-slate-600 dark:text-slate-400 hover: text-sm text-foreground`}>✕</button>
 </div>

 <div className="my-6 space-y-4">
 <div className={`flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400`}>
 <span>Raised by: <strong className="text-slate-800 dark:text-slate-200">{selectedPost.user?.name || "Citizen"}</strong></span>
 <span>•</span>
 <span>Location: <strong className="text-slate-800 dark:text-slate-200">{selectedPost.location || "N/A"}</strong></span>
 <span>•</span>
 <span>Category: <strong className="text-indigo-600 dark:text-indigo-400">{selectedPost.category}</strong></span>
 </div>

 <div className={`p-4 rounded-2xl border border-slate-800 bg-white border-slate-200 shadow-sm dark:bg-zinc-900/75 dark:border-slate-800`}>
 <p className={`text-xs font-bold uppercase tracking-wider mb-1 text-slate-600 dark:text-slate-400`}>Citizen Problem Description</p>
 <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{selectedPost.description}</p>
 </div>

 {selectedPost.imageUrl && (
 <img
 src={selectedPost.imageUrl.startsWith("data:") ? selectedPost.imageUrl : `${API}${selectedPost.imageUrl}`}
 alt={selectedPost.title}
 className="w-full h-auto rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"
 />
 )}

 <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-500/30">
 <p className={`text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-1`}>Problem-Specific Approval Memorandum</p>
 <p className={`text-xs font-mono whitespace-pre-line leading-relaxed text-foreground`}>{selectedPost.approvalMemo || selectedPost.statusMessage}</p>
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
 role="UNIVERSITY"
 currentUser={collegeUser}
 onUpdateUser={(updated) => {
 setCollegeUser(updated);
 if (updated.collegeName) {
 setTeamName(`${updated.collegeName} Research Team`);
 const matched = TAMIL_NADU_COLLEGES.find((c) => c.name === updated.collegeName);
 if (matched) setActiveCollege(matched);
 }
 if (updated.facultyName) setFacultyGuide(updated.facultyName);
 if (updated.skills && Array.isArray(updated.skills)) setActiveSkills(updated.skills);
 }}
 />
 )}

 </div>
 );
}
