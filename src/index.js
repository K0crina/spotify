//importă funcțiile necesare din auth.js
import {
  redirectToSpotifyLogin,
  exchangeCodeForToken,
  getStoredToken
} from "./auth.js";

const loginBtn = document.getElementById("login-btn");


const params = new URLSearchParams(window.location.search);
//Extragem valoarea parametrului "code" din URL
const code = params.get("code");

//daca exisă code înseamnă că login-ul a fost realizat cu succes
if (code) {
   // Schimbăm codul primit în access token
    exchangeCodeForToken(code).then(() => {
    window.history.replaceState({}, document.title, "/");
    //dupa ce token este salvat redirectionam catre profil
    window.location.href = "profile.html";
  });
}
// Când utilizatorul apasă butonul de login
// este redirecționat către pagina de autentificare Spotify
loginBtn.addEventListener("click", () => {
  redirectToSpotifyLogin();
});
