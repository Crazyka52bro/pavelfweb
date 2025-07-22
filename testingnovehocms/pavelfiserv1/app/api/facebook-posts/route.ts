import { NextResponse } from "next/server";
import crypto from "crypto";

export const revalidate = 3600; // 1 hodina

export async function GET() {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!token || !appSecret) {
    return NextResponse.json({ error: "Missing Facebook access token or app secret" }, { status: 500 });
  }

  const appsecret_proof = crypto
    .createHmac("sha256", appSecret)
    .update(token)
    .digest("hex");

  const url = `https://graph.facebook.com/640847772437096/posts?fields=message,created_time,permalink_url&access_token=${token}&appsecret_proof=${appsecret_proof}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.text();
      return NextResponse.json({ error: `Facebook API request failed: ${errorData}` }, { status: res.status });
    }
    const { data: posts } = await res.json();
    return NextResponse.json({ data: posts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
