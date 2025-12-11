import { getStoredToken } from "./auth.js";
import { setAccessToken, searchSpotify } from "./api.js";

const token = getStoredToken();
if (!token) location.href = "index.html";
setAccessToken(token);

const input = document.getElementById("search-input");

const tracksBox = document.getElementById("tracks-results");
const artistsBox = document.getElementById("artists-results");
const albumsBox = document.getElementById("albums-results");

let audio = new Audio();
let current = null;

input.oninput = async () => {
  const q = input.value.trim();
  
  // Selectam toate titlurile
  const titles = document.querySelectorAll(".search-title");

  if (!q) {
    tracksBox.innerHTML = "";
    artistsBox.innerHTML = "";
    albumsBox.innerHTML = "";
    
    // ASCUNDEM titlurile daca nu e text
    titles.forEach(h3 => h3.style.display = "none");
    return;
  }

  // Daca avem text, AFISAM titlurile
  titles.forEach(h3 => h3.style.display = "block");

  const data = await searchSpotify(q);

  //  MELODII
  tracksBox.innerHTML = data.tracks.items.slice(0, 5).map((t, i) => `
    <div class="music-card search-card">  <div class="card-info">
        <strong>#${i + 1}</strong>
        <img src="${t.album.images?.[0]?.url || ""}">
        <div class="text-details">
            <p class="track-name">${t.name}</p>
            <span class="artist-name">${t.artists[0].name}</span>
        </div>
      </div>
      ${
        t.preview_url
          ? `<button onclick="play('${t.preview_url}')"><i class="fas fa-play"></i></button>`
          : ""
      }
    </div>
  `).join("");

  // ARTISTI
  artistsBox.innerHTML = data.artists.items.slice(0, 5).map((a, i) => `
    <div class="music-card search-card">
      <img src="${a.images?.[0]?.url || ""}">
      <p>${a.name}</p>
    </div>
  `).join("");

  //  ALBUME
  albumsBox.innerHTML = data.albums.items.slice(0, 5).map((a, i) => `
    <div class="music-card search-card">
      <img src="${a.images?.[0]?.url || ""}">
      <p>${a.name}</p>
    </div>
  `).join("");
};

//SEARCH
const searchButton = document.getElementById("search-btn");

searchButton.onclick = async () => {
    const q = input.value.trim();
    if (!q) {
        tracksBox.innerHTML = "";
        artistsBox.innerHTML = "";
        albumsBox.innerHTML = "";
        return;
    }

    const data = await searchSpotify(q);
};


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


