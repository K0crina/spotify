import { getStoredToken } from "./auth.js";
import { setAccessToken, getTopTracks } from "./api.js";

const token = getStoredToken();
if (!token) location.href = "index.html";
setAccessToken(token);

const container = document.getElementById("tracks");
let audio = new Audio();
let current = null;

(async () => {
  const data = await getTopTracks(5);

  container.innerHTML = data.items.map((t, i) => `
    <div class="music-card">
      <strong>#${i + 1}</strong>
      <img src="${t.album.images?.[0]?.url || ""}">
      <p>${t.name}</p>
      <span>${t.artists[0].name}</span>

      ${t.preview_url ? `<button onclick="play('${t.preview_url}')">▶</button>` : ""}
    </div>
  `).join("");
})();

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

document.getElementById("logout-btn").onclick = () => {
  localStorage.clear();
  location.href = "index.html";
};
