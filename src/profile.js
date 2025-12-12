import { getStoredToken } from "./auth.js";
import {
  setAccessToken,
  getUserProfile,
  getTopArtists,
  getRecentlyPlayed
} from "./api.js";

// token
const token = getStoredToken();
if (!token) location.href = "index.html";
setAccessToken(token);

// Elemente
const sidebar = document.getElementById("playlist-sidebar");
const toggleBtn = document.getElementById("toggle-playlists");
const mainContent = document.getElementById("main-content");

const playlistList = document.getElementById("playlist-list");
const playlistTracks = document.getElementById("playlist-tracks");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");

    if (sidebar.classList.contains("hidden")) {
        mainContent.classList.remove("shifted");
    } else {
        mainContent.classList.add("shifted");
    }
});




// PROFIL 
(async () => {
  const user = await getUserProfile();
  document.getElementById("profile-img").src = user.images?.[0]?.url || "";
  document.getElementById("profile-name").textContent = user.display_name;
  document.getElementById("profile-email").textContent = user.email;

  const artists = await getTopArtists(10);
  const genres = new Set();
  artists.items.forEach(a => (a.genres ?? []).forEach(g => genres.add(g)));

  document.getElementById("genres").innerHTML =
    [...genres]
      .slice(0, 8)
      .map(g => `<div class="music-card"><p>${g}</p></div>`)
      .join("");

  const played = await getRecentlyPlayed(10);
  document.getElementById("recently").innerHTML =
    played.items
      .map(entry => {
        const t = entry.track;
        return `
        <div class="music-card">
          <img src="${t.album.images?.[0]?.url || ""}">
          <p>${t.name}</p>
          <span>${t.artists.map(a => a.name).join(", ")}</span>
        </div>`;
      })
      .join("");
})();

// PLAYLISTS
(async () => {
  const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  playlistList.innerHTML = data.items
    .map(
      pl => `
        <div class="sidebar-item" onclick="openPlaylist('${pl.id}')">
          <img src="${pl.images?.[0]?.url || ''}">
          <p>${pl.name}</p>
        </div>
      `
    )
    .join("");
})();

// TRACKS 
window.openPlaylist = async (id) => {
  playlistTracks.innerHTML = `<p style="color:white;">Loading...</p>`;

  const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const playlist = await res.json();

  playlistTracks.innerHTML = `<h3 style="color:white;">${playlist.name}</h3>`;

  playlistTracks.innerHTML += playlist.tracks.items
    .map((item, i) => {
      const t = item.track;
      if (!t) return "";

      return `
        <div class="track-item">
          <img src="${t.album.images?.[0]?.url || ''}">
          <div class="track-info">
            <p>${t.name}</p>
            <span>${t.artists.map(a => a.name).join(", ")}</span>
          </div>

          ${
            t.preview_url
              ? `<button class="track-play" onclick="play('${t.preview_url}')">▶</button>`
              : `<button class="track-play" disabled>No</button>`
          }

          <button class="track-delete" onclick="deleteTrack('${id}', '${t.uri}')">✕</button>
        </div>
      `;
    })
    .join("");
};

// DELETE TRACK 
window.deleteTrack = async (playlistId, trackUri) => {
  if (!confirm("Ștergi melodia din playlist?")) return;

  await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ tracks: [{ uri: trackUri }] })
  });

  openPlaylist(playlistId);
};

// AUDIO PLAYER
let audio = new Audio();
let current = null;

window.play = (url) => {
  if (current === url) {
    audio.pause();
    current = null;
  } else {
    audio.src = url;
    audio.play();
    current = url;
  }
};
