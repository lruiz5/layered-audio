import { NextRequest, NextResponse } from "next/server";
import { getPlexHeaders } from "@/lib/plex/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const authToken = searchParams.get("token");

  if (!url || !authToken) {
    return NextResponse.json(
      { error: "Missing url or token parameter" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(url, {
      headers: getPlexHeaders(authToken),
    });

    if (!response.ok) {
      throw new Error(`Plex API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Plex proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Plex server" },
      { status: 500 },
    );
  }
}
