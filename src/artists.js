import { getStoredToken } from "./auth.js";
import { setAccessToken, getTopArtists } from "./api.js";

const token = getStoredToken();
if (!token) location.href = "index.html";
setAccessToken(token);

const container = document.getElementById("artists");

(async () => {
    const data = await getTopArtists(5);
    container.innerHTML = data.items.map((a, i) => `
  <div class="top-card"> <div class="rank-tag">#${i + 1}</div>
    <img src="${a.images?.[0]?.url || ""}">
    <p>${a.name}</p>
  </div>
`).join("");
})();

document.getElementById("logout-btn").onclick = () => {
  localStorage.clear();
  location.href = "index.html";
};
