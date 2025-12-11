import { getStoredToken } from "./auth.js";
import {
  setAccessToken,
  getUserProfile,
  getTopArtists,
  getRecentlyPlayed
} from "./api.js";

const token = getStoredToken();
if (!token) location.href = "index.html";
setAccessToken(token);

// --- ELEMENTE DIN HTML ---
const img = document.getElementById("profile-img");
const nameEl = document.getElementById("profile-name");
const emailEl = document.getElementById("profile-email");

const genreBox = document.getElementById("genres");
const recentBox = document.getElementById("recently");

// PLAYER AUDIO
let audio = new Audio();
let current = null;

// LOAD PROFILE (TOTUL AICI)
loadProfile();

async function loadProfile() {
  try {
    // PROFIL UTILIZATOR 
    const user = await getUserProfile();
    img.src = user.images?.[0]?.url || "";
    nameEl.textContent = user.display_name;
    emailEl.textContent = user.email || "";

    // TOP ARTIȘTI → GENURI 
    const topRes = await getTopArtists(5);
    const artists = topRes.items;

    const genres = new Set();
    artists.forEach(a => (a.genres || []).forEach(g => genres.add(g)));

    genreBox.innerHTML = Array.from(genres)
      .slice(0, 8)
      .map(g => `<div class="music-card"><p>${g}</p></div>`)
      .join("");

    // RECENTLY PLAYED
    const played = await getRecentlyPlayed(10);
    const tracks = played.items || [];

    recentBox.innerHTML = tracks
      .map(entry => {
        const t = entry.track;
        const imgURL = t.album.images?.[0]?.url || "";
        const artists = t.artists.map(a => a.name).join(", ");

        return `
          <div class="music-card">
            <img src="${imgURL}">
            <p><strong>${t.name}</strong></p>
            <span>${artists}</span>
            ${
              t.preview_url
                ? `<button onclick="play('${t.preview_url}')">▶ Play</button>`
                : `<span style="opacity:0.5;">No preview</span>`
            }
          </div>
        `;
      })
      .join("");

  } catch (err) {
    console.error("EROARE PROFILE:", err);
    recentBox.innerHTML = "<p>Eroare la încărcarea pieselor.</p>";
  }
}

// PLAYER
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

// LOGOUT
document.getElementById("logout-btn").onclick = () => {
  localStorage.clear();
  location.href = "index.html";
};
