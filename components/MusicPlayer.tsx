"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const mp3Tracks = [
  "001 jhove - It All.mp3",
  "002 towerz x spencer hunt - Pillows.mp3",
  "003 hoogway - Eternal Life.mp3",
  "004 Allem Iversom - Habits.mp3",
  "005 Aso - Teakwood.mp3",
  "006 jhove x trxxshed - Over The Valley.mp3",
  "007 Elior x eaup - Cruisin'.mp3",
  "008 brillion x HM surf - Kiptime.mp3",
  "009 Monma x cocabona - Garnet.mp3",
  "010 Celestial Alignment - Building A New Life.mp3",
  "011 tender spring - Diet Cola w middle school.mp3",
  "012 Casiio - Stray.mp3",
  "013 Thaehan - Remorse.mp3",
  "014 Blue Wednesday - Dont let go w tender spring.mp3",
  "015 Dr Dundiff - Pink Night Sky.mp3",
  "016 G Mills x HM surf - Mmmm.mp3",
  "017 mell-ø x Phlocalyst - Nautilus.mp3",
  "018 DLJ x TABAL - 3 AM.mp3",
  "019 Kupla - Soft to Touch.mp3",
  "020 Otaam x Sitting Duck - Vivid Memories.mp3",
  "021 Glimlip x Yasper - Floating Away.mp3",
  "022 Glimlip x Sleepermane - Nostalgia.mp3",
  "023 Yasumu - Untold Stories.mp3",
  "024 No Spirit x Fatb - Desire.mp3",
  "025 Mondo Loops - Wandering Another World.mp3",
  "026 Eisu x softy - Snowflakes.mp3",
  "027 Kainbeats - Quilted Dreams.mp3",
  "028 lofty x pointy features - Psilo.mp3",
  "029 kanisan - Astral Walker w Mondo Loops.mp3",
  "030 Chiccote's Beats - Before.mp3",
  "031 Elior - Ponds.mp3",
];

// Helper function to format track names for display
const formatTrackName = (filename: string): string => {
  // Remove file extension
  let name = filename.replace(".mp3", "");

  // Remove YouTube ID pattern
  name = name.replace(/\s*\[[\w-]+\]\s*$/, "");

  // Remove "Lazy Sunday 💤 [lofi hip hop] - " prefix
  name = name.replace(/^Lazy Sunday 💤 \[lofi hip hop\] - /, "");

  // Remove leading numbers (e.g., "001 ", "012 ")
  name = name.replace(/^\d+\s+/, "");

  return name.trim();
};

