"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Bell, 
  MessageCircle, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Sparkles,
  TrendingUp,
  HelpCircle,
  FileText
} from "lucide-react";
import { logout, getCurrentUser } from "../lib/api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [dropdownImageError, setDropdownImageError] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const updateUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      // Reset image errors when user changes
      setImageError(false);
      setDropdownImageError(false);
    };
    
    // Initial load
    updateUser();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', updateUser);
    
    // Listen for custom login event (when user logs in on same tab)
    window.addEventListener('userLogin', updateUser);
    
    // Also check on focus (when user logs in on same tab)
    window.addEventListener('focus', updateUser);
    
    return () => {
      window.removeEventListener('storage', updateUser);
      window.removeEventListener('userLogin', updateUser);
      window.removeEventListener('focus', updateUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowDropdown(false);
    router.push("/");
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with query parameter
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear search after navigation
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
      <div className="h-full max-w-full mx-auto px-4 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="relative">
            <svg 
              viewBox="0 0 20 20" 
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill="#FF4500" cx="10" cy="10" r="10"/>
              <circle fill="white" cx="10" cy="10" r="7"/>
              <circle fill="#FF4500" cx="6.5" cy="9" r="1"/>
              <circle fill="#FF4500" cx="13.5" cy="9" r="1"/>
              <ellipse fill="#FF4500" cx="10" cy="4" rx="3" ry="2"/>
              <circle fill="white" cx="12" cy="3.5" r="0.8"/>
              <path 
                fill="#FF4500" 
                d="M6.5 12.5c0 0 1.5 2 3.5 2s3.5-2 3.5-2" 
                stroke="#FF4500" 
                strokeWidth="1" 
                strokeLinecap="round"
                fillOpacity="0"
              />
            </svg>
          </div>
          <span className="text-[var(--text-primary)] font-bold text-xl hidden md:block tracking-tight">
            reddit
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className={`search-bar flex items-center h-10 px-4 ${searchFocused ? 'bg-[var(--bg-canvas)] border-[var(--text-primary)]' : ''}`}>
            <Search className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
            <input
              type="text"
              placeholder="Search Reddit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full h-full bg-transparent border-none text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none ml-2"
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              {/* Create Post Button */}
              <Link
                href="/submit"
                className="hidden sm:flex items-center gap-2 h-8 px-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create</span>
              </Link>

              {/* Mobile Create Button */}
              <Link
                href="/submit"
                className="sm:hidden flex items-center justify-center w-9 h-9 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
              >
                <Plus className="w-5 h-5" />
              </Link>

              {/* Notifications */}
              <button className="relative flex items-center justify-center w-9 h-9 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              {/* Messages */}
              <button className="hidden sm:flex relative items-center justify-center w-9 h-9 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 h-9 px-2 hover:bg-[var(--bg-hover)] rounded transition-colors border border-transparent hover:border-[var(--border-primary)]"
                >
                  {/* Avatar */}
                  {user.imageUrl && !imageError ? (
                    <img 
                      src={user.imageUrl} 
                      alt={user.userName || "User"} 
                      className="w-7 h-7 rounded-full object-cover border border-[var(--border-primary)]"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.userName?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  
                  {/* User Info - Hidden on mobile */}
                  <div className="hidden lg:flex flex-col items-start text-xs">
                    <span className="text-[var(--text-primary)] font-medium leading-tight">
                      {user.userName}
                    </span>
                    <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                      <Sparkles className="w-3 h-3 text-[var(--reddit-orange)]" />
                      <span>1 karma</span>
                    </div>
                  </div>
                  
                  <ChevronDown 
                    className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-md shadow-lg overflow-hidden animate-fadeIn">
                    {/* User Section */}
                    <div className="p-3 border-b border-[var(--border-primary)]">
                      <div className="flex items-center gap-3">
                        {user.imageUrl && !dropdownImageError ? (
                          <img 
                            src={user.imageUrl} 
                            alt={user.userName || "User"} 
                            className="w-10 h-10 rounded-full object-cover border border-[var(--border-primary)]"
                            onError={() => setDropdownImageError(true)}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user.userName?.[0]?.toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--text-primary)] truncate">
                            {user.userName}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            u/{user.userName}
                          </p>
                          {user.phoneNumber && (
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                              📱 {user.phoneNumber}
                            </p>
                          )}
                          {user.email && (
                            <p className="text-xs text-[var(--text-muted)] truncate">
                              ✉️ {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* My Stuff */}
                    <div className="py-2">
                      <p className="px-4 py-1 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        My Stuff
                      </p>
                      <Link
                        href={`/user/${encodeURIComponent(user.email)}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <User className="w-5 h-5 text-[var(--text-secondary)]" />
                        Profile
                      </Link>
                      <Link
                        href="/create-community"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <Plus className="w-5 h-5 text-[var(--text-secondary)]" />
                        Create Community
                      </Link>
                      <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
                        <TrendingUp className="w-5 h-5 text-[var(--text-secondary)]" />
                        Achievements
                      </button>
                    </div>

                    {/* Settings & More */}
                    <div className="py-2 border-t border-[var(--border-primary)]">
                      <Link
                        href="/settings"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <Settings className="w-5 h-5 text-[var(--text-secondary)]" />
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="py-2 border-t border-[var(--border-primary)]">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <LogOut className="w-5 h-5 text-[var(--text-secondary)]" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Get App Button - Optional */}
              <button className="hidden lg:flex items-center gap-2 h-8 px-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                </svg>
                <span>Get app</span>
              </button>

              {/* Login Button */}
              <Link
                href="/login"
                className="h-8 px-4 flex items-center justify-center text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full border border-[var(--border-hover)] transition-colors"
              >
                Log In
              </Link>

              {/* Sign Up Button */}
              <Link
                href="/register"
                className="h-8 px-4 flex items-center justify-center text-sm font-bold text-white bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] rounded-full transition-colors"
              >
                Sign Up
              </Link>

              {/* More Options Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center w-9 h-9 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-md shadow-lg overflow-hidden animate-fadeIn">
                    <div className="py-2">
                      <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
                        <HelpCircle className="w-5 h-5 text-[var(--text-secondary)]" />
                        Help Center
                      </button>
                      <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
                        <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
                        Terms & Policies
                      </button>
                    </div>
                    <div className="py-2 border-t border-[var(--border-primary)]">
                      <Link
                        href="/login"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <LogOut className="w-5 h-5 text-[var(--text-secondary)]" />
                        Log In / Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
