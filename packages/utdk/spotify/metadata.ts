import type { ToolRuntimeMetadataMap } from "../client.js";

export const toolMetadata = {
  "get-an-album": {
    "accessPath": [
      "getAnAlbum"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/albums/{id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market"
    ]
  },
  "get-multiple-albums": {
    "accessPath": [
      "getMultipleAlbums"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/albums",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids",
      "market"
    ]
  },
  "get-an-albums-tracks": {
    "accessPath": [
      "getAnAlbumsTracks"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/albums/{id}/tracks",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "limit",
      "offset"
    ]
  },
  "get-an-artist": {
    "accessPath": [
      "getAnArtist"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/artists/{id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-multiple-artists": {
    "accessPath": [
      "getMultipleArtists"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/artists",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "get-an-artists-albums": {
    "accessPath": [
      "getAnArtistsAlbums"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/artists/{id}/albums",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "include_groups",
      "market",
      "limit",
      "offset"
    ]
  },
  "get-an-artists-top-tracks": {
    "accessPath": [
      "getAnArtistsTopTracks"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/artists/{id}/top-tracks",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market"
    ]
  },
  "get-an-artists-related-artists": {
    "accessPath": [
      "getAnArtistsRelatedArtists"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/artists/{id}/related-artists",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-a-show": {
    "accessPath": [
      "getAShow"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/shows/{id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market"
    ]
  },
  "get-multiple-shows": {
    "accessPath": [
      "getMultipleShows"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/shows",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "ids"
    ]
  },
  "get-a-shows-episodes": {
    "accessPath": [
      "getAShowsEpisodes"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/shows/{id}/episodes",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "limit",
      "offset"
    ]
  },
  "get-an-episode": {
    "accessPath": [
      "getAnEpisode"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/episodes/{id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market"
    ]
  },
  "get-multiple-episodes": {
    "accessPath": [
      "getMultipleEpisodes"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/episodes",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids",
      "market"
    ]
  },
  "get-an-audiobook": {
    "accessPath": [
      "getAnAudiobook"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/audiobooks/{id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market"
    ]
  },
  "get-multiple-audiobooks": {
    "accessPath": [
      "getMultipleAudiobooks"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/audiobooks",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids",
      "market"
    ]
  },
  "get-audiobook-chapters": {
    "accessPath": [
      "getAudiobookChapters"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/audiobooks/{id}/chapters",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "limit",
      "offset"
    ]
  },
  "get-users-saved-audiobooks": {
    "accessPath": [
      "getUsersSavedAudiobooks"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/audiobooks",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "limit",
      "offset"
    ]
  },
  "save-audiobooks-user": {
    "accessPath": [
      "saveAudiobooksUser"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/audiobooks",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "remove-audiobooks-user": {
    "accessPath": [
      "removeAudiobooksUser"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "DELETE",
    "pathTemplate": "/v1/me/audiobooks",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "check-users-saved-audiobooks": {
    "accessPath": [
      "checkUsersSavedAudiobooks"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/audiobooks/contains",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "get-a-chapter": {
    "accessPath": [
      "getAChapter"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/chapters/{id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market"
    ]
  },
  "get-several-chapters": {
    "accessPath": [
      "getSeveralChapters"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/chapters",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids",
      "market"
    ]
  },
  "get-track": {
    "accessPath": [
      "getTrack"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/tracks/{id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market"
    ]
  },
  "get-several-tracks": {
    "accessPath": [
      "getSeveralTracks"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/tracks",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "ids"
    ]
  },
  "search": {
    "accessPath": [
      "search"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/search",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "q",
      "type",
      "market",
      "limit",
      "offset",
      "include_external"
    ]
  },
  "get-current-users-profile": {
    "accessPath": [
      "getCurrentUsersProfile"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-playlist": {
    "accessPath": [
      "getPlaylist"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/playlists/{playlist_id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "fields",
      "additional_types"
    ]
  },
  "change-playlist-details": {
    "accessPath": [
      "changePlaylistDetails"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "name",
      "public",
      "collaborative",
      "description"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/playlists/{playlist_id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-playlists-tracks": {
    "accessPath": [
      "getPlaylistsTracks"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/playlists/{playlist_id}/tracks",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "fields",
      "limit",
      "offset",
      "additional_types"
    ]
  },
  "add-tracks-to-playlist": {
    "accessPath": [
      "addTracksToPlaylist"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "uris",
      "position"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "POST",
    "pathTemplate": "/v1/playlists/{playlist_id}/tracks",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [
      "position",
      "uris"
    ],
    "queryParameterKeys": [
      "position",
      "uris"
    ]
  },
  "reorder-or-replace-playlists-tracks": {
    "accessPath": [
      "reorderOrReplacePlaylistsTracks"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "uris",
      "range_start",
      "insert_before",
      "range_length",
      "snapshot_id"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/playlists/{playlist_id}/tracks",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [
      "uris"
    ],
    "queryParameterKeys": [
      "uris"
    ]
  },
  "remove-tracks-playlist": {
    "accessPath": [
      "removeTracksPlaylist"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "tracks",
      "snapshot_id"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "DELETE",
    "pathTemplate": "/v1/playlists/{playlist_id}/tracks",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-playlists-items": {
    "accessPath": [
      "getPlaylistsItems"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/playlists/{playlist_id}/items",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "fields",
      "limit",
      "offset",
      "additional_types"
    ]
  },
  "add-items-to-playlist": {
    "accessPath": [
      "addItemsToPlaylist"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "uris",
      "position"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "POST",
    "pathTemplate": "/v1/playlists/{playlist_id}/items",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [
      "position",
      "uris"
    ],
    "queryParameterKeys": [
      "position",
      "uris"
    ]
  },
  "reorder-or-replace-playlists-items": {
    "accessPath": [
      "reorderOrReplacePlaylistsItems"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "uris",
      "range_start",
      "insert_before",
      "range_length",
      "snapshot_id"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/playlists/{playlist_id}/items",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [
      "uris"
    ],
    "queryParameterKeys": [
      "uris"
    ]
  },
  "remove-items-playlist": {
    "accessPath": [
      "removeItemsPlaylist"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "items",
      "snapshot_id"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "DELETE",
    "pathTemplate": "/v1/playlists/{playlist_id}/items",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-a-list-of-current-users-playlists": {
    "accessPath": [
      "getAListOfCurrentUsersPlaylists"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/playlists",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "limit",
      "offset"
    ]
  },
  "create-playlist": {
    "accessPath": [
      "createPlaylist"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "name",
      "public",
      "collaborative",
      "description"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "POST",
    "pathTemplate": "/v1/me/playlists",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "save-library-items": {
    "accessPath": [
      "saveLibraryItems"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/library",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "uris"
    ]
  },
  "remove-library-items": {
    "accessPath": [
      "removeLibraryItems"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "DELETE",
    "pathTemplate": "/v1/me/library",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "uris"
    ]
  },
  "check-library-contains": {
    "accessPath": [
      "checkLibraryContains"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/library/contains",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "uris"
    ]
  },
  "get-users-saved-albums": {
    "accessPath": [
      "getUsersSavedAlbums"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/albums",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "limit",
      "offset",
      "market"
    ]
  },
  "save-albums-user": {
    "accessPath": [
      "saveAlbumsUser"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "ids"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/albums",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [
      "ids"
    ],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "remove-albums-user": {
    "accessPath": [
      "removeAlbumsUser"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "ids"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "DELETE",
    "pathTemplate": "/v1/me/albums",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [
      "ids"
    ],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "check-users-saved-albums": {
    "accessPath": [
      "checkUsersSavedAlbums"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/albums/contains",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "get-users-saved-tracks": {
    "accessPath": [
      "getUsersSavedTracks"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/tracks",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "limit",
      "offset"
    ]
  },
  "save-tracks-user": {
    "accessPath": [
      "saveTracksUser"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "ids",
      "timestamped_ids"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/tracks",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "remove-tracks-user": {
    "accessPath": [
      "removeTracksUser"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "ids"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "DELETE",
    "pathTemplate": "/v1/me/tracks",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [
      "ids"
    ],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "check-users-saved-tracks": {
    "accessPath": [
      "checkUsersSavedTracks"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/tracks/contains",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "get-users-saved-episodes": {
    "accessPath": [
      "getUsersSavedEpisodes"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/episodes",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "limit",
      "offset"
    ]
  },
  "save-episodes-user": {
    "accessPath": [
      "saveEpisodesUser"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "ids"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/episodes",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [
      "ids"
    ],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "remove-episodes-user": {
    "accessPath": [
      "removeEpisodesUser"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "ids"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "DELETE",
    "pathTemplate": "/v1/me/episodes",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [
      "ids"
    ],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "check-users-saved-episodes": {
    "accessPath": [
      "checkUsersSavedEpisodes"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/episodes/contains",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "get-users-saved-shows": {
    "accessPath": [
      "getUsersSavedShows"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/shows",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "limit",
      "offset"
    ]
  },
  "save-shows-user": {
    "accessPath": [
      "saveShowsUser"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/shows",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "remove-shows-user": {
    "accessPath": [
      "removeShowsUser"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "DELETE",
    "pathTemplate": "/v1/me/shows",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids",
      "market"
    ]
  },
  "check-users-saved-shows": {
    "accessPath": [
      "checkUsersSavedShows"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/shows/contains",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "get-users-top-artists-and-tracks": {
    "accessPath": [
      "getUsersTopArtistsAndTracks"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/top/{type}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "type"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "time_range",
      "limit",
      "offset"
    ]
  },
  "get-users-profile": {
    "accessPath": [
      "getUsersProfile"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/users/{user_id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "user_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-list-users-playlists": {
    "accessPath": [
      "getListUsersPlaylists"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/users/{user_id}/playlists",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "user_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "limit",
      "offset"
    ]
  },
  "create-playlist-for-user": {
    "accessPath": [
      "createPlaylistForUser"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "name",
      "public",
      "collaborative",
      "description"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "POST",
    "pathTemplate": "/v1/users/{user_id}/playlists",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "user_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "follow-playlist": {
    "accessPath": [
      "followPlaylist"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "public"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/playlists/{playlist_id}/followers",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "unfollow-playlist": {
    "accessPath": [
      "unfollowPlaylist"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "DELETE",
    "pathTemplate": "/v1/playlists/{playlist_id}/followers",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-featured-playlists": {
    "accessPath": [
      "getFeaturedPlaylists"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/browse/featured-playlists",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "locale",
      "limit",
      "offset"
    ]
  },
  "get-categories": {
    "accessPath": [
      "getCategories"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/browse/categories",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "locale",
      "limit",
      "offset"
    ]
  },
  "get-a-category": {
    "accessPath": [
      "getACategory"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/browse/categories/{category_id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "category_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "locale"
    ]
  },
  "get-a-categories-playlists": {
    "accessPath": [
      "getACategoriesPlaylists"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/browse/categories/{category_id}/playlists",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "category_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "limit",
      "offset"
    ]
  },
  "get-playlist-cover": {
    "accessPath": [
      "getPlaylistCover"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/playlists/{playlist_id}/images",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "upload-custom-playlist-cover": {
    "accessPath": [
      "uploadCustomPlaylistCover"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "raw",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/playlists/{playlist_id}/images",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-new-releases": {
    "accessPath": [
      "getNewReleases"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/browse/new-releases",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "limit",
      "offset"
    ]
  },
  "get-followed": {
    "accessPath": [
      "getFollowed"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/following",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "type",
      "after",
      "limit"
    ]
  },
  "follow-artists-users": {
    "accessPath": [
      "followArtistsUsers"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "ids"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/following",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [
      "ids"
    ],
    "queryParameterKeys": [
      "type",
      "ids"
    ]
  },
  "unfollow-artists-users": {
    "accessPath": [
      "unfollowArtistsUsers"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "ids"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "DELETE",
    "pathTemplate": "/v1/me/following",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [
      "ids"
    ],
    "queryParameterKeys": [
      "type",
      "ids"
    ]
  },
  "check-current-user-follows": {
    "accessPath": [
      "checkCurrentUserFollows"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/following/contains",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "type",
      "ids"
    ]
  },
  "check-if-user-follows-playlist": {
    "accessPath": [
      "checkIfUserFollowsPlaylist"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/playlists/{playlist_id}/followers/contains",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "playlist_id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "get-several-audio-features": {
    "accessPath": [
      "getSeveralAudioFeatures"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/audio-features",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "ids"
    ]
  },
  "get-audio-features": {
    "accessPath": [
      "getAudioFeatures"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/audio-features/{id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-audio-analysis": {
    "accessPath": [
      "getAudioAnalysis"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/audio-analysis/{id}",
    "pathConflictKeys": [],
    "pathParameterKeys": [
      "id"
    ],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-recommendations": {
    "accessPath": [
      "getRecommendations"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/recommendations",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "limit",
      "market",
      "seed_artists",
      "seed_genres",
      "seed_tracks",
      "min_acousticness",
      "max_acousticness",
      "target_acousticness",
      "min_danceability",
      "max_danceability",
      "target_danceability",
      "min_duration_ms",
      "max_duration_ms",
      "target_duration_ms",
      "min_energy",
      "max_energy",
      "target_energy",
      "min_instrumentalness",
      "max_instrumentalness",
      "target_instrumentalness",
      "min_key",
      "max_key",
      "target_key",
      "min_liveness",
      "max_liveness",
      "target_liveness",
      "min_loudness",
      "max_loudness",
      "target_loudness",
      "min_mode",
      "max_mode",
      "target_mode",
      "min_popularity",
      "max_popularity",
      "target_popularity",
      "min_speechiness",
      "max_speechiness",
      "target_speechiness",
      "min_tempo",
      "max_tempo",
      "target_tempo",
      "min_time_signature",
      "max_time_signature",
      "target_time_signature",
      "min_valence",
      "max_valence",
      "target_valence"
    ]
  },
  "get-recommendation-genres": {
    "accessPath": [
      "getRecommendationGenres"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/recommendations/available-genre-seeds",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-information-about-the-users-current-playback": {
    "accessPath": [
      "getInformationAboutTheUsersCurrentPlayback"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/player",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "additional_types"
    ]
  },
  "transfer-a-users-playback": {
    "accessPath": [
      "transferAUsersPlayback"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "device_ids",
      "play"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/player",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-a-users-available-devices": {
    "accessPath": [
      "getAUsersAvailableDevices"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/player/devices",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "get-the-users-currently-playing-track": {
    "accessPath": [
      "getTheUsersCurrentlyPlayingTrack"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/player/currently-playing",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "market",
      "additional_types"
    ]
  },
  "start-a-users-playback": {
    "accessPath": [
      "startAUsersPlayback"
    ],
    "bodyAllowsAdditionalProperties": true,
    "bodyKind": "properties",
    "bodyPropertyKeys": [
      "context_uri",
      "uris",
      "offset",
      "position_ms"
    ],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/player/play",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "device_id"
    ]
  },
  "pause-a-users-playback": {
    "accessPath": [
      "pauseAUsersPlayback"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/player/pause",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "device_id"
    ]
  },
  "skip-users-playback-to-next-track": {
    "accessPath": [
      "skipUsersPlaybackToNextTrack"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "POST",
    "pathTemplate": "/v1/me/player/next",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "device_id"
    ]
  },
  "skip-users-playback-to-previous-track": {
    "accessPath": [
      "skipUsersPlaybackToPreviousTrack"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "POST",
    "pathTemplate": "/v1/me/player/previous",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "device_id"
    ]
  },
  "seek-to-position-in-currently-playing-track": {
    "accessPath": [
      "seekToPositionInCurrentlyPlayingTrack"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/player/seek",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "position_ms",
      "device_id"
    ]
  },
  "set-repeat-mode-on-users-playback": {
    "accessPath": [
      "setRepeatModeOnUsersPlayback"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/player/repeat",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "state",
      "device_id"
    ]
  },
  "set-volume-for-users-playback": {
    "accessPath": [
      "setVolumeForUsersPlayback"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/player/volume",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "volume_percent",
      "device_id"
    ]
  },
  "toggle-shuffle-for-users-playback": {
    "accessPath": [
      "toggleShuffleForUsersPlayback"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "PUT",
    "pathTemplate": "/v1/me/player/shuffle",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "state",
      "device_id"
    ]
  },
  "get-recently-played": {
    "accessPath": [
      "getRecentlyPlayed"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/player/recently-played",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "limit",
      "after",
      "before"
    ]
  },
  "get-queue": {
    "accessPath": [
      "getQueue"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/me/player/queue",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  },
  "add-to-queue": {
    "accessPath": [
      "addToQueue"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "POST",
    "pathTemplate": "/v1/me/player/queue",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": [
      "uri",
      "device_id"
    ]
  },
  "get-available-markets": {
    "accessPath": [
      "getAvailableMarkets"
    ],
    "bodyAllowsAdditionalProperties": false,
    "bodyKind": "none",
    "bodyPropertyKeys": [],
    "contentType": "application/json",
    "headerParameterKeys": [],
    "httpMethod": "GET",
    "pathTemplate": "/v1/markets",
    "pathConflictKeys": [],
    "pathParameterKeys": [],
    "queryConflictKeys": [],
    "queryParameterKeys": []
  }
} satisfies ToolRuntimeMetadataMap;
