"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import PostCard from "../../components/postCard";
import Sidebar from "../../components/Sidebar";
import { getAllPosts } from "../../lib/api";
import { Search, ArrowLeft } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch posts");
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (query && posts.length > 0) {
      // Filter posts by title and content
      const filtered = posts.filter(post => {
        const searchLower = query.toLowerCase();
        const title = (post.title || "").toLowerCase();
        const content = (post.content || "").toLowerCase();
        const username = (post.username || "").toLowerCase();
        const communityName = (post.communityName || "").toLowerCase();
        
        return (
          title.includes(searchLower) ||
          content.includes(searchLower) ||
          username.includes(searchLower) ||
          communityName.includes(searchLower)
        );
      });
      setFilteredPosts(filtered);
      setSearchQuery(query);
    } else {
      setFilteredPosts([]);
    }
  }, [query, posts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-canvas)]">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[640px] mx-auto px-4 py-4">
        {/* Header */}
        <div className="reddit-card p-4 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Search</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch}>
            <div className="search-bar flex items-center h-10 px-4">
              <Search className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
              <input
                type="text"
                placeholder="Search Reddit"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent border-none text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none ml-2"
              />
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="reddit-card p-8 text-center">
            <p className="text-[var(--text-secondary)]">Loading...</p>
          </div>
        ) : query ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-[var(--text-secondary)]">
                {filteredPosts.length > 0
                  ? `Found ${filteredPosts.length} result${filteredPosts.length !== 1 ? "s" : ""} for "${query}"`
                  : `No results found for "${query}"`}
              </p>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard key={post.postId} post={post} />
                ))}
              </div>
            ) : (
              <div className="reddit-card p-8 text-center">
                <Search className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-lg font-medium text-[var(--text-primary)] mb-2">
                  No posts found
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Try different keywords or check your spelling
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="reddit-card p-8 text-center">
            <Search className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-lg font-medium text-[var(--text-primary)] mb-2">
              Search Reddit
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Enter keywords to search for posts, communities, and users
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-[var(--bg-canvas)] items-center justify-center">
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

