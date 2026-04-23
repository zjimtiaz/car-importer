import { NextResponse } from "next/server";

export async function GET() {
  const wpUrl = process.env.WORDPRESS_URL;
  return NextResponse.json({
    status: "ok",
    wordpress_url: wpUrl ? wpUrl.replace(/https?:\/\//, "***") : "NOT SET",
    timestamp: new Date().toISOString(),
  });
}
