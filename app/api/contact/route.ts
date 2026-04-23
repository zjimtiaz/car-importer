import { NextRequest, NextResponse } from "next/server";

const WP_URL = process.env.WORDPRESS_URL;

// Proxy contact form submissions to WordPress CF7
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Try CF7 REST API (requires CF7 plugin with REST API support)
    if (WP_URL) {
      try {
        const formData = new FormData();
        formData.append("your-name", name);
        formData.append("your-email", email);
        formData.append("your-phone", phone || "");
        formData.append("your-message", message);

        await fetch(
          `${WP_URL}/wp-json/contact-form-7/v1/contact-forms/1/feedback`,
          {
            method: "POST",
            body: formData,
          }
        );
      } catch {
        // CF7 submission failed, but we still return success to the user
        console.warn("CF7 submission failed");
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
