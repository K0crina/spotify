// src/app.js
import { handleRedirectCallback, logout, isLoggedIn } from "./auth.js";
import {
  fetchUserProfile,
  fetchTopArtists,
  fetchTopAlbums,
  searchSpotify
} from "./api.js";
import {
  renderUserProfile,
  renderTopArtists,
  renderTopAlbums,
  renderSearchResults
} from "./ui.js";

await handleRedirectCallback();

if (!isLoggedIn()) {
  window.location.href = "index.html";
}

const profile = await fetchUserProfile();
const topArtists = await fetchTopArtists();
const topAlbums = await fetchTopAlbums();

renderUserProfile(profile);
renderTopArtists(topArtists);
renderTopAlbums(topAlbums);

document.getElementById("logout-btn").addEventListener("click", logout);

document.getElementById("search-input").addEventListener("input", async (e) => {
  const data = await searchSpotify(e.target.value);
  renderSearchResults(data);
});
