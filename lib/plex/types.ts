// Plex API Types

export interface PlexUser {
  id: number;
  uuid: string;
  username: string;
  title: string;
  email: string;
  thumb: string;
  authToken: string;
}

export interface PlexServer {
  name: string;
  host: string;
  address: string;
  port: number;
  machineIdentifier: string;
  version: string;
  accessToken: string;
  owned: boolean;
  httpsRequired: boolean;
  provides?: string;
  publicAddress?: string;
  publicAddressMatches?: boolean;
  presence?: boolean;
  relay?: boolean;
  local?: boolean;
}

export interface PlexLibrary {
  key: string;
  type: string;
  title: string;
  agent: string;
  scanner: string;
  language: string;
  uuid: string;
  updatedAt: number;
  createdAt: number;
  scannedAt: number;
}

export interface PlexTrack {
  ratingKey: string;
  key: string;
  parentRatingKey: string;
  grandparentRatingKey: string;
  guid: string;
  type: string;
  title: string;
  grandparentKey: string;
  parentKey: string;
  grandparentTitle: string; // Artist name
  parentTitle: string; // Album name
  summary: string;
  index: number;
  parentIndex: number;
  thumb: string;
  parentThumb: string;
  grandparentThumb: string;
  duration: number;
  addedAt: number;
  updatedAt: number;
  Media?: PlexMedia[];
}

export interface PlexMedia {
  id: number;
  duration: number;
  bitrate: number;
  audioChannels: number;
  audioCodec: string;
  container: string;
  Part: PlexPart[];
}

export interface PlexPart {
  id: number;
  key: string;
  duration: number;
  file: string;
  size: number;
  container: string;
  audioProfile: string;
}

export interface PlexPlaylist {
  ratingKey: string;
  key: string;
  guid: string;
  type: string;
  title: string;
  summary: string;
  smart: boolean;
  playlistType: string;
  composite: string;
  duration: number;
  leafCount: number;
  addedAt: number;
  updatedAt: number;
}

export interface PlexArtist {
  ratingKey: string;
  key: string;
  guid: string;
  type: string;
  title: string;
  summary: string;
  index: number;
  thumb: string;
  art: string;
  addedAt: number;
  updatedAt: number;
}

export interface PlexAlbum {
  ratingKey: string;
  key: string;
  parentRatingKey: string;
  guid: string;
  parentGuid: string;
  type: string;
  title: string;
  parentKey: string;
  parentTitle: string; // Artist name
  summary: string;
  index: number;
  year: number;
  thumb: string;
  art: string;
  parentThumb: string;
  addedAt: number;
  updatedAt: number;
  leafCount: number; // Number of tracks
}

export interface PlexAuthPin {
  id: number;
  code: string;
  product: string;
  trusted: boolean;
  clientIdentifier: string;
  location: {
    code: string;
    country: string;
  };
  expiresIn: number;
  createdAt: string;
  expiresAt: string;
  authToken: string | null;
  newRegistration: boolean | null;
}

export interface PlexResourcesResponse {
  MediaContainer: {
    size: number;
    Device: PlexServer[];
  };
}

export interface PlexLibrariesResponse {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    title1: string;
    Directory: PlexLibrary[];
  };
}

export interface PlexTracksResponse {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    art: string;
    identifier: string;
    librarySectionID: number;
    librarySectionTitle: string;
    librarySectionUUID: string;
    mediaTagPrefix: string;
    mediaTagVersion: number;
    thumb: string;
    title1: string;
    title2: string;
    viewGroup: string;
    viewMode: number;
    Metadata: PlexTrack[];
  };
}

export interface PlexPlaylistsResponse {
  MediaContainer: {
    size: number;
    Metadata: PlexPlaylist[];
  };
}

export interface PlexArtistsResponse {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    art: string;
    identifier: string;
    librarySectionID: number;
    librarySectionTitle: string;
    librarySectionUUID: string;
    mediaTagPrefix: string;
    mediaTagVersion: number;
    nocache: boolean;
    thumb: string;
    title1: string;
    title2: string;
    viewGroup: string;
    viewMode: number;
    Metadata: PlexArtist[];
  };
}

export interface PlexAlbumsResponse {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    art: string;
    identifier: string;
    librarySectionID: number;
    librarySectionTitle: string;
    librarySectionUUID: string;
    mediaTagPrefix: string;
    mediaTagVersion: number;
    nocache: boolean;
    parentIndex: number;
    parentTitle: string;
    parentYear: number;
    thumb: string;
    title1: string;
    title2: string;
    viewGroup: string;
    viewMode: number;
    Metadata: PlexAlbum[];
  };
}
