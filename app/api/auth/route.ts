import { NextRequest, NextResponse } from "next/server";
import { loginUser, validateToken, getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";

const COOKIE_NAME = "wp_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

// POST /api/auth — login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, username, password, email } = body;

    if (action === "login") {
      const result = await loginUser(username, password);
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, result.token, COOKIE_OPTIONS);

      return NextResponse.json({
        success: true,
        user: {
          displayName: result.user_display_name,
          email: result.user_email,
        },
      });
    }

    if (action === "logout") {
      const cookieStore = await cookies();
      cookieStore.delete(COOKIE_NAME);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Auth failed" },
      { status: 401 }
    );
  }
}

// GET /api/auth — get current user
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const valid = await validateToken(token);
    if (!valid) {
      cookieStore.delete(COOKIE_NAME);
      return NextResponse.json({ user: null });
    }

    const user = await getCurrentUser(token);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
