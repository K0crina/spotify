import {
  redirectToSpotifyLogin,
  exchangeCodeForToken,
  getStoredToken
} from "./auth.js";

const loginBtn = document.getElementById("login-btn");

// DACA AM COD IN URL -> SCHIMBARE IN TOKEN
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (code) {
  exchangeCodeForToken(code).then(() => {
    window.history.replaceState({}, document.title, "/");
    window.location.href = "app.html"; // ⬅️ MERGEM ÎN APLICAȚIE
  });
}

// CLICK LOGIN
loginBtn.addEventListener("click", () => {
  redirectToSpotifyLogin();
});
