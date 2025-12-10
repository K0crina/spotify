import { getStoredToken } from "./auth.js";
import {
  setAccessToken,
  getUserProfile,
  getTopArtists,
  getRecommendations
} from "./api.js";

const token = getStoredToken();
if (!token) location.href = "index.html";
setAccessToken(token);

const img = document.getElementById("profile-img");
const nameEl = document.getElementById("profile-name");
const emailEl = document.getElementById("profile-email");
const recBox = document.getElementById("recommendations");
const genreBox = document.getElementById("genres");

let audio = new Audio(), current = null;

loadProfile();

async function loadProfile() {
  try {
    //   PROFIL
    const user = await getUserProfile();
    img.src = user.images?.[0]?.url || "";
    nameEl.textContent = user.display_name;
    emailEl.textContent = user.email || "";

    //   TOP ARTIȘTI
    const topRes = await getTopArtists(5);
    const artists = topRes.items;

    const artistIds = artists.map(a => a.id);

    //   GENURI (doar afișare, NU trimitem la API)
    const genres = new Set();
    artists.forEach(a => (a.genres || []).forEach(g => genres.add(g)));

    genreBox.innerHTML = Array.from(genres).slice(0, 8).map(g => `
      <div class="music-card"><p>${g}</p></div>
    `).join("");

    //   RECOMANDĂRI REALE (doar artiști)
    const rec = await getRecommendations(artistIds);

    recBox.innerHTML = rec.tracks.map((t, i) => `
      <div class="music-card">
        <strong>#${i + 1}</strong>
        <img src="${t.album.images?.[0]?.url || ""}">
        <p>${t.name}</p>
        <span>${t.artists[0].name}</span>
        ${t.preview_url ? `<button onclick="play('${t.preview_url}')">▶ Play</button>` : ""}
      </div>
    `).join("");

  } catch (err) {
    console.error("EROARE PROFIL:", err);
    recBox.innerHTML = "<p>Eroare la încărcarea sugestiilor.</p>";
  }
}

//   PLAYER
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

//   LOGOUT
document.getElementById("logout-btn").onclick = () => {
  localStorage.clear();
  location.href = "index.html";
};
