import { NextRequest, NextResponse } from "next/server";

/**
 * Newsletter subscription endpoint.
 * Supports Mailchimp integration when MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID
 * are configured. Falls back to logging the email for manual follow-up.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;

    if (apiKey && listId) {
      // Mailchimp API — the data center is the suffix after the dash in the API key
      const dc = apiKey.split("-").pop();
      const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `apikey ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          tags: ["website-signup"],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        // "Member Exists" is not an error for UX purposes
        if (data.title === "Member Exists") {
          return NextResponse.json({ success: true, message: "Already subscribed" });
        }
        console.error("Mailchimp error:", data);
        return NextResponse.json(
          { error: "Subscription failed. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // No Mailchimp configured — log for manual follow-up
    console.log(`Newsletter signup: ${email}`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
