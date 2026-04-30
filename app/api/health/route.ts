import { NextResponse } from "next/server";

export async function GET() {
  const wpUrl = process.env.WORDPRESS_URL;
  let apiTest = "not tested";

  if (wpUrl) {
    try {
      const res = await fetch(`${wpUrl}/wp-json/vehica/v1/cars?per_page=1`, {
        signal: AbortSignal.timeout(10000),
      });
      const data = await res.json();
      apiTest = `status=${res.status}, resultsCount=${data.resultsCount ?? "unknown"}`;
    } catch (e: unknown) {
      apiTest = `error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  return NextResponse.json({
    status: "ok",
    wordpress_url: wpUrl ? `${wpUrl.substring(0, 20)}...` : "NOT SET",
    hostname: process.env.WORDPRESS_HOSTNAME || "NOT SET",
    api_test: apiTest,
  });
}
