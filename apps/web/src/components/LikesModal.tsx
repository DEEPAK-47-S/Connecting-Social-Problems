"use client";

import { useState, useEffect } from "react";
import { X, Heart, ShieldCheck, Loader2, Search, User, Building2, GraduationCap, Landmark } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface LikerUser {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  companyName?: string;
  likedAt?: string;
}

interface LikesModalProps {
  postId: string;
  postTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  token?: string | null;
}

export default function LikesModal({
  postId,
  postTitle,
  isOpen,
  onClose,
  token,
}: LikesModalProps) {
  const { theme } = useTheme();
  const [users, setUsers] = useState<LikerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen && postId) {
      setLoading(true);
      fetch(`${API}/api/posts/${postId}/likes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data.users || []);
        })
        .catch((err) => console.error("Error loading likers:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, postId, token]);

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      u.email.toLowerCase().includes(q) ||
      (u.companyName && u.companyName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] transition-all duration-200 border bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-950 dark:border-zinc-800 dark:text-white`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between sticky top-0 z-10 bg-white/90 border-zinc-200/80 backdrop-blur-md dark:bg-zinc-950/90 dark:border-zinc-800/80 dark:backdrop-blur-md`}
        >
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center">
              <Heart className="h-4 w-4 fill-rose-500" />
            </div>
            <h2 className="font-bold text-base tracking-tight">Likes</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300`}
            >
              {users.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        {users.length > 5 && (
          <div className={`p-3 border-b border-zinc-200 dark:border-zinc-800/60`}>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search citizens & partners..."
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none border transition bg-zinc-100 border-zinc-300 text-zinc-900 placeholder-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:placeholder-zinc-500`}
              />
            </div>
          </div>
        )}

        {/* Scrollable Likers List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
              <span className={`text-xs text-zinc-500 dark:text-zinc-400`}>
                Loading likers...
              </span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500`}
              >
                <Heart className="h-6 w-6" />
              </div>
              <p className="font-bold text-sm">No likes yet</p>
              <p className={`text-xs mt-1 max-w-xs text-zinc-500 dark:text-zinc-400`}>
                Be the first to like this community problem to boost visibility.
              </p>
            </div>
          ) : (
            filteredUsers.map((u) => {
              const displayName = u.name || u.email.split("@")[0];
              const role = (u.role || "CITIZEN").toUpperCase();

              return (
                <div
                  key={u.id}
                  className={`p-2.5 rounded-2xl flex items-center justify-between gap-3 transition hover:bg-zinc-100 dark:hover:bg-zinc-900/60`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar with Story gradient ring */}
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px] flex-shrink-0">
                      <div
                        className={`h-full w-full rounded-full flex items-center justify-center font-bold text-xs bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white`}
                      >
                        {displayName[0].toUpperCase()}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs truncate">{displayName}</span>
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                      </div>
                      <p className={`text-[11px] truncate text-zinc-500 dark:text-zinc-400`}>
                        {u.companyName || u.email}
                      </p>
                    </div>
                  </div>

                  {/* Role Pill */}
                  <div className="flex-shrink-0">
                    {role === "UNIVERSITY" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30 flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        <span>Lab Lead</span>
                      </span>
                    )}
                    {role === "INDUSTRY" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-bold border border-pink-500/30 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>CSR Sponsor</span>
                      </span>
                    )}
                    {role === "GOVERNMENT" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30 flex items-center gap-1">
                        <Landmark className="h-3 w-3" />
                        <span>Civic Official</span>
                      </span>
                    )}
                    {role === "CITIZEN" && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700`}>
                        Citizen
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
