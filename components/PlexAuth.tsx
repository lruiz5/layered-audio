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
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.thumb && (
              <img
                src={user.thumb}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <div className="text-sm font-medium text-white">
                {user.username}
              </div>
              <div className="text-xs text-gray-400">Connected to Plex</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <svg
          className="w-6 h-6 text-orange-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
        <h3 className="text-sm font-medium text-gray-300">
          Connect Your Plex Library
        </h3>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Access your personal music collection from Plex
      </p>

      {error && (
        <div className="mb-4 p-2 bg-red-900/50 border border-red-700 rounded text-xs text-red-200">
          {error}
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={isAuthenticating}
        className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isAuthenticating ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Waiting for authorization...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
            Connect to Plex
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        You'll be redirected to Plex.tv to authorize this app
      </p>
    </div>
  );
}
