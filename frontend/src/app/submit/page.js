"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createPost, getAllCommunities, getCurrentUser } from "../../lib/api";
import { ChevronDown, FileText, Image as ImageIcon, Link2, ListOrdered, Mic, X, Check, Search, Upload, X as XIcon } from "lucide-react";

function SubmitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCommunity = searchParams.get("community");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState(preselectedCommunity || "");
  const [communities, setCommunities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchCommunity, setSearchCommunity] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (!currentUser) {
      router.push("/login");
      return;
    }
    getAllCommunities().then((data) => setCommunities(data || [])).catch(console.error);
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("Image size must be less than 10MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const fakeEvent = { target: { files: [file] } };
      handleImageChange(fakeEvent);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedCommunity) {
      setError("Please select a community");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (activeTab === "image" && !image) {
      setError("Please select an image for your post");
      return;
    }

    if (activeTab === "link" && !linkUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    try {
      // Determine post content based on tab
      let postContent = content.trim();
      if (activeTab === "link" && linkUrl.trim()) {
        postContent = linkUrl.trim();
      }

      // Create post with image if available
      const postData = {
        title: title.trim(),
        content: postContent,
        userId: user.userId,
        communityName: selectedCommunity,
      };

      // Pass image file if image tab is selected and image exists
      // For other post types, create a transparent 1x1 pixel PNG as placeholder
      // since backend requires an image
      if (activeTab === "image" && image) {
        await createPost(postData, image);
      } else {
        // Create a transparent 1x1 pixel PNG for non-image posts
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 1, 1);
        
        canvas.toBlob(async (blob) => {
          try {
            await createPost(postData, blob);
            router.push(`/community/${encodeURIComponent(selectedCommunity)}`);
          } catch (err) {
            setError(err.message || "Failed to create post");
          } finally {
            setLoading(false);
          }
        }, 'image/png');
        return; // Return early since we're handling async in the callback
      }
      
      router.push(`/community/${encodeURIComponent(selectedCommunity)}`);
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const filteredCommunities = communities.filter(c => 
    c.communityName.toLowerCase().includes(searchCommunity.toLowerCase())
  );

  const tabs = [
    { id: "text", icon: FileText, label: "Post" },
    { id: "image", icon: ImageIcon, label: "Images & Video" },
    { id: "link", icon: Link2, label: "Link" },
    { id: "poll", icon: ListOrdered, label: "Poll" },
    { id: "talk", icon: Mic, label: "Talk" },
  ];

  if (!user) return null;

  return (
    <div className="max-w-[740px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-primary)]">
        <h1 className="text-lg font-medium text-[var(--text-primary)]">Create a post</h1>
        <button className="text-xs font-bold text-[var(--text-link)] hover:text-[var(--reddit-blue)]">
          DRAFTS
        </button>
      </div>

      {/* Community Selector */}
      <div className="relative mb-4">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded text-sm hover:border-[var(--border-hover)] w-[280px]"
        >
          {selectedCommunity ? (
            <>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">r/</span>
              </div>
              <span className="text-[var(--text-primary)] font-medium">r/{selectedCommunity}</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5 text-[var(--text-muted)]" />
              <span className="text-[var(--text-muted)]">Choose a community</span>
            </>
          )}
          <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] ml-auto transition-transform ${showDropdown ? "rotate-180" : ""}`} />
        </button>

        {showDropdown && (
          <div className="absolute z-20 top-full left-0 mt-1 w-[320px] bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded shadow-xl overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-[var(--border-primary)]">
              <div className="flex items-center gap-2 h-9 px-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded">
                <Search className="w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search communities"
                  value={searchCommunity}
                  onChange={(e) => setSearchCommunity(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                />
              </div>
            </div>

            {/* Communities List */}
            <div className="max-h-72 overflow-y-auto">
              {filteredCommunities.length === 0 ? (
                <div className="p-4 text-sm text-[var(--text-muted)] text-center">
                  No communities found.{" "}
                  <Link href="/create-community" className="text-[var(--text-link)] hover:underline">
                    Create one
                  </Link>
                </div>
              ) : (
                <>
                  <p className="px-4 py-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Your Communities
                  </p>
                  {filteredCommunities.map((c) => (
                    <button
                      key={c.communityName}
                      type="button"
                      onClick={() => {
                        setSelectedCommunity(c.communityName);
                        setShowDropdown(false);
                        setSearchCommunity("");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[var(--bg-hover)] text-left transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">r/</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--text-primary)] font-medium">r/{c.communityName}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{c.communityDesc}</p>
                      </div>
                      {selectedCommunity === c.communityName && (
                        <Check className="w-4 h-4 text-[var(--reddit-orange)]" />
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Post Form Card */}
      <div className="reddit-card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border-primary)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setError("");
                if (tab.id === "image") {
                  setContent("");
                  setLinkUrl("");
                } else if (tab.id === "link") {
                  setImage(null);
                  setImagePreview(null);
                  setContent("");
                } else {
                  setImage(null);
                  setImagePreview(null);
                  setLinkUrl("");
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-[var(--text-primary)] border-[var(--text-primary)]"
                  : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded text-[var(--error)] text-sm flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Title */}
            <div className="relative">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={300}
                className="w-full h-12 px-4 bg-transparent border border-[var(--border-primary)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-muted)]">
                {title.length}/300
              </span>
            </div>

            {/* Content */}
            {activeTab === "text" && (
              <textarea
                placeholder="Text (optional)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-transparent border border-[var(--border-primary)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] resize-none transition-colors"
              />
            )}

            {activeTab === "image" && (
              <div className="space-y-4">
                {!imagePreview ? (
                  <label
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-[var(--border-primary)] rounded-lg p-12 text-center hover:border-[var(--border-hover)] transition-colors cursor-pointer block"
                  >
                    <ImageIcon className="w-10 h-10 mx-auto text-[var(--text-muted)] mb-3" />
                    <p className="text-[var(--text-muted)] text-sm mb-2">Drag and drop images or</p>
                    <span className="text-[var(--text-link)] text-sm font-medium hover:underline">
                      Upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-96 object-contain rounded-lg border border-[var(--border-primary)]"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-[var(--bg-primary)]/90 hover:bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-full flex items-center justify-center text-[var(--text-primary)] transition-colors"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {activeTab === "image" && imagePreview && (
                  <textarea
                    placeholder="Add a caption (optional)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-transparent border border-[var(--border-primary)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] resize-none transition-colors"
                  />
                )}
              </div>
            )}

            {activeTab === "link" && (
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full h-12 px-4 bg-transparent border border-[var(--border-primary)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                />
                {linkUrl && (
                  <textarea
                    placeholder="Add a comment (optional)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-transparent border border-[var(--border-primary)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] resize-none transition-colors"
                  />
                )}
              </div>
            )}

            {(activeTab === "poll" || activeTab === "talk") && (
              <div className="p-8 text-center text-[var(--text-muted)]">
                This feature is coming soon!
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <button className="h-8 px-4 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !selectedCommunity}
            className="h-8 px-6 bg-[var(--text-primary)] hover:bg-[var(--text-secondary)] text-[var(--bg-primary)] text-sm font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    }>
      <SubmitForm />
    </Suspense>
  );
}
