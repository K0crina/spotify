const CLIENT_ID = "1f14936b233442ac8162f89eca2cecea";
const REDIRECT_URI = "http://127.0.0.1:5500/index.html";
const SCOPES = [
  "user-read-email",
  "user-read-private",
  "user-top-read",
  "user-read-recently-played",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",   
  "playlist-modify-public"
]

// string aleator utilizat pentru a genera un verifier PKCE
function generateRandomString(length) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((x) => possible[x % possible.length])
    .join("");
}

// codifica sirul de caractere folosind SHA-256
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

// codifica datele intr-un string base64
function base64encode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// genereaza un code PKCE si redirectioneaza utilizatorul catre pagina de login Spotify pentru autentificare
export async function redirectToSpotifyLogin() {
  const verifier = generateRandomString(64);
  const challenge = base64encode(await sha256(verifier));

  localStorage.setItem("pkce_verifier", verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(" "),
    code_challenge_method: "S256",
    code_challenge: challenge
  });

  window.location.href =
    "https://accounts.spotify.com/authorize?" + params.toString();
}

// schimba codul de autorizare pentru a obtine un token de acces, care este salvat în localStorage
export async function exchangeCodeForToken(code) {
  const verifier = localStorage.getItem("pkce_verifier");

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const data = await res.json();

  localStorage.setItem("spotify_token", data.access_token);
  return data.access_token;
}

// preia tokenul
export function getStoredToken() {
  return localStorage.getItem("spotify_token");
}
