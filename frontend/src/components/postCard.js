"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark, Award, MoreHorizontal } from "lucide-react";
import { getCurrentUser, getImageDataUrl } from "../lib/api";

export default function PostCard({ post }) {
  const router = useRouter();
  const [votes, setVotes] = useState(0);
  const [voteState, setVoteState] = useState(null); // null, 'up', or 'down'
  const [userImageUrl, setUserImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    // Try to get user image from localStorage if it's the current user
    // Use setTimeout to ensure this runs only on client side
    if (typeof window !== "undefined") {
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.email === post.userEmail && currentUser.imageUrl) {
        setUserImageUrl(currentUser.imageUrl);
      } else if (post.userEmail) {
        // For other users, we could fetch from API, but for now use initial
        setUserImageUrl(null);
      }
    }
  }, [post.userEmail]);

  const handleClick = () => {
    if (post.postId) {
      // Remove large image byte array before storing to avoid quota errors
      const postToStore = { ...post };
      if (postToStore.image) {
        delete postToStore.image;
      }
      // Keep imageUrl if it exists, but don't store raw bytes
      try {
        sessionStorage.setItem(`post_${post.postId}`, JSON.stringify(postToStore));
      } catch (e) {
        console.warn('Failed to store post in sessionStorage:', e);
        // Continue anyway - we can fetch from API if needed
      }
      router.push(`/post/${post.postId}`);
    }
  };

  const handleUpvote = (e) => {
    e.stopPropagation();
    if (voteState === 'up') {
      setVotes(votes - 1);
      setVoteState(null);
    } else {
      setVotes(voteState === 'down' ? votes + 2 : votes + 1);
      setVoteState('up');
    }
  };

  const handleDownvote = (e) => {
    e.stopPropagation();
    if (voteState === 'down') {
      setVotes(votes + 1);
      setVoteState(null);
    } else {
      setVotes(voteState === 'up' ? votes - 2 : votes - 1);
      setVoteState('down');
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min. ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr. ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const formatVotes = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  return (
    <article 
      className="reddit-card overflow-hidden cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex">
        {/* Vote Column */}
        <div className="w-10 bg-[var(--bg-secondary)] flex flex-col items-center py-2 gap-1 shrink-0">
          <button 
            onClick={handleUpvote}
            className={`p-1 rounded transition-colors ${
              voteState === 'up' 
                ? 'text-[var(--upvote)] bg-[var(--upvote)]/10' 
                : 'text-[var(--text-muted)] hover:text-[var(--upvote)] hover:bg-[var(--upvote)]/10'
            }`}
          >
            <ArrowBigUp className={`w-6 h-6 ${voteState === 'up' ? 'fill-current' : ''}`} />
          </button>
          <span className={`text-xs font-bold ${
            voteState === 'up' ? 'text-[var(--upvote)]' : 
            voteState === 'down' ? 'text-[var(--downvote)]' : 
            'text-[var(--text-secondary)]'
          }`}>
            {formatVotes(votes)}
          </span>
          <button 
            onClick={handleDownvote}
            className={`p-1 rounded transition-colors ${
              voteState === 'down' 
                ? 'text-[var(--downvote)] bg-[var(--downvote)]/10' 
                : 'text-[var(--text-muted)] hover:text-[var(--downvote)] hover:bg-[var(--downvote)]/10'
            }`}
          >
            <ArrowBigDown className={`w-6 h-6 ${voteState === 'down' ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-2 pt-1.5 min-w-0">
          {/* Meta */}
          <div className="flex items-center gap-1.5 text-xs mb-1.5 flex-wrap">
            <Link
              href={`/community/${encodeURIComponent(post.communityName || "")}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 font-bold text-[var(--text-primary)] hover:underline"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center">
                <span className="text-[6px] font-bold text-white">r/</span>
              </div>
              r/{post.communityName || "unknown"}
            </Link>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text-muted)] flex items-center gap-1.5">
              Posted by{" "}
              <Link
                href={`/user/${encodeURIComponent(post.userEmail || "")}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:underline flex items-center gap-1"
              >
                {userImageUrl && !imageError ? (
                  <img
                    src={userImageUrl}
                    alt={post.username || "User"}
                    className="w-4 h-4 rounded-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">
                      {(post.username || "A")[0].toUpperCase()}
                    </span>
                  </div>
                )}
                u/{post.username || "anonymous"}
              </Link>
            </span>
            <span className="text-[var(--text-muted)]">{formatTime(post.createAt)}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--reddit-blue)] leading-snug mb-1">
            {post.title}
          </h3>

          {/* Post Image - display if image exists and is not a tiny placeholder */}
          {(() => {
            // Prefer imageUrl from transformed post, otherwise convert from image bytes
            let imageUrl = post.imageUrl;
            
            if (!imageUrl && post.image && post.imageType) {
              // Check if image has meaningful content (not a 1x1 transparent placeholder)
              const isPlaceholder = Array.isArray(post.image) && post.image.length <= 100;
              if (isPlaceholder) return null;
              
              imageUrl = getImageDataUrl(post.image, post.imageType);
            }
            
            if (!imageUrl) return null;
            
            return (
              <div className="mb-2 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="w-full max-h-96 object-contain bg-[var(--bg-secondary)] rounded"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            );
          })()}

          {/* Content Preview */}
          {post.content && (
            <div className="relative">
              <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-2">
                {post.content}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 -ml-1.5 mt-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleClick(); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Comments</span>
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Award</span>
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-8 h-8 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
