"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
 Heart, MessageCircle, Send,
 ShieldCheck, MapPin, Activity, Plus, Loader2, X, Clock,
 Search, Trash2, AlertTriangle, CheckCircle2,
 Folder, User, Sparkles, Building2, ChevronRight, RefreshCw,
 GraduationCap, Handshake, Bookmark, MoreHorizontal, MessageSquare,
 Edit3
} from "lucide-react";
import CreatePostModal from "@/components/CreatePostModal";
import EditPostModal from "@/components/EditPostModal";
import ProfileModal from "@/components/ProfileModal";
import ApprovalMemoCard from "@/components/ApprovalMemoCard";
import InstagramCommentModal from "@/components/InstagramCommentModal";
import LikesModal from "@/components/LikesModal";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useSocket } from "@/context/SocketContext";
import { TAMIL_NADU_DISTRICTS } from "@/data/tamilNaduDistricts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function formatTime(dateStr: string) {
 const diff = Date.now() - new Date(dateStr).getTime();
 if (diff < 60000) return "JUST NOW";
 if (diff < 3600000) return `${Math.floor(diff / 60000)} MINUTES AGO`;
 if (diff < 86400000) return `${Math.floor(diff / 3600000)} HOURS AGO`;
 return `${Math.floor(diff / 86400000)} DAYS AGO`;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
 SUBMITTED: { label: "Submitted", color: "bg-zinc-800 text-zinc-300 border-zinc-700", desc: "Complaint submitted and queued." },
 AI_ANALYZING: { label: "🤖 AI Analysing...", color: "bg-amber-950/60 text-amber-300 border-amber-800/60", desc: "AI evaluating domain & required skills." },
 UNIVERSITY_MATCHING: { label: "🔍 Matching University...", color: "bg-blue-950/60 text-blue-300 border-blue-800/60", desc: "Dispatched to Tamil Nadu Engineering Labs." },
 UNIVERSITY_ACCEPTED: { label: "🎓 University Accepted", color: "bg-indigo-950/60 text-indigo-300 border-indigo-800/60", desc: "University research lab adopted solution lead." },
 INDUSTRY_MATCHING: { label: "🏭 Matching Industry...", color: "bg-purple-950/60 text-purple-300 border-purple-800/60", desc: "Inviting corporate CSR sponsors." },
 INDUSTRY_ACCEPTED: { label: "🤝 Industry Sponsored", color: "bg-pink-950/60 text-pink-300 border-pink-800/60", desc: "Corporate CSR grant and mentorship locked." },
 PROTOTYPING: { label: "🔧 Prototyping", color: "bg-sky-950/60 text-sky-300 border-sky-800/60", desc: "Fabricating working prototype in lab." },
 TESTING: { label: "🧪 Testing", color: "bg-cyan-950/60 text-cyan-300 border-cyan-800/60", desc: "Ground pilot validation." },
 GOVT_REVIEW: { label: "📋 Govt Review", color: "bg-orange-950/60 text-orange-300 border-orange-800/60", desc: "Municipal safety review." },
 GOVT_APPROVED: { label: "✅ Govt Approved", color: "bg-teal-950/60 text-teal-300 border-teal-800/60", desc: "Sanctioned for permanent rollout." },
 IMPLEMENTATION: { label: "🚀 Implementing", color: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60", desc: "Civil and electrical ground installation." },
 COMPLETED: { label: "🌟 Solved & Implemented", color: "bg-green-950/60 text-green-300 border-green-800/60", desc: "Problem permanently solved." },
 REJECTED: { label: "❌ Rejected", color: "bg-rose-950/60 text-rose-300 border-rose-800/60", desc: "Declined by review committee." },
};

const CATEGORIES = [
 "All",
 "Water Management",
 "Electricity & Power",
 "Roads & Infrastructure",
 "Agriculture & Rural",
 "Waste & Sanitation",
 "Environment & Pollution",
 "Public Safety & Health"
];