type RepeatMode = "off" | "one" | "all";

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load preferences from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem("musicPlayerVolume");
    const savedTrackIndex = localStorage.getItem("musicPlayerTrackIndex");
    const savedShuffle = localStorage.getItem("musicPlayerShuffle");
    const savedRepeat = localStorage.getItem("musicPlayerRepeat");

    if (savedVolume) setVolume(parseFloat(savedVolume));
    if (savedTrackIndex) setCurrentTrackIndex(parseInt(savedTrackIndex));
    if (savedShuffle) setIsShuffle(savedShuffle === "true");
    if (savedRepeat) setRepeatMode(savedRepeat as RepeatMode);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("musicPlayerVolume", volume.toString());
    localStorage.setItem("musicPlayerTrackIndex", currentTrackIndex.toString());
    localStorage.setItem("musicPlayerShuffle", isShuffle.toString());
    localStorage.setItem("musicPlayerRepeat", repeatMode);
  }, [volume, currentTrackIndex, isShuffle, repeatMode]);

  // Generate shuffle order
  useEffect(() => {
    if (isShuffle) {
      const order = Array.from({ length: mp3Tracks.length }, (_, i) => i);
      // Fisher-Yates shuffle
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      setShuffleOrder(order);
    }
  }, [isShuffle]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Update time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const getNextTrackIndex = useCallback(() => {
    if (isShuffle && shuffleOrder.length > 0) {
      const currentShuffleIndex = shuffleOrder.indexOf(currentTrackIndex);
      const nextShuffleIndex = (currentShuffleIndex + 1) % shuffleOrder.length;
      return shuffleOrder[nextShuffleIndex];
    }
    return (currentTrackIndex + 1) % mp3Tracks.length;
  }, [currentTrackIndex, isShuffle, shuffleOrder]);

  const getPreviousTrackIndex = useCallback(() => {
    if (isShuffle && shuffleOrder.length > 0) {
      const currentShuffleIndex = shuffleOrder.indexOf(currentTrackIndex);
      const prevShuffleIndex =
        currentShuffleIndex === 0
          ? shuffleOrder.length - 1
          : currentShuffleIndex - 1;
      return shuffleOrder[prevShuffleIndex];
    }
    return currentTrackIndex === 0
      ? mp3Tracks.length - 1
      : currentTrackIndex - 1;
  }, [currentTrackIndex, isShuffle, shuffleOrder]);

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    const nextIndex = getNextTrackIndex();
    setCurrentTrackIndex(nextIndex);
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [isPlaying, getNextTrackIndex]);

  const handlePrevious = useCallback(() => {
    // If more than 3 seconds into the track, restart it
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      const prevIndex = getPreviousTrackIndex();
      setCurrentTrackIndex(prevIndex);
      if (isPlaying && audioRef.current) {
        audioRef.current.play();
      }
    }
  }, [isPlaying, getPreviousTrackIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if not typing in an input or select
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          handlePlayPause();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handlePrevious();
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((v) => Math.min(1, v + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 0.1));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handlePlayPause, handleNext, handlePrevious]);

  const handleTrackEnd = () => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === "all") {
      handleNext();
    } else {
      // repeatMode === "off"
      const nextIndex = getNextTrackIndex();
      if (nextIndex !== 0 || isShuffle) {
        handleNext();
      } else {
        setIsPlaying(false);
      }
    }
  };

  const handleTrackChange = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ["off", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTrack = mp3Tracks[currentTrackIndex];
  const displayName = formatTrackName(currentTrack);

  return (
    <div className="player-card">
      <div className="player-header">
        <span className="player-icon">🎵</span>
        <h3 className="player-title">Lofi Music</h3>
        <div className="ml-auto flex items-center gap-1">
          <span className="kbd">Space</span>
          <span className="text-xs text-muted">Play/Pause</span>
        </div>
      </div>

      {/* Now Playing */}
      <div className="player-now-playing">
        <div className="player-now-playing-label">Now Playing</div>
        <div className="player-track-name" title={displayName}>
          {displayName}
        </div>
        <div className="player-track-info">
          Track {currentTrackIndex + 1} of {mp3Tracks.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleProgressChange}
          className="progress-bar"
        />
        <div className="progress-time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="player-controls">
        {/* Shuffle */}
        <button
          onClick={toggleShuffle}
          className={`btn-ghost ${isShuffle ? "active" : ""}`}
          title="Shuffle"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
          </svg>
        </button>

        {/* Previous */}
        <button
          onClick={handlePrevious}
          className="btn-ghost"
          title="Previous (←)"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          className="btn-icon-primary"
          title="Play/Pause (Space)"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button onClick={handleNext} className="btn-ghost" title="Next (→)">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        {/* Repeat */}
        <button
          onClick={toggleRepeat}
          className={`btn-ghost ${repeatMode !== "off" ? "active" : ""}`}
          title={`Repeat: ${repeatMode}`}
        >
          {repeatMode === "one" ? (
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
      <div className="player-volume">
        <svg
          className="w-4 h-4 player-volume-icon"
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
          className="slider flex-1"
          title="Volume (↑↓)"
        />
        <span className="player-volume-value">{Math.round(volume * 100)}%</span>
      </div>

      {/* Track Selection */}
      <div>
        <label className="text-xs text-muted mb-2 block">Select Track</label>
        <select
          value={currentTrackIndex}
          onChange={(e) => handleTrackChange(parseInt(e.target.value))}
          className="select"
        >
          {mp3Tracks.map((track, index) => (
            <option key={track} value={index}>
              {formatTrackName(track)}
            </option>
          ))}
        </select>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={`/audio/${currentTrack}`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleTrackEnd}
      />
    </div>
  );
}
