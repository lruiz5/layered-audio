"use client";

import { useState, useEffect } from "react";
import {
  saveAuthToken,
  saveUserInfo,
  getAuthToken,
  clearAuthToken,
  getUserInfoFromStorage,
} from "@/lib/plex/auth";
import { PlexUser } from "@/lib/plex/types";

interface PlexAuthProps {
  onAuthChange: (user: PlexUser | null, token: string | null) => void;
}

export default function PlexAuth({ onAuthChange }: PlexAuthProps) {
  const [user, setUser] = useState<PlexUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const token = getAuthToken();
    const savedUser = getUserInfoFromStorage();

    if (token && savedUser) {
      setUser(savedUser);
      onAuthChange(savedUser, token);
    }
  }, [onAuthChange]);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      // Step 1: Get auth URL from our API
      const response = await fetch("/api/plex/auth", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to initiate authentication");
      }

      const { pinId, authUrl } = await response.json();

      // Step 2: Open Plex auth page in new window
      const authWindow = window.open(
        authUrl,
        "PlexAuth",
        "width=600,height=700",
      );

      // Step 3: Poll for auth token via our callback API
      const pollInterval = setInterval(async () => {
        try {
          const callbackResponse = await fetch(
            `/api/plex/callback?pinId=${pinId}`,
          );

          if (callbackResponse.ok) {
            const { authToken, user: userInfo } = await callbackResponse.json();

            clearInterval(pollInterval);
            authWindow?.close();

            // Step 4: Save to localStorage
            saveAuthToken(authToken);
            saveUserInfo(userInfo);

            setUser(userInfo);
            onAuthChange(userInfo, authToken);
            setIsAuthenticating(false);
          }
        } catch (err) {
          // Continue polling
        }
      }, 2000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isAuthenticating) {
          setIsAuthenticating(false);
          setError("Authentication timeout. Please try again.");
          authWindow?.close();
        }
      }, 300000);
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Failed to authenticate. Please try again.");
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    // Call logout API (optional, but good practice)
    fetch("/api/plex/logout", { method: "POST" }).catch(console.error);

    // Clear local data
    clearAuthToken();
    setUser(null);
    onAuthChange(null, null);
  };

  if (user) {
    return (
      <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border-default">
        <div className="flex items-center gap-2">
          <div className="text-coral-500 font-bold text-sm">plex</div>
          <span className="text-sm text-text-secondary">Connected</span>
        </div>
        <button onClick={handleLogout} className="btn-ghost text-xs px-2 py-1">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="plex-auth-card">
      <div className="plex-connect-header">
        <img src="/plex.png" alt="Plex" className="w-6 h-6 plex-connect-icon" />
        <h3 className="plex-connect-title">Connect Your Plex Library</h3>
      </div>

      <p className="plex-connect-description">
        Access your personal music collection from Plex
      </p>

      {error && <div className="error-message mb-4">{error}</div>}

      <button
        onClick={handleLogin}
        disabled={isAuthenticating}
        className="btn-primary w-full"
      >
        {isAuthenticating ? (
          <>
            <span className="spinner"></span>
            Waiting for authorization...
          </>
        ) : (
          <>
            <img src="/plex.png" alt="Plex" className="w-5 h-5" />
            Connect to Plex
          </>
        )}
      </button>

      <p className="plex-connect-footer">
        You'll be redirected to Plex.tv to authorize this app
      </p>
    </div>
  );
}
