import { NextRequest, NextResponse } from "next/server";
import {
  checkAuthPin,
  getUserInfo,
  saveAuthToken,
  saveUserInfo,
} from "@/lib/plex/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pinId = searchParams.get("pinId");

  if (!pinId) {
    return NextResponse.json(
      { error: "Missing pinId parameter" },
      { status: 400 },
    );
  }

  try {
    // Check auth pin status
    const pin = await checkAuthPin(parseInt(pinId));

    if (!pin.authToken) {
      return NextResponse.json(
        { error: "Authentication not completed" },
        { status: 400 },
      );
    }

    // Get user info
    const userInfo = await getUserInfo(pin.authToken);

    // Save to localStorage (we'll handle this on the client side)
    // For now, return the data to the client
    return NextResponse.json({
      authToken: pin.authToken,
      user: userInfo,
    });
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
