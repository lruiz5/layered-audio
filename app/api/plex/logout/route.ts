import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // This is handled on the client side by clearing localStorage
    // The API route is here for consistency and future server-side session handling
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
