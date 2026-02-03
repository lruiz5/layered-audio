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
} from "@/lib/plex/types";

interface PlexBrowserProps {
  authToken: string;
  onTrackSelect: (track: PlexTrack, serverUrl: string) => void;
  onTracksSelect: (tracks: PlexTrack[], serverUrl: string) => void;
}

type ViewMode = "playlists" | "artists" | "albums" | "search";

export default function PlexBrowser({
  authToken,
  onTrackSelect,
  onTracksSelect,
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
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
        <div className="text-center text-gray-400">
          {isLoading ? "Loading servers..." : "No Plex servers found"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">🎵</span>
        <h3 className="text-sm font-medium text-gray-300">Plex Music</h3>
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
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode("playlists")}
          className={`px-3 py-1.5 text-xs rounded transition-colors ${
            viewMode === "playlists"
              ? "bg-orange-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Playlists
        </button>
        <button
          onClick={() => setViewMode("artists")}
          className={`px-3 py-1.5 text-xs rounded transition-colors ${
            viewMode === "artists"
              ? "bg-orange-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Artists
        </button>
        <button
          onClick={() => setViewMode("albums")}
          className={`px-3 py-1.5 text-xs rounded transition-colors ${
            viewMode === "albums"
              ? "bg-orange-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Albums
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-2 bg-red-900/50 border border-red-700 rounded text-xs text-red-200">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Loading...</div>
        ) : viewMode === "playlists" ? (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <button
                key={playlist.ratingKey}
                onClick={() => handlePlaylistClick(playlist)}
                className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded transition-colors"
              >
                <div className="text-sm text-white">{playlist.title}</div>
                <div className="text-xs text-gray-400">
                  {playlist.leafCount} tracks
                </div>
              </button>
            ))}
          </div>
        ) : viewMode === "artists" ? (
          selectedArtist ? (
            <div>
              <button
                onClick={() => setSelectedArtist(null)}
                className="mb-3 text-xs text-orange-500 hover:text-orange-400"
              >
                ← Back to artists
              </button>
              <div className="space-y-2">
                {artistAlbums.map((album) => (
                  <button
                    key={album.ratingKey}
                    onClick={() => handleAlbumClick(album)}
                    className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded transition-colors"
                  >
                    <div className="text-sm text-white">{album.title}</div>
                    <div className="text-xs text-gray-400">
                      {album.year} • {album.leafCount} tracks
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
                  className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded transition-colors"
                >
                  <div className="text-sm text-white">{artist.title}</div>
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
                className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded transition-colors"
              >
                <div className="text-sm text-white">{album.title}</div>
                <div className="text-xs text-gray-400">
                  {album.parentTitle} • {album.year}
                </div>
              </button>
            ))}
          </div>
        ) : viewMode === "search" && searchResults ? (
          <div className="space-y-4">
            {searchResults.tracks.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-2">
                  Tracks
                </h4>
                <div className="space-y-2">
                  {searchResults.tracks.map((track) => (
                    <button
                      key={track.ratingKey}
                      onClick={() =>
                        selectedServer &&
                        onTrackSelect(track, selectedServer.host)
                      }
                      className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded transition-colors"
                    >
                      <div className="text-sm text-white">{track.title}</div>
                      <div className="text-xs text-gray-400">
                        {track.grandparentTitle} • {track.parentTitle}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {searchResults.albums.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-2">
                  Albums
                </h4>
                <div className="space-y-2">
                  {searchResults.albums.map((album) => (
                    <button
                      key={album.ratingKey}
                      onClick={() => handleAlbumClick(album)}
                      className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded transition-colors"
                    >
                      <div className="text-sm text-white">{album.title}</div>
                      <div className="text-xs text-gray-400">
                        {album.parentTitle}
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
