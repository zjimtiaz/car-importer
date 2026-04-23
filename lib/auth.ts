// JWT Authentication client for WordPress REST API
// Requires: JWT Authentication for WP REST API plugin

const baseUrl = process.env.WORDPRESS_URL;

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

export interface AuthError {
  code: string;
  message: string;
}

/** Login with WP credentials, returns JWT token */
export async function loginUser(
  username: string,
  password: string
): Promise<AuthResponse> {
  if (!baseUrl) throw new Error("WORDPRESS_URL not configured");

  const res = await fetch(`${baseUrl}/wp-json/jwt-auth/v1/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

/** Validate an existing token */
export async function validateToken(token: string): Promise<boolean> {
  if (!baseUrl) return false;

  try {
    const res = await fetch(`${baseUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Get current user from WP using JWT */
export async function getCurrentUser(
  token: string
): Promise<AuthUser | null> {
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const user = await res.json();
    return {
      id: user.id,
      username: user.slug,
      email: user.email || "",
      displayName: user.name,
      avatar: user.avatar_urls?.["96"] || user.avatar_urls?.["48"],
    };
  } catch {
    return null;
  }
}

/** Register a new user */
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<{ id: number }> {
  if (!baseUrl) throw new Error("WORDPRESS_URL not configured");

  const res = await fetch(`${baseUrl}/wp-json/wp/v2/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return { id: data.id };
}
