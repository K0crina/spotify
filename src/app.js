import { getStoredToken } from "./auth.js";
import {
  setAccessToken,
  getUserProfile,
  getTopArtists,
  getTopTracks,
  searchSpotify
} from "./api.js";

// === ELEMENTE UI ===
const profileImg = document.getElementById("profile-img");
const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");

const topArtistsList = document.getElementById("top-artists-list");
const topAlbumsList = document.getElementById("top-albums-list");
const topTracksList = document.getElementById("top-tracks-list");

const searchInput = document.getElementById("navbar-search");
const searchResults = document.getElementById("search-results");

const logoutBtn = document.getElementById("logout-btn");

// === PLAYER GLOBAL ===
let audioPlayer = new Audio();
let currentPreview = null;

// === INIT ===
const token = getStoredToken();
if (!token) {
  window.location.href = "index.html";
}
setAccessToken(token);

loadDashboard();

// === LOAD USER DATA ===
async function loadDashboard() {
  try {
    const user = await getUserProfile();
    profileImg.src = user.images?.[0]?.url || "";
    profileName.textContent = user.display_name;
    profileEmail.textContent = user.email || "";

    const artists = await getTopArtists(5);
    renderArtists(artists.items);

    const tracks = await getTopTracks(5);
    renderTracks(tracks.items);
    renderAlbumsFromTracks(tracks.items);
  } catch (err) {
    console.error("Eroare dashboard:", err);
  }
}

// === RENDER ARTISTS ===
function renderArtists(artists) {
  topArtistsList.innerHTML = "";
  artists.forEach((artist, index) => {
    topArtistsList.innerHTML += `
      <div class="music-card">
        <img src="${artist.images?.[0]?.url || ""}">
        <p>${artist.name}</p>
        <span class="rank-number">${index + 1}</span>
      </div>
    `;
  });
}

// === RENDER TRACKS + PLAY ===
function renderTracks(tracks) {
  topTracksList.innerHTML = "";
  tracks.forEach((track, index) => {
    const img = track.album.images?.[0]?.url || "";
    const artist = track.artists[0]?.name || "";
    const preview = track.preview_url;

    topTracksList.innerHTML += `
      <div class="music-card">
        <img src="${img}">
        <p>${track.name}</p>
        <span>${artist}</span>

        ${
          preview
            ? `<button onclick="playPreview('${preview}')">▶ Play</button>`
            : `<span style="font-size:12px;color:#aaa">Fără preview</span>`
        }

        <span class="rank-number">${index + 1}</span>
      </div>
    `;
  });
}

// === ALBUME REALE DIN TRACKS (NU PIESE) ===
function renderAlbumsFromTracks(tracks) {
  const map = new Map();

  tracks.forEach(track => {
    const album = track.album;
    if (!map.has(album.id)) {
      map.set(album.id, album);
    }
  });

  const albums = Array.from(map.values()).slice(0, 5);
  topAlbumsList.innerHTML = "";

  albums.forEach((album, index) => {
    topAlbumsList.innerHTML += `
      <div class="music-card">
        <img src="${album.images?.[0]?.url || ""}">
        <p>${album.name}</p>
        <span class="rank-number">${index + 1}</span>
      </div>
    `;
  });
}

// === SEARCH DINAMIC + PLAY + IMAGINE ===
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  if (!query) {
    searchResults.innerHTML = "";
    return;
  }

  try {
    const data = await searchSpotify(query);
    searchResults.innerHTML = "";

    data.tracks.items.forEach(track => {
      const preview = track.preview_url;
      const img = track.album.images?.[0]?.url || "";

      searchResults.innerHTML += `
        <div class="music-card small">
          <img src="${img}">
          <p>${track.name}</p>
          <span>${track.artists[0].name}</span>

          ${
            preview
              ? `<button onclick="playPreview('${preview}')">▶ Play</button>`
              : `<span style="font-size:11px;color:#aaa">Fără preview</span>`
          }
        </div>
      `;
    });
  } catch (err) {
    console.error("Eroare search:", err);
  }
});

// === PLAY PREVIEW REAL ===
window.playPreview = function (url) {
  if (currentPreview === url) {
    audioPlayer.pause();
    currentPreview = null;
  } else {
    audioPlayer.src = url;
    audioPlayer.play();
    currentPreview = url;
  }
};

// === NAVBAR ===
const sections = {
  profile: document.querySelector(".dashboard-header"),
  artists: document.querySelector("#top-artists-list").parentElement,
  albums: document.querySelector("#top-albums-list").parentElement,
  tracks: document.querySelector("#top-tracks-list").parentElement,
};

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    const section = link.dataset.section;

    Object.values(sections).forEach(el => el.style.display = "none");
    sections[section].style.display = "block";
  });
});

// === LOGOUT ===
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});
