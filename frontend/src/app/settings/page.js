"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, logout } from "../../lib/api";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowLeft, 
  Settings as SettingsIcon,
  Edit,
  LogOut,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  HelpCircle
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }
      console.log('Settings - User loaded:', {
        userName: currentUser.userName,
        hasImageUrl: !!currentUser.imageUrl,
        imageUrlPreview: currentUser.imageUrl ? currentUser.imageUrl.substring(0, 50) + '...' : 'none'
      });
      setUser(currentUser);
    };
    
    loadUser();
    
    // Listen for user updates
    window.addEventListener('userLogin', loadUser);
    
    return () => {
      window.removeEventListener('userLogin', loadUser);
    };
  }, [router]);
  
  // Prevent rendering if user is not loaded
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
    window.location.reload();
  };


  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
            <p className="text-sm text-[var(--text-muted)]">Manage your account settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Account Information */}
            <div className="reddit-card overflow-hidden">
              <div className="p-4 border-b border-[var(--border-primary)] flex items-center gap-3">
                <User className="w-5 h-5 text-[var(--text-secondary)]" />
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Account Information</h2>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {user.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.userName || "User"} 
                        className="w-20 h-20 rounded-full object-cover border-2 border-[var(--border-primary)]"
                        onError={(e) => {
                          console.error('Settings - Image failed to load');
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        onLoad={() => {
                          console.log('Settings - Profile image loaded successfully');
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-20 h-20 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center ${user.imageUrl ? 'hidden' : ''}`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {user.userName?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Profile Picture</p>
                    <Link
                      href={`/edit-profile`}
                      className="text-sm text-[var(--text-link)] hover:underline"
                    >
                      Change picture
                    </Link>
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-4 pt-4 border-t border-[var(--border-primary)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-[var(--text-secondary)]" />
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Username</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{user.userName || "N/A"}</p>
                      </div>
                    </div>
                    <Link
                      href={`/edit-profile`}
                      className="text-sm text-[var(--text-link)] hover:underline font-medium"
                    >
                      Edit
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[var(--text-secondary)]" />
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Email</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{user.email || "N/A"}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">Cannot change</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[var(--text-secondary)]" />
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Phone Number</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {user.phoneNumber || "Not set"}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/edit-profile`}
                      className="text-sm text-[var(--text-link)] hover:underline font-medium"
                    >
                      Edit
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[var(--text-secondary)]" />
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Member Since</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {user.createAt ? new Date(user.createAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-[var(--text-secondary)]" />
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Password</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {showPassword ? (user.password ? "••••••••" : "Not set") : "••••••••"}
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/edit-profile`}
                      className="text-sm text-[var(--text-link)] hover:underline font-medium"
                    >
                      Change
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="reddit-card overflow-hidden">
              <div className="p-4 border-b border-[var(--border-primary)] flex items-center gap-3">
                <SettingsIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Preferences</h2>
              </div>
              
              <div className="p-4 space-y-2">
                <Link
                  href="/about-reddit"
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                >
                  <HelpCircle className="w-5 h-5 text-[var(--text-secondary)]" />
                  <div>
                    <p className="font-medium">About Reddit</p>
                    <p className="text-xs text-[var(--text-muted)]">Learn more about Reddit</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Account Actions */}
            <div className="reddit-card overflow-hidden">
              <div className="p-4 border-b border-[var(--border-primary)] flex items-center gap-3">
                <SettingsIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Account Actions</h2>
              </div>
              
              <div className="p-4 space-y-2">
                <Link
                  href="/edit-profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                >
                  <Edit className="w-5 h-5 text-[var(--text-secondary)]" />
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                >
                  <LogOut className="w-5 h-5 text-[var(--text-secondary)]" />
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="reddit-card p-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/edit-profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] bg-[var(--reddit-blue)] hover:bg-[var(--reddit-blue-hover)] rounded-full transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Link>
                <Link
                  href={`/user/${encodeURIComponent(user.email)}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
                >
                  <User className="w-4 h-4" />
                  View Profile
                </Link>
              </div>
            </div>

            {/* Account Stats */}
            <div className="reddit-card p-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Account Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">User ID</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{user.userId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Account Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-[var(--success)] rounded-full" />
                    <p className="text-sm font-medium text-[var(--text-primary)]">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

