const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://54.79.247.75/api';

export interface AuthUser {
  id: string;
  email: string;
  role: 'guest' | 'teacher' | 'student' | 'parent' | 'admin' | 'super_admin';
  full_name?: string;
  phone?: string;
  school_id?: string;
  created_at?: string;
}

export interface AuthError {
  message: string;
}

export interface AuthResponse {
  user?: AuthUser;
  error?: AuthError;
  token?: string; // Thêm JWT token
}

// Sign in with email and password - API trả về JWT
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/User/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: { message: data.message || 'Authentication failed' } };
    }

    // API trả về user data và JWT token
    return {
      user: data.user,
      token: data.token || data.accessToken || data.jwt
    };
  } catch (error: any) {
    return { error: { message: error.message || 'Network error' } };
  }
}

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/User/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        full_name: `${firstName} ${lastName}`.trim()
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: { message: data.message || 'Sign up failed' } };
    }

    return {
      user: data.user,
      token: data.token || data.accessToken || data.jwt
    };
  } catch (error: any) {
    return { error: { message: error.message || 'Network error' } };
  }
}

// JWT Token Management
export function saveAuthToken(token: string): void {
  try {
    // Lưu vào httpOnly cookie (secure)
    document.cookie = `auth-token=${token}; path=/; max-age=86400; secure; samesite=strict`;
    console.log('🔑 JWT token saved to cookie');
  } catch (error) {
    console.error('❌ Failed to save token:', error);
  }
}

export function getAuthToken(): string | null {
  try {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('auth-token=')
    );
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  } catch (error) {
    console.error('❌ Failed to get token:', error);
    return null;
  }
}

export function clearAuthToken(): void {
  try {
    document.cookie =
      'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    console.log('🗑️ JWT token cleared');
  } catch (error) {
    console.error('❌ Failed to clear token:', error);
  }
}

// User Data Management
export function saveUserData(user: AuthUser): void {
  try {
    localStorage.setItem('auth-user', JSON.stringify(user));
    console.log('💾 User data saved to localStorage');
  } catch (error) {
    console.error('❌ Failed to save user data:', error);
  }
}

export function getUserData(): AuthUser | null {
  try {
    const userData = localStorage.getItem('auth-user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('❌ Failed to get user data:', error);
    return null;
  }
}

export function clearUserData(): void {
  try {
    localStorage.removeItem('auth-user');
    console.log('🗑️ User data cleared');
  } catch (error) {
    console.error('❌ Failed to clear user data:', error);
  }
}

export async function getUserById(userId: string): Promise<AuthUser | null> {
  try {
    const userData = await fetch(`${API_BASE_URL}/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await userData.json();
    return data;
  } catch (error) {
    console.error('❌ Failed to get user data:', error);
    return null;
  }
}

// Validate JWT token with API
export async function validateToken(token?: string): Promise<AuthUser | null> {
  try {
    const authToken = token || getAuthToken();

    console.log('🔄 Validating token:', authToken);

    if (!authToken) {
      console.log('❌ No token available for validation');
      return null;
    }

    const res = await fetch(`${API_BASE_URL}/User/current`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      console.log('❌ Token validation failed:', res.status);
      // Clear invalid token ngay lập tức
      clearAuthToken();
      clearUserData();

      // Nếu là client-side, redirect ngay lập tức
      if (typeof window !== 'undefined') {
        console.log('🔄 Redirecting to sign-in due to invalid token');
        window.location.href = '/auth/sign-in';
      }

      return null;
    }

    const userData = await res.json();
    console.log('✅ Token validated, user:', userData.email);

    // Update stored user data
    saveUserData(userData);

    return userData;
  } catch (error) {
    console.error('❌ Token validation error:', error);

    // Clear auth data khi có lỗi
    clearAuthToken();
    clearUserData();

    // Redirect nếu là client-side
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/sign-in';
    }

    return null;
  }
}

// Refresh user data from API
export async function refreshUserData(): Promise<AuthUser | null> {
  const token = getAuthToken();
  if (!token) return null;

  return await validateToken(token);
}

// Sign out - clear all auth data
export async function signOut(): Promise<{ error?: AuthError }> {
  try {
    // Optional: Call API logout endpoint
    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/User/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.log('⚠️ API logout failed, continuing with local cleanup');
      }
    }

    // Clear all auth data
    clearAuthToken();
    clearUserData();

    // Clear any other stored data
    sessionStorage.clear();

    console.log('👋 User signed out successfully');

    // Redirect to sign-in
    window.location.href = '/auth/sign-in';
    return {};
  } catch (error: any) {
    console.error('❌ Sign out error:', error);
    return { error: { message: error.message || 'Sign out failed' } };
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const user = getUserData();
  return !!(token && user);
}

// Get redirect path based on user role
export function getRedirectPath(role: string): string {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return '/dashboard/overview';
    case 'teacher':
      return '/teacher';
    case 'student':
      return '/student';
    case 'parent':
      return '/parent';
    default:
      return '/';
  }
}

// API call helper with automatic token injection
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No authentication token available');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  // Handle token expiration
  if (response.status === 401) {
    console.log('🔄 Token expired, clearing auth data');
    clearAuthToken();
    clearUserData();
    window.location.href = '/auth/sign-in';
    throw new Error('Authentication token expired');
  }

  return response;
}

// Initialize auth state on app load
export async function initializeAuth(): Promise<AuthUser | null> {
  try {
    console.log('🔄 Initializing auth state...');

    // Check if we have stored user data and token
    const storedUser = getUserData();
    const token = getAuthToken();

    if (!token) {
      console.log('❌ No token found');
      clearUserData();
      return null;
    }

    if (storedUser) {
      console.log('📦 Found stored user data:', storedUser.email);
      // Validate token in background
      validateToken(token).catch((error) => {
        console.log('⚠️ Background token validation failed:', error);
      });
      return storedUser;
    }

    // No stored user data, validate token with API
    console.log('🌐 Validating token with API...');
    return await validateToken(token);
  } catch (error) {
    console.error('❌ Auth initialization error:', error);
    clearAuthToken();
    clearUserData();
    return null;
  }
}

// Check if user has specific role(s)
export function hasRole(
  user: AuthUser | null,
  roles: string | string[]
): boolean {
  if (!user) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
}

// Legacy functions for backward compatibility (sẽ remove sau)
export async function signInWithGoogle(): Promise<{ error?: AuthError }> {
  return { error: { message: 'Google OAuth not implemented with JWT auth' } };
}
