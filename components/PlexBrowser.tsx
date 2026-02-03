"use client";

import { useState, useEffect } from "react";
import { PlexClient } from "@/lib/plex/client";
import {
  PlexServer,
  PlexLibrary,
  PlexPlaylist,
  PlexArtist,
  PlexAlbum,
  PlexTrack,
  PlexUser,
} from "@/lib/plex/types";

interface PlexBrowserProps {
  authToken: string;
  user: PlexUser | null;
  onTrackSelect: (track: PlexTrack, serverUrl: string) => void;
  onTracksSelect: (tracks: PlexTrack[], serverUrl: string) => void;
  onDisconnect: () => void;
}

type ViewMode = "playlists" | "artists" | "albums" | "search";

export default function PlexBrowser({
  authToken,
  user,
  onTrackSelect,
  onTracksSelect,
  onDisconnect,
}: PlexBrowserProps) {
  const [client] = useState(() => new PlexClient(authToken));
  const [servers, setServers] = useState<PlexServer[]>([]);
  const [selectedServer, setSelectedServer] = useState<PlexServer | null>(null);
  const [libraries, setLibraries] = useState<PlexLibrary[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<PlexLibrary | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("playlists");
  const [playlists, setPlaylists] = useState<PlexPlaylist[]>([]);
  const [artists, setArtists] = useState<PlexArtist[]>([]);
  const [albums, setAlbums] = useState<PlexAlbum[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<PlexArtist | null>(null);
  const [artistAlbums, setArtistAlbums] = useState<PlexAlbum[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    artists: PlexArtist[];
    albums: PlexAlbum[];
    tracks: PlexTrack[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load servers on mount
  useEffect(() => {
    loadServers();
  }, []);

  // Load libraries when server is selected
  useEffect(() => {
    if (selectedServer) {
      loadLibraries();
      loadPlaylists();
    }
  }, [selectedServer]);

  // Load content when library or view mode changes
  useEffect(() => {
    if (selectedServer && selectedLibrary) {
      if (viewMode === "artists") {
        loadArtists();
      } else if (viewMode === "albums") {
        loadAlbums();
      }
    }
  }, [selectedLibrary, viewMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest(".relative")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const loadServers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const serverList = await client.getServers();
      console.log("Loaded servers:", serverList);
      setServers(serverList);
      if (serverList.length > 0) {
        // Auto-select first server (host is already set by getServers)
        setSelectedServer(serverList[0]);
      }
    } catch (err) {
      setError("Failed to load Plex servers");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLibraries = async () => {
    if (!selectedServer) return;
    setIsLoading(true);
    try {
      const libs = await client.getLibraries(selectedServer.host);
      setLibraries(libs);
      if (libs.length > 0) {
        setSelectedLibrary(libs[0]);
      }
    } catch (err) {
      setError("Failed to load music libraries");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlaylists = async () => {
    if (!selectedServer) return;
    setIsLoading(true);
    try {
      const playlistList = await client.getPlaylists(selectedServer.host);
      setPlaylists(playlistList);
    } catch (err) {
      setError("Failed to load playlists");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadArtists = async () => {
    if (!selectedServer || !selectedLibrary) return;
    setIsLoading(true);
    try {
      const artistList = await client.getArtists(
        selectedServer.host,
        selectedLibrary.key,
      );
      setArtists(artistList);
    } catch (err) {
      setError("Failed to load artists");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAlbums = async () => {
    if (!selectedServer || !selectedLibrary) return;
    setIsLoading(true);
    try {
      const albumList = await client.getAlbums(
        selectedServer.host,
        selectedLibrary.key,
      );
      setAlbums(albumList);
    } catch (err) {
      setError("Failed to load albums");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaylistClick = async (playlist: PlexPlaylist) => {
    if (!selectedServer) return;
    setIsLoading(true);
    try {
      const tracks = await client.getPlaylistTracks(
        selectedServer.host,
        playlist.key,
      );
      onTracksSelect(tracks, selectedServer.host);
    } catch (err) {
      setError("Failed to load playlist tracks");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArtistClick = async (artist: PlexArtist) => {
    if (!selectedServer) return;
    setSelectedArtist(artist);
    setIsLoading(true);
    try {
      const albums = await client.getArtistAlbums(
        selectedServer.host,
        artist.key,
      );
      setArtistAlbums(albums);
    } catch (err) {
      setError("Failed to load artist albums");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlbumClick = async (album: PlexAlbum) => {
    if (!selectedServer) return;
    setIsLoading(true);
    try {
      const tracks = await client.getAlbumTracks(
        selectedServer.host,
        album.key,
      );
      onTracksSelect(tracks, selectedServer.host);
    } catch (err) {
      setError("Failed to load album tracks");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedServer || !selectedLibrary || !searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const results = await client.searchMusic(
        selectedServer.host,
        selectedLibrary.key,
        searchQuery,
      );
      setSearchResults(results);
      setViewMode("search");
    } catch (err) {
      setError("Search failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedServer) {
    return (
      <div className="card">
        <div className="empty-state">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="spinner"></span>
              <span>Loading servers...</span>
            </div>
          ) : (
            "No Plex servers found"
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src="/plex.png" alt="Plex" className="w-6 h-6" />
          <h3 className="player-title">Plex Music</h3>
        </div>
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-card transition-colors"
            >
              {user.thumb ? (
                <img
                  src={user.thumb}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm text-text-secondary">
                {user.username}
              </span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-bg-secondary border border-border-default rounded-lg shadow-lg z-10 min-w-32">
                <button
                  onClick={() => {
                    onDisconnect();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search music..."
            className="input flex-1"
          />
          <button onClick={handleSearch} className="btn-secondary">
            Search
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="plex-tabs">
        <button
          onClick={() => setViewMode("playlists")}
          className={`plex-tab ${viewMode === "playlists" ? "active" : ""}`}
        >
          Playlists
        </button>
        <button
          onClick={() => setViewMode("artists")}
          className={`plex-tab ${viewMode === "artists" ? "active" : ""}`}
        >
          Artists
        </button>
        <button
          onClick={() => setViewMode("albums")}
          className={`plex-tab ${viewMode === "albums" ? "active" : ""}`}
        >
          Albums
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="error-message mb-4">{error}</div>}

      {/* Content */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="empty-state">
            <div className="flex items-center justify-center gap-2">
              <span className="spinner"></span>
              <span>Loading...</span>
            </div>
          </div>
        ) : viewMode === "playlists" ? (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <button
                key={playlist.ratingKey}
                onClick={() => handlePlaylistClick(playlist)}
                className="plex-list-item"
              >
                <div>
                  <div className="plex-list-item-title">{playlist.title}</div>
                  <div className="plex-list-item-subtitle">
                    {playlist.leafCount} tracks
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : viewMode === "artists" ? (
          selectedArtist ? (
            <div>
              <button
                onClick={() => setSelectedArtist(null)}
                className="mb-3 text-xs transition-colors"
                style={{ color: "var(--coral-500)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--coral-400)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--coral-500)")
                }
              >
                ← Back to artists
              </button>
              <div className="space-y-2">
                {artistAlbums.map((album) => (
                  <button
                    key={album.ratingKey}
                    onClick={() => handleAlbumClick(album)}
                    className="plex-list-item"
                  >
                    <div>
                      <div className="plex-list-item-title">{album.title}</div>
                      <div className="plex-list-item-subtitle">
                        {album.year} • {album.leafCount} tracks
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {artists.map((artist) => (
                <button
                  key={artist.ratingKey}
                  onClick={() => handleArtistClick(artist)}
                  className="plex-list-item"
                >
                  <div className="plex-list-item-title">{artist.title}</div>
                </button>
              ))}
            </div>
          )
        ) : viewMode === "albums" ? (
          <div className="space-y-2">
            {albums.map((album) => (
              <button
                key={album.ratingKey}
                onClick={() => handleAlbumClick(album)}
                className="plex-list-item"
              >
                <div>
                  <div className="plex-list-item-title">{album.title}</div>
                  <div className="plex-list-item-subtitle">
                    {album.parentTitle} • {album.year}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : viewMode === "search" && searchResults ? (
          <div className="space-y-4">
            {searchResults.tracks.length > 0 && (
              <div>
                <h4 className="section-header">Tracks</h4>
                <div className="space-y-2">
                  {searchResults.tracks.map((track) => (
                    <button
                      key={track.ratingKey}
                      onClick={() =>
                        selectedServer &&
                        onTrackSelect(track, selectedServer.host)
                      }
                      className="plex-list-item"
                    >
                      <div>
                        <div className="plex-list-item-title">
                          {track.title}
                        </div>
                        <div className="plex-list-item-subtitle">
                          {track.grandparentTitle} • {track.parentTitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {searchResults.albums.length > 0 && (
              <div>
                <h4 className="section-header">Albums</h4>
                <div className="space-y-2">
                  {searchResults.albums.map((album) => (
                    <button
                      key={album.ratingKey}
                      onClick={() => handleAlbumClick(album)}
                      className="plex-list-item"
                    >
                      <div>
                        <div className="plex-list-item-title">
                          {album.title}
                        </div>
                        <div className="plex-list-item-subtitle">
                          {album.parentTitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
