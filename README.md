# Spotify Dashboard

A client-side web application that connects to any Spotify account and surfaces personal listening statistics — top artists, albums, tracks, recently played history, playlist management and real-time search — all without a backend server.

---

## Authentication

The app uses the **OAuth 2.0 PKCE flow** entirely from the browser:

1. A random 64-character `code_verifier` is generated using `crypto.getRandomValues`.
2. It is hashed with SHA-256 (`crypto.subtle.digest`) and base64url-encoded to produce the `code_challenge`.
3. The user is redirected to Spotify's authorization endpoint with the challenge.
4. On callback, the authorization code is exchanged for an access token using the original verifier — no client secret needed, no backend.
5. The token is stored in `localStorage` and reused across pages.

---

## Pages & Features

| Page | File | What it does |
|---|---|---|
| Login | `index.html` + `src/index.js` | Initiates PKCE flow, handles redirect callback, stores token |
| Profile | `profile.html` + `src/profile.js` | Displays avatar, display name, email, top genres (extracted from top artists), recently played tracks; sidebar with all playlists — click to expand, preview 30s clips, delete tracks via `DELETE /playlists/{id}/tracks` |
| Top Artists | `artists.html` + `src/artists.js` | Top 5 artists (medium-term), responsive grid with images |
| Top Albums | `albums.html` + `src/albums.js` | Top 5 albums derived from top tracks |
| Top Tracks | `tracks.html` + `src/tracks.js` | Top 5 tracks with preview playback |
| Search | `search.html` + `src/search.js` | Live search on input — queries `GET /search?type=track,artist,album`, displays results in three simultaneous columns |

---

## Project Structure

```
.
├── index.html / profile.html / artists.html / albums.html / tracks.html / search.html
├── style.css
└── src/
    ├── config.js      # CLIENT_ID constant
    ├── auth.js        # PKCE flow: generateRandomString, sha256, redirectToSpotifyLogin, exchangeCodeForToken, getStoredToken
    ├── api.js         # Central fetch wrapper (spotifyRequest) + all endpoint functions
    ├── index.js       # Login page: detect callback code, exchange for token, redirect
    ├── profile.js     # Profile page: user data, genres, recently played, playlists, delete track
    ├── artists.js     # Top artists rendering
    ├── albums.js      # Top albums rendering
    ├── tracks.js      # Top tracks + preview playback
    ├── search.js      # Live search: debounced input → three-column results
    └── ui.js          # Shared UI helpers
```

---

## Setup & Run

1. Create an application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Add `http://127.0.0.1:5500/index.html` as a **Redirect URI**.
3. Copy your **Client ID** into `src/config.js` and `src/auth.js`.
4. Open `index.html` with a local server (e.g. **Live Server** in VS Code).

> The app must be served over HTTP — `file://` won't work because Spotify's OAuth redirect requires a real URI.

---

## API Scopes Used

| Scope | Used for |
|---|---|
| `user-read-email`, `user-read-private` | Profile page |
| `user-top-read` | Top artists, tracks |
| `user-read-recently-played` | Recently played on profile |
| `playlist-read-private`, `playlist-read-collaborative` | Sidebar playlist list |
| `playlist-modify-private`, `playlist-modify-public` | Delete track from playlist |

---

## Technical Notes

- **No frameworks, no bundler** — ES modules (`import`/`export`) loaded natively in the browser.
- All Spotify requests go through a single `spotifyRequest()` wrapper in `api.js` that injects the `Bearer` token and handles errors uniformly.
- Live search fires on every keystroke (`input` event) — results for tracks, artists and albums are rendered simultaneously from a single API call (`type=track,artist,album`).
- 30-second preview clips are played directly in the browser using the `preview_url` field where available.
