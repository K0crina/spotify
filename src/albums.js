import { getStoredToken } from "./auth.js";
import { setAccessToken, getTopTracks } from "./api.js";

//obtinerea tokenului si setarea accesului
const token = getStoredToken();
if (!token) location.href = "index.html";
setAccessToken(token);

const container = document.getElementById("albums");

(async () => {
  const tracks = await getTopTracks(50);
  const map = new Map();

  tracks.items.forEach(t => {
    //se adauga piesa daca nu exista deja in albumul cu map
    if (!map.has(t.album.id)) map.set(t.album.id, t.album); 
  });

  //vector cu albumele
  const albums = Array.from(map.values()).slice(0, 5);

  container.innerHTML = albums.map((a, i) => `
  <div class="top-card">
  <div class="rank-tag">#${i + 1}</div>
    <img src="${a.images?.[0]?.url || ""}"> 
    <p>${a.name}</p>
  </div>
`).join("");
})();

document.getElementById("logout-btn").onclick = () => {
  localStorage.clear();
  location.href = "index.html";
};
