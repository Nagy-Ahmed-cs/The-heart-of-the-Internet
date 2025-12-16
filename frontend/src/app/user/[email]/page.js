"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getUserPosts, getCurrentUser } from "../../../lib/api";
import PostCard from "../../../components/postCard";
import { Calendar, FileText, Settings, Award, MessageSquare, Sparkles } from "lucide-react";

export default function UserProfilePage() {
  const params = useParams();
  const email = decodeURIComponent(params.email);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [imageError, setImageError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    
    getUserPosts(email)
      .then((data) => setPosts(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [email]);

  const isOwnProfile = currentUser?.email === email;
  const username = posts[0]?.username || (isOwnProfile ? (currentUser?.userName || email.split("@")[0]) : email.split("@")[0]);
  
  // Error handling - redirect to login if own profile but not logged in
  if (isOwnProfile && !currentUser) {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-primary)] mb-4">Please log in to view your profile</p>
          <Link href="/login" className="text-[var(--reddit-orange)] hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "posts", label: "Posts", icon: FileText },
    { id: "comments", label: "Comments", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      {/* Banner */}
      <div className="h-24 bg-gradient-to-r from-[#0079D3] via-[#FF4500] to-[#FF8717]" />

      {/* Header */}
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-end gap-4 -mt-6 pb-4">
            {/* Avatar */}
            <div className="relative">
              {isOwnProfile && currentUser?.imageUrl && !imageError ? (
                <img 
                  src={currentUser.imageUrl} 
                  alt={username || "User"} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-[var(--bg-primary)]"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] border-4 border-[var(--bg-primary)] flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {username?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
              {/* Online indicator */}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-[var(--success)] border-3 border-[var(--bg-primary)] rounded-full" />
            </div>

            {/* Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">u/{username}</h1>
              <p className="text-sm text-[var(--text-muted)]">u/{username} • 1 karma</p>
            </div>

            {/* Actions */}
            {isOwnProfile ? (
              <Link
                href="/edit-profile"
                className="h-8 px-4 flex items-center border border-[var(--text-primary)] text-[var(--text-primary)] text-sm font-bold rounded-full hover:bg-[var(--bg-hover)] transition-colors"
              >
                Edit Profile
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <button className="h-8 px-4 bg-[var(--reddit-blue)] text-white text-sm font-bold rounded-full hover:bg-[var(--reddit-blue-hover)] transition-colors">
                  Follow
                </button>
                <button className="h-8 px-4 border border-[var(--text-primary)] text-[var(--text-primary)] text-sm font-bold rounded-full hover:bg-[var(--bg-hover)] transition-colors">
                  Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-[var(--text-primary)] border-[var(--text-primary)]"
                    : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex gap-4">
        {/* Main */}
        <main className="flex-1 min-w-0 space-y-3">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="reddit-card overflow-hidden">
                <div className="flex">
                  <div className="w-10 bg-[var(--bg-secondary)] flex flex-col items-center py-3 gap-1">
                    <div className="w-5 h-5 skeleton rounded" />
                    <div className="w-4 h-3 skeleton rounded" />
                    <div className="w-5 h-5 skeleton rounded" />
                  </div>
                  <div className="flex-1 p-3 space-y-3">
                    <div className="h-4 w-32 skeleton rounded" />
                    <div className="h-5 w-4/5 skeleton rounded" />
                    <div className="h-4 w-full skeleton rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : activeTab === "posts" ? (
            posts.length === 0 ? (
              <div className="reddit-card p-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
                <p className="text-[var(--text-muted)]">
                  {isOwnProfile ? "You haven't posted anything yet" : "No posts yet"}
                </p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.postId} post={post} />)
            )
          ) : (
            <div className="reddit-card p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
              <p className="text-[var(--text-muted)]">No comments yet</p>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-[312px] shrink-0">
          <div className="sticky top-16 space-y-4">
            {/* Profile Card */}
            <div className="reddit-card overflow-hidden">
              {/* Banner */}
              <div className="h-16 bg-gradient-to-r from-[#0079D3] to-[#FF4500]" />
              
              {/* Content */}
              <div className="p-4 text-center -mt-8">
                {isOwnProfile && currentUser?.imageUrl && !imageError ? (
                  <img 
                    src={currentUser.imageUrl} 
                    alt={username || "User"} 
                    className="w-16 h-16 rounded-full object-cover border-4 border-[var(--bg-primary)] mx-auto"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] border-4 border-[var(--bg-primary)] mx-auto flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <h2 className="font-bold text-[var(--text-primary)] mt-2">u/{username}</h2>
                
                {/* Stats */}
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-[var(--border-primary)]">
                  <div>
                    <div className="text-lg font-bold text-[var(--text-primary)]">1</div>
                    <div className="text-xs text-[var(--text-muted)]">Karma</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[var(--text-primary)]">{posts.length}</div>
                    <div className="text-xs text-[var(--text-muted)]">Posts</div>
                  </div>
                </div>

                {/* Contact Info */}
                {isOwnProfile && currentUser?.phoneNumber && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Phone</p>
                    <p className="text-sm text-[var(--text-primary)]">{currentUser.phoneNumber}</p>
                  </div>
                )}

                {/* Cake Day */}
                {isOwnProfile && currentUser?.createAt && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-primary)] flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(currentUser.createAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Trophy Case */}
            <div className="reddit-card overflow-hidden">
              <div className="p-3 border-b border-[var(--border-primary)]">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Trophy Case</h2>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD635] to-[#FF8717] flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">New User</p>
                    <p className="text-xs text-[var(--text-muted)]">Welcome to Reddit!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings (only for own profile) */}
            {isOwnProfile && (
              <div className="reddit-card p-3">
                <Link
                  href="/settings"
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Profile Settings
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
