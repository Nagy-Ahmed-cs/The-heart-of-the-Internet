"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPost, getPostComments, addComment, getCurrentUser, getImageDataUrl, upvoteComment, downvoteComment } from "../../../lib/api";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark, Award, MoreHorizontal, Send, Flag, EyeOff } from "lucide-react";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [votes, setVotes] = useState(0);
  const [voteState, setVoteState] = useState(null);
  const [user, setUser] = useState(null);
  const [commentVotes, setCommentVotes] = useState({}); // { commentId: { votes: number, voteState: 'up' | 'down' | null } }

  useEffect(() => {
    setUser(getCurrentUser());
    
    const fetchData = async () => {
      try {
        const [postData, commentsData] = await Promise.all([
          getPost(postId),
          getPostComments(postId),
        ]);
        setPost(postData);
        const commentsList = commentsData || [];
        setComments(commentsList);
        
        // Initialize vote states for each comment
        const initialVotes = {};
        commentsList.forEach(comment => {
          initialVotes[comment.commentId] = {
            votes: comment.votes || 0,
            voteState: null
          };
        });
        setCommentVotes(initialVotes);
      } catch (err) {
        console.error("Error fetching post data:", err);
        // Try to get post from sessionStorage as fallback
        try {
          const stored = sessionStorage.getItem(`post_${postId}`);
          if (stored) {
            const storedPost = JSON.parse(stored);
            setPost(storedPost);
          }
          // Still try to fetch comments even if post fetch failed
          try {
            const commentsData = await getPostComments(postId);
            const commentsList = commentsData || [];
            setComments(commentsList);
            const initialVotes = {};
            commentsList.forEach(comment => {
              initialVotes[comment.commentId] = {
                votes: comment.votes || 0,
                voteState: null
              };
            });
            setCommentVotes(initialVotes);
          } catch (commentErr) {
            console.error("Error fetching comments:", commentErr);
          }
        } catch (storageErr) {
          console.error("Error reading from sessionStorage:", storageErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const result = await addComment({ content: newComment.trim(), postId: parseInt(postId) }, user.userId);
      setComments([...comments, result]);
      
      // Initialize vote state for new comment
      setCommentVotes(prev => ({
        ...prev,
        [result.commentId]: {
          votes: result.votes || 0,
          voteState: null
        }
      }));
      
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = () => {
    if (voteState === 'up') {
      setVotes(votes - 1);
      setVoteState(null);
    } else {
      setVotes(voteState === 'down' ? votes + 2 : votes + 1);
      setVoteState('up');
    }
  };

  const handleDownvote = () => {
    if (voteState === 'down') {
      setVotes(votes + 1);
      setVoteState(null);
    } else {
      setVotes(voteState === 'up' ? votes + 2 : votes + 1);
      setVoteState('down');
    }
  };

  const handleCommentUpvote = async (commentId) => {
    if (!user) return;
    
    const currentVote = commentVotes[commentId] || { votes: 0, voteState: null };
    
    // Optimistic update
    const optimisticVotes = currentVote.votes + 1;
    setCommentVotes(prev => ({
      ...prev,
      [commentId]: {
        votes: optimisticVotes,
        voteState: 'up'
      }
    }));
    
    try {
      await upvoteComment(commentId);
      
      // Refresh comments to get updated vote count from backend
      const updatedComments = await getPostComments(postId);
      const updatedComment = updatedComments.find(c => c.commentId === commentId);
      if (updatedComment) {
        setCommentVotes(prev => ({
          ...prev,
          [commentId]: {
            votes: updatedComment.votes || 0,
            voteState: 'up'
          }
        }));
      }
    } catch (error) {
      console.error("Failed to upvote comment:", error);
      // Revert optimistic update
      setCommentVotes(prev => ({
        ...prev,
        [commentId]: currentVote
      }));
    }
  };

  const handleCommentDownvote = async (commentId) => {
    if (!user) return;
    
    const currentVote = commentVotes[commentId] || { votes: 0, voteState: null };
    
    // Optimistic update
    const optimisticVotes = currentVote.votes - 1;
    setCommentVotes(prev => ({
      ...prev,
      [commentId]: {
        votes: optimisticVotes,
        voteState: 'down'
      }
    }));
    
    try {
      await downvoteComment(commentId);
      
      // Refresh comments to get updated vote count from backend
      const updatedComments = await getPostComments(postId);
      const updatedComment = updatedComments.find(c => c.commentId === commentId);
      if (updatedComment) {
        setCommentVotes(prev => ({
          ...prev,
          [commentId]: {
            votes: updatedComment.votes || 0,
            voteState: 'down'
          }
        }));
      }
    } catch (error) {
      console.error("Failed to downvote comment:", error);
      // Revert optimistic update
      setCommentVotes(prev => ({
        ...prev,
        [commentId]: currentVote
      }));
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
    return `${Math.floor(diff / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="reddit-card overflow-hidden">
          <div className="flex">
            <div className="w-10 bg-[var(--bg-secondary)] flex flex-col items-center py-3 gap-1">
              <div className="w-6 h-6 skeleton rounded" />
              <div className="w-4 h-4 skeleton rounded" />
              <div className="w-6 h-6 skeleton rounded" />
            </div>
            <div className="flex-1 p-4 space-y-4">
              <div className="h-4 w-48 skeleton rounded" />
              <div className="h-6 w-full skeleton rounded" />
              <div className="h-4 w-full skeleton rounded" />
              <div className="h-4 w-3/4 skeleton rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Post */}
      <article className="reddit-card overflow-hidden">
        <div className="flex">
          {/* Vote Column */}
          <div className="w-10 bg-[var(--bg-secondary)] flex flex-col items-center py-3 gap-1 shrink-0">
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
              {votes}
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
          <div className="flex-1 p-4">
            {post ? (
              <>
                {/* Meta */}
                <div className="flex items-center gap-1.5 text-xs mb-3 flex-wrap">
                  <Link 
                    href={`/community/${encodeURIComponent(post.communityName)}`} 
                    className="flex items-center gap-1.5 font-bold text-[var(--text-primary)] hover:underline"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center">
                      <span className="text-[6px] font-bold text-white">r/</span>
                    </div>
                    r/{post.communityName}
                  </Link>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="text-[var(--text-muted)]">
                    Posted by{" "}
                    <Link href={`/user/${encodeURIComponent(post.userEmail)}`} className="hover:underline">
                      u/{post.username}
                    </Link>
                  </span>
                  <span className="text-[var(--text-muted)]">{formatTime(post.createAt)}</span>
                </div>

                {/* Title */}
                <h1 className="text-xl font-medium text-[var(--text-primary)] mb-3">{post.title}</h1>

                {/* Post Image - prefer imageUrl from transformed post */}
                {(() => {
                  let imageUrl = post.imageUrl;
                  
                  // Fallback: convert from image bytes if imageUrl not available
                  if (!imageUrl && post.image && post.imageType) {
                    // Only show if it's not a tiny placeholder
                    const isPlaceholder = Array.isArray(post.image) && post.image.length <= 100;
                    if (isPlaceholder) return null;
                    
                    imageUrl = getImageDataUrl(post.image, post.imageType);
                  }
                  
                  if (!imageUrl) return null;
                  
                  return (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full max-h-[600px] object-contain bg-[var(--bg-secondary)]"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  );
                })()}

                {/* Content */}
                {post.content && (
                  <div className="text-[var(--text-secondary)] whitespace-pre-wrap mb-4 leading-relaxed">
                    {post.content}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 -ml-1.5 flex-wrap">
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>{comments.length} Comments</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors">
                    <Award className="w-4 h-4" />
                    <span>Award</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors">
                    <Bookmark className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button className="flex items-center justify-center w-8 h-8 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-[var(--text-muted)]">Post not found</p>
              </div>
            )}
          </div>
        </div>

        {/* Comment Box */}
        <div className="p-4 border-t border-[var(--border-primary)]">
          {user ? (
            <form onSubmit={handleSubmitComment}>
              <p className="text-xs text-[var(--text-muted)] mb-2">
                Comment as <span className="text-[var(--text-link)]">{user.userName}</span>
              </p>
              <div className="border border-[var(--border-primary)] rounded overflow-hidden focus-within:border-[var(--text-primary)] transition-colors">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  rows={4}
                  className="w-full bg-transparent px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none resize-none"
                />
                <div className="bg-[var(--bg-secondary)] px-4 py-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="h-7 px-4 bg-[var(--text-primary)] hover:bg-[var(--text-secondary)] text-[var(--bg-primary)] text-xs font-bold rounded-full flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    {submitting ? "Posting..." : "Comment"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 bg-[var(--bg-secondary)] rounded">
              <p className="text-sm text-[var(--text-muted)] mb-3">Log in or sign up to leave a comment</p>
              <div className="flex items-center justify-center gap-2">
                <Link 
                  href="/login" 
                  className="h-8 px-4 flex items-center text-sm font-bold text-[var(--text-link)] border border-[var(--text-link)] rounded-full hover:bg-[var(--bg-hover)] transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  href="/register" 
                  className="h-8 px-4 flex items-center text-sm font-bold text-white bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] rounded-full transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="border-t border-[var(--border-primary)]">
          {comments.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-[var(--text-muted)] opacity-50" />
              <p className="text-[var(--text-muted)]">No comments yet</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Be the first to share what you think!</p>
            </div>
          ) : (
            <div>
              {comments.map((comment, i) => (
                <div key={comment.commentId || i} className="p-4 border-b border-[var(--border-primary)] last:border-b-0">
                  {/* Comment Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">
                        {comment.username?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <Link 
                      href={`/user/${encodeURIComponent(comment.userEmail || '')}`}
                      className="text-xs font-medium text-[var(--text-primary)] hover:underline"
                    >
                      {comment.username || "user"}
                    </Link>
                    <span className="text-xs text-[var(--text-muted)]">•</span>
                    <span className="text-xs text-[var(--text-muted)]">{formatTime(comment.createAt)}</span>
                  </div>

                  {/* Comment Content */}
                  <div className="pl-9">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{comment.content}</p>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center gap-1 mt-2 -ml-1.5">
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleCommentUpvote(comment.commentId)}
                          className={`p-1 rounded transition-colors ${
                            commentVotes[comment.commentId]?.voteState === 'up'
                              ? 'text-[var(--upvote)] bg-[var(--upvote)]/10' 
                              : 'text-[var(--text-muted)] hover:text-[var(--upvote)] hover:bg-[var(--upvote)]/10'
                          }`}
                        >
                          <ArrowBigUp className={`w-4 h-4 ${commentVotes[comment.commentId]?.voteState === 'up' ? 'fill-current' : ''}`} />
                        </button>
                        <span className={`text-xs font-bold min-w-[16px] text-center ${
                          commentVotes[comment.commentId]?.voteState === 'up' 
                            ? 'text-[var(--upvote)]' 
                            : commentVotes[comment.commentId]?.voteState === 'down'
                            ? 'text-[var(--downvote)]'
                            : 'text-[var(--text-muted)]'
                        }`}>
                          {commentVotes[comment.commentId]?.votes ?? comment.votes ?? 0}
                        </span>
                        <button 
                          onClick={() => handleCommentDownvote(comment.commentId)}
                          className={`p-1 rounded transition-colors ${
                            commentVotes[comment.commentId]?.voteState === 'down'
                              ? 'text-[var(--downvote)] bg-[var(--downvote)]/10' 
                              : 'text-[var(--text-muted)] hover:text-[var(--downvote)] hover:bg-[var(--downvote)]/10'
                          }`}
                        >
                          <ArrowBigDown className={`w-4 h-4 ${commentVotes[comment.commentId]?.voteState === 'down' ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <button className="px-2 py-1 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors">
                        Reply
                      </button>
                      <button className="px-2 py-1 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors">
                        Share
                      </button>
                      <button className="p-1 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
