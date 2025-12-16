"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCommunity, getCurrentUser } from "../../lib/api";
import { Users, Lock, Eye, X, Check, AlertCircle } from "lucide-react";

export default function CreateCommunityPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [communityType, setCommunityType] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (!currentUser) router.push("/login");
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("A community name is required");
      return;
    }
    if (name.length < 3) {
      setError("Community names must be between 3–21 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setError("Community names can only contain letters, numbers, or underscores");
      return;
    }

    setLoading(true);
    try {
      await createCommunity({
        communityName: name,
        communityDesc: description || `Welcome to r/${name}`,
        userId: user.userId,
      });
      router.push(`/community/${encodeURIComponent(name)}`);
    } catch (err) {
      setError("Sorry, r/" + name + " is taken. Try another.");
    } finally {
      setLoading(false);
    }
  };

  const isNameValid = name.length >= 3 && name.length <= 21 && /^[a-zA-Z0-9_]+$/.test(name);

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" style={{ top: '48px' }}>
      <div className="w-full max-w-md bg-[var(--bg-primary)] rounded-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
          <h1 className="text-lg font-medium text-[var(--text-primary)]">Create a community</h1>
          <Link 
            href="/"
            className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Name
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Community names including capitalization cannot be changed.
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">r/</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.replace(/\s/g, ''))}
                maxLength={21}
                placeholder=""
                className="w-full h-12 pl-8 pr-10 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
              {name && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isNameValid ? (
                    <Check className="w-5 h-5 text-[var(--success)]" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[var(--error)]" />
                  )}
                </div>
              )}
            </div>
            <p className={`text-xs mt-1 ${name.length > 18 ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]'}`}>
              {21 - name.length} Characters remaining
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded text-[var(--error)] text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Description
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              This is how new members come to understand your community.
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Tell us about your community"
              className="w-full px-3 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] resize-none transition-colors"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1 text-right">
              {description.length}/500
            </p>
          </div>

          {/* Community Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
              Community type
            </label>
            <div className="space-y-2">
              {/* Public */}
              <label 
                className={`flex items-start gap-3 p-3 rounded cursor-pointer transition-colors ${
                  communityType === 'public' 
                    ? 'bg-[var(--bg-hover)] border border-[var(--text-primary)]' 
                    : 'border border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                }`}
              >
                <input 
                  type="radio" 
                  name="type" 
                  value="public"
                  checked={communityType === 'public'}
                  onChange={(e) => setCommunityType(e.target.value)}
                  className="mt-1 accent-[var(--reddit-orange)]" 
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                    <Users className="w-5 h-5 text-[var(--text-secondary)]" />
                    Public
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Anyone can view, post, and comment to this community
                  </p>
                </div>
              </label>

              {/* Restricted */}
              <label 
                className={`flex items-start gap-3 p-3 rounded cursor-not-allowed opacity-50 border border-[var(--border-primary)]`}
              >
                <input 
                  type="radio" 
                  name="type" 
                  value="restricted"
                  disabled
                  className="mt-1" 
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                    <Eye className="w-5 h-5 text-[var(--text-secondary)]" />
                    Restricted
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Anyone can view, but only approved users can post
                  </p>
                </div>
              </label>

              {/* Private */}
              <label 
                className={`flex items-start gap-3 p-3 rounded cursor-not-allowed opacity-50 border border-[var(--border-primary)]`}
              >
                <input 
                  type="radio" 
                  name="type" 
                  value="private"
                  disabled
                  className="mt-1" 
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                    <Lock className="w-5 h-5 text-[var(--text-secondary)]" />
                    Private
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Only approved users can view and post
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 18+ Content */}
          <div className="mb-6 pb-6 border-b border-[var(--border-primary)]">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-[var(--text-primary)]">Adult content</span>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  18+ year old community
                </p>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-10 h-5 bg-[var(--bg-active)] rounded-full peer-checked:bg-[var(--reddit-blue)] transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Link
              href="/"
              className="h-9 px-4 flex items-center text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !isNameValid}
              className="h-9 px-6 bg-[var(--reddit-blue)] hover:bg-[var(--reddit-blue-hover)] text-white text-sm font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Create Community"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
