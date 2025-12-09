// src/api.js
import { getAccessToken } from "./auth.js";

const API_BASE = "https://api.spotify.com/v1";

async function apiRequest(endpoint) {
  const token = getAccessToken();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
}

export function fetchUserProfile() {
  return apiRequest("/me");
}

export function fetchTopArtists() {
  return apiRequest("/me/top/artists?limit=5");
}

export async function fetchTopAlbums() {
  const data = await apiRequest("/me/top/tracks?limit=20");
  const albums = [];

  data.items.forEach((track) => {
    if (!albums.find((a) => a.id === track.album.id)) {
      albums.push(track.album);
    }
  });

  return albums.slice(0, 5);
}

export function searchSpotify(query) {
  return apiRequest(`/search?q=${query}&type=track,artist&limit=8`);
}
