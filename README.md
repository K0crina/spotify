📁 Proiect: Spotify Dashboard App

📌 Descriere generală
Proiectul constă într-o aplicație web interactivă (HTML, CSS, Vanilla JavaScript) care se conectează la contul de Spotify al utilizatorului. Accentul 
cade pe integrarea cu Spotify Web API prin fluxul de autentificare securizată OAuth 2.0 (PKCE) direct din browser, procesarea datelor asincrone și 
manipularea dinamică a DOM-ului pentru afișarea statisticilor muzicale.

▶️ Configurare și Rulare
1. Obține un `Client ID` creând o aplicație în Spotify Developer Dashboard.
2. Setează Redirect URI-ul aplicației către serverul tău local (ex: `http://127.0.0.1:5500/index.html`).
3. Actualizează `CLIENT_ID` în fișierele `src/config.js` și `src/auth.js`.
4. Rulează fișierul `index.html` folosind un server local (ex. extensia Live Server din VS Code).


📂 Modul 1 – Autentificare Securizată (PKCE)
📘 Descriere:
Gestionează logarea utilizatorului prin redirect către platforma Spotify și schimbul de coduri criptografice pentru obținerea token-ului de acces. 
Nu necesită backend separat, datele de sesiune fiind stocate sigur în localStorage.

🧪 Funcționalitate:
Accesare `index.html` -> Generare challenge PKCE -> Redirect login -> Validare și Salvare token.

📂 Modul 2 – Profil & Gestionare Playlist-uri
📘 Descriere:
Afișează datele contului, topul genurilor muzicale și istoricul ascultărilor recente (Recently Played). Include un meniu lateral interactiv prin 
care utilizatorul își poate accesa playlist-urile și poate șterge melodii direct prin cereri API (`DELETE`).

🧪 Funcționalitate:
Accesare `profile.html` -> Randare UI dinamic -> Interacțiune Sidebar Playlist-uri.

📂 Modul 3 – Topuri Muzicale Personale
📘 Descriere:
Extrage și afișează, în pagini dedicate cu grid-uri responsive, primele 5 poziții din preferințele utilizatorului pe termen mediu.
🧪 Funcționalitate:
Navigare `artists.html` / `albums.html` / `tracks.html` -> Cereri API categorisite.

📂 Modul 4 – Motor de Căutare În Timp Real
📘 Descriere:
Simulează funcția de căutare nativă din Spotify. Preia input-ul utilizatorului și interoghează baza de date asincron, returnând și afișând simultan rezultate împărțite pe trei coloane: Melodii, Artiști și Albume.

🧪 Funcționalitate:
Accesare `search.html` -> Introducere text în Search Bar -> Preluare și parsare obiect JSON complex.
