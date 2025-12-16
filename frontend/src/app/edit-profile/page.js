"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, updateProfile, getImageDataUrl, storeUserData } from "../../lib/api";
import { 
  ArrowLeft, 
  Camera, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Phone, 
  X, 
  Check,
  AlertCircle,
  Lock
} from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    setUsername(currentUser.userName || "");
    setPhoneNumber(currentUser.phoneNumber || "");
    setImagePreview(currentUser.imageUrl || null);
  }, [router]);
  
  // Prevent rendering if user is not loaded
  if (!user) {
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    setLoading(true);

    try {
      // Convert existing image URL to file if no new image is selected
      // Backend requires an image, so we need to provide one
      let imageFile = image;
      
      if (!imageFile && user.imageUrl && user.imageUrl.startsWith('data:')) {
        // Convert data URL to blob/file
        try {
          const response = await fetch(user.imageUrl);
          const blob = await response.blob();
          imageFile = new File([blob], user.imageName || 'profile.jpg', { type: user.imageType || blob.type || 'image/jpeg' });
        } catch (err) {
          console.error('Error converting image:', err);
          setError("Please select a new profile image to update");
          setLoading(false);
          return;
        }
      } else if (!imageFile && (user.image || user.imageName)) {
        // If we have image data but no URL, user must select a new image
        setError("Please select a profile image to update");
        setLoading(false);
        return;
      }
      
      if (!imageFile) {
        setError("Profile image is required. Please select an image.");
        setLoading(false);
        return;
      }

      const updateData = {
        userId: user.userId,
        userName: username.trim(),
      };

      // Include phoneNumber if provided (even if empty, to clear it)
      updateData.phoneNumber = phoneNumber.trim() || null;

      // Only include password if it's been changed
      if (password.trim()) {
        if (password.length < 3 || password.length > 10) {
          setError("Password must be between 3-10 characters");
          setLoading(false);
          return;
        }
        updateData.password = password.trim();
      }

      const updatedUser = await updateProfile(updateData, imageFile);
      
      // Preserve email if not in response
      if (updatedUser && !updatedUser.email && user.email) {
        updatedUser.email = user.email;
      }
      
      // Preserve phoneNumber from update if it exists, otherwise keep existing
      if (updatedUser) {
        // Phone number should be in response now, but preserve existing if somehow missing
        if (!updatedUser.phoneNumber && user.phoneNumber) {
          updatedUser.phoneNumber = user.phoneNumber;
        }
        
        // Store user data (excluding large image byte array)
        storeUserData(updatedUser);
        
        // Dispatch event to update navbar
        window.dispatchEvent(new Event('userLogin'));
        
        setSuccess("Profile updated successfully!");
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/user/${encodeURIComponent(user.email)}`);
        }, 1500);
      } else {
        setError("Failed to update profile. Invalid response from server.");
      }
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/user/${encodeURIComponent(user.email)}`}
            className="w-10 h-10 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Profile</h1>
            <p className="text-sm text-[var(--text-muted)]">Update your profile information</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="reddit-card overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Success Message */}
            {success && (
              <div className="p-3 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded text-[var(--success)] text-sm flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded text-[var(--error)] text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer group">
                  <div className="relative w-24 h-24 rounded-full bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-primary)] flex items-center justify-center overflow-hidden group-hover:border-[var(--reddit-orange)] transition-colors">
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
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {image ? "New image selected" : "Current profile picture"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {image ? "Click to change" : "Click to upload a new picture"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">JPG, PNG or GIF. Max size 5MB</p>
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full h-11 pl-10 pr-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full h-11 pl-10 pr-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-muted)] cursor-not-allowed opacity-60"
                />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Email cannot be changed</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full h-11 pl-10 pr-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                New Password <span className="text-[var(--text-muted)] font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  minLength={3}
                  maxLength={10}
                  className="w-full h-11 pl-10 pr-12 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className={`flex items-center gap-2 text-xs ${password.length >= 3 && password.length <= 10 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                    {password.length >= 3 && password.length <= 10 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    3-10 characters
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-primary)]">
              <Link
                href={`/user/${encodeURIComponent(user.email)}`}
                className="h-10 px-6 flex items-center text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="h-10 px-6 bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] text-white text-sm font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

