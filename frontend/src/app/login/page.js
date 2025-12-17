"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser, getCurrentUser, storeUserData } from "../../lib/api";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    // Only check on client side
    if (typeof window !== "undefined") {
      const user = getCurrentUser();
      if (user) {
        router.push("/");
      }
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const userData = await loginUser(email.trim(), password.trim());
      console.log('Login - Received userData:', {
        userName: userData.userName,
        hasImage: !!userData.image,
        hasImageType: !!userData.imageType,
        hasImageUrl: !!userData.imageUrl
      });
      
      // Store user data (excluding large image byte array)
      const storedUser = storeUserData(userData);
      console.log('Login - Stored user:', {
        userName: storedUser.userName,
        hasImageUrl: !!storedUser.imageUrl
      });
      
      // Verify storage
      const verifyUser = getCurrentUser();
      console.log('Login - Verification:', {
        userName: verifyUser?.userName,
        hasImageUrl: !!verifyUser?.imageUrl
      });
      
      // Dispatch custom event to update navbar (multiple times to ensure it's caught)
      window.dispatchEvent(new Event('userLogin'));
      
      // Small delay to ensure localStorage is updated before redirect
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Redirect to main page automatically after login
      router.push("/");
      router.refresh();
    } catch (err) {
      // Handle error - show user-friendly message
      const errorMessage = err.message || "Invalid email or password. Please check your credentials and try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-48px)] flex bg-[var(--bg-canvas)]">
      {/* Left side - Art/Branding */}
      <div className="hidden lg:flex lg:w-[280px] bg-gradient-to-b from-[#FF4500] to-[#FF8717] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <pattern id="pattern-login" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="white"/>
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#pattern-login)"/>
          </svg>
        </div>
        <div className="relative z-10 flex flex-col justify-end p-8">
          <div className="mb-6">
            <svg viewBox="0 0 40 40" className="w-12 h-12 mb-4">
              <circle fill="white" cx="20" cy="20" r="20"/>
              <circle fill="#FF4500" cx="20" cy="20" r="14"/>
              <circle fill="white" cx="13" cy="18" r="2"/>
              <circle fill="white" cx="27" cy="18" r="2"/>
              <path fill="white" d="M13 25 Q20 28 27 25" stroke="white" strokeWidth="2" fillOpacity="0" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Log in to Reddit</h2>
          <p className="text-white/90 text-sm leading-relaxed">
            Join thousands of communities and explore content that matters to you.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[280px]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Log In</h1>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="#" className="text-[var(--text-link)] hover:underline font-medium">User Agreement</a>
              {" "}and acknowledge that you understand the{" "}
              <a href="#" className="text-[var(--text-link)] hover:underline font-medium">Privacy Policy</a>.
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button 
              type="button"
              className="w-full h-11 flex items-center justify-center gap-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] font-semibold rounded-full hover:bg-[var(--bg-hover)] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button 
              type="button"
              className="w-full h-11 flex items-center justify-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] font-semibold rounded-full hover:bg-[var(--bg-hover)] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--border-primary)]" />
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-[var(--border-primary)]" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-[var(--error)] shrink-0 mt-0.5" />
              <p className="text-[var(--error)] text-sm flex-1">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // Clear error when user types
                }}
                placeholder=" "
                required
                disabled={loading}
                className="peer w-full h-12 px-4 pt-5 pb-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-all pointer-events-none peer-focus:top-3.5 peer-focus:text-xs peer-focus:text-[var(--text-secondary)] peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[var(--text-secondary)]">
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear error when user types
                }}
                placeholder=" "
                required
                disabled={loading}
                className="peer w-full h-12 px-4 pt-5 pb-1 pr-12 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-all pointer-events-none peer-focus:top-3.5 peer-focus:text-xs peer-focus:text-[var(--text-secondary)] peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[var(--text-secondary)]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-right mb-2">
              <a href="#" className="text-xs text-[var(--text-link)] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full h-11 bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] active:bg-[#E63900] text-white font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 transform active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t border-[var(--border-primary)]">
            <p className="text-xs text-[var(--text-secondary)] text-center">
              New to Reddit?{" "}
              <Link href="/register" className="text-[var(--text-link)] font-bold hover:underline">
                SIGN UP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