// Authentic Instagram-Style Post Component
function InstagramPost({
 post,
 user,
 token,
 onLikeToggle,
 onOpenComments,
 onOpenLikes,
 onRequestDelete,
 onRequestEdit,
 isMyActivity = false,
}: {
 post: any;
 user: any;
 token: string | null;
 onLikeToggle: (id: string, liked: boolean, explicitCount?: number) => void;
 onOpenComments: (post: any) => void;
 onOpenLikes?: (postId: string, title: string) => void;
 onRequestDelete?: (post: any) => void;
 onRequestEdit?: (post: any) => void;
 isMyActivity?: boolean;
}) {
 const { theme } = useTheme();
 const [likedByMe, setLikedByMe] = useState(Boolean(post.likedByMe));
 const [likeCount, setLikeCount] = useState(post.likeCount || 0);
 const [commentCount, setCommentCount] = useState(post.commentCount || (post.comments?.length || 0));
 const [commentText, setCommentText] = useState("");
 const [loadingComment, setLoadingComment] = useState(false);
 const [copied, setCopied] = useState(false);
 const [saved, setSaved] = useState(false);
 const [showFullCaption, setShowFullCaption] = useState(false);

 useEffect(() => {
 setLikedByMe(Boolean(post.likedByMe));
 setLikeCount(post.likeCount || 0);
 setCommentCount(post.commentCount || (post.comments?.length || 0));
 }, [post.likedByMe, post.likeCount, post.commentCount, post]);

 const statusCfg = STATUS_CONFIG[post.status] || STATUS_CONFIG["SUBMITTED"];
 const isOwner = Boolean(user && (user.id === post.userId || user.email === post.user?.email));
 const authorName = post.user?.name || post.user?.email?.split("@")[0] || "citizen_user";

 const handleLike = async () => {
 if (!token) return (window.location.href = "/login");
 const newLiked = !likedByMe;
 const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
 
 // 1. Instant optimistic update locally
 setLikedByMe(newLiked);
 setLikeCount(newCount);
 
 // 2. Instant optimistic update on feed
 onLikeToggle(post.id, newLiked, newCount);

 try {
 const res = await fetch(`${API}/api/posts/${post.id}/like`, {
 method: "POST",
 headers: { Authorization: `Bearer ${token}` },
 });
 const data = await res.json();
 if (res.ok && typeof data.likeCount === "number") {
 setLikeCount(data.likeCount);
 onLikeToggle(post.id, data.liked, data.likeCount);
 }
 } catch {
 // Revert on error
 setLikedByMe(!newLiked);
 setLikeCount(likeCount);
 onLikeToggle(post.id, !newLiked, likeCount);
 }
 };

 const handleAddQuickComment = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!token) return (window.location.href = "/login");
  if (!commentText.trim()) return;
  
  const originalText = commentText;
  
  // 1. Instant optimistic update
  setCommentText("");
  setCommentCount((c: number) => c + 1);
  
  setLoadingComment(true);
  try {
  const res = await fetch(`${API}/api/posts/${post.id}/comments`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ text: originalText.trim() }),
  });
  if (!res.ok) {
    // Revert optimistic update on failure
    setCommentCount((c: number) => Math.max(0, c - 1));
    setCommentText(originalText);
  }
  } catch {
    setCommentCount((c: number) => Math.max(0, c - 1));
    setCommentText(originalText);
  } finally {
  setLoadingComment(false);
  }
  };

 const handleShare = async () => {
 try {
 await navigator.clipboard.writeText(`${window.location.origin}/#post-${post.id}`);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 } catch {}
 fetch(`${API}/api/posts/${post.id}/share`, {
 method: "POST",
 headers: token ? { Authorization: `Bearer ${token}` } : {},
 }).catch(() => {});
 };

 return (
 <article
 id={`post-${post.id}`}
 className={`border rounded-3xl overflow-hidden shadow-xl mb-6 transition duration-200 bg-white border-zinc-200 text-zinc-900 shadow-sm dark:bg-zinc-950 dark:border-zinc-800/80 dark:text-white`}
 >
 {/* 1. Instagram Post Header */}
 <div
 className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-3.5 sm:p-4 border-b bg-zinc-50/80 border-zinc-200 text-zinc-900 dark:bg-zinc-950 dark:border-zinc-800/80 dark:text-white`}
 >
 <div className="flex items-center gap-3">
 {/* Instagram Story-style Gradient Ring Avatar */}
 <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] flex-shrink-0 shadow-md">
 <div
 className={`h-full w-full rounded-full flex items-center justify-center text-xs font-black bg-white text-zinc-900 dark:bg-black dark:text-white`}
 >
 {authorName[0].toUpperCase()}
 </div>
 </div>

 <div>
 <div className="flex items-center gap-1.5">
 <span className="font-bold text-sm hover:underline cursor-pointer">
 {authorName}
 </span>
 {isOwner && (
 <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
 YOU
 </span>
 )}
 </div>

 {/* Location Subtitle */}
 <div className={`flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400`}>
 <MapPin className="h-3 w-3 text-rose-500 flex-shrink-0" />
 <span className="truncate max-w-[200px] sm:max-w-xs font-medium">
 {post.location || post.district || "Tamil Nadu, India"}
 </span>
 </div>
 </div>
 </div>

 {/* Right side: Status Badge and Menu/Delete */}
 <div className="flex flex-wrap items-center justify-end gap-2 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
 <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.color}`}>
 {statusCfg.label}
 </span>

 {isOwner && (
 <div className="flex items-center gap-1">
 {onRequestEdit && (
 <button
 onClick={() => onRequestEdit(post)}
 className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors bg-zinc-100 dark:bg-zinc-900 rounded-full sm:bg-transparent sm:dark:bg-transparent"
 title="Edit post"
 >
 <Edit3 className="h-4 w-4" />
 </button>
 )}
 {onRequestDelete && (
 <button
 onClick={() => onRequestDelete(post)}
 className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors bg-zinc-100 dark:bg-zinc-900 rounded-full sm:bg-transparent sm:dark:bg-transparent"
 title="Delete post permanently"
 >
 <Trash2 className="h-4 w-4" />
 </button>
 )}
 </div>
 )}
 </div>
 </div>

 {/* 2. Instagram Main Media Section */}
 <div
 className={`relative flex items-center justify-center bg-zinc-100 dark:bg-zinc-950`}
 >
 {post.imageUrl ? (
 <img
 src={post.imageUrl.startsWith("data:") || post.imageUrl.startsWith("http") ? post.imageUrl : `${API}${post.imageUrl.startsWith("/") ? "" : "/"}${post.imageUrl}`}
 alt={post.title}
 className="w-full object-cover max-h-[550px] min-h-[280px]"
 loading="lazy"
 />
 ) : (
 /* Sleek Graphic Fallback when no photo attached */
 <div
 className={`w-full py-16 px-6 flex flex-col items-center justify-center text-center border-y bg-card text-card-foreground border-border`}
 >
 <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center mb-3 shadow-lg shadow-rose-500/20">
 <Activity className="h-7 w-7 text-white" />
 </div>
 <h4
 className={`font-extrabold text-lg max-w-md leading-snug px-4 text-zinc-900 dark:text-white`}
 >
 "{post.title}"
 </h4>
 <p
 className={`text-xs mt-2 max-w-sm line-clamp-2 text-zinc-600 dark:text-zinc-400`}
 >
 {post.description}
 </p>
 {post.category && (
 <span
 className={`mt-3 px-3 py-1 rounded-full text-[11px] font-bold border bg-white text-rose-600 border-zinc-300 shadow-sm dark:bg-zinc-800 dark:text-rose-400 dark:border-zinc-700`}
 >
 #{post.category.replace(/\s+/g, "")}
 </span>
 )}
 </div>
 )}
 </div>

 {/* 3. Instagram Action Bar (Aligned Icons & Counters) */}
 <div
 className={`px-4 py-3 flex items-center justify-between border-t bg-white border-zinc-100 text-zinc-800 dark:bg-zinc-950 dark:border-zinc-800/40 dark:text-white`}
 >
 <div className="flex items-center gap-6">
 {/* Like Action */}
 <button
 type="button"
 onClick={handleLike}
 className="flex flex-col items-center justify-center transition-transform active:scale-125 focus:outline-none group min-w-[36px]"
 title={likedByMe ? "Unlike" : "Like"}
 >
 <div className="h-6 w-6 flex items-center justify-center">
 <Heart
 className={`h-6 w-6 transition-colors ${
 likedByMe
 ? "fill-rose-500 text-rose-500 animate-in zoom-in-75 duration-200"
 : (theme === "dark")
 ? "text-white group-hover:text-rose-400"
 : "text-zinc-700 group-hover:text-rose-600"
 }`}
 />
 </div>
 <span
 className={`text-[11px] font-bold mt-1 leading-none transition-colors ${
 likedByMe
 ? "text-rose-500"
 : (theme === "dark")
 ? "text-zinc-400 group-hover:text-white"
 : "text-zinc-600 group-hover:text-zinc-900"
 }`}
 >
 {likeCount}
 </span>
 </button>

 {/* Comment Action */}
 <button
 type="button"
 onClick={() => onOpenComments(post)}
 className="flex flex-col items-center justify-center transition-transform active:scale-110 focus:outline-none group min-w-[36px]"
 title="View comments and discussions"
 >
 <div className="h-6 w-6 flex items-center justify-center">
 <MessageCircle
 className={`h-6 w-6 transition-colors text-zinc-700 group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-400`}
 />
 </div>
 <span
 className={`text-[11px] font-bold mt-1 leading-none transition-colors text-zinc-600 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white`}
 >
 {commentCount}
 </span>
 </button>

 {/* Share Action */}
 <button
 type="button"
 onClick={handleShare}
 className="flex flex-col items-center justify-center transition-transform active:scale-125 focus:outline-none relative group min-w-[36px]"
 title="Share link"
 >
 <div className="h-6 w-6 flex items-center justify-center">
 <Send
 className={`h-6 w-6 transition-colors text-zinc-700 group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-400`}
 />
 </div>
 <span
 className={`text-[11px] font-bold mt-1 leading-none transition-colors text-zinc-600 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white`}
 >
 Share
 </span>
 {copied && (
 <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-rose-600 text-white text-[9px] font-bold rounded shadow-lg whitespace-nowrap animate-in fade-in">
 Link copied!
 </span>
 )}
 </button>
 </div>

 {/* Bookmark Save */}
 <button
 type="button"
 onClick={() => setSaved(!saved)}
 className="flex flex-col items-center justify-center transition focus:outline-none group min-w-[36px]"
 title="Save"
 >
 <div className="h-6 w-6 flex items-center justify-center">
 <Bookmark
 className={`h-6 w-6 transition-colors ${
 saved
 ? (theme === "dark")
 ? "fill-white text-white"
 : "fill-zinc-900 text-zinc-900"
 : (theme === "dark")
 ? "text-white group-hover:text-zinc-400"
 : "text-zinc-700 group-hover:text-zinc-900"
 }`}
 />
 </div>
 <span
 className={`text-[11px] font-bold mt-1 leading-none transition-colors text-zinc-600 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white`}
 >
 {saved ? "Saved" : "Save"}
 </span>
 </button>
 </div>

 {/* 4. Likes & Engagement Counter (Clickable to view list of people who liked) */}
 <div className={`px-4 pb-1 bg-white dark:bg-zinc-950`}>
 <button
 type="button"
 onClick={() => onOpenLikes?.(post.id, post.title)}
 className={`font-bold text-xs hover:underline cursor-pointer transition text-left focus:outline-none flex items-center gap-1 text-zinc-900 hover:text-rose-600 dark:text-white dark:hover:text-rose-400`}
 title="See who liked this post"
 >
 <span>{likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}</span>
 </button>
 </div>

 {/* 5. Caption Section (Username + Problem Title + Description + Hashtags) */}
 <div
 className={`px-4 py-1.5 text-xs leading-relaxed space-y-1 bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200`}
 >
 <div>
 <span className="font-extrabold mr-2 cursor-pointer hover:underline">
 {authorName}
 </span>
 <span className="font-bold text-sm block sm:inline mr-2">
 {post.title}
 </span>
 </div>

 <p className={`mt-1 whitespace-pre-line ${!showFullCaption ? "line-clamp-2" : ""} text-zinc-700 dark:text-zinc-300`}>
 {post.description}
 </p>

 {post.description && post.description.length > 100 && (
 <button
 onClick={() => setShowFullCaption(!showFullCaption)}
 className={`text-[11px] font-semibold block text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300`}
 >
 {showFullCaption ? "less" : "...more"}
 </button>
 )}

 {/* Hashtags */}
 <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-medium text-rose-500">
 {post.category && <span>#{post.category.replace(/\s+/g, "")}</span>}
 {post.district && <span>#{post.district.replace(/\s+/g, "")}</span>}
 <span>#TamilNaduCivicHub</span>
 </div>
 </div>

 {/* 6. Embedded Official Sanction / R&D Scope Card (if accepted) */}
 {post.status !== "SUBMITTED" && post.status !== "AI_ANALYZING" && post.status !== "UNIVERSITY_MATCHING" && (
 <div className={`p-4 pt-2 bg-white dark:bg-zinc-950`}>
 <ApprovalMemoCard
 post={post}
 variant="default"
 title="Official Academic Sanction & CSR Mandate"
 />
 </div>
 )}

 {/* 7. View All Comments Trigger Sub-Block */}
 <div className={`px-4 py-2 bg-white dark:bg-zinc-950`}>
 <button
 onClick={() => onOpenComments(post)}
 className={`text-xs font-semibold hover:underline flex items-center gap-1.5 transition text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200`}
 >
 <MessageCircle className="h-3.5 w-3.5 text-rose-500" />
 <span>
 {commentCount > 0
 ? `View all ${commentCount} ${commentCount === 1 ? "comment" : "comments"}`
 : "View discussions & leave a comment"}
 </span>
 </button>
 </div>

 {/* 8. Timestamp */}
 <div className={`px-4 pb-3 pt-1 bg-white dark:bg-zinc-950`}>
 <span className={`text-[9px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500`}>
 {formatTime(post.createdAt)}
 </span>
 </div>
 </article>
 );
}

