import { NextRequest, NextResponse } from "next/server";
import { createAuthPin, getAuthUrl } from "@/lib/plex/auth";

export async function POST(request: NextRequest) {
  try {
    // Create auth pin
    const pin = await createAuthPin();

    // Get auth URL
    const authUrl = getAuthUrl(pin);

    return NextResponse.json({
      pinId: pin.id,
      authUrl,
      expiresAt: pin.expiresAt,
    });
  } catch (error) {
    console.error("Failed to create auth pin:", error);
    return NextResponse.json(
      { error: "Failed to initiate authentication" },
      { status: 500 },
    );
  }
}
