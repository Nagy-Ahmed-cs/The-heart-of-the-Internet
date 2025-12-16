"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../../lib/api";
import { Eye, EyeOff, Camera, Check, X } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please select a profile image");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        userName: username,
        email,
        password,
        phoneNumber: phoneNumber || null,
      }, image);
      router.push("/login");
    } catch (err) {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  // Password validation
  const passwordChecks = {
    length: password.length >= 3 && password.length <= 10,
    hasLetter: /[a-zA-Z]/.test(password),
  };
  const isPasswordValid = passwordChecks.length && passwordChecks.hasLetter;

  return (
    <div className="min-h-[calc(100vh-48px)] flex">
      {/* Left side - Art/Branding */}
      <div className="hidden lg:flex lg:w-[280px] bg-gradient-to-b from-[#0079D3] to-[#00A8E8] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <pattern id="pattern-signup" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="white"/>
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#pattern-signup)"/>
          </svg>
        </div>
        <div className="relative z-10 flex flex-col justify-end p-6">
          <h2 className="text-white text-xl font-bold mb-2">Join Reddit</h2>
          <p className="text-white/80 text-sm">
            Create your account and start exploring communities that interest you.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 py-10">
        <div className="w-full max-w-[280px]">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Sign Up</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              By continuing, you agree to our{" "}
              <a href="#" className="text-[var(--text-link)] hover:underline">User Agreement</a>
              {" "}and acknowledge that you understand the{" "}
              <a href="#" className="text-[var(--text-link)] hover:underline">Privacy Policy</a>.
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full h-11 flex items-center justify-center gap-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium rounded-full hover:bg-[var(--bg-hover)] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button className="w-full h-11 flex items-center justify-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium rounded-full hover:bg-[var(--bg-hover)] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--border-primary)]" />
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Or</span>
            <div className="flex-1 h-px bg-[var(--border-primary)]" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded text-[var(--error)] text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex justify-center mb-2">
              <label className="cursor-pointer group">
                <div className="relative w-20 h-20 rounded-full bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-primary)] flex items-center justify-center overflow-hidden group-hover:border-[var(--reddit-orange)] transition-colors">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-[var(--text-muted)] group-hover:text-[var(--reddit-orange)] transition-colors">
                      <Camera className="w-8 h-8 mx-auto" />
                      <span className="text-[10px] font-medium mt-1 block">Add photo</span>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=" "
                required
                className="peer w-full h-14 px-4 pt-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-all pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[var(--text-secondary)] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs">
                Username
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                className="peer w-full h-14 px-4 pt-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-all pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[var(--text-secondary)] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs">
                Email
              </label>
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  minLength={3}
                  maxLength={10}
                  required
                  className="peer w-full h-14 px-4 pt-4 pr-12 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                />
                <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-all pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[var(--text-secondary)] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className={`flex items-center gap-2 text-xs ${passwordChecks.length ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                    {passwordChecks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    3-10 characters
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordChecks.hasLetter ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                    {passwordChecks.hasLetter ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    Contains a letter
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder=" "
                className="peer w-full h-14 px-4 pt-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-all pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[var(--text-secondary)] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs">
                Phone (optional)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full h-11 bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] text-white font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-[var(--text-secondary)] mt-6">
            Already a redditor?{" "}
            <Link href="/login" className="text-[var(--text-link)] font-medium hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
