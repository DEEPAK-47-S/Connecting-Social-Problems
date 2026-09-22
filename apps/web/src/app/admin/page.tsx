"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck, Trash2, Search, Filter, AlertTriangle, CheckCircle2,
  MapPin, Clock, Loader2, ArrowUpDown, Eye, X, CheckSquare, Square,
  Building, GraduationCap, Handshake, LogOut, RefreshCw, Sparkles,
  FileText, Activity
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { TAMIL_NADU_DISTRICTS } from "@/data/tamilNaduDistricts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  SUBMITTED:           { label: "Submitted", color: "bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-700" },
  AI_ANALYZING:        { label: "AI Analysing", color: "bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-800/60" },
  UNIVERSITY_MATCHING: { label: "Finding University", color: "bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-800/60" },
  UNIVERSITY_ACCEPTED: { label: "University Accepted", color: "bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-800/60" },
  INDUSTRY_MATCHING:   { label: "Finding Industry", color: "bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-800/60" },
  INDUSTRY_ACCEPTED:   { label: "Industry Locked", color: "bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-800/60" },
  PROTOTYPING:         { label: "Prototyping", color: "bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-800/60" },
  TESTING:             { label: "Testing", color: "bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-800/60" },
  GOVT_REVIEW:         { label: "Govt Review", color: "bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-800/60" },
  GOVT_APPROVED:       { label: "Govt Approved", color: "bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-800/60" },
  IMPLEMENTATION:      { label: "Implementing", color: "bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-800/60" },
  COMPLETED:           { label: "Completed", color: "bg-green-950/60 text-green-700 dark:text-green-300 border-green-800/60" },
  REJECTED:            { label: "Rejected", color: "bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-800/60" },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tabs & Users
  const [activeTab, setActiveTab] = useState<"complaints" | "users">("complaints");
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [postToDelete, setPostToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Detail Drawer
  const [inspectPost, setInspectPost] = useState<any | null>(null);

  // Check Auth
  useEffect(() => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
    const userStr = localStorage.getItem("admin_user") || localStorage.getItem("user");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const u = userStr ? JSON.parse(userStr) : null;
      if (!u || ((u.role || "").toUpperCase() !== "ADMIN" && (u.role || "").toUpperCase() !== "SUPERADMIN")) {
        router.push("/admin/login");
        return;
      }
      setAdminUser(u);
      setAdminToken(token);
    } catch {
      router.push("/admin/login");
    }
  }, [router]);

  // Load all users
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API}/api/admin/users`, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken && activeTab === "users") {
      fetchUsers();
    }
  }, [adminToken, activeTab, fetchUsers]);

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setToastMessage(`Deleted user "${userToDelete.email}" successfully.`);
      setUserToDelete(null);
      setTimeout(() => setToastMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  // Load all complaints
  const fetchAllComplaints = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/posts?limit=500`);
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      } else {
        setError(data.error || "Failed to load database records.");
      }
    } catch {
      setError("Cannot reach backend server. Please verify port 4000.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminToken) {
      fetchAllComplaints();
    }
  }, [adminToken, fetchAllComplaints]);

  // Delete Single Post from Database
  const handleConfirmSingleDelete = async () => {
    if (!postToDelete) return;
    setDeleting(true);

    try {
      const res = await fetch(`${API}/api/posts/${postToDelete.id}`, {
        method: "DELETE",
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete post");

      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(postToDelete.id);
        return next;
      });
      if (inspectPost?.id === postToDelete.id) setInspectPost(null);

      setToastMessage(`Deleted complaint "${postToDelete.title.slice(0, 25)}..." from SQLite database.`);
      setPostToDelete(null);
      setTimeout(() => setToastMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to delete record.");
    } finally {
      setDeleting(false);
    }
  };

  // Bulk Delete Selected Posts from Database
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleting(true);

    const idsToDelete = Array.from(selectedIds);
    let successCount = 0;

    for (const id of idsToDelete) {
      try {
        const res = await fetch(`${API}/api/posts/${id}`, {
          method: "DELETE",
          headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
        });
        if (res.ok) successCount++;
      } catch (e) {
        console.error("Bulk delete item error", e);
      }
    }

    setPosts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
    setShowBulkModal(false);
    setIsBulkDeleting(false);

    setToastMessage(`Successfully removed ${successCount} complaints permanently from database.`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredPosts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPosts.map((p) => p.id)));
    }
  };

  // Filtering
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (selectedCategory !== "All") {
        if (!(p.category || "").toLowerCase().includes(selectedCategory.toLowerCase().split(" ")[0])) {
          return false;
        }
      }
      if (selectedDistrict !== "All") {
        if (p.district !== selectedDistrict) return false;
      }
      if (selectedStatus !== "All") {
        if (p.status !== selectedStatus) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const t = p.title?.toLowerCase() || "";
        const d = p.description?.toLowerCase() || "";
        const l = p.location?.toLowerCase() || "";
        const id = p.id?.toLowerCase() || "";
        const email = p.user?.email?.toLowerCase() || "";
        if (!t.includes(q) && !d.includes(q) && !l.includes(q) && !id.includes(q) && !email.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [posts, selectedCategory, selectedDistrict, selectedStatus, searchQuery]);

  // Metrics
  const stats = useMemo(() => {
    const total = posts.length;
    const universityAccepted = posts.filter((p) => p.status === "UNIVERSITY_ACCEPTED" || p.status === "PROTOTYPING" || p.status === "TESTING").length;
    const industryAccepted = posts.filter((p) => p.status === "INDUSTRY_ACCEPTED" || p.status === "GOVT_REVIEW" || p.status === "GOVT_APPROVED" || p.status === "IMPLEMENTATION").length;
    const completed = posts.filter((p) => p.status === "COMPLETED").length;
    return { total, universityAccepted, industryAccepted, completed };
  }, [posts]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 bg-background text-foreground selection:bg-rose-500/20 dark:selection:bg-rose-500/30`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600  px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-4 text-foreground`}>
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className={`px-4 sm:px-8 h-18 flex items-center justify-between border-b sticky top-0 z-40 backdrop-blur-md bg-white/90 border-zinc-200 shadow-sm dark:bg-black/90 dark:border-zinc-800/80`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ShieldCheck className={`h-5 w-5 text-foreground`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight">
                Admin Moderation Portal
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase">
                Database Authority
              </span>
            </div>
            <p className={`text-[11px] text-zinc-500 dark:text-zinc-400`}>
              Manage, inspect, and delete complaints permanently
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={fetchAllComplaints}
            className={`p-2 rounded-xl transition bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300`}
            title="Refresh database"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/"
            className={`hidden sm:inline-flex px-3.5 py-1.5 rounded-xl border text-xs font-bold transition border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800`}
          >
            View Public Site
          </Link>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-900/50 transition`}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`p-5 rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-zinc-900/80 border border-zinc-800 shadow-xl`}>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Complaints</span>
              <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className={`text-3xl font-black text-foreground`}>{stats.total}</p>
            <p className="text-[11px] text-zinc-500 mt-1">Stored in SQLite `Post` table</p>
          </div>

          <div className={`p-5 rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-zinc-900/80 border border-zinc-800 shadow-xl`}>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">College Leads</span>
              <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.universityAccepted}</p>
            <p className="text-[11px] text-zinc-500 mt-1">Under R&amp;D Lab prototyping</p>
          </div>

          <div className={`p-5 rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-zinc-900/80 border border-zinc-800 shadow-xl`}>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Industry Sponsors</span>
              <Handshake className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
            <p className="text-3xl font-black text-pink-600 dark:text-pink-400">{stats.industryAccepted}</p>
            <p className="text-[11px] text-zinc-500 mt-1">Funded by CSR corporate partners</p>
          </div>

          <div className={`p-5 rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-zinc-900/80 border border-zinc-800 shadow-xl`}>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Resolved Issues</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
            <p className="text-[11px] text-zinc-500 mt-1">Deployed ground solutions</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("complaints")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === "complaints"
                ? "bg-indigo-600 text-foreground shadow-lg"
                : (theme === "dark")
                ? "bg-white shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-transparent text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                : "bg-white text-zinc-600 border hover:text-zinc-900"
            }`}
          >
            Complaints Management
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === "users"
                ? "bg-indigo-600 text-foreground shadow-lg"
                : (theme === "dark")
                ? "bg-white shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-transparent text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                : "bg-white text-zinc-600 border hover:text-zinc-900"
            }`}
          >
            Users Management
          </button>
        </div>

        {/* Users Tab View */}
        {activeTab === "users" && (
          <div className={`p-6 rounded-3xl border shadow-xl bg-white border-zinc-200 dark:bg-zinc-900/90 dark:border-zinc-800`}>
            <h2 className={`text-xl font-black mb-4 text-zinc-900 dark:text-white`}>Registered Users</h2>
            
            {loadingUsers ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className={`border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400`}>
                      <th className="p-3 font-bold uppercase tracking-wider text-xs">User / Email</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-xs">Role</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-xs">Organization</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className={`border-b transition hover:bg-zinc-500/5 border-zinc-100 dark:border-zinc-800/50`}>
                        <td className="p-3">
                          <div className={`font-bold text-zinc-900 dark:text-white`}>{u.name}</div>
                          <div className="text-xs text-zinc-500">{u.email}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-xs font-bold">{u.role}</span>
                        </td>
                        <td className="p-3 text-zinc-500 text-xs font-medium">
                          {u.companyName || "N/A"} {u.sector ? `(${u.sector})` : ""}
                        </td>
                        <td className="p-3 text-right">
                          {u.role !== "SUPERADMIN" && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Delete User Modal */}
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white dark:bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className={`max-w-md w-full rounded-3xl p-6 shadow-2xl border bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800`}>
              <div className="flex items-center gap-3 text-rose-500 mb-4">
                <AlertTriangle className="h-6 w-6" />
                <h3 className={`text-xl font-black text-zinc-900 dark:text-white`}>Delete User</h3>
              </div>
              <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-zinc-900 dark:text-white">{userToDelete.email}</strong>? 
                This action is irreversible and will cascade to all their data.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setUserToDelete(null)}
                  disabled={deleting}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteUser}
                  disabled={deleting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-foreground rounded-xl text-sm font-bold flex items-center gap-2 transition disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  <span>Delete Permanently</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "complaints" && (
          <>
            {/* Filter & Action Toolbar */}
        <div className={`p-5 rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-zinc-900/90 border border-zinc-800 mb-6 shadow-xl space-y-4`}>
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by title, description, citizen email, landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs sm:text-sm  placeholder-zinc-500 focus:outline-none focus:border-rose-500 text-foreground`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-700 dark:text-zinc-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Bulk Action Controls */}
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-3 bg-rose-950/40 border border-rose-500/40 px-4 py-2 rounded-2xl animate-in fade-in">
                <span className={`text-xs font-bold text-rose-700 dark:text-rose-300`}>
                  {selectedIds.size} {selectedIds.size === 1 ? "complaint" : "complaints"} selected
                </span>
                <button
                  onClick={() => setShowBulkModal(true)}
                  className={`px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700  rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition text-foreground`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Selected ({selectedIds.size})</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-800/80 text-xs">
            <div className={`flex items-center gap-1.5 bg-white shadow-sm border border-gray-200 dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800`}>
              <span className="text-zinc-500 font-bold">District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className={`bg-transparent font-semibold  outline-none cursor-pointer text-foreground`}
              >
                <option value="All">All Districts</option>
                {TAMIL_NADU_DISTRICTS.map((d) => (
                  <option key={d} value={d} className={`bg-white shadow-sm border border-gray-200 dark:bg-zinc-900`}>{d}</option>
                ))}
              </select>
            </div>

            <div className={`flex items-center gap-1.5 bg-white shadow-sm border border-gray-200 dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800`}>
              <span className="text-zinc-500 font-bold">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`bg-transparent font-semibold  outline-none cursor-pointer text-foreground`}
              >
                <option value="All">All Categories</option>
                <option value="Water">Water Management</option>
                <option value="Electricity">Electricity &amp; Power</option>
                <option value="Road">Roads &amp; Civil Infra</option>
                <option value="Agriculture">Agriculture &amp; Rural</option>
                <option value="Waste">Waste &amp; Sanitation</option>
              </select>
            </div>

            <div className={`flex items-center gap-1.5 bg-white shadow-sm border border-gray-200 dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800`}>
              <span className="text-zinc-500 font-bold">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`bg-transparent font-semibold  outline-none cursor-pointer text-foreground`}
              >
                <option value="All">All Statuses</option>
                {Object.keys(STATUS_BADGES).map((k) => (
                  <option key={k} value={k} className={`bg-white shadow-sm border border-gray-200 dark:bg-zinc-900`}>{STATUS_BADGES[k].label}</option>
                ))}
              </select>
            </div>

            <span className="ml-auto text-zinc-500 text-[11px] font-semibold">
              Showing {filteredPosts.length} of {posts.length} records
            </span>
          </div>
        </div>

        {/* Complaints Table */}
        <div className={`rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-2xl`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-bold">Fetching complaints from database...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 p-6">
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <p className="text-red-400 font-bold mb-3">{error}</p>
              <button
                onClick={fetchAllComplaints}
                className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold"
              >
                Retry
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              <p className="text-sm font-bold">No complaints match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`bg-white shadow-sm border border-gray-200 dark:bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800 text-[10px]`}>
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <button onClick={toggleSelectAll} className={`hover: text-foreground`}>
                        {selectedIds.size === filteredPosts.length ? (
                          <CheckSquare className="h-4 w-4 text-rose-500" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-4">Complaint / Problem Title</th>
                    <th className="p-4">Location &amp; District</th>
                    <th className="p-4">Citizen User</th>
                    <th className="p-4">Status &amp; Match</th>
                    <th className="p-4 text-center">Submitted</th>
                    <th className="p-4 text-right">Admin Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {filteredPosts.map((post) => {
                    const isSelected = selectedIds.has(post.id);
                    const statusInfo = STATUS_BADGES[post.status] || STATUS_BADGES["SUBMITTED"];

                    return (
                      <tr
                        key={post.id}
                        className={`hover:bg-zinc-800/40 transition ${
                          isSelected ? "bg-rose-950/20" : ""
                        }`}
                      >
                        <td className="p-4 text-center">
                          <button onClick={() => toggleSelect(post.id)}>
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-rose-500" />
                            ) : (
                              <Square className="h-4 w-4 text-zinc-600" />
                            )}
                          </button>
                        </td>

                        <td className="p-4 max-w-xs">
                          <p className={`font-bold  text-xs sm:text-sm line-clamp-1 text-foreground`}>{post.title}</p>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-1 mt-0.5">{post.description}</p>
                          {post.category && (
                            <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[9px] font-bold mt-1">
                              #{post.category}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                            <span className="font-bold">{post.district || "Tamil Nadu"}</span>
                          </div>
                          {post.location && (
                            <p className="text-[10px] text-zinc-500 truncate max-w-[160px] mt-0.5">{post.location}</p>
                          )}
                        </td>

                        <td className="p-4 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                          <p className={`font-bold  text-xs text-foreground`}>{post.user?.name || "Citizen"}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">{post.user?.email || "N/A"}</p>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          {post.acceptedCollegeName && (
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1 truncate max-w-[150px]">
                              🎓 {post.acceptedCollegeName}
                            </p>
                          )}
                          {post.acceptedIndustryName && (
                            <p className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold mt-0.5 truncate max-w-[150px]">
                              🤝 {post.acceptedIndustryName}
                            </p>
                          )}
                        </td>

                        <td className="p-4 text-center text-zinc-600 dark:text-zinc-400 text-[11px] whitespace-nowrap">
                          {formatTime(post.createdAt)}
                        </td>

                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setInspectPost(post)}
                              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition"
                              title="Inspect Complaint Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() => setPostToDelete(post)}
                              className={`p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover: transition text-foreground`}
                              title="Delete Complaint from Database"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
                </>
        )}
      </main>

      {/* Delete Single Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white dark:bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className={`bg-white shadow-sm border border-gray-200 dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 border border-zinc-800 shadow-2xl`}>
            <div className="h-12 w-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className={`font-black text-lg text-foreground`}>
              Permanently Delete Complaint?
            </h3>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              You are deleting <span className={`font-bold text-foreground`}>"{postToDelete.title}"</span>.
            </p>

            <div className={`mt-4 p-3 bg-rose-950/40 rounded-2xl border border-rose-500/40 text-[11px] text-rose-700 dark:text-rose-300 space-y-1`}>
              <p className="font-bold">⚠️ Irreversible Admin Action:</p>
              <p>This will permanently purge this complaint, comments, likes, images, and AI collaboration records from the SQLite database.</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                disabled={deleting}
                className={`flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700  text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 text-foreground`}
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span>{deleting ? "Purging from DB..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white dark:bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className={`bg-white shadow-sm border border-gray-200 dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 border border-zinc-800 shadow-2xl`}>
            <div className="h-12 w-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className={`font-black text-lg text-foreground`}>
              Delete {selectedIds.size} Selected Complaints?
            </h3>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              You are about to permanently purge <strong className={` text-foreground`}>{selectedIds.size} complaints</strong> from the database.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                disabled={isBulkDeleting}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                disabled={isBulkDeleting}
                className={`flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700  text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 text-foreground`}
              >
                {isBulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span>{isBulkDeleting ? "Deleting..." : `Yes, Purge ${selectedIds.size} Records`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Inspection Drawer */}
      {inspectPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-white dark:bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className={`bg-white shadow-sm border border-gray-200 dark:bg-zinc-900 border-l border-zinc-800 h-full w-full max-w-lg p-6 overflow-y-auto shadow-2xl flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-rose-500" />
                  <span className={`font-bold  text-sm text-foreground`}>Complaint Record Inspector</span>
                </div>
                <button
                  onClick={() => setInspectPost(null)}
                  className={`p-1 rounded-lg text-zinc-400 hover: text-foreground`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-4 text-xs">
                <div>
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Database ID</span>
                  <p className={`font-mono text-zinc-300 bg-white shadow-sm border border-gray-200 dark:bg-zinc-950 p-2 rounded-xl mt-1 text-[11px] select-all`}>{inspectPost.id}</p>
                </div>

                <div>
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Title</span>
                  <p className={`text-sm font-bold  mt-1 text-foreground`}>{inspectPost.title}</p>
                </div>

                <div>
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Description</span>
                  <p className={`text-zinc-300 mt-1 leading-relaxed bg-white shadow-sm border border-gray-200 dark:bg-zinc-950 p-3 rounded-xl whitespace-pre-line`}>{inspectPost.description}</p>
                </div>

                {inspectPost.imageUrl && (
                  <div>
                    <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Attached Photo</span>
                    <img
                      src={`${API}${inspectPost.imageUrl}`}
                      alt={inspectPost.title}
                      className="rounded-2xl mt-1 w-full max-h-60 object-cover border border-zinc-800"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className={`p-3 bg-white shadow-sm border border-gray-200 dark:bg-zinc-950 rounded-xl`}>
                    <span className="text-zinc-500 font-bold text-[10px]">District</span>
                    <p className={`font-bold mt-0.5 text-foreground`}>{inspectPost.district || "Tamil Nadu"}</p>
                  </div>
                  <div className={`p-3 bg-white shadow-sm border border-gray-200 dark:bg-zinc-950 rounded-xl`}>
                    <span className="text-zinc-500 font-bold text-[10px]">Category</span>
                    <p className={`font-bold mt-0.5 text-foreground`}>{inspectPost.category || "General"}</p>
                  </div>
                </div>

                {inspectPost.location && (
                  <div>
                    <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Location Landmark</span>
                    <p className="text-zinc-200 mt-1 font-semibold">{inspectPost.location}</p>
                  </div>
                )}

                {inspectPost.user && (
                  <div className={`p-3 bg-white shadow-sm border border-gray-200 dark:bg-zinc-950 rounded-xl`}>
                    <span className="text-zinc-500 font-bold text-[10px]">Submitted By Citizen</span>
                    <p className={`font-bold text-foreground`}>{inspectPost.user.name || "Citizen"}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 font-mono text-[10px]">{inspectPost.user.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 flex gap-3">
              <button
                onClick={() => setInspectPost(null)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const p = inspectPost;
                  setInspectPost(null);
                  setPostToDelete(p);
                }}
                className={`flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700  text-xs font-bold flex items-center justify-center gap-2 text-foreground`}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Complaint</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
