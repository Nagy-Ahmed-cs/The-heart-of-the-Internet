"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PostCard from "../components/postCard";
import Sidebar from "../components/Sidebar";
import { getAllPosts, getCurrentUser } from "../lib/api";
import { Flame, Clock, TrendingUp, ImageIcon, Link2, Sparkles } from "lucide-react";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("hot");
  const [imageError, setImageError] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data || []);
      } catch (err) {
        console.error("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const SortButton = ({ type, icon: Icon, label }) => (
    <button
      onClick={() => setSortBy(type)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
        sortBy === type
          ? "bg-[var(--bg-hover)] text-[var(--text-primary)]"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
      }`}
    >
      <Icon className={`w-5 h-5 ${sortBy === type ? "text-[var(--reddit-blue)]" : ""}`} />
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[var(--bg-canvas)]">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[640px] mx-auto px-4 py-4">
        {/* Create Post Card */}
        {user && (
          <div className="reddit-card p-2 mb-4">
            <div className="flex items-center gap-2">
              {/* User Avatar */}
              {user.imageUrl && !imageError ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.userName || "User"} 
                  className="w-10 h-10 rounded-full object-cover border border-[var(--border-primary)] shrink-0"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">
                    {user.userName?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}

              {/* Input */}
              <Link href="/submit" className="flex-1">
                <div className="h-10 px-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded flex items-center text-[var(--text-muted)] text-sm hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)] transition-colors">
                  Create Post
                </div>
              </Link>

              {/* Quick Actions */}
              <Link
                href="/submit?type=image"
                className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/submit?type=link"
                className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors"
              >
                <Link2 className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}

        {/* Sort Bar */}
        <div className="reddit-card p-2 mb-4 flex items-center gap-1">
          <SortButton type="hot" icon={Flame} label="Hot" />
          <SortButton type="new" icon={Clock} label="New" />
          <SortButton type="top" icon={TrendingUp} label="Top" />
        </div>

        {/* Posts Feed */}
        <div className="space-y-3">
          {loading ? (
            // Loading Skeletons
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="reddit-card overflow-hidden">
                <div className="flex">
                  <div className="w-10 bg-[var(--bg-secondary)] flex flex-col items-center py-3 gap-1">
                    <div className="w-5 h-5 skeleton rounded" />
                    <div className="w-4 h-3 skeleton rounded" />
                    <div className="w-5 h-5 skeleton rounded" />
                  </div>
                  <div className="flex-1 p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 skeleton rounded-full" />
                      <div className="h-3 w-32 skeleton rounded" />
                    </div>
                    <div className="h-5 skeleton rounded w-4/5" />
                    <div className="h-4 skeleton rounded w-full" />
                    <div className="h-4 skeleton rounded w-2/3" />
                    <div className="flex gap-2 pt-1">
                      <div className="h-6 w-20 skeleton rounded" />
                      <div className="h-6 w-16 skeleton rounded" />
                      <div className="h-6 w-14 skeleton rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            // Empty State
            <div className="reddit-card p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                No posts yet
              </h3>
              <p className="text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
                Be the first to share something with the community!
              </p>
              {user ? (
                <Link
                  href="/submit"
                  className="inline-flex h-10 px-6 items-center text-sm font-bold text-white bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] rounded-full transition-colors"
                >
                  Create Post
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-10 px-6 items-center text-sm font-bold text-white bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] rounded-full transition-colors"
                >
                  Log in to post
                </Link>
              )}
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.postId} post={post} />)
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:block w-[312px] shrink-0 p-4">
        <div className="sticky top-16 space-y-4">
          {/* Premium Card */}
          <div className="reddit-card p-3">
            <div className="flex items-start gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FFD635] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[var(--text-primary)] text-sm">Reddit Premium</h3>
                <p className="text-xs text-[var(--text-muted)]">The best Reddit experience</p>
              </div>
            </div>
            <button className="w-full h-8 bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] text-white text-xs font-bold rounded-full transition-colors">
              Try Now
            </button>
          </div>

          {/* Home Card */}
          {user && (
            <div className="reddit-card overflow-hidden">
              {/* Banner */}
              <div className="h-8 bg-gradient-to-r from-[#0079D3] to-[#46D160]" />
              
              {/* Content */}
              <div className="p-3 pt-0">
                <div className="flex items-center gap-2 -mt-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--bg-primary)] flex items-center justify-center">
                    <svg viewBox="0 0 20 20" className="w-8 h-8">
                      <circle fill="#FF4500" cx="10" cy="10" r="10"/>
                      <circle fill="white" cx="10" cy="10" r="7"/>
                      <circle fill="#FF4500" cx="6.5" cy="9" r="1"/>
                      <circle fill="#FF4500" cx="13.5" cy="9" r="1"/>
                    </svg>
                  </div>
                  <span className="font-bold text-[var(--text-primary)] text-sm">Home</span>
                </div>
                
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  Your personal Reddit frontpage. Come here to check in with your favorite communities.
                </p>

                <div className="space-y-2 border-t border-[var(--border-primary)] pt-3">
                  <Link
                    href="/submit"
                    className="flex h-8 items-center justify-center text-xs font-bold text-[var(--bg-primary)] bg-[var(--text-primary)] hover:bg-[var(--text-secondary)] rounded-full transition-colors"
                  >
                    Create Post
                  </Link>
                  <Link
                    href="/create-community"
                    className="flex h-8 items-center justify-center text-xs font-bold text-[var(--text-primary)] border border-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
                  >
                    Create Community
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Policy Links */}
          <div className="text-xs text-[var(--text-muted)] space-y-2">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <a href="#" className="hover:text-[var(--text-secondary)]">User Agreement</a>
              <a href="#" className="hover:text-[var(--text-secondary)]">Privacy Policy</a>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <a href="#" className="hover:text-[var(--text-secondary)]">Content Policy</a>
              <a href="#" className="hover:text-[var(--text-secondary)]">Moderator Code of Conduct</a>
            </div>
            <p className="text-[var(--text-muted)] pt-2">
              Reddit, Inc. © 2025. All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
