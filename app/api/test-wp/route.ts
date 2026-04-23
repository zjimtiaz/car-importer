import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const wpUrl = process.env.WORDPRESS_URL;

  if (!wpUrl) {
    return NextResponse.json({
      error: "WORDPRESS_URL not set",
      env_keys: Object.keys(process.env).filter((k) =>
        k.startsWith("WORDPRESS")
      ),
    });
  }

  const testUrl = `${wpUrl}/wp-json/vehica/v1/cars`;

  try {
    const start = Date.now();
    const res = await fetch(testUrl, {
      headers: { "User-Agent": "Next.js Test" },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const elapsed = Date.now() - start;

    if (!res.ok) {
      return NextResponse.json({
        error: `API returned ${res.status}`,
        url: testUrl,
        elapsed_ms: elapsed,
      });
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      url: testUrl,
      elapsed_ms: elapsed,
      results_count: data.resultsCount || 0,
      first_car: data.results?.[0]?.title || "none",
    });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message || "Unknown error",
      type: err.name || "Error",
      url: testUrl,
    });
  }
}
