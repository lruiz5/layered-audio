import {
  PlexServer,
  PlexLibrary,
  PlexTrack,
  PlexPlaylist,
  PlexArtist,
  PlexAlbum,
  PlexResourcesResponse,
  PlexLibrariesResponse,
  PlexTracksResponse,
  PlexPlaylistsResponse,
  PlexArtistsResponse,
  PlexAlbumsResponse,
} from "./types";
import { getPlexHeaders } from "./auth";

const PLEX_TV_URL = "https://plex.tv";

export class PlexClient {
  private authToken: string;

  constructor(authToken: string) {
    this.authToken = authToken;
  }

  private async fetch<T>(url: string, useProxy = false): Promise<T> {
    // Use proxy for Plex server requests to avoid CORS issues
    if (useProxy) {
      const proxyUrl = `/api/plex/proxy?url=${encodeURIComponent(url)}&token=${encodeURIComponent(this.authToken)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Plex proxy error: ${response.statusText}`);
      }

      return response.json();
    }

    // Direct fetch for plex.tv API (no CORS issues)
    const response = await fetch(url, {
      headers: getPlexHeaders(this.authToken),
    });

    if (!response.ok) {
      throw new Error(`Plex API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getServers(): Promise<PlexServer[]> {
    try {
      const data = await this.fetch<any>(
        `${PLEX_TV_URL}/api/v2/resources?includeHttps=1&includeRelay=1`,
      );

      console.log("Full API response:", JSON.stringify(data, null, 2));

      // The API returns a direct array, not wrapped in MediaContainer
      const devices = Array.isArray(data)
        ? data
        : data.MediaContainer?.Device || [];

      console.log("Raw server data:", devices);

      // Filter for actual Plex Media Servers that you own
      const servers = devices.filter((device: any) => {
        console.log(
          `Device: ${device.name}, provides: ${device.provides}, owned: ${device.owned}`,
        );
        return device.provides === "server" && device.owned === true;
      });

      console.log("Filtered servers:", servers);

      // Map to include the connection URI as the host
      // Prefer non-local connections (public/relay) for server-side access
      return servers.map((server: any) => {
        const connections = server.connections || [];

        // Try to find a non-local connection first (for server-side proxy)
        const publicConnection = connections.find((conn: any) => !conn.local);
        const localConnection = connections.find((conn: any) => conn.local);

        const preferredConnection =
          publicConnection || localConnection || connections[0];

        console.log(
          `Server ${server.name} using connection:`,
          preferredConnection?.uri,
        );

        return {
          ...server,
          host:
            preferredConnection?.uri ||
            `https://${server.address}:${server.port}`,
        };
      });
    } catch (error) {
      console.error("Error fetching servers:", error);
      throw error;
    }
  }

  async getLibraries(serverUrl: string): Promise<PlexLibrary[]> {
    const data = await this.fetch<PlexLibrariesResponse>(
      `${serverUrl}/library/sections?X-Plex-Token=${this.authToken}`,
      true, // Use proxy
    );

    return data.MediaContainer.Directory.filter(
      (library) => library.type === "artist",
    );
  }

  async getPlaylists(serverUrl: string): Promise<PlexPlaylist[]> {
    const data = await this.fetch<PlexPlaylistsResponse>(
      `${serverUrl}/playlists?X-Plex-Token=${this.authToken}`,
      true, // Use proxy
    );

    return data.MediaContainer.Metadata || [];
  }

  async getPlaylistTracks(
    serverUrl: string,
    playlistKey: string,
  ): Promise<PlexTrack[]> {
    const data = await this.fetch<PlexTracksResponse>(
      `${serverUrl}${playlistKey}?X-Plex-Token=${this.authToken}`,
      true, // Use proxy
    );

    return data.MediaContainer.Metadata || [];
  }

  async getArtists(
    serverUrl: string,
    libraryKey: string,
  ): Promise<PlexArtist[]> {
    const data = await this.fetch<PlexArtistsResponse>(
      `${serverUrl}/library/sections/${libraryKey}/all?type=8&X-Plex-Token=${this.authToken}`,
      true, // Use proxy
    );

    return data.MediaContainer.Metadata || [];
  }

  async getArtistAlbums(
    serverUrl: string,
    artistKey: string,
  ): Promise<PlexAlbum[]> {
    const data = await this.fetch<PlexAlbumsResponse>(
      `${serverUrl}${artistKey}?X-Plex-Token=${this.authToken}`,
      true, // Use proxy
    );

    return data.MediaContainer.Metadata || [];
  }

  async getAlbums(serverUrl: string, libraryKey: string): Promise<PlexAlbum[]> {
    const data = await this.fetch<PlexAlbumsResponse>(
      `${serverUrl}/library/sections/${libraryKey}/all?type=9&X-Plex-Token=${this.authToken}`,
      true, // Use proxy
    );

    return data.MediaContainer.Metadata || [];
  }

  async getAlbumTracks(
    serverUrl: string,
    albumKey: string,
  ): Promise<PlexTrack[]> {
    const data = await this.fetch<PlexTracksResponse>(
      `${serverUrl}${albumKey}?X-Plex-Token=${this.authToken}`,
      true, // Use proxy
    );

    return data.MediaContainer.Metadata || [];
  }

  async searchMusic(
    serverUrl: string,
    libraryKey: string,
    query: string,
  ): Promise<{
    artists: PlexArtist[];
    albums: PlexAlbum[];
    tracks: PlexTrack[];
  }> {
    const data = await this.fetch<any>(
      `${serverUrl}/library/sections/${libraryKey}/all?query=${encodeURIComponent(query)}&X-Plex-Token=${this.authToken}`,
      true, // Use proxy
    );

    const metadata = data.MediaContainer.Metadata || [];

    return {
      artists: metadata.filter((item: any) => item.type === "artist"),
      albums: metadata.filter((item: any) => item.type === "album"),
      tracks: metadata.filter((item: any) => item.type === "track"),
    };
  }

  getTrackUrl(serverUrl: string, track: PlexTrack): string | null {
    if (!track.Media || track.Media.length === 0) return null;
    if (!track.Media[0].Part || track.Media[0].Part.length === 0) return null;

    const partKey = track.Media[0].Part[0].key;
    return `${serverUrl}${partKey}?X-Plex-Token=${this.authToken}`;
  }

  getImageUrl(serverUrl: string, path: string): string {
    if (!path) return "";
    return `${serverUrl}${path}?X-Plex-Token=${this.authToken}`;
  }
}
