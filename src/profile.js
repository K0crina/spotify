// importam functia care citeste token-ul salvat dupa login
import { getStoredToken } from "./auth.js";

// importam functii api pentru comunicarea cu spotify
import {
  setAccessToken,
  getUserProfile,
  getTopArtists,
  getRecentlyPlayed
} from "./api.js";

// token din localStorage
const token = getStoredToken();
//daca nu exista redirectionam la login
if (!token) location.href = "index.html";
setAccessToken(token);

// Elemente UI necesare din html
const sidebar = document.getElementById("playlist-sidebar");
const toggleBtn = document.getElementById("toggle-playlists");
const mainContent = document.getElementById("main-content");

const playlistList = document.getElementById("playlist-list");
const playlistTracks = document.getElementById("playlist-tracks");

//la click afisam sau ascudnem playlists
toggleBtn.addEventListener("click", () => {
  
    sidebar.classList.toggle("hidden");
    // Ajustăm poziția conținutului principal
    if (sidebar.classList.contains("hidden")) {
        mainContent.classList.remove("shifted");
    } else {
        mainContent.classList.add("shifted");
    }
});




(async () => {
  // obtinem datele utilizatorului logat
  const user = await getUserProfile();
  // actualizam ui-ul cu informatiile de profil
  document.getElementById("profile-img").src = user.images?.[0]?.url || "";
  document.getElementById("profile-name").textContent = user.display_name;
  document.getElementById("profile-email").textContent = user.email;

  const artists = await getTopArtists(10);
  const genres = new Set();
   // extragem genurile din artisti
  artists.items.forEach(a => (a.genres ?? []).forEach(g => genres.add(g)));

  // afisam melodiile recent ascultate
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

//functie pentru incarcare playlist
(async () => {
   // Cerere directă către Spotify API pentru playlist-uri
  const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  
  // Afișăm playlist-urile în sidebar
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

// functie activata la click pe playlist
window.openPlaylist = async (id) => {
  playlistTracks.innerHTML = `<p style="color:white;">Loading...</p>`;
  //Cerere către Spotify pentru detaliile playlist-ului
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

// functie pentru stergerea unei melodii din playlist
window.deleteTrack = async (playlistId, trackUri) => {
  //cer confirm
  if (!confirm("Ștergi melodia din playlist?")) return;
   // Cerere DELETE către Spotify API
  await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ tracks: [{ uri: trackUri }] })
  });
  // Reîncărcăm playlist-ul după ștergere
  openPlaylist(playlistId);
};

