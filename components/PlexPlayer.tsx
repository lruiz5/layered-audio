"use client";

import { useState, useRef, useEffect } from "react";
import { PlexTrack } from "@/lib/plex/types";
import { PlexClient } from "@/lib/plex/client";

interface PlexPlayerProps {
  authToken: string;
}

export default function PlexPlayer({ authToken }: PlexPlayerProps) {
  const [client] = useState(() => new PlexClient(authToken));
  const [currentTrack, setCurrentTrack] = useState<PlexTrack | null>(null);
  const [serverUrl, setServerUrl] = useState<string>("");
  const [queue, setQueue] = useState<PlexTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off");
  const audioRef = useRef<HTMLAudioElement>(null);

  // Expose methods to parent via window object
  useEffect(() => {
    (window as any).plexPlayer = {
      playTrack: (track: PlexTrack, url: string) => {
        setCurrentTrack(track);
        setServerUrl(url);
        setQueue([track]);
        setCurrentIndex(0);
        setIsPlaying(true);
      },
      playTracks: (tracks: PlexTrack[], url: string) => {
        if (tracks.length === 0) return;
        setQueue(tracks);
        setServerUrl(url);
        setCurrentIndex(0);
        setCurrentTrack(tracks[0]);
        setIsPlaying(true);
      },
    };

    return () => {
      delete (window as any).plexPlayer;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (currentTrack && serverUrl && audioRef.current) {
      const trackUrl = client.getTrackUrl(serverUrl, currentTrack);
      if (trackUrl) {
        audioRef.current.src = trackUrl;
        if (isPlaying) {
          audioRef.current.play();
        }
      }
    }
  }, [currentTrack, serverUrl]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentTrack(queue[newIndex]);
    }
  };

  const handleNext = () => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setCurrentIndex(randomIndex);
      setCurrentTrack(queue[randomIndex]);
    } else if (currentIndex < queue.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentTrack(queue[newIndex]);
    } else if (repeat === "all") {
      setCurrentIndex(0);
      setCurrentTrack(queue[0]);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleEnded = () => {
    if (repeat === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNext();
    }
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentTrack) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🎵</span>
          <h3 className="text-sm font-medium text-gray-300">Plex Player</h3>
        </div>
        <div className="text-xs text-gray-400 text-center py-4">
          Select music from your Plex library to start playing
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">🎵</span>
        <h3 className="text-sm font-medium text-gray-300">Now Playing</h3>
      </div>

      {/* Track Info */}
      <div className="mb-4">
        <div className="text-sm text-white font-medium truncate">
          {currentTrack.title}
        </div>
        <div className="text-xs text-gray-400 truncate">
          {currentTrack.grandparentTitle} • {currentTrack.parentTitle}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        {/* Shuffle */}
        <button
          onClick={() => setShuffle(!shuffle)}
          className={`p-2 rounded transition-colors ${
            shuffle
              ? "text-orange-500 bg-orange-500/20"
              : "text-gray-400 hover:text-white"
          }`}
          title="Shuffle"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
          </svg>
        </button>

        {/* Previous */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center w-12 h-12 bg-orange-600 hover:bg-orange-700 rounded-full transition-colors"
        >
          {isPlaying ? (
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={
            !shuffle && currentIndex === queue.length - 1 && repeat === "off"
          }
          className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        {/* Repeat */}
        <button
          onClick={() =>
            setRepeat(
              repeat === "off" ? "all" : repeat === "all" ? "one" : "off",
            )
          }
          className={`p-2 rounded transition-colors ${
            repeat !== "off"
              ? "text-orange-500 bg-orange-500/20"
              : "text-gray-400 hover:text-white"
          }`}
          title={`Repeat: ${repeat}`}
        >
          {repeat === "one" ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
          )}
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
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
          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <span className="text-xs text-gray-500 w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Queue Info */}
      {queue.length > 1 && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Track {currentIndex + 1} of {queue.length}
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />
    </div>
  );
}
