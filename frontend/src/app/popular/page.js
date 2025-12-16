"use client";

import { useEffect, useState } from "react";
import PostCard from "../../components/postCard";
import Sidebar from "../../components/Sidebar";
import { getAllPosts, getCurrentUser } from "../../lib/api";
import { Flame, Clock, TrendingUp, Globe, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function PopularPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("hot");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    
    getAllPosts()
      .then((data) => setPosts(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const SortButton = ({ type, icon: Icon, label }) => (
    <button
      onClick={() => setSortBy(type)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
        sortBy === type
          ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
      }`}
    >
      <Icon className={`w-5 h-5 ${sortBy === type ? "text-[var(--reddit-blue)]" : ""}`} />
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[var(--bg-canvas)]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 max-w-[640px] mx-auto px-4 py-4">
        {/* Header Card */}
        <div className="reddit-card overflow-hidden mb-4">
          {/* Banner */}
          <div className="h-16 bg-gradient-to-r from-[#FF4500] via-[#FF6B35] to-[#FF8717]" />
          
          {/* Content */}
          <div className="p-4 -mt-4">
            <div className="flex items-end gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] border-4 border-[var(--bg-primary)] flex items-center justify-center">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Popular</h1>
                <p className="text-sm text-[var(--text-muted)]">The best posts on Reddit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="reddit-card p-2 mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <SortButton type="hot" icon={Flame} label="Hot" />
            <SortButton type="new" icon={Clock} label="New" />
            <SortButton type="top" icon={TrendingUp} label="Top" />
          </div>
          
          {/* Location Filter */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded-full transition-colors">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Everywhere</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-3">
          {loading ? (
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
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="reddit-card p-12 text-center">
              <Flame className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">No popular posts yet</h2>
              <p className="text-[var(--text-muted)] mb-4">Be the first to share something!</p>
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
          {/* About Popular */}
          <div className="reddit-card overflow-hidden">
            <div className="h-8 bg-gradient-to-r from-[#FF4500] to-[#FF8717]" />
            <div className="p-3">
              <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">About Popular</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                The best posts from all of Reddit, curated for you. These posts are trending across communities.
              </p>
            </div>
          </div>

          {/* Reddit Premium */}
          <div className="reddit-card p-3">
            <div className="flex items-start gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FFD635] flex items-center justify-center shrink-0">
                <span className="text-white text-lg">★</span>
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

          {/* Footer */}
          <div className="text-xs text-[var(--text-muted)] space-y-2">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <a href="#" className="hover:text-[var(--text-secondary)]">User Agreement</a>
              <a href="#" className="hover:text-[var(--text-secondary)]">Privacy Policy</a>
            </div>
            <p className="text-[var(--text-muted)]">
              Reddit, Inc. © 2025. All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
