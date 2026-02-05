import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node runtime (safe default)

type UnsplashRandomPhoto = {
  id: string;
  alt_description: string | null;
  urls: { regular: string };
};

export async function GET() {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Missing UNSPLASH_ACCESS_KEY" },
      { status: 500 }
    );
  }

  const url = "https://api.unsplash.com/photos/random?query=pelican";

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Unsplash request failed", status: res.status, details: text },
        { status: res.status }
      );
    }

    const data = (await res.json()) as UnsplashRandomPhoto;

    return NextResponse.json({
      id: data.id,
      url: data.urls.regular,
      alt: data.alt_description ?? "Pelican",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Network error", details: String(err) },
      { status: 500 }
    );
  }
}
