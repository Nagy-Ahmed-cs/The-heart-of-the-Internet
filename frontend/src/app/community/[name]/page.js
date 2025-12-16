"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCommunityDetails, getCommunityPosts, joinCommunity, getCurrentUser } from "../../../lib/api";
import PostCard from "../../../components/postCard";
import { Calendar, UserPlus, Shield, ImageIcon, Link2, Bell, MoreHorizontal, Flame, Clock, TrendingUp, Users } from "lucide-react";

export default function CommunityPage() {
  const params = useParams();
  const communityName = decodeURIComponent(params.name);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinMessage, setJoinMessage] = useState("");
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [sortBy, setSortBy] = useState("hot");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    
    const fetchData = async () => {
      try {
        const [communityData, postsData] = await Promise.all([
          getCommunityDetails(communityName),
          getCommunityPosts(communityName),
        ]);
        setCommunity(communityData);
        setPosts(postsData || []);
      } catch (err) {
        console.error("Failed to load community");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [communityName]);

  const handleJoin = async () => {
    if (!user) {
      setJoinMessage("Please log in to join");
      return;
    }
    setJoining(true);
    try {
      const result = await joinCommunity(user.email, communityName);
      setJoinMessage(result);
      setJoined(true);
    } catch (err) {
      setJoinMessage("Failed to join");
    } finally {
      setJoining(false);
    }
  };

  const SortButton = ({ type, icon: Icon, label }) => (
    <button
      onClick={() => setSortBy(type)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
        sortBy === type
          ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
      }`}
    >
      <Icon className={`w-4 h-4 ${sortBy === type ? "text-[var(--reddit-blue)]" : ""}`} />
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)]">
        {/* Banner Skeleton */}
        <div className="h-20 skeleton" />
        {/* Header Skeleton */}
        <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 -mt-8 skeleton rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-48 skeleton rounded" />
                <div className="h-4 w-24 skeleton rounded" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex max-w-5xl mx-auto px-4 py-4 gap-4">
          <div className="flex-1 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="reddit-card h-32 skeleton" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Community not found</h2>
          <p className="text-[var(--text-muted)] mb-4">The community you're looking for doesn't exist.</p>
          <Link 
            href="/" 
            className="inline-flex h-10 px-6 items-center text-sm font-bold text-white bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] rounded-full transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      {/* Banner */}
      <div className="h-20 bg-gradient-to-r from-[#0079D3] via-[#FF4500] to-[#FF8717]" />

      {/* Header */}
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-end gap-4 -mt-4 pb-3">
            {/* Community Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] border-4 border-[var(--bg-primary)] flex items-center justify-center shrink-0">
              <span className="text-white text-2xl font-bold">r/</span>
            </div>

            {/* Community Info */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">r/{community.communityName}</h1>
              </div>
              <p className="text-sm text-[var(--text-muted)]">r/{community.communityName}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pb-1">
              <button
                onClick={handleJoin}
                disabled={joining || joined}
                className={`h-8 px-4 text-sm font-bold rounded-full flex items-center gap-2 transition-colors ${
                  joined 
                    ? "bg-transparent border border-[var(--text-primary)] text-[var(--text-primary)]"
                    : "bg-[var(--reddit-blue)] hover:bg-[var(--reddit-blue-hover)] text-white"
                }`}
              >
                {joined ? (
                  <>
                    <Users className="w-4 h-4" />
                    Joined
                  </>
                ) : (
                  joining ? "..." : "Join"
                )}
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-full">
                <Bell className="w-5 h-5" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {joinMessage && (
            <p className="text-sm text-[var(--success)] pb-2">{joinMessage}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex max-w-5xl mx-auto gap-4 p-4">
        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-3">
          {/* Create Post */}
          {user && (
            <div className="reddit-card p-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">
                    {user.userName?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <Link 
                  href={`/submit?community=${encodeURIComponent(communityName)}`}
                  className="flex-1"
                >
                  <div className="h-10 px-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded flex items-center text-[var(--text-muted)] text-sm hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)] transition-colors">
                    Create Post
                  </div>
                </Link>
                <Link
                  href={`/submit?community=${encodeURIComponent(communityName)}&type=image`}
                  className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                </Link>
                <Link
                  href={`/submit?community=${encodeURIComponent(communityName)}&type=link`}
                  className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                >
                  <Link2 className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}

          {/* Sort Bar */}
          <div className="reddit-card p-2 flex items-center gap-1">
            <SortButton type="hot" icon={Flame} label="Hot" />
            <SortButton type="new" icon={Clock} label="New" />
            <SortButton type="top" icon={TrendingUp} label="Top" />
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="reddit-card p-12 text-center">
              <p className="text-[var(--text-muted)] mb-4">No posts in this community yet</p>
              {user && (
                <Link
                  href={`/submit?community=${encodeURIComponent(communityName)}`}
                  className="inline-flex h-10 px-6 items-center text-sm font-bold text-white bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] rounded-full transition-colors"
                >
                  Be the first to post
                </Link>
              )}
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.postId} post={post} />)
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-[312px] shrink-0">
          <div className="sticky top-16 space-y-4">
            {/* About Community */}
            <div className="reddit-card overflow-hidden">
              {/* Header */}
              <div className="h-8 bg-gradient-to-r from-[#0079D3] to-[#FF4500] flex items-center px-3">
                <h2 className="text-xs font-bold text-white">About Community</h2>
              </div>

              {/* Content */}
              <div className="p-3">
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {community.communityDesc || "Welcome to this community!"}
                </p>

                {/* Stats */}
                <div className="flex gap-6 py-3 border-y border-[var(--border-primary)]">
                  <div>
                    <div className="text-lg font-bold text-[var(--text-primary)]">1</div>
                    <div className="text-xs text-[var(--text-muted)]">Members</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[var(--success)] rounded-full animate-pulse" />
                      <span className="text-lg font-bold text-[var(--text-primary)]">1</span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Online</div>
                  </div>
                </div>

                {/* Created */}
                <div className="flex items-center gap-2 py-3 text-sm text-[var(--text-muted)]">
                  <Calendar className="w-4 h-4" />
                  Created {community.createAt ? new Date(community.createAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                </div>

                {/* Create Post Button */}
                {user && (
                  <Link
                    href={`/submit?community=${encodeURIComponent(communityName)}`}
                    className="flex h-8 items-center justify-center text-sm font-bold text-[var(--bg-primary)] bg-[var(--text-primary)] hover:bg-[var(--text-secondary)] rounded-full transition-colors"
                  >
                    Create Post
                  </Link>
                )}
              </div>
            </div>

            {/* Rules */}
            <div className="reddit-card overflow-hidden">
              <div className="p-3 border-b border-[var(--border-primary)]">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">r/{community.communityName} Rules</h2>
              </div>
              <div className="p-3">
                <p className="text-sm text-[var(--text-muted)]">No rules have been added yet.</p>
              </div>
            </div>

            {/* Moderators */}
            <div className="reddit-card overflow-hidden">
              <div className="p-3 border-b border-[var(--border-primary)] flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Moderators</h2>
                <button className="text-xs font-bold text-[var(--text-link)]">MESSAGE THE MODS</button>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-link)] hover:underline cursor-pointer">
                    u/{community.createdByName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
