import { getStoredToken } from "./auth.js";
import { setAccessToken, getTopTracks } from "./api.js";

const token = getStoredToken();
if (!token) location.href = "index.html";
setAccessToken(token);

const container = document.getElementById("albums");

(async () => {
  const tracks = await getTopTracks(50);
  const map = new Map();

  tracks.items.forEach(t => {
    if (!map.has(t.album.id)) map.set(t.album.id, t.album);
  });

  const albums = Array.from(map.values()).slice(0, 5);

container.innerHTML = albums.map((a, i) => `
  <div class="music-card">
    <strong>#${i + 1}</strong>
    <img src="${a.images?.[0]?.url || ""}">
    <p>${a.name}</p>
  </div>
`).join("");
})();

document.getElementById("logout-btn").onclick = () => {
  localStorage.clear();
  location.href = "index.html";
};
