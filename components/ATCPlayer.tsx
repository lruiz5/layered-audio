"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Airport } from "@/data/airports";
import { ConnectionStatus } from "./ATCStatusIndicator";

interface ATCPlayerProps {
  airport: Airport | null;
  onStatusChange: (code: string, status: ConnectionStatus) => void;
}

export default function ATCPlayer({ airport, onStatusChange }: ATCPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const audioRef = useRef<HTMLAudioElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateStatus = useCallback(
    (newStatus: ConnectionStatus) => {
      setStatus(newStatus);
      if (airport) {
        onStatusChange(airport.code, newStatus);
      }
    },
    [airport, onStatusChange],
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Reset when airport changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    updateStatus("idle");

    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, [airport, updateStatus]);

  const handlePlayPause = () => {
    if (!airport || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      updateStatus("idle");
    } else {
      updateStatus("connecting");
      audioRef.current.play().catch(() => {
        updateStatus("error");
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Audio event handlers
  const handlePlaying = () => {
    setIsPlaying(true);
    updateStatus("connected");
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (status !== "error") {
      updateStatus("idle");
    }
  };

  const handleWaiting = () => {
    updateStatus("connecting");
  };

  const handleError = () => {
    setIsPlaying(false);
    updateStatus("error");

    // Auto-retry after 5 seconds
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    retryTimeoutRef.current = setTimeout(() => {
      if (audioRef.current && airport) {
        updateStatus("connecting");
        audioRef.current.play().catch(() => {
          updateStatus("error");
        });
      }
    }, 5000);
  };

  const handleStalled = () => {
    updateStatus("connecting");
  };

  if (!airport) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">📻</span>
          <h3 className="text-sm font-medium text-gray-300">ATC Radio</h3>
        </div>
        <p className="text-sm text-gray-500">Select an airport to listen</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">📻</span>
        <h3 className="text-sm font-medium text-gray-300">ATC Radio</h3>
      </div>

      {/* Current Airport */}
      <div className="mb-4">
        <div className="text-lg font-bold text-white">{airport.code}</div>
        <div className="text-xs text-gray-400">{airport.name}</div>
      </div>

      {/* Status Message */}
      {status === "error" && (
        <div className="text-xs text-red-400 mb-3">
          Connection failed. Retrying...
        </div>
      )}
      {status === "connecting" && (
        <div className="text-xs text-yellow-400 mb-3">Connecting...</div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            status === "error"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isPlaying ? (
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Volume Control */}
        <div className="flex-1 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <span className="text-xs text-gray-500 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={airport.streamUrl}
        onPlaying={handlePlaying}
        onPause={handlePause}
        onWaiting={handleWaiting}
        onError={handleError}
        onStalled={handleStalled}
      />
    </div>
  );
}
