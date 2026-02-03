import { v4 as uuidv4 } from "uuid";
import { PlexAuthPin, PlexUser } from "./types";

const PLEX_TV_URL = "https://plex.tv";
const CLIENT_ID = process.env.NEXT_PUBLIC_PLEX_CLIENT_ID || "lofi-atc-player";
const PRODUCT_NAME =
  process.env.NEXT_PUBLIC_PLEX_PRODUCT_NAME || "Lofi ATC Player";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface PlexAuthHeaders {
  "X-Plex-Product": string;
  "X-Plex-Version": string;
  "X-Plex-Client-Identifier": string;
  "X-Plex-Platform": string;
  "X-Plex-Platform-Version": string;
  "X-Plex-Device": string;
  "X-Plex-Device-Name": string;
  "X-Plex-Token"?: string;
  Accept: string;
}

export function getPlexHeaders(authToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Plex-Product": PRODUCT_NAME,
    "X-Plex-Version": "1.0.0",
    "X-Plex-Client-Identifier": CLIENT_ID,
    "X-Plex-Platform": "Web",
    "X-Plex-Platform-Version": "1.0.0",
    "X-Plex-Device": "Browser",
    "X-Plex-Device-Name": "Web Browser",
    Accept: "application/json",
  };

  if (authToken) {
    headers["X-Plex-Token"] = authToken;
  }

  return headers;
}

export async function createAuthPin(): Promise<PlexAuthPin> {
  const response = await fetch(`${PLEX_TV_URL}/api/v2/pins`, {
    method: "POST",
    headers: {
      ...getPlexHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      strong: true,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create auth pin");
  }

  return response.json();
}

export async function checkAuthPin(pinId: number): Promise<PlexAuthPin> {
  const response = await fetch(`${PLEX_TV_URL}/api/v2/pins/${pinId}`, {
    method: "GET",
    headers: getPlexHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to check auth pin");
  }

  return response.json();
}

export function getAuthUrl(pin: PlexAuthPin): string {
  // Official Plex OAuth documentation specifies:
  // https://app.plex.tv/auth#?clientID={clientID}&code={code}&context[device][product]={product}
  // The URL uses app.plex.tv (not plex.tv) and requires minimal context
  const params = new URLSearchParams({
    clientID: CLIENT_ID,
    code: pin.code,
    "context[device][product]": PRODUCT_NAME,
  });

  return `https://app.plex.tv/auth#?${params.toString()}`;
}

export async function getUserInfo(authToken: string): Promise<PlexUser> {
  const response = await fetch(`${PLEX_TV_URL}/api/v2/user`, {
    method: "GET",
    headers: getPlexHeaders(authToken),
  });

  if (!response.ok) {
    throw new Error("Failed to get user info");
  }

  return response.json();
}

export function saveAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("plex_auth_token", token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("plex_auth_token");
  }
  return null;
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("plex_auth_token");
    localStorage.removeItem("plex_user");
    localStorage.removeItem("plex_selected_server");
  }
}

export function saveUserInfo(user: PlexUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("plex_user", JSON.stringify(user));
  }
}

export function getUserInfoFromStorage(): PlexUser | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("plex_user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}