export default function HomePage() {
 const { theme } = useTheme();
 const [posts, setPosts] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [activeTab, setActiveTab] = useState<"feed" | "myActivity">("feed");
 const [showCreate, setShowCreate] = useState(false);
 const [postToEdit, setPostToEdit] = useState<any | null>(null);
 const [showProfile, setShowProfile] = useState(false);
 const [user, setUser] = useState<any>(null);
 const [token, setToken] = useState<string | null>(null);

 // Instagram Comments Pop-up Modal Sub Block
 const [activeCommentPost, setActiveCommentPost] = useState<any | null>(null);

 // Instagram Likes Pop-up Modal
 const [activeLikesPost, setActiveLikesPost] = useState<{ id: string; title: string } | null>(null);

 // Search & Filter
 const [searchQuery, setSearchQuery] = useState("");
 const [selectedCategory, setSelectedCategory] = useState("All");
 const [selectedDistrict, setSelectedDistrict] = useState("All");

 // Deletion Modal
 const [postToDelete, setPostToDelete] = useState<any | null>(null);
 const [deleting, setDeleting] = useState(false);
 const [deleteSuccessToast, setDeleteSuccessToast] = useState("");

 const { socket } = useSocket();

 useEffect(() => {
 if (!socket) return;

 const handleNewPost = (post: any) => {
 setPosts((prev) => [post, ...prev]);
 };

 const handlePostLiked = ({ postId, likeCount }: any) => {
 setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likeCount } : p)));
 };

 const handleNewComment = ({ postId }: any) => {
 setPosts((prev) =>
 prev.map((p) =>
 p.id === postId ? { ...p, commentCount: Math.max(0, (p.commentCount || 0) + 1) } : p
 )
 );
 setActiveCommentPost((prev: any) =>
 prev && prev.id === postId
 ? { ...prev, commentCount: Math.max(0, (prev.commentCount || 0) + 1) }
 : prev
 );
 };

 socket.on("new-post", handleNewPost);
 socket.on("post-liked", handlePostLiked);
 socket.on("new-comment", handleNewComment);

 return () => {
 socket.off("new-post", handleNewPost);
 socket.off("post-liked", handlePostLiked);
 socket.off("new-comment", handleNewComment);
 };
 }, [socket]);

 const fetchPosts = useCallback(async (authToken?: string | null, silent = false) => {
  if (!silent) setLoading(true);
  try {
  const currentToken = authToken !== undefined ? authToken : (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const headers: HeadersInit = currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
  const res = await fetch(`${API}/api/posts?limit=100`, { headers });
  const data = await res.json();
  if (res.ok) {
  setPosts(data.posts || []);
  } else {
  if (!silent) setError(data.error || "Failed to load posts.");
  }
  } catch {
  if (!silent) setError("Cannot reach backend server. Please verify it is running on port 4000.");
  } finally {
  if (!silent) setLoading(false);
  }
  }, []);

 useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  if (storedToken && storedUser) {
  setToken(storedToken);
  try {
  setUser(JSON.parse(storedUser));
  } catch {}
  }
  fetchPosts(storedToken);

  // Silent Background Poller for real-time updates across users (1.0 seconds)
  // Ensures Vercel updates without needing WebSockets or page refresh
  const interval = setInterval(() => {
    fetchPosts(storedToken, true);
  }, 1000);

  return () => clearInterval(interval);
  }, [fetchPosts]);

 const handleLogout = () => {
 localStorage.removeItem("token");
 localStorage.removeItem("user");
 setUser(null);
 setToken(null);
 setActiveTab("feed");
 };

 const handlePostCreated = (newPost: any) => {
 setPosts((prev) => [newPost, ...prev]);
 };

 const handlePostUpdated = (updatedPost: any) => {
 setPosts((prev) =>
 prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
 );
 };

 const handleLikeToggle = (postId: string, liked: boolean, explicitCount?: number) => {
 setPosts((prev) =>
 prev.map((p) => {
 if (p.id === postId) {
 const nextCount =
 explicitCount !== undefined
 ? explicitCount
 : liked
 ? (p.likeCount || 0) + 1
 : Math.max(0, (p.likeCount || 0) - 1);
 return { ...p, likedByMe: liked, likeCount: nextCount };
 }
 return p;
 })
 );
 };

 const handleCommentCountDelta = (postId: string, delta: number) => {
 setPosts((prev) =>
 prev.map((p) => {
 if (p.id === postId) {
 const nextCount = Math.max(0, (p.commentCount || 0) + delta);
 return { ...p, commentCount: nextCount };
 }
 return p;
 })
 );
 setActiveCommentPost((prev: any) =>
 prev && prev.id === postId
 ? { ...prev, commentCount: Math.max(0, (prev.commentCount || 0) + delta) }
 : prev
 );
 };

 // Permanent Database Deletion Handler
 const handleConfirmDelete = async () => {
 if (!postToDelete) return;
 setDeleting(true);

 try {
 const res = await fetch(`${API}/api/posts/${postToDelete.id}`, {
 method: "DELETE",
 headers: token ? { Authorization: `Bearer ${token}` } : {},
 });

 const data = await res.json();
 if (!res.ok) {
 throw new Error(data.error || "Failed to delete complaint from database.");
 }

 setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
 setDeleteSuccessToast(`Complaint "${postToDelete.title.slice(0, 30)}..." deleted permanently from database.`);
 setPostToDelete(null);

 setTimeout(() => setDeleteSuccessToast(""), 4000);
 } catch (err: any) {
 alert(err.message || "Could not delete complaint. Please try again.");
 } finally {
 setDeleting(false);
 }
 };

 // Filtered complaints
 const filteredPosts = useMemo(() => {
 return posts.filter((post) => {
 if (activeTab === "myActivity") {
 const isMine = user && (post.userId === user.id || post.user?.email === user.email);
 if (!isMine) return false;
 }

 if (selectedCategory !== "All") {
 const cat = (post.category || "").toLowerCase();
 const sel = selectedCategory.toLowerCase();
 if (!cat.includes(sel.split(" ")[0])) return false;
 }

 if (selectedDistrict !== "All") {
 if (post.district !== selectedDistrict) return false;
 }

 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase().trim();
 const titleMatch = post.title?.toLowerCase().includes(q);
 const descMatch = post.description?.toLowerCase().includes(q);
 const locMatch = post.location?.toLowerCase().includes(q);
 const distMatch = post.district?.toLowerCase().includes(q);
 const catMatch = post.category?.toLowerCase().includes(q);
 const collegeMatch = post.acceptedCollegeName?.toLowerCase().includes(q);
 const industryMatch = post.acceptedIndustryName?.toLowerCase().includes(q);

 if (!titleMatch && !descMatch && !locMatch && !distMatch && !catMatch && !collegeMatch && !industryMatch) {
 return false;
 }
 }

 return true;
 });
 }, [posts, activeTab, user, selectedCategory, selectedDistrict, searchQuery]);

 const myComplaintsCount = useMemo(() => {
 if (!user) return 0;
 return posts.filter((p) => p.userId === user.id || p.user?.email === user.email).length;
 }, [posts, user]);

 return (
 <div
 className={`min-h-screen flex flex-col font-sans transition-colors duration-200 bg-background text-foreground selection:bg-rose-500/20 dark:selection:bg-rose-500/30`}
 >
 {/* Toast Notification */}
 {deleteSuccessToast && (
 <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-4">
 <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
 <span>{deleteSuccessToast}</span>
 </div>
 )}

  {/* 1. Instagram-Style Top Navigation */}
  <header
  className={`px-4 sm:px-8 py-3 md:py-0 min-h-[4rem] md:h-16 flex items-center border-b backdrop-blur-md sticky top-0 z-40 bg-white/90 border-zinc-200 text-zinc-900 shadow-sm dark:bg-black/90 dark:border-zinc-800/80 dark:text-white`}
  >
  <div className="max-w-xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
  <Link href="/" className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 group w-full sm:w-auto">
  <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
  <Activity className="h-5 w-5 text-white" />
  </div>
  <span className="font-black text-lg sm:text-xl tracking-tight italic text-center sm:text-left break-words">
  Connecting Social Problem
  </span>
  </Link>

 <div className="flex items-center gap-2.5">
 {/* Theme Toggle (Dark / Light) */}
 <ThemeToggle />

 {token && user ? (
 <>
 <button
 onClick={() => setShowCreate(true)}
 className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-95 transition shadow-md shadow-rose-500/20"
 >
 <Plus className="h-4 w-4" /> <span>Post</span>
 </button>

 <button
 onClick={() => setShowProfile(true)}
 className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold transition bg-zinc-100 border-zinc-300 text-zinc-800 hover:border-zinc-400 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-500`}
 title="Profile"
 >
 {(user.name || user.email || "?")[0].toUpperCase()}
 </button>

 
 </>
 ) : (
 <Link
 href="/login"
 className="px-4 py-1.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition shadow-md"
 >
 Log In
 </Link>
 )}
 </div>
  </div>
  </header>

  {/* 2. Main Feed Container */}
  <main className="flex-1 max-w-xl mx-auto w-full py-5 px-3 sm:px-0 overflow-x-hidden">
 
 {/* Instagram-Style Story Filter Bar & Search */}
 <div className="mb-5 space-y-3">
 {/* Tabs */}
 <div
 className={`flex p-1 rounded-2xl border text-xs font-bold bg-zinc-100 border-zinc-200 dark:bg-zinc-900/90 dark:border-zinc-800`}
 >
 <button
 onClick={() => setActiveTab("feed")}
 className={`flex-1 py-2 rounded-xl transition ${
 activeTab === "feed"
 ? (theme === "dark")
 ? "bg-zinc-800 text-white shadow-sm"
 : "bg-white text-zinc-900 shadow-sm"
 : (theme === "dark")
 ? "text-zinc-400 hover:text-white"
 : "text-zinc-600 hover:text-zinc-900"
 }`}
 >
 Feed ({posts.length})
 </button>
 <button
 onClick={() => {
 if (!token) {
 window.location.href = "/login";
 return;
 }
 setActiveTab("myActivity");
 }}
 className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
 activeTab === "myActivity"
 ? (theme === "dark")
 ? "bg-zinc-800 text-white shadow-sm"
 : "bg-white text-zinc-900 shadow-sm"
 : (theme === "dark")
 ? "text-zinc-400 hover:text-white"
 : "text-zinc-600 hover:text-zinc-900"
 }`}
 >
 <span>My Activity</span>
 {user && (
 <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-500 font-bold">
 {myComplaintsCount}
 </span>
 )}
 </button>
 </div>

 {/* Search Input */}
 <div className="relative">
 <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-400" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search community posts, landmarks, districts..."
 className={`w-full pl-10 pr-9 py-2 rounded-2xl text-xs outline-none border transition bg-white text-zinc-900 placeholder-zinc-400 border-zinc-300 focus:border-zinc-400 shadow-sm dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:border-zinc-800 dark:focus:border-zinc-700`}
 />
 {searchQuery && (
 <button
 onClick={() => setSearchQuery("")}
 className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
 >
 <X className="h-4 w-4" />
 </button>
 )}
 </div>

 {/* District & Category Scroll Bar */}
 <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
 <div
 className={`flex items-center gap-1 px-3 py-1.5 rounded-full border flex-shrink-0 bg-white border-zinc-300 text-zinc-900 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`}
 >
 <MapPin className="h-3 w-3 text-rose-500" />
 <select
 value={selectedDistrict}
 onChange={(e) => setSelectedDistrict(e.target.value)}
 className={`bg-transparent font-bold text-xs outline-none cursor-pointer text-zinc-900 dark:text-white`}
 >
 <option value="All" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">All Districts</option>
 {TAMIL_NADU_DISTRICTS.map((d) => (
 <option key={d} value={d} className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">{d}</option>
 ))}
 </select>
 </div>

 {CATEGORIES.map((cat) => (
 <button
 key={cat}
 onClick={() => setSelectedCategory(cat)}
 className={`px-3 py-1.5 rounded-full whitespace-nowrap font-bold text-xs transition flex-shrink-0 ${
 selectedCategory === cat
 ? (theme === "dark")
 ? "bg-white text-black"
 : "bg-zinc-900 text-white shadow-sm"
 : (theme === "dark")
 ? "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
 : "bg-white text-zinc-600 border border-zinc-200 hover:text-zinc-900 shadow-sm"
 }`}
 >
 {cat}
 </button>
 ))}
 </div>
 </div>

 {/* Feed Posts */}
 {loading ? (
 <div className="flex flex-col items-center justify-center py-24 gap-3">
 <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
 <p className="text-xs font-bold text-zinc-500">Loading feed...</p>
 </div>
 ) : error ? (
 <div
 className={`text-center py-16 rounded-3xl border p-6 bg-white border-rose-200 shadow-md dark:bg-zinc-950 dark:border-rose-500/30`}
 >
 <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
 <p className="text-rose-500 font-bold text-xs mb-3">{error}</p>
 <button
 onClick={() => fetchPosts()}
 className={`px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700`}
 >
 Retry
 </button>
 </div>
 ) : filteredPosts.length === 0 ? (
 <div
 className={`text-center py-20 rounded-3xl border p-8 bg-white border-zinc-200 shadow-sm dark:bg-zinc-950 dark:border-zinc-900`}
 >
 <Sparkles className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
 <h3 className="font-bold text-sm">
 {activeTab === "myActivity" ? "No activity posts yet" : "No posts found"}
 </h3>
 <p className={`text-xs mt-1 text-zinc-400 dark:text-zinc-500`}>
 {activeTab === "myActivity"
 ? "Post a civic issue in your neighborhood to initiate university research."
 : "Try searching for a different keyword or district."}
 </p>
 </div>
 ) : (
 <div>
 {filteredPosts.map((post) => (
 <InstagramPost
 key={post.id}
 post={post}
 user={user}
 token={token}
 onLikeToggle={handleLikeToggle}
 onOpenComments={(p) => setActiveCommentPost(p)}
 onOpenLikes={(id, title) => setActiveLikesPost({ id, title })}
 onRequestDelete={(p) => setPostToDelete(p)}
 onRequestEdit={(p) => setPostToEdit(p)}
 isMyActivity={activeTab === "myActivity"}
 />
 ))}
 </div>
 )}
 </main>

 {/* Floating Plus Button on Mobile */}
 {token && (
 <button
 onClick={() => setShowCreate(true)}
 className="fixed bottom-6 right-6 h-13 w-13 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-30 sm:hidden"
 >
 <Plus className="h-6 w-6" />
 </button>
 )}

 {/* Instagram Comments Pop-up Modal Sub Block */}
 {activeCommentPost && (
 <InstagramCommentModal
 post={activeCommentPost}
 isOpen={Boolean(activeCommentPost)}
 onClose={() => setActiveCommentPost(null)}
 currentUser={user}
 token={token}
 onCommentCountChange={handleCommentCountDelta}
 />
 )}

 {/* Instagram Likes Modal (Shows who liked the post) */}
 {activeLikesPost && (
 <LikesModal
 postId={activeLikesPost.id}
 postTitle={activeLikesPost.title}
 isOpen={Boolean(activeLikesPost)}
 onClose={() => setActiveLikesPost(null)}
 token={token}
 />
 )}

 {/* Delete Confirmation Modal */}
 {postToDelete && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
 <div
 className={`rounded-3xl max-w-md w-full p-6 border shadow-2xl bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`}
 >
 <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
 <Trash2 className="h-6 w-6" />
 </div>

 <h3 className="font-black text-lg">
 Delete Post?
 </h3>

 <p className={`text-xs mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400`}>
 Are you sure you want to permanently delete <span className="font-bold">"{postToDelete.title}"</span> from the database?
 </p>

 <div className="flex gap-3 mt-6">
 <button
 type="button"
 onClick={() => setPostToDelete(null)}
 disabled={deleting}
 className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800`}
 >
 Cancel
 </button>
 <button
 type="button"
 onClick={handleConfirmDelete}
 disabled={deleting}
 className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-2"
 >
 {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
 <span>{deleting ? "Deleting..." : "Delete"}</span>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Create Post Modal */}
 {showCreate && (
 <CreatePostModal onClose={() => setShowCreate(false)} onPosted={handlePostCreated} />
 )}

 {/* Edit Post Modal */}
 {postToEdit && (
 <EditPostModal
 post={postToEdit}
 onClose={() => setPostToEdit(null)}
 onUpdated={handlePostUpdated}
 />
 )}

 {/* Profile Modal */}
 {showProfile && (
 <ProfileModal
 isOpen={showProfile}
 onClose={() => setShowProfile(false)}
 role="CITIZEN"
 currentUser={user}
 onUpdateUser={(updated) => setUser(updated)}
 />
 )}
 </div>
 );
}
