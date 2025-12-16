const API_BASE = "http://localhost:9090";

// Helper to convert image bytes to base64 data URL
export const getImageDataUrl = (imageBytes, imageType) => {
  if (!imageBytes || !imageType) {
    return null;
  }
  try {
    // If imageBytes is already a base64 data URL, return it
    if (typeof imageBytes === 'string') {
      if (imageBytes.startsWith('data:')) {
        return imageBytes;
      }
      // If it's a base64 string without data: prefix, add it
      return `data:${imageType};base64,${imageBytes}`;
    }
    
    // If it's an array of numbers (byte array from JSON response)
    if (Array.isArray(imageBytes)) {
      // Handle large arrays by chunking to avoid "Maximum call stack size exceeded"
      // Java bytes are signed (-128 to 127), so we need to convert to unsigned (0-255)
      let binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < imageBytes.length; i += chunkSize) {
        const chunk = imageBytes.slice(i, i + chunkSize);
        // Convert signed bytes to unsigned bytes
        const charCodes = chunk.map(byte => {
          // Convert signed byte (-128 to 127) to unsigned byte (0 to 255)
          let unsignedByte = byte < 0 ? byte + 256 : byte;
          // Ensure byte is in valid range (0-255)
          unsignedByte = Math.max(0, Math.min(255, Math.round(unsignedByte)));
          return unsignedByte;
        });
        binary += String.fromCharCode.apply(null, charCodes);
      }
      const base64 = btoa(binary);
      const dataUrl = `data:${imageType};base64,${base64}`;
      return dataUrl;
    }
    
    // If it's a Uint8Array or similar typed array
    if (imageBytes instanceof Uint8Array || imageBytes.buffer) {
      const bytes = new Uint8Array(imageBytes);
      let binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk);
      }
      const base64 = btoa(binary);
      return `data:${imageType};base64,${base64}`;
    }
    
    return null;
  } catch (error) {
    console.error('Error converting image:', error);
    return null;
  }
};

// Helper to get current user from localStorage
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    const parsedUser = JSON.parse(user);
    // imageUrl should already be stored, but if we have image bytes as fallback, convert them
    if (!parsedUser.imageUrl && parsedUser.image && parsedUser.imageType) {
      parsedUser.imageUrl = getImageDataUrl(parsedUser.image, parsedUser.imageType);
    }
    // Ensure we don't return the large image byte array
    if (parsedUser.image) {
      delete parsedUser.image;
    }
    return parsedUser;
  } catch (error) {
    console.error('Error parsing user:', error);
    return null;
  }
};

// Helper to logout
export const logout = () => {
  localStorage.removeItem("user");
};

// Helper to store user data (excluding large image byte arrays)
export const storeUserData = (userData) => {
  // CRITICAL: Never store the raw image byte array - it causes localStorage quota errors
  // Convert image bytes to base64 data URL if available, otherwise use existing imageUrl
  let imageUrl = null;
  
  
  if (userData.image && userData.imageType) {
    try {
      imageUrl = getImageDataUrl(userData.image, userData.imageType);
    } catch (error) {
      console.error('Error converting image to URL:', error);
      // If conversion fails, use existing imageUrl if available
      imageUrl = userData.imageUrl || null;
    }
  } else if (userData.imageUrl) {
    // If no raw image bytes but we have an imageUrl, use it
    imageUrl = userData.imageUrl;
  }
  
  // Store only essential fields (EXPLICITLY excluding the large image byte array)
  // DO NOT include: userData.image (this is the large byte array that causes quota errors)
  const userToStore = {
    userId: userData.userId,
    userName: userData.userName,
    email: userData.email,
    phoneNumber: userData.phoneNumber || null,
    imageName: userData.imageName || null,
    imageType: userData.imageType || null,
    // Store imageUrl (base64 string) instead of raw bytes - this is smaller and acceptable
    imageUrl: imageUrl || null,
    createAt: userData.createAt || null,
    updateAt: userData.updateAt || null,
  };
  
  // Explicitly ensure image byte array is never included
  if (userToStore.image) {
    delete userToStore.image;
  }
  
  // Store user data in localStorage (WITHOUT the large image byte array)
  try {
    localStorage.setItem("user", JSON.stringify(userToStore));
  } catch (error) {
    // If still getting quota error, try removing imageUrl too (user will have no profile pic but can still use the app)
    if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
      console.warn('localStorage quota exceeded, removing imageUrl to reduce size');
      userToStore.imageUrl = null;
      localStorage.setItem("user", JSON.stringify(userToStore));
    } else {
      throw error;
    }
  }
  
  return userToStore;
};

// User APIs
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/test_login?userEmail=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  
  // Handle different error status codes
  if (res.status === 401 || res.status === 500 || !res.ok) {
    throw new Error("Invalid email or password");
  }
  
  const userData = await res.json();
  return userData;
};

export const registerUser = async (userData, imageFile) => {
  const formData = new FormData();
  formData.append("dto", new Blob([JSON.stringify(userData)], { type: "application/json" }));
  formData.append("image", imageFile);
  
  const res = await fetch(`${API_BASE}/create-account`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};

export const updateProfile = async (userData, imageFile) => {
  const formData = new FormData();
  formData.append("dto", new Blob([JSON.stringify(userData)], { type: "application/json" }));
  if (imageFile) {
    formData.append("image", imageFile);
  }
  
  const res = await fetch(`${API_BASE}/update-profile`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

// Post APIs
export const getAllPosts = async () => {
  const res = await fetch(`${API_BASE}/get-all-posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};

export const getPost = async (postId) => {
  const res = await fetch(`${API_BASE}/get-post?postId=${postId}`);
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
};

export const getCommunityPosts = async (communityName) => {
  const res = await fetch(`${API_BASE}/get-community-posts?communityName=${encodeURIComponent(communityName)}`);
  if (!res.ok) throw new Error("Failed to fetch community posts");
  return res.json();
};

export const getUserPosts = async (email) => {
  const res = await fetch(`${API_BASE}/get-user-posts?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Failed to fetch user posts");
  return res.json();
};

export const createPost = async (postData) => {
  const res = await fetch(`${API_BASE}/create-post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
};

export const deletePost = async (postId) => {
  const res = await fetch(`${API_BASE}/delete-post?postId=${postId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to delete post");
  return res.text();
};

// Community APIs
export const getAllCommunities = async () => {
  const res = await fetch(`${API_BASE}/get-communities`);
  if (!res.ok) throw new Error("Failed to fetch communities");
  return res.json();
};

export const getCommunityDetails = async (communityName) => {
  const res = await fetch(`${API_BASE}/community-details?communityName=${encodeURIComponent(communityName)}`);
  if (!res.ok) throw new Error("Failed to fetch community details");
  return res.json();
};

export const createCommunity = async (communityData) => {
  const res = await fetch(`${API_BASE}/create-community`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(communityData),
  });
  if (!res.ok) throw new Error("Failed to create community");
  return res.json();
};

export const joinCommunity = async (userEmail, communityName) => {
  const res = await fetch(`${API_BASE}/join-community?userEmail=${encodeURIComponent(userEmail)}&communityName=${encodeURIComponent(communityName)}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to join community");
  return res.text();
};

// Comment APIs
export const getPostComments = async (postId) => {
  const res = await fetch(`${API_BASE}/get-post-comments?postId=${postId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
};

export const addComment = async (commentData, userId) => {
  const res = await fetch(`${API_BASE}/add-comment?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
};
