export type SpotifyClient = {
  /**
   * Add Items to Playlist 
   * Tags: Playlists, Tracks
   * Access as: spotify.addItemsToPlaylist(input, options)
   */
  addItemsToPlaylist: (input: { uris?: (string)[]; position?: number; playlist_id: string; [key: string]: unknown }, options?: { query?: { position?: number; uris?: string } }) => Promise<{ snapshot_id?: string }>;
  /**
   * Add Item to Playback Queue 
   * Tags: Player
   * Access as: spotify.addToQueue(input)
   */
  addToQueue: (input: { uri: string; device_id?: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Add Items to Playlist [DEPRECATED] 
   * Tags: Playlists, Tracks
   * Access as: spotify.addTracksToPlaylist(input, options)
   */
  addTracksToPlaylist: (input: { uris?: (string)[]; position?: number; playlist_id: string; [key: string]: unknown }, options?: { query?: { position?: number; uris?: string } }) => Promise<{ snapshot_id?: string }>;
  /**
   * Change Playlist Details 
   * Tags: Playlists, Library
   * Access as: spotify.changePlaylistDetails(input)
   */
  changePlaylistDetails: (input: { name?: string; public?: boolean; collaborative?: boolean; description?: string; playlist_id: string; [key: string]: unknown }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Check If User Follows Artists or Users 
   * Tags: Users, Artists, Library
   * Access as: spotify.checkCurrentUserFollows(input)
   */
  checkCurrentUserFollows: (input: { type: "artist" | "user"; ids: string }) => Promise<(boolean)[]>;
  /**
   * Check if Current User Follows Playlist 
   * Tags: Users, Playlists
   * Access as: spotify.checkIfUserFollowsPlaylist(input)
   */
  checkIfUserFollowsPlaylist: (input: { playlist_id: string; ids?: string }) => Promise<(boolean)[]>;
  /**
   * Check User's Saved Items 
   * Tags: Library
   * Access as: spotify.checkLibraryContains(input)
   */
  checkLibraryContains: (input: { uris: string }) => Promise<(boolean)[]>;
  /**
   * Check User's Saved Albums 
   * Tags: Albums, Library
   * Access as: spotify.checkUsersSavedAlbums(input)
   */
  checkUsersSavedAlbums: (input: { ids: string }) => Promise<(boolean)[]>;
  /**
   * Check User's Saved Audiobooks 
   * Tags: Audiobooks, Library
   * Access as: spotify.checkUsersSavedAudiobooks(input)
   */
  checkUsersSavedAudiobooks: (input: { ids: string }) => Promise<(boolean)[]>;
  /**
   * Check User's Saved Episodes 
   * Tags: Episodes, Library
   * Access as: spotify.checkUsersSavedEpisodes(input)
   */
  checkUsersSavedEpisodes: (input: { ids: string }) => Promise<(boolean)[]>;
  /**
   * Check User's Saved Shows 
   * Tags: Shows, Library
   * Access as: spotify.checkUsersSavedShows(input)
   */
  checkUsersSavedShows: (input: { ids: string }) => Promise<(boolean)[]>;
  /**
   * Check User's Saved Tracks 
   * Tags: Tracks, Library
   * Access as: spotify.checkUsersSavedTracks(input)
   */
  checkUsersSavedTracks: (input: { ids: string }) => Promise<(boolean)[]>;
  /**
   * Create Playlist 
   * Tags: Playlists, Library
   * Access as: spotify.createPlaylist(input)
   */
  createPlaylist: (input: { name: string; public?: boolean; collaborative?: boolean; description?: string; [key: string]: unknown }) => Promise<{ collaborative?: boolean; description?: string | null; external_urls?: { spotify?: string }; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; owner?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string } & { display_name?: string | null }; public?: boolean; snapshot_id?: string; items?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; added_by?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string }; is_local?: boolean; item?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }; track?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } } })[] }; tracks?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; added_by?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string }; is_local?: boolean; item?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }; track?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } } })[] }; type?: string; uri?: string }>;
  /**
   * Create Playlist for user 
   * Tags: Playlists, Library
   * Access as: spotify.createPlaylistForUser(input)
   */
  createPlaylistForUser: (input: { name: string; public?: boolean; collaborative?: boolean; description?: string; user_id: string; [key: string]: unknown }) => Promise<{ collaborative?: boolean; description?: string | null; external_urls?: { spotify?: string }; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; owner?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string } & { display_name?: string | null }; public?: boolean; snapshot_id?: string; items?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; added_by?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string }; is_local?: boolean; item?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }; track?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } } })[] }; tracks?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; added_by?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string }; is_local?: boolean; item?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }; track?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } } })[] }; type?: string; uri?: string }>;
  /**
   * Follow Artists or Users 
   * Tags: Users, Artists, Library
   * Access as: spotify.followArtistsUsers(input, options)
   */
  followArtistsUsers: (input: { ids: (string)[]; type: "artist" | "user"; [key: string]: unknown }, options: { query: { ids: string } }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Follow Playlist 
   * Tags: Users, Playlists
   * Access as: spotify.followPlaylist(input)
   */
  followPlaylist: (input: { public?: boolean; playlist_id: string; [key: string]: unknown }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Get Category's Playlists 
   * Tags: Playlists, Categories
   * Access as: spotify.getACategoriesPlaylists(input)
   */
  getACategoriesPlaylists: (input: { category_id: string; limit?: number; offset?: number }) => Promise<{ message?: string; playlists?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ collaborative?: boolean; description?: string; external_urls?: { spotify?: string }; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; owner?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string } & { display_name?: string | null }; public?: boolean; snapshot_id?: string; items?: { href?: string; total?: number }; tracks?: { href?: string; total?: number }; type?: string; uri?: string })[] } }>;
  /**
   * Get Single Browse Category 
   * Tags: Categories
   * Access as: spotify.getACategory(input)
   */
  getACategory: (input: { category_id: string; locale?: string }) => Promise<{ href: string; icons: ({ url: string; height: number | null; width: number | null })[]; id: string; name: string }>;
  /**
   * Get a Chapter 
   * Tags: Chapters
   * Access as: spotify.getAChapter(input)
   */
  getAChapter: (input: { id: string; market?: string }) => Promise<{ audio_preview_url: string | null; available_markets?: (string)[]; chapter_number: number; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_playable: boolean; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { audiobook: { authors: ({ name?: string })[]; available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; edition?: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; languages: (string)[]; media_type: string; name: string; narrators: ({ name?: string })[]; publisher: string; type: "audiobook"; uri: string; total_chapters: number } & { [key: string]: unknown } }>;
  /**
   * Get Current User's Playlists 
   * Tags: Playlists, Library
   * Access as: spotify.getAListOfCurrentUsersPlaylists(input)
   */
  getAListOfCurrentUsersPlaylists: (input: { limit?: number; offset?: number }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ collaborative?: boolean; description?: string; external_urls?: { spotify?: string }; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; owner?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string } & { display_name?: string | null }; public?: boolean; snapshot_id?: string; items?: { href?: string; total?: number }; tracks?: { href?: string; total?: number }; type?: string; uri?: string })[] }>;
  /**
   * Get Album 
   * Tags: Albums
   * Access as: spotify.getAnAlbum(input)
   */
  getAnAlbum: (input: { id: string; market?: string }) => Promise<{ album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; tracks?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: string; uri?: string }; restrictions?: { reason?: string }; name?: string; preview_url?: string | null; track_number?: number; type?: string; uri?: string; is_local?: boolean })[] }; copyrights?: ({ text?: string; type?: string })[]; external_ids?: { isrc?: string; ean?: string; upc?: string }; genres?: (string)[]; label?: string; popularity?: number }>;
  /**
   * Get Album Tracks 
   * Tags: Albums, Tracks
   * Access as: spotify.getAnAlbumsTracks(input)
   */
  getAnAlbumsTracks: (input: { id: string; market?: string; limit?: number; offset?: number }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: string; uri?: string }; restrictions?: { reason?: string }; name?: string; preview_url?: string | null; track_number?: number; type?: string; uri?: string; is_local?: boolean })[] }>;
  /**
   * Get Artist 
   * Tags: Artists
   * Access as: spotify.getAnArtist(input)
   */
  getAnArtist: (input: { id: string }) => Promise<{ external_urls?: { spotify?: string }; followers?: { href?: string | null; total?: number }; genres?: (string)[]; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; popularity?: number; type?: "artist"; uri?: string }>;
  /**
   * Get Artist's Albums 
   * Tags: Artists, Albums
   * Access as: spotify.getAnArtistsAlbums(input)
   */
  getAnArtistsAlbums: (input: { id: string; include_groups?: string; market?: string; limit?: number; offset?: number }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] } & { album_group: "album" | "single" | "compilation" | "appears_on" })[] }>;
  /**
   * Get Artist's Related Artists 
   * Tags: Artists
   * Access as: spotify.getAnArtistsRelatedArtists(input)
   */
  getAnArtistsRelatedArtists: (input: { id: string }) => Promise<{ artists: ({ external_urls?: { spotify?: string }; followers?: { href?: string | null; total?: number }; genres?: (string)[]; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; popularity?: number; type?: "artist"; uri?: string })[] }>;
  /**
   * Get Artist's Top Tracks 
   * Tags: Artists, Tracks
   * Access as: spotify.getAnArtistsTopTracks(input)
   */
  getAnArtistsTopTracks: (input: { id: string; market?: string }) => Promise<{ tracks: ({ album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean })[] }>;
  /**
   * Get an Audiobook 
   * Tags: Audiobooks
   * Access as: spotify.getAnAudiobook(input)
   */
  getAnAudiobook: (input: { id: string; market?: string }) => Promise<{ authors: ({ name?: string })[]; available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; edition?: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; languages: (string)[]; media_type: string; name: string; narrators: ({ name?: string })[]; publisher: string; type: "audiobook"; uri: string; total_chapters: number } & { chapters: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ audio_preview_url: string | null; available_markets?: (string)[]; chapter_number: number; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_playable: boolean; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { [key: string]: unknown })[] } }>;
  /**
   * Get Episode 
   * Tags: Episodes
   * Access as: spotify.getAnEpisode(input)
   */
  getAnEpisode: (input: { id: string; market?: string }) => Promise<{ audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }>;
  /**
   * Get Show 
   * Tags: Shows
   * Access as: spotify.getAShow(input)
   */
  getAShow: (input: { id: string; market?: string }) => Promise<{ available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { episodes: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { [key: string]: unknown })[] } }>;
  /**
   * Get Show Episodes 
   * Tags: Shows, Episodes
   * Access as: spotify.getAShowsEpisodes(input)
   */
  getAShowsEpisodes: (input: { id: string; market?: string; limit?: number; offset?: number }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { [key: string]: unknown })[] }>;
  /**
   * Get Track's Audio Analysis 
   * Tags: Tracks
   * Access as: spotify.getAudioAnalysis(input)
   */
  getAudioAnalysis: (input: { id: string }) => Promise<{ meta?: { analyzer_version?: string; platform?: string; detailed_status?: string; status_code?: number; timestamp?: number; analysis_time?: number; input_process?: string }; track?: { num_samples?: number; duration?: number; sample_md5?: string; offset_seconds?: number; window_seconds?: number; analysis_sample_rate?: number; analysis_channels?: number; end_of_fade_in?: number; start_of_fade_out?: number; loudness?: number; tempo?: number; tempo_confidence?: number; time_signature?: number; time_signature_confidence?: number; key?: number; key_confidence?: number; mode?: number; mode_confidence?: number; codestring?: string; code_version?: number; echoprintstring?: string; echoprint_version?: number; synchstring?: string; synch_version?: number; rhythmstring?: string; rhythm_version?: number }; bars?: ({ start?: number; duration?: number; confidence?: number })[]; beats?: ({ start?: number; duration?: number; confidence?: number })[]; sections?: ({ start?: number; duration?: number; confidence?: number; loudness?: number; tempo?: number; tempo_confidence?: number; key?: number; key_confidence?: number; mode?: -1 | 0 | 1; mode_confidence?: number; time_signature?: number; time_signature_confidence?: number })[]; segments?: ({ start?: number; duration?: number; confidence?: number; loudness_start?: number; loudness_max?: number; loudness_max_time?: number; loudness_end?: number; pitches?: (number)[]; timbre?: (number)[] })[]; tatums?: ({ start?: number; duration?: number; confidence?: number })[] }>;
  /**
   * Get Audiobook Chapters 
   * Tags: Audiobooks, Chapters
   * Access as: spotify.getAudiobookChapters(input)
   */
  getAudiobookChapters: (input: { id: string; market?: string; limit?: number; offset?: number }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ audio_preview_url: string | null; available_markets?: (string)[]; chapter_number: number; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_playable: boolean; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { [key: string]: unknown })[] }>;
  /**
   * Get Track's Audio Features 
   * Tags: Tracks
   * Access as: spotify.getAudioFeatures(input)
   */
  getAudioFeatures: (input: { id: string }) => Promise<{ acousticness?: number; analysis_url?: string; danceability?: number; duration_ms?: number; energy?: number; id?: string; instrumentalness?: number; key?: number; liveness?: number; loudness?: number; mode?: number; speechiness?: number; tempo?: number; time_signature?: number; track_href?: string; type?: "audio_features"; uri?: string; valence?: number }>;
  /**
   * Get Available Devices 
   * Tags: Player
   * Access as: spotify.getAUsersAvailableDevices()
   */
  getAUsersAvailableDevices: () => Promise<{ devices: ({ id?: string | null; is_active?: boolean; is_private_session?: boolean; is_restricted?: boolean; name?: string; type?: string; volume_percent?: number | null; supports_volume?: boolean })[] }>;
  /**
   * Get Available Markets 
   * Tags: Markets
   * Access as: spotify.getAvailableMarkets()
   */
  getAvailableMarkets: () => Promise<{ markets?: (string)[] }>;
  /**
   * Get Several Browse Categories 
   * Tags: Categories
   * Access as: spotify.getCategories(input)
   */
  getCategories: (input: { locale?: string; limit?: number; offset?: number }) => Promise<{ categories: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ href: string; icons: ({ url: string; height: number | null; width: number | null })[]; id: string; name: string })[] } }>;
  /**
   * Get Current User's Profile 
   * Tags: Users
   * Access as: spotify.getCurrentUsersProfile()
   */
  getCurrentUsersProfile: () => Promise<{ country?: string; display_name?: string; email?: string; explicit_content?: { filter_enabled?: boolean; filter_locked?: boolean }; external_urls?: { spotify?: string }; followers?: { href?: string | null; total?: number }; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; product?: string; type?: string; uri?: string }>;
  /**
   * Get Featured Playlists 
   * Tags: Playlists
   * Access as: spotify.getFeaturedPlaylists(input)
   */
  getFeaturedPlaylists: (input: { locale?: string; limit?: number; offset?: number }) => Promise<{ message?: string; playlists?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ collaborative?: boolean; description?: string; external_urls?: { spotify?: string }; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; owner?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string } & { display_name?: string | null }; public?: boolean; snapshot_id?: string; items?: { href?: string; total?: number }; tracks?: { href?: string; total?: number }; type?: string; uri?: string })[] } }>;
  /**
   * Get Followed Artists 
   * Tags: Users, Library, Artists
   * Access as: spotify.getFollowed(input)
   */
  getFollowed: (input: { type: "artist"; after?: string; limit?: number }) => Promise<{ artists: { href?: string; limit?: number; next?: string; cursors?: { after?: string; before?: string }; total?: number } & { items?: ({ external_urls?: { spotify?: string }; followers?: { href?: string | null; total?: number }; genres?: (string)[]; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; popularity?: number; type?: "artist"; uri?: string })[] } }>;
  /**
   * Get Playback State 
   * Tags: Player
   * Access as: spotify.getInformationAboutTheUsersCurrentPlayback(input)
   */
  getInformationAboutTheUsersCurrentPlayback: (input: { market?: string; additional_types?: string }) => Promise<{ device?: { id?: string | null; is_active?: boolean; is_private_session?: boolean; is_restricted?: boolean; name?: string; type?: string; volume_percent?: number | null; supports_volume?: boolean }; repeat_state?: string; shuffle_state?: boolean; context?: { type?: string; href?: string; external_urls?: { spotify?: string }; uri?: string }; timestamp?: number; progress_ms?: number; is_playing?: boolean; item?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }; currently_playing_type?: string; actions?: { interrupting_playback?: boolean; pausing?: boolean; resuming?: boolean; seeking?: boolean; skipping_next?: boolean; skipping_prev?: boolean; toggling_repeat_context?: boolean; toggling_shuffle?: boolean; toggling_repeat_track?: boolean; transferring_playback?: boolean } }>;
  /**
   * Get User's Playlists 
   * Tags: Playlists, Users
   * Access as: spotify.getListUsersPlaylists(input)
   */
  getListUsersPlaylists: (input: { user_id: string; limit?: number; offset?: number }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ collaborative?: boolean; description?: string; external_urls?: { spotify?: string }; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; owner?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string } & { display_name?: string | null }; public?: boolean; snapshot_id?: string; items?: { href?: string; total?: number }; tracks?: { href?: string; total?: number }; type?: string; uri?: string })[] }>;
  /**
   * Get Several Albums 
   * Tags: Albums
   * Access as: spotify.getMultipleAlbums(input)
   */
  getMultipleAlbums: (input: { ids: string; market?: string }) => Promise<{ albums: ({ album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; tracks?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: string; uri?: string }; restrictions?: { reason?: string }; name?: string; preview_url?: string | null; track_number?: number; type?: string; uri?: string; is_local?: boolean })[] }; copyrights?: ({ text?: string; type?: string })[]; external_ids?: { isrc?: string; ean?: string; upc?: string }; genres?: (string)[]; label?: string; popularity?: number })[] }>;
  /**
   * Get Several Artists 
   * Tags: Artists
   * Access as: spotify.getMultipleArtists(input)
   */
  getMultipleArtists: (input: { ids: string }) => Promise<{ artists: ({ external_urls?: { spotify?: string }; followers?: { href?: string | null; total?: number }; genres?: (string)[]; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; popularity?: number; type?: "artist"; uri?: string })[] }>;
  /**
   * Get Several Audiobooks 
   * Tags: Audiobooks
   * Access as: spotify.getMultipleAudiobooks(input)
   */
  getMultipleAudiobooks: (input: { ids: string; market?: string }) => Promise<{ audiobooks: ({ authors: ({ name?: string })[]; available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; edition?: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; languages: (string)[]; media_type: string; name: string; narrators: ({ name?: string })[]; publisher: string; type: "audiobook"; uri: string; total_chapters: number } & { chapters: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ audio_preview_url: string | null; available_markets?: (string)[]; chapter_number: number; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_playable: boolean; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { [key: string]: unknown })[] } })[] }>;
  /**
   * Get Several Episodes 
   * Tags: Episodes
   * Access as: spotify.getMultipleEpisodes(input)
   */
  getMultipleEpisodes: (input: { ids: string; market?: string }) => Promise<{ episodes: ({ audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } })[] }>;
  /**
   * Get Several Shows 
   * Tags: Shows
   * Access as: spotify.getMultipleShows(input)
   */
  getMultipleShows: (input: { market?: string; ids: string }) => Promise<{ shows: ({ available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown })[] }>;
  /**
   * Get New Releases 
   * Tags: Albums
   * Access as: spotify.getNewReleases(input)
   */
  getNewReleases: (input: { limit?: number; offset?: number }) => Promise<{ albums: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] })[] } }>;
  /**
   * Get Playlist 
   * Tags: Playlists
   * Access as: spotify.getPlaylist(input)
   */
  getPlaylist: (input: { playlist_id: string; market?: string; fields?: string; additional_types?: string }) => Promise<{ collaborative?: boolean; description?: string | null; external_urls?: { spotify?: string }; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; owner?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string } & { display_name?: string | null }; public?: boolean; snapshot_id?: string; items?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; added_by?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string }; is_local?: boolean; item?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }; track?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } } })[] }; tracks?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; added_by?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string }; is_local?: boolean; item?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }; track?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } } })[] }; type?: string; uri?: string }>;
  /**
   * Get Playlist Cover Image 
   * Tags: Playlists
   * Access as: spotify.getPlaylistCover(input)
   */
  getPlaylistCover: (input: { playlist_id: string }) => Promise<({ url: string; height: number | null; width: number | null })[]>;
  /**
   * Get Playlist Items 
   * Tags: Playlists, Tracks
   * Access as: spotify.getPlaylistsItems(input)
   */
  getPlaylistsItems: (input: { playlist_id: string; market?: string; fields?: string; limit?: number; offset?: number; additional_types?: string }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; added_by?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string }; is_local?: boolean; item?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }; track?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } } })[] }>;
  /**
   * Get Playlist Items [DEPRECATED] 
   * Tags: Playlists, Tracks
   * Access as: spotify.getPlaylistsTracks(input)
   */
  getPlaylistsTracks: (input: { playlist_id: string; market?: string; fields?: string; limit?: number; offset?: number; additional_types?: string }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; added_by?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string }; is_local?: boolean; item?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }; track?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } } })[] }>;
  /**
   * Get the User's Queue 
   * Tags: Player
   * Access as: spotify.getQueue()
   */
  getQueue: () => Promise<{ currently_playing?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }; queue?: ({ album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } })[] }>;
  /**
   * Get Recently Played Tracks 
   * Tags: Player
   * Access as: spotify.getRecentlyPlayed(input)
   */
  getRecentlyPlayed: (input: { limit?: number; after?: number; before?: number }) => Promise<{ href?: string; limit?: number; next?: string; cursors?: { after?: string; before?: string }; total?: number } & { items?: ({ track?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean }; played_at?: string; context?: { type?: string; href?: string; external_urls?: { spotify?: string }; uri?: string } })[] }>;
  /**
   * Get Available Genre Seeds 
   * Tags: Genres
   * Access as: spotify.getRecommendationGenres()
   */
  getRecommendationGenres: () => Promise<{ genres: (string)[] }>;
  /**
   * Get Recommendations 
   * Tags: Tracks
   * Access as: spotify.getRecommendations(input)
   */
  getRecommendations: (input: { limit?: number; market?: string; seed_artists: string; seed_genres: string; seed_tracks: string; min_acousticness?: number; max_acousticness?: number; target_acousticness?: number; min_danceability?: number; max_danceability?: number; target_danceability?: number; min_duration_ms?: number; max_duration_ms?: number; target_duration_ms?: number; min_energy?: number; max_energy?: number; target_energy?: number; min_instrumentalness?: number; max_instrumentalness?: number; target_instrumentalness?: number; min_key?: number; max_key?: number; target_key?: number; min_liveness?: number; max_liveness?: number; target_liveness?: number; min_loudness?: number; max_loudness?: number; target_loudness?: number; min_mode?: number; max_mode?: number; target_mode?: number; min_popularity?: number; max_popularity?: number; target_popularity?: number; min_speechiness?: number; max_speechiness?: number; target_speechiness?: number; min_tempo?: number; max_tempo?: number; target_tempo?: number; min_time_signature?: number; max_time_signature?: number; target_time_signature?: number; min_valence?: number; max_valence?: number; target_valence?: number }) => Promise<{ seeds: ({ afterFilteringSize?: number; afterRelinkingSize?: number; href?: string; id?: string; initialPoolSize?: number; type?: string })[]; tracks: ({ album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean })[] }>;
  /**
   * Get Several Tracks' Audio Features 
   * Tags: Tracks
   * Access as: spotify.getSeveralAudioFeatures(input)
   */
  getSeveralAudioFeatures: (input: { ids: string }) => Promise<{ audio_features: ({ acousticness?: number; analysis_url?: string; danceability?: number; duration_ms?: number; energy?: number; id?: string; instrumentalness?: number; key?: number; liveness?: number; loudness?: number; mode?: number; speechiness?: number; tempo?: number; time_signature?: number; track_href?: string; type?: "audio_features"; uri?: string; valence?: number })[] }>;
  /**
   * Get Several Chapters 
   * Tags: Chapters
   * Access as: spotify.getSeveralChapters(input)
   */
  getSeveralChapters: (input: { ids: string; market?: string }) => Promise<{ chapters: ({ audio_preview_url: string | null; available_markets?: (string)[]; chapter_number: number; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_playable: boolean; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { audiobook: { authors: ({ name?: string })[]; available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; edition?: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; languages: (string)[]; media_type: string; name: string; narrators: ({ name?: string })[]; publisher: string; type: "audiobook"; uri: string; total_chapters: number } & { [key: string]: unknown } })[] }>;
  /**
   * Get Several Tracks 
   * Tags: Tracks
   * Access as: spotify.getSeveralTracks(input)
   */
  getSeveralTracks: (input: { market?: string; ids: string }) => Promise<{ tracks: ({ album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean })[] }>;
  /**
   * Get Currently Playing Track 
   * Tags: Player
   * Access as: spotify.getTheUsersCurrentlyPlayingTrack(input)
   */
  getTheUsersCurrentlyPlayingTrack: (input: { market?: string; additional_types?: string }) => Promise<{ device?: { id?: string | null; is_active?: boolean; is_private_session?: boolean; is_restricted?: boolean; name?: string; type?: string; volume_percent?: number | null; supports_volume?: boolean }; repeat_state?: string; shuffle_state?: boolean; context?: { type?: string; href?: string; external_urls?: { spotify?: string }; uri?: string }; timestamp?: number; progress_ms?: number; is_playing?: boolean; item?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } | { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } }; currently_playing_type?: string; actions?: { interrupting_playback?: boolean; pausing?: boolean; resuming?: boolean; seeking?: boolean; skipping_next?: boolean; skipping_prev?: boolean; toggling_repeat_context?: boolean; toggling_shuffle?: boolean; toggling_repeat_track?: boolean; transferring_playback?: boolean } }>;
  /**
   * Get Track 
   * Tags: Tracks
   * Access as: spotify.getTrack(input)
   */
  getTrack: (input: { id: string; market?: string }) => Promise<{ album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean }>;
  /**
   * Get User's Profile 
   * Tags: Users
   * Access as: spotify.getUsersProfile(input)
   */
  getUsersProfile: (input: { user_id: string }) => Promise<{ display_name?: string | null; external_urls?: { spotify?: string }; followers?: { href?: string | null; total?: number }; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; type?: "user"; uri?: string }>;
  /**
   * Get User's Saved Albums 
   * Tags: Albums, Library
   * Access as: spotify.getUsersSavedAlbums(input)
   */
  getUsersSavedAlbums: (input: { limit?: number; offset?: number; market?: string }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; tracks?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: string; uri?: string }; restrictions?: { reason?: string }; name?: string; preview_url?: string | null; track_number?: number; type?: string; uri?: string; is_local?: boolean })[] }; copyrights?: ({ text?: string; type?: string })[]; external_ids?: { isrc?: string; ean?: string; upc?: string }; genres?: (string)[]; label?: string; popularity?: number } })[] }>;
  /**
   * Get User's Saved Audiobooks 
   * Tags: Audiobooks, Library
   * Access as: spotify.getUsersSavedAudiobooks(input)
   */
  getUsersSavedAudiobooks: (input: { limit?: number; offset?: number }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ authors: ({ name?: string })[]; available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; edition?: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; languages: (string)[]; media_type: string; name: string; narrators: ({ name?: string })[]; publisher: string; type: "audiobook"; uri: string; total_chapters: number } & { [key: string]: unknown })[] }>;
  /**
   * Get User's Saved Episodes 
   * Tags: Episodes, Library
   * Access as: spotify.getUsersSavedEpisodes(input)
   */
  getUsersSavedEpisodes: (input: { market?: string; limit?: number; offset?: number }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; episode?: { audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { show: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } } })[] }>;
  /**
   * Get User's Saved Shows 
   * Tags: Shows, Library
   * Access as: spotify.getUsersSavedShows(input)
   */
  getUsersSavedShows: (input: { limit?: number; offset?: number }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; show?: { available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown } })[] }>;
  /**
   * Get User's Saved Tracks 
   * Tags: Tracks, Library
   * Access as: spotify.getUsersSavedTracks(input)
   */
  getUsersSavedTracks: (input: { market?: string; limit?: number; offset?: number }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ added_at?: string; track?: { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean } })[] }>;
  /**
   * Get User's Top Items 
   * Tags: Users, Tracks, Library
   * Access as: spotify.getUsersTopArtistsAndTracks(input)
   */
  getUsersTopArtistsAndTracks: (input: { type: "artists" | "tracks"; time_range?: string; limit?: number; offset?: number }) => Promise<{ href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ external_urls?: { spotify?: string }; followers?: { href?: string | null; total?: number }; genres?: (string)[]; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; popularity?: number; type?: "artist"; uri?: string } | { album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean })[] }>;
  /**
   * Pause Playback 
   * Tags: Player
   * Access as: spotify.pauseAUsersPlayback(input)
   */
  pauseAUsersPlayback: (input: { device_id?: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Remove Users' Saved Albums 
   * Tags: Albums, Library
   * Access as: spotify.removeAlbumsUser(input, options)
   */
  removeAlbumsUser: (input: { ids?: (string)[]; [key: string]: unknown }, options: { query: { ids: string } }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Remove User's Saved Audiobooks 
   * Tags: Audiobooks, Library
   * Access as: spotify.removeAudiobooksUser(input)
   */
  removeAudiobooksUser: (input: { ids: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Remove User's Saved Episodes 
   * Tags: Episodes, Library
   * Access as: spotify.removeEpisodesUser(input, options)
   */
  removeEpisodesUser: (input: { ids?: (string)[]; [key: string]: unknown }, options: { query: { ids: string } }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Remove Playlist Items 
   * Tags: Playlists, Tracks
   * Access as: spotify.removeItemsPlaylist(input)
   */
  removeItemsPlaylist: (input: { items: ({ uri?: string })[]; snapshot_id?: string; playlist_id: string }) => Promise<{ snapshot_id?: string }>;
  /**
   * Remove Items from Library 
   * Tags: Library
   * Access as: spotify.removeLibraryItems(input)
   */
  removeLibraryItems: (input: { uris: string }) => Promise<{ status: number; message: string }>;
  /**
   * Remove User's Saved Shows 
   * Tags: Shows, Library
   * Access as: spotify.removeShowsUser(input)
   */
  removeShowsUser: (input: { ids: string; market?: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Remove Playlist Items [DEPRECATED] 
   * Tags: Playlists, Tracks
   * Access as: spotify.removeTracksPlaylist(input)
   */
  removeTracksPlaylist: (input: { tracks: ({ uri?: string })[]; snapshot_id?: string; playlist_id: string }) => Promise<{ snapshot_id?: string }>;
  /**
   * Remove User's Saved Tracks 
   * Tags: Tracks, Library
   * Access as: spotify.removeTracksUser(input, options)
   */
  removeTracksUser: (input: { ids?: (string)[]; [key: string]: unknown }, options: { query: { ids: string } }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Update Playlist Items 
   * Tags: Playlists, Tracks
   * Access as: spotify.reorderOrReplacePlaylistsItems(input, options)
   */
  reorderOrReplacePlaylistsItems: (input: { uris?: (string)[]; range_start?: number; insert_before?: number; range_length?: number; snapshot_id?: string; playlist_id: string; [key: string]: unknown }, options?: { query?: { uris?: string } }) => Promise<{ snapshot_id?: string }>;
  /**
   * Update Playlist Items [DEPRECATED] 
   * Tags: Playlists, Tracks
   * Access as: spotify.reorderOrReplacePlaylistsTracks(input, options)
   */
  reorderOrReplacePlaylistsTracks: (input: { uris?: (string)[]; range_start?: number; insert_before?: number; range_length?: number; snapshot_id?: string; playlist_id: string; [key: string]: unknown }, options?: { query?: { uris?: string } }) => Promise<{ snapshot_id?: string }>;
  /**
   * Save Albums for Current User 
   * Tags: Albums, Library
   * Access as: spotify.saveAlbumsUser(input, options)
   */
  saveAlbumsUser: (input: { ids?: (string)[]; [key: string]: unknown }, options: { query: { ids: string } }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Save Audiobooks for Current User 
   * Tags: Audiobooks, Library
   * Access as: spotify.saveAudiobooksUser(input)
   */
  saveAudiobooksUser: (input: { ids: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Save Episodes for Current User 
   * Tags: Episodes, Library
   * Access as: spotify.saveEpisodesUser(input, options)
   */
  saveEpisodesUser: (input: { ids?: (string)[]; [key: string]: unknown }, options: { query: { ids: string } }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Save Items to Library 
   * Tags: Library
   * Access as: spotify.saveLibraryItems(input)
   */
  saveLibraryItems: (input: { uris: string }) => Promise<{ status: number; message: string }>;
  /**
   * Save Shows for Current User 
   * Tags: Shows, Library
   * Access as: spotify.saveShowsUser(input)
   */
  saveShowsUser: (input: { ids: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Save Tracks for Current User 
   * Tags: Tracks, Library
   * Access as: spotify.saveTracksUser(input)
   */
  saveTracksUser: (input: { ids?: (string)[]; timestamped_ids?: ({ id: string; added_at: string })[]; [key: string]: unknown }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Search for Item 
   * Tags: Search
   * Access as: spotify.search(input)
   */
  search: (input: { q: string; type: ("album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook")[]; market?: string; limit?: number; offset?: number; include_external?: "audio" }) => Promise<{ tracks?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ album?: { album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] }; artists?: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[]; available_markets?: (string)[]; disc_number?: number; duration_ms?: number; explicit?: boolean; external_ids?: { isrc?: string; ean?: string; upc?: string }; external_urls?: { spotify?: string }; href?: string; id?: string; is_playable?: boolean; linked_from?: { [key: string]: unknown }; restrictions?: { reason?: string }; name?: string; popularity?: number; preview_url?: string | null; track_number?: number; type?: "track"; uri?: string; is_local?: boolean })[] }; artists?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ external_urls?: { spotify?: string }; followers?: { href?: string | null; total?: number }; genres?: (string)[]; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; popularity?: number; type?: "artist"; uri?: string })[] }; albums?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ album_type: "album" | "single" | "compilation"; total_tracks: number; available_markets: (string)[]; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; restrictions?: { reason?: "market" | "product" | "explicit" }; type: "album"; uri: string } & { artists: ({ external_urls?: { spotify?: string }; href?: string; id?: string; name?: string; type?: "artist"; uri?: string })[] })[] }; playlists?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ collaborative?: boolean; description?: string; external_urls?: { spotify?: string }; href?: string; id?: string; images?: ({ url: string; height: number | null; width: number | null })[]; name?: string; owner?: { external_urls?: { spotify?: string }; href?: string; id?: string; type?: "user"; uri?: string } & { display_name?: string | null }; public?: boolean; snapshot_id?: string; items?: { href?: string; total?: number }; tracks?: { href?: string; total?: number }; type?: string; uri?: string })[] }; shows?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; languages: (string)[]; media_type: string; name: string; publisher: string; type: "show"; uri: string; total_episodes: number } & { [key: string]: unknown })[] }; episodes?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ audio_preview_url: string | null; description: string; html_description: string; duration_ms: number; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; is_externally_hosted: boolean; is_playable: boolean; language?: string; languages: (string)[]; name: string; release_date: string; release_date_precision: "year" | "month" | "day"; resume_point?: { fully_played?: boolean; resume_position_ms?: number }; type: "episode"; uri: string; restrictions?: { reason?: string } } & { [key: string]: unknown })[] }; audiobooks?: { href: string; limit: number; next: string | null; offset: number; previous: string | null; total: number } & { items?: ({ authors: ({ name?: string })[]; available_markets: (string)[]; copyrights: ({ text?: string; type?: string })[]; description: string; html_description: string; edition?: string; explicit: boolean; external_urls: { spotify?: string }; href: string; id: string; images: ({ url: string; height: number | null; width: number | null })[]; languages: (string)[]; media_type: string; name: string; narrators: ({ name?: string })[]; publisher: string; type: "audiobook"; uri: string; total_chapters: number } & { [key: string]: unknown })[] } }>;
  /**
   * Seek To Position 
   * Tags: Player
   * Access as: spotify.seekToPositionInCurrentlyPlayingTrack(input)
   */
  seekToPositionInCurrentlyPlayingTrack: (input: { position_ms: number; device_id?: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Set Repeat Mode 
   * Tags: Player
   * Access as: spotify.setRepeatModeOnUsersPlayback(input)
   */
  setRepeatModeOnUsersPlayback: (input: { state: string; device_id?: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Set Playback Volume 
   * Tags: Player
   * Access as: spotify.setVolumeForUsersPlayback(input)
   */
  setVolumeForUsersPlayback: (input: { volume_percent: number; device_id?: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Skip To Next 
   * Tags: Player
   * Access as: spotify.skipUsersPlaybackToNextTrack(input)
   */
  skipUsersPlaybackToNextTrack: (input: { device_id?: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Skip To Previous 
   * Tags: Player
   * Access as: spotify.skipUsersPlaybackToPreviousTrack(input)
   */
  skipUsersPlaybackToPreviousTrack: (input: { device_id?: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Start/Resume Playback 
   * Tags: Player
   * Access as: spotify.startAUsersPlayback(input)
   */
  startAUsersPlayback: (input: { context_uri?: string; uris?: (string)[]; offset?: { [key: string]: unknown }; position_ms?: number; device_id?: string; [key: string]: unknown }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Toggle Playback Shuffle 
   * Tags: Player
   * Access as: spotify.toggleShuffleForUsersPlayback(input)
   */
  toggleShuffleForUsersPlayback: (input: { state: boolean; device_id?: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Transfer Playback 
   * Tags: Player
   * Access as: spotify.transferAUsersPlayback(input)
   */
  transferAUsersPlayback: (input: { device_ids: (string)[]; play?: boolean; [key: string]: unknown }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Unfollow Artists or Users 
   * Tags: Users, Artists, Library
   * Access as: spotify.unfollowArtistsUsers(input, options)
   */
  unfollowArtistsUsers: (input: { ids?: (string)[]; type: "artist" | "user"; [key: string]: unknown }, options: { query: { ids: string } }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Unfollow Playlist 
   * Tags: Users, Playlists
   * Access as: spotify.unfollowPlaylist(input)
   */
  unfollowPlaylist: (input: { playlist_id: string }) => Promise<{ error: { status: number; message: string } }>;
  /**
   * Add Custom Playlist Cover Image 
   * Tags: Playlists
   * Access as: spotify.uploadCustomPlaylistCover(input)
   */
  uploadCustomPlaylistCover: (input: { body?: string; playlist_id: string }) => Promise<{ error: { status: number; message: string } }>;
};
