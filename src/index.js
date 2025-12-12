import {
  redirectToSpotifyLogin,
  exchangeCodeForToken,
  getStoredToken
} from "./auth.js";

const loginBtn = document.getElementById("login-btn");

// Daca avem code dupa login -> intrăm direct pe PROFIL
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (code) {
  exchangeCodeForToken(code).then(() => {
    window.history.replaceState({}, document.title, "/");
    window.location.href = "profile.html";
  });
}

loginBtn.addEventListener("click", () => {
  redirectToSpotifyLogin();
});
