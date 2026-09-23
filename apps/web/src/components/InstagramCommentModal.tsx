"use client";

import { useState, useEffect, useRef } from "react";
import {
  X, Heart, MessageCircle, Send, Trash2, CornerDownRight,
  ShieldCheck, Loader2, Sparkles, User, Smile
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSocket } from "@/context/SocketContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function formatCommentTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
  return `${Math.floor(diff / 604800000)}w`;
}

export interface CommentItem {
  id: string;
  postId: string;
  parentId?: string | null;
  text: string;
  createdAt: string;
  likeCount: number;
  likedByMe?: boolean;
  user?: {
    id: string;
    name?: string;
    email: string;
    avatarUrl?: string;
    role?: string;
  };
  replies?: CommentItem[];
}

interface InstagramCommentModalProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  token: string | null;
  onCommentCountChange?: (postId: string, delta: number) => void;
}

export default function InstagramCommentModal({
  post,
  isOpen,
  onClose,
  currentUser,
  token,
  onCommentCountChange,
}: InstagramCommentModalProps) {
  const { theme } = useTheme();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const { socket } = useSocket();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load comments
  const loadComments = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${API}/api/posts/${post.id}/comments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && post?.id) {
      loadComments();
      
      // Silent Poller for live comments (1.0 seconds)
      const interval = setInterval(() => {
        loadComments(true);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, post?.id]);

  useEffect(() => {
    if (!socket || !isOpen || !post) return;

    const handleNewComment = ({ postId, comment }: any) => {
      // Avoid duplicating the comment we just posted (we add it optimistically in handleAddComment)
      // Actually, since we optimistically add it, we should check if it exists or we can just ignore optimistic and rely on socket
      // But we already do optimistic. A simple dedupe check by ID:
      if (postId === post.id) {
        setComments((prev) => {
          // Check if already exists in top level
          if (prev.some((c) => c.id === comment.id)) return prev;
          
          if (!comment.parentId) {
            return [comment, ...prev];
          } else {
            return prev.map((c) => {
              if (c.id === comment.parentId) {
                if (c.replies?.some((r) => r.id === comment.id)) return c;
                return { ...c, replies: [...(c.replies || []), comment] };
              }
              return c;
            });
          }
        });
      }
    };

    socket.on("new-comment", handleNewComment);
    return () => {
      socket.off("new-comment", handleNewComment);
    };
  }, [socket, isOpen, post]);

  if (!isOpen || !post) return null;

  const postAuthorName = post.user?.name || "citizen_user";

  // Add Comment or Reply
  const handleAddComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!activeToken) {
      alert("Please log in to comment on civic complaints.");
      window.location.href = "/login";
      return;
    }
    if (!commentText.trim() || submitting) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticComment: CommentItem = {
      id: tempId,
      postId: post.id,
      parentId: replyingTo?.id || null,
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likedByMe: false,
      user: currentUser, // Assuming currentUser has id, name, avatarUrl
    };

    // 1. Optimistic Update (Immediate)
    if (replyingTo?.id) {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === replyingTo.id) return { ...c, replies: [...(c.replies || []), optimisticComment] };
          return c;
        })
      );
      setExpandedReplies((prev) => ({ ...prev, [replyingTo.id]: true }));
    } else {
      setComments((prev) => [optimisticComment, ...prev]);
    }
    
    const originalText = commentText;
    setCommentText("");
    setReplyingTo(null);
    if (onCommentCountChange) onCommentCountChange(post.id, 1);

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          text: originalText.trim(),
          parentId: replyingTo?.id || null,
        }),
      });

      const data = await res.json();
      if (res.status === 401) {
        alert("Your session has expired. Please log in again.");
        window.location.href = "/login";
        return;
      }
      
      if (res.ok && data.comment) {
        // Swap temp comment with real server comment silently
        setComments((prev) => {
          if (replyingTo?.id) {
            return prev.map(c => c.id === replyingTo.id ? { ...c, replies: c.replies?.map(r => r.id === tempId ? data.comment : r) } : c);
          } else {
            return prev.map(c => c.id === tempId ? data.comment : c);
          }
        });
        
        // Scroll to bottom or top
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }
        }, 100);
      } else {
        // Revert on error
        setComments((prev) => prev.filter(c => c.id !== tempId));
        if (onCommentCountChange) onCommentCountChange(post.id, -1);
        setCommentText(originalText);
        alert(data.error || "Failed to post comment");
      }
    } catch {
      // Revert on error
      setComments((prev) => prev.filter(c => c.id !== tempId));
      if (onCommentCountChange) onCommentCountChange(post.id, -1);
      setCommentText(originalText);
      alert("Error posting comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Comment Like
  const handleToggleLike = async (commentId: string, isReply = false, parentId?: string) => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Optimistic UI Update
    setComments((prev) =>
      prev.map((c) => {
        if (!isReply && c.id === commentId) {
          const nextLiked = !c.likedByMe;
          return {
            ...c,
            likedByMe: nextLiked,
            likeCount: nextLiked ? c.likeCount + 1 : Math.max(0, c.likeCount - 1),
          };
        }
        if (isReply && c.id === parentId && c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) => {
              if (r.id === commentId) {
                const nextLiked = !r.likedByMe;
                return {
                  ...r,
                  likedByMe: nextLiked,
                  likeCount: nextLiked ? r.likeCount + 1 : Math.max(0, r.likeCount - 1),
                };
              }
              return r;
            }),
          };
        }
        return c;
      })
    );

    try {
      const res = await fetch(`${API}/api/posts/comments/${commentId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => {
            if (!isReply && c.id === commentId) {
              return { ...c, likedByMe: data.liked, likeCount: data.likeCount };
            }
            if (isReply && c.id === parentId && c.replies) {
              return {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === commentId
                    ? { ...r, likedByMe: data.liked, likeCount: data.likeCount }
                    : r
                ),
              };
            }
            return c;
          })
        );
      }
    } catch {
      // Revert on error
      loadComments();
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId: string, isReply = false, parentId?: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`${API}/api/posts/comments/${commentId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        if (!isReply) {
          setComments((prev) => prev.filter((c) => c.id !== commentId));
        } else if (parentId) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === parentId
                ? { ...c, replies: (c.replies || []).filter((r) => r.id !== commentId) }
                : c
            )
          );
        }
        if (onCommentCountChange) onCommentCountChange(post.id, -1);
      }
    } catch {
      alert("Failed to delete comment");
    }
  };

  // Start Reply Mode
  const handleReplyClick = (comment: CommentItem) => {
    const authorName = comment.user?.name || "user";
    setReplyingTo({ id: comment.id, name: authorName });
    setCommentText(`@${authorName} `);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleRepliesAccordion = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const quickEmojis = ["❤️", "🙌", "🔥", "👏", "💡", "🚨", "✨"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-all duration-200 border bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-950 dark:border-zinc-800 dark:text-white`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between sticky top-0 z-10 bg-white/90 border-zinc-200/80 backdrop-blur-md dark:bg-zinc-950/90 dark:border-zinc-800/80 dark:backdrop-blur-md`}
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-rose-500" />
            <h2 className="font-bold text-base tracking-tight">Comments</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300`}
            >
              {comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Comments Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-5 py-4 space-y-4 divide-y divide-zinc-800/40"
        >
          {/* 1. Original Post Caption Card */}
          <div className="pb-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px] flex-shrink-0">
              <div
                className={`h-full w-full rounded-full flex items-center justify-center font-bold text-xs bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white`}
              >
                {postAuthorName[0].toUpperCase()}
              </div>
            </div>
            <div className="flex-1 text-xs leading-relaxed">
              <div className="flex items-center gap-1.5">
                <span className="font-bold">{postAuthorName}</span>
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                <span className={`text-[10px] text-zinc-400 dark:text-zinc-500`}>
                  • {formatCommentTime(post.createdAt)}
                </span>
              </div>
              <p className={`mt-1 font-medium text-zinc-800 dark:text-zinc-200`}>
                <span className="font-bold mr-1">{post.title}</span> — {post.description}
              </p>
            </div>
          </div>

          {/* 2. Loading State */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
              <span className={`text-xs text-zinc-500 dark:text-zinc-400`}>
                Loading conversation thread...
              </span>
            </div>
          ) : comments.length === 0 ? (
            /* Empty State */
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500`}
              >
                <MessageCircle className="h-6 w-6" />
              </div>
              <p className="font-bold text-sm">No comments yet</p>
              <p className={`text-xs mt-1 max-w-xs text-zinc-500 dark:text-zinc-400`}>
                Be the first citizen or research lead to share technical insights or support.
              </p>
            </div>
          ) : (
            /* 3. Top-Level Comments List */
            comments.map((comment) => {
              const commenterName =
                comment.user?.name || "community_user";
              const isOwner = Boolean(
                currentUser &&
                  (currentUser.id === comment.user?.id || currentUser.email === comment.user?.email)
              );
              const repliesCount = comment.replies?.length || 0;
              const isRepliesOpen = expandedReplies[comment.id];

              return (
                <div key={comment.id} className="pt-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-3 group">
                    {/* Left: Avatar + Body */}
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 border bg-zinc-200 border-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200`}
                      >
                        {commenterName[0].toUpperCase()}
                      </div>

                      <div className="flex-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">{commenterName}</span>
                          {comment.user?.role === "UNIVERSITY" && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-semibold">
                              Lab Lead
                            </span>
                          )}
                          {comment.user?.role === "INDUSTRY" && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 font-semibold">
                              CSR
                            </span>
                          )}
                          <span className={`text-[10px] text-zinc-400 dark:text-zinc-500`}>
                            {formatCommentTime(comment.createdAt)}
                          </span>
                        </div>

                        <p className={`mt-1 text-xs text-zinc-800 dark:text-zinc-200`}>
                          {comment.text}
                        </p>

                        {/* Reply Action */}
                        <div className="flex items-center gap-4 mt-2 text-[11px]">
                          <button
                            onClick={() => handleReplyClick(comment)}
                            className={`font-semibold hover:underline text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white`}
                          >
                            Reply
                          </button>

                          {comment.likeCount > 0 && (
                            <span className="text-zinc-400 dark:text-zinc-500">
                              {comment.likeCount} {comment.likeCount === 1 ? "like" : "likes"}
                            </span>
                          )}

                          {isOwner && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition p-1"
                              title="Delete comment"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Heart Like Button */}
                    <button
                      onClick={() => handleToggleLike(comment.id)}
                      className={`p-1.5 transition flex flex-col items-center gap-0.5 ${
                        comment.likedByMe
                          ? "text-rose-500 hover:scale-110"
                          : (theme === "dark")
                          ? "text-zinc-500 hover:text-zinc-300"
                          : "text-zinc-400 hover:text-zinc-600"
                      }`}
                    >
                      <Heart
                        className="h-3.5 w-3.5"
                        fill={comment.likedByMe ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  {/* Nested Replies View Button */}
                  {repliesCount > 0 && (
                    <div className="pl-11">
                      <button
                        onClick={() => toggleRepliesAccordion(comment.id)}
                        className={`text-[11px] font-semibold flex items-center gap-1.5 transition text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white`}
                      >
                        <span className="w-6 h-[1px] bg-zinc-600"></span>
                        <span>
                          {isRepliesOpen
                            ? "Hide replies"
                            : `View ${repliesCount} ${repliesCount === 1 ? "reply" : "replies"}`}
                        </span>
                      </button>

                      {/* Nested Replies Thread */}
                      {isRepliesOpen && (
                        <div className="mt-3 space-y-3 pl-2 border-l border-zinc-800">
                          {comment.replies?.map((reply) => {
                            const replyAuthor =
                              reply.user?.name || "user";
                            const isReplyOwner = Boolean(
                              currentUser &&
                                (currentUser.id === reply.user?.id ||
                                  currentUser.email === reply.user?.email)
                            );

                            return (
                              <div
                                key={reply.id}
                                className="flex items-start justify-between gap-3 group"
                              >
                                <div className="flex items-start gap-2.5 flex-1">
                                  <div
                                    className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 border bg-zinc-200 border-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200`}
                                  >
                                    {replyAuthor[0].toUpperCase()}
                                  </div>

                                  <div className="flex-1 text-xs">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-[11px]">{replyAuthor}</span>
                                      <span
                                        className={`text-[9px] text-zinc-400 dark:text-zinc-500`}
                                      >
                                        {formatCommentTime(reply.createdAt)}
                                      </span>
                                    </div>
                                    <p
                                      className={`mt-0.5 text-xs text-zinc-800 dark:text-zinc-300`}
                                    >
                                      {reply.text}
                                    </p>

                                    <div className="flex items-center gap-3 mt-1 text-[10px]">
                                      <button
                                        onClick={() => handleReplyClick(comment)}
                                        className={`font-semibold hover:underline text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white`}
                                      >
                                        Reply
                                      </button>
                                      {reply.likeCount > 0 && (
                                        <span
                                          className="text-zinc-400 dark:text-zinc-500"
                                        >
                                          {reply.likeCount} likes
                                        </span>
                                      )}
                                      {isReplyOwner && (
                                        <button
                                          onClick={() =>
                                            handleDeleteComment(reply.id, true, comment.id)
                                          }
                                          className="text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition p-1"
                                          title="Delete reply"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleToggleLike(reply.id, true, comment.id)}
                                  className={`p-1 transition ${
                                    reply.likedByMe
                                      ? "text-rose-500"
                                      : (theme === "dark")
                                      ? "text-zinc-500 hover:text-zinc-300"
                                      : "text-zinc-400 hover:text-zinc-600"
                                  }`}
                                >
                                  <Heart
                                    className="h-3 w-3"
                                    fill={reply.likedByMe ? "currentColor" : "none"}
                                  />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Sticky Input Block */}
        <div
          className={`p-3 sm:p-4 border-t bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800`}
        >
          {/* Replying banner */}
          {replyingTo && (
            <div
              className={`mb-2.5 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:border dark:border-zinc-800`}
            >
              <div className="flex items-center gap-1.5">
                <CornerDownRight className="h-3.5 w-3.5 text-rose-500" />
                <span>Replying to @{replyingTo.name}</span>
              </div>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setCommentText("");
                }}
                className="text-zinc-400 hover:text-rose-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Quick Reaction Emoji Pills */}
          <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setCommentText((prev) => prev + emoji)}
                className={`text-sm px-2 py-0.5 rounded-full transition border bg-zinc-100 hover:bg-zinc-200 border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 border bg-zinc-200 border-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white`}
            >
              {currentUser ? (currentUser.name || currentUser.email || "U")[0].toUpperCase() : "?"}
            </div>

            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  replyingTo
                    ? `Reply to @${replyingTo.name}...`
                    : "Add a technical insight or comment..."
                }
                className={`w-full pl-3.5 pr-14 py-2 rounded-2xl text-xs outline-none border transition bg-zinc-100 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-700`}
              />

              <button
                type="submit"
                disabled={!commentText.trim() || submitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-500 hover:text-blue-400 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
