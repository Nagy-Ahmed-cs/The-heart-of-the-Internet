"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import { getAllCommunities, getCurrentUser, joinCommunity } from "../../lib/api";
import { Compass, Plus, Calendar, Users, TrendingUp, Search, Check } from "lucide-react";

export default function ExplorePage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedCommunities, setJoinedCommunities] = useState(new Set());
  const [joinMessages, setJoinMessages] = useState({});
  const [joining, setJoining] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    
    getAllCommunities()
      .then((data) => setCommunities(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredCommunities = communities.filter(c => 
    c.communityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.communityDesc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = async (e, communityName) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please log in to join communities");
      return;
    }

    // Check if already joined
    if (joinedCommunities.has(communityName)) {
      setJoinMessages(prev => ({
        ...prev,
        [communityName]: "You are already in this community"
      }));
      // Clear message after 3 seconds
      setTimeout(() => {
        setJoinMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[communityName];
          return newMessages;
        });
      }, 3000);
      return;
    }

    setJoining(prev => ({ ...prev, [communityName]: true }));
    setJoinMessages(prev => ({ ...prev, [communityName]: "" }));

    try {
      const result = await joinCommunity(user.email, communityName);
      
      // Check if user is already in community
      if (result.includes("already in the community")) {
        setJoinMessages(prev => ({
          ...prev,
          [communityName]: "You are already in this community"
        }));
        setJoinedCommunities(prev => new Set(prev).add(communityName));
      } else if (result.includes("Completely joined")) {
        setJoinMessages(prev => ({
          ...prev,
          [communityName]: "Successfully joined the community!"
        }));
        setJoinedCommunities(prev => new Set(prev).add(communityName));
      } else {
        setJoinMessages(prev => ({
          ...prev,
          [communityName]: result || "Failed to join community"
        }));
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setJoinMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[communityName];
          return newMessages;
        });
      }, 3000);
    } catch (err) {
      setJoinMessages(prev => ({
        ...prev,
        [communityName]: "Failed to join community. Please try again."
      }));
      setTimeout(() => {
        setJoinMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[communityName];
          return newMessages;
        });
      }, 3000);
    } finally {
      setJoining(prev => {
        const newJoining = { ...prev };
        delete newJoining[communityName];
        return newJoining;
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-canvas)]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="reddit-card p-4 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0079D3] to-[#00A8E8] flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Explore</h1>
                <p className="text-sm text-[var(--text-muted)]">Discover new communities</p>
              </div>
            </div>
            {user && (
              <Link
                href="/create-community"
                className="h-9 px-4 flex items-center gap-2 bg-[var(--reddit-blue)] hover:bg-[var(--reddit-blue-hover)] text-white text-sm font-bold rounded-full transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Community
              </Link>
            )}
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search communities"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <Users className="w-4 h-4" />
            <span>{communities.length} communities</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <TrendingUp className="w-4 h-4" />
            <span>Growing fast</span>
          </div>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="reddit-card p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 skeleton rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 skeleton rounded w-1/2" />
                    <div className="h-4 skeleton rounded w-full" />
                    <div className="h-4 skeleton rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="reddit-card p-12 text-center">
            <Compass className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
            {searchQuery ? (
              <>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">No results found</h2>
                <p className="text-[var(--text-muted)]">Try a different search term</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">No communities yet</h2>
                <p className="text-[var(--text-muted)] mb-4">Be the first to create one!</p>
                {user && (
                  <Link
                    href="/create-community"
                    className="inline-flex h-10 px-6 items-center gap-2 bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] text-white font-bold rounded-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Community
                  </Link>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommunities.map((c, index) => (
              <div
                key={c.communityName}
                className="reddit-card p-4 group"
              >
                <div className="flex gap-4">
                  {/* Community Icon & Info - Clickable */}
                  <Link
                    href={`/community/${encodeURIComponent(c.communityName)}`}
                    className="flex gap-4 flex-1 min-w-0"
                  >
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center">
                        <span className="text-xl font-bold text-white">r/</span>
                      </div>
                      {/* Rank Badge */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--bg-primary)] border-2 border-[var(--border-primary)] rounded-full flex items-center justify-center text-xs font-bold text-[var(--text-primary)]">
                        {index + 1}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--reddit-orange)] transition-colors">
                        r/{c.communityName}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] line-clamp-2 mt-1">
                        {c.communityDesc || "Welcome to this community!"}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          1 member
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {c.createAt ? new Date(c.createAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Join Button - Not clickable through Link */}
                  <div className="flex flex-col items-end gap-2 self-center">
                    <button 
                      onClick={(e) => handleJoin(e, c.communityName)}
                      disabled={joining[c.communityName]}
                      className={`h-8 px-4 text-xs font-bold rounded-full self-center transition-colors flex items-center gap-2 ${
                        joinedCommunities.has(c.communityName)
                          ? "bg-transparent border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                          : "bg-[var(--reddit-blue)] hover:bg-[var(--reddit-blue-hover)] text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {joining[c.communityName] ? (
                        "Joining..."
                      ) : joinedCommunities.has(c.communityName) ? (
                        <>
                          <Check className="w-4 h-4" />
                          Joined
                        </>
                      ) : (
                        "Join"
                      )}
                    </button>
                    {joinMessages[c.communityName] && (
                      <p className={`text-xs ${
                        joinMessages[c.communityName].includes("already") || joinMessages[c.communityName].includes("Failed")
                          ? "text-[var(--error)]"
                          : "text-[var(--success)]"
                      } max-w-[120px] text-right`}>
                        {joinMessages[c.communityName]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
